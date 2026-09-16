from fastapi import APIRouter, WebSocket, WebSocketDisconnect, Depends, HTTPException, Query
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from bson import ObjectId
from datetime import datetime, timezone
from typing import List, Optional
import json

from ..database import get_database
from ..config import settings
from ..dependencies import get_current_user
from ..models.chat import (
    ConversationCreate, ConversationResponse, MessageCreate, MessageResponse, ParticipantInfo
)
from ..models.user import UserResponse
from ..services.connection_manager import manager

router = APIRouter(prefix="/api/chat", tags=["chat"])


# ─────────────────────────────────────────────────────────────
# Helper: authenticate a WS token and return user_id + user doc
# ─────────────────────────────────────────────────────────────

async def authenticate_ws_token(token: str, db) -> Optional[dict]:
    try:
        payload = jwt.decode(token, settings.JWT_SECRET, algorithms=[settings.ALGORITHM])
        email = payload.get("email")
        if not email:
            return None
        user = await db.users.find_one({"email": email})
        return user
    except JWTError:
        return None


# ─────────────────────────────────────────────────────────────
# REST: Create or fetch a 1-to-1 conversation
# ─────────────────────────────────────────────────────────────

@router.post("/conversations", response_model=ConversationResponse)
async def get_or_create_conversation(
    body: ConversationCreate,
    current_user: UserResponse = Depends(get_current_user),
    db=Depends(get_database)
):
    my_id = current_user.id
    other_id = body.participant_id

    # Check if a conversation already exists between these two users
    existing = await db.conversations.find_one({
        "participants": {"$all": [my_id, other_id]}
    })

    if existing:
        return await _format_conversation(existing, my_id, db)

    # Create new conversation
    new_conv = {
        "participants": [my_id, other_id],
        "last_message": None,
        "last_message_time": None,
        "created_at": datetime.now(timezone.utc)
    }
    result = await db.conversations.insert_one(new_conv)
    new_conv["_id"] = result.inserted_id
    return await _format_conversation(new_conv, my_id, db)


@router.get("/conversations", response_model=List[ConversationResponse])
async def list_conversations(
    current_user: UserResponse = Depends(get_current_user),
    db=Depends(get_database)
):
    my_id = current_user.id
    cursor = db.conversations.find({"participants": my_id}).sort("last_message_time", -1)
    conversations = await cursor.to_list(length=50)
    result = []
    for conv in conversations:
        formatted = await _format_conversation(conv, my_id, db)
        result.append(formatted)
    return result


@router.get("/conversations/{conv_id}/messages", response_model=List[MessageResponse])
async def get_messages(
    conv_id: str,
    limit: int = 50,
    current_user: UserResponse = Depends(get_current_user),
    db=Depends(get_database)
):
    conv = await db.conversations.find_one({"_id": ObjectId(conv_id)})
    if not conv or current_user.id not in conv["participants"]:
        raise HTTPException(status_code=403, detail="Forbidden")

    cursor = db.messages.find({"conversation_id": conv_id}).sort("timestamp", -1).limit(limit)
    msgs = await cursor.to_list(length=limit)
    msgs.reverse()  # chronological order

    result = []
    for m in msgs:
        sender = await db.users.find_one({"_id": ObjectId(m["sender_id"])})
        result.append(MessageResponse(
            id=str(m["_id"]),
            conversation_id=m["conversation_id"],
            sender_id=m["sender_id"],
            sender_name=sender["full_name"] if sender else "Unknown",
            text=m["text"],
            timestamp=m["timestamp"],
            read=m.get("read", False)
        ))
    return result


async def _format_conversation(conv: dict, my_id: str, db) -> ConversationResponse:
    participants_info = []
    for pid in conv["participants"]:
        try:
            u = await db.users.find_one({"_id": ObjectId(pid)})
            if u:
                participants_info.append(ParticipantInfo(
                    id=str(u["_id"]),
                    name=u["full_name"],
                    photo_url=u.get("photo_url"),
                    role=u.get("role"),
                    online=manager.is_online(str(u["_id"]))
                ))
        except Exception:
            pass

    unread = await db.messages.count_documents({
        "conversation_id": str(conv["_id"]),
        "sender_id": {"$ne": my_id},
        "read": False
    })

    return ConversationResponse(
        id=str(conv["_id"]),
        participants=participants_info,
        last_message=conv.get("last_message"),
        last_message_time=conv.get("last_message_time"),
        unread_count=unread
    )


# ─────────────────────────────────────────────────────────────
# WebSocket: Real-time chat + WebRTC signaling
# ─────────────────────────────────────────────────────────────

@router.websocket("/ws/{user_id}")
async def websocket_endpoint(
    websocket: WebSocket,
    user_id: str,
    token: str = Query(...)
):
    db = get_database()

    # Authenticate the token before accepting the connection
    user = await authenticate_ws_token(token, db)
    if not user or str(user["_id"]) != user_id:
        await websocket.close(code=4001, reason="Unauthorized")
        return

    await manager.connect(user_id, websocket)

    # Notify all connected contacts that this user is now online
    await manager.broadcast({
        "type": "presence",
        "user_id": user_id,
        "online": True
    })

    try:
        while True:
            raw = await websocket.receive_text()
            try:
                data = json.loads(raw)
            except json.JSONDecodeError:
                continue

            event_type = data.get("type")

            # ── Chat Message ──────────────────────────────────
            if event_type == "chat_message":
                conv_id = data.get("conversation_id")
                text = data.get("text", "").strip()
                recipient_id = data.get("recipient_id")

                if not (conv_id and text and recipient_id):
                    continue

                # Verify sender is in this conversation
                try:
                    conv = await db.conversations.find_one({"_id": ObjectId(conv_id)})
                except Exception:
                    continue

                if not conv or user_id not in conv["participants"]:
                    continue

                now = datetime.now(timezone.utc)

                # Persist to MongoDB
                msg_doc = {
                    "conversation_id": conv_id,
                    "sender_id": user_id,
                    "text": text,
                    "timestamp": now,
                    "read": False
                }
                result = await db.messages.insert_one(msg_doc)
                msg_id = str(result.inserted_id)

                # Update conversation's last_message
                await db.conversations.update_one(
                    {"_id": ObjectId(conv_id)},
                    {"$set": {"last_message": text, "last_message_time": now}}
                )

                # Build outgoing payload
                outgoing = {
                    "type": "chat_message",
                    "id": msg_id,
                    "conversation_id": conv_id,
                    "sender_id": user_id,
                    "sender_name": user["full_name"],
                    "text": text,
                    "timestamp": now.isoformat(),
                    "read": False
                }

                # Echo back to sender
                await manager.send_to_user(user_id, outgoing)
                # Send to recipient
                await manager.send_to_user(recipient_id, outgoing)

            # ── Typing Indicator ──────────────────────────────
            elif event_type == "typing":
                recipient_id = data.get("recipient_id")
                conv_id = data.get("conversation_id")
                is_typing = data.get("is_typing", False)
                if recipient_id:
                    await manager.send_to_user(recipient_id, {
                        "type": "typing",
                        "sender_id": user_id,
                        "conversation_id": conv_id,
                        "is_typing": is_typing
                    })

            # ── Mark Messages Read ────────────────────────────
            elif event_type == "mark_read":
                conv_id = data.get("conversation_id")
                if conv_id:
                    await db.messages.update_many(
                        {"conversation_id": conv_id, "sender_id": {"$ne": user_id}},
                        {"$set": {"read": True}}
                    )

            # ── WebRTC Signaling (forwarded to recipient) ──────
            elif event_type in ("call_offer", "call_answer", "call_reject", "ice_candidate", "call_end"):
                recipient_id = data.get("recipient_id")
                if recipient_id:
                    data["sender_id"] = user_id
                    data["sender_name"] = user["full_name"]
                    await manager.send_to_user(recipient_id, data)

    except WebSocketDisconnect:
        pass
    finally:
        manager.disconnect(user_id)
        await manager.broadcast({
            "type": "presence",
            "user_id": user_id,
            "online": False
        })
