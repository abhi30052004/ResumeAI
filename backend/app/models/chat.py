from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime


class MessageCreate(BaseModel):
    conversation_id: str
    text: str


class MessageResponse(BaseModel):
    id: str
    conversation_id: str
    sender_id: str
    sender_name: str
    text: str
    timestamp: datetime
    read: bool = False


class ConversationCreate(BaseModel):
    participant_id: str  # The other user's ID


class ParticipantInfo(BaseModel):
    id: str
    name: str
    photo_url: Optional[str] = None
    role: Optional[str] = None
    online: bool = False


class ConversationResponse(BaseModel):
    id: str
    participants: List[ParticipantInfo]
    last_message: Optional[str] = None
    last_message_time: Optional[datetime] = None
    unread_count: int = 0
