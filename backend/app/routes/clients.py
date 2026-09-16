from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import List, Optional, Dict
from datetime import datetime, timezone
from bson import ObjectId

from ..database import get_database
from ..dependencies import require_admin
from ..models.user import UserResponse

router = APIRouter(prefix="/api/clients", tags=["clients"])


class ClientCreate(BaseModel):
    name: str
    industry: str
    contact: Optional[str] = None
    phone: Optional[str] = None
    website: Optional[str] = None
    status: str = "Active"


class ClientUpdate(BaseModel):
    name: Optional[str] = None
    industry: Optional[str] = None
    contact: Optional[str] = None
    phone: Optional[str] = None
    website: Optional[str] = None
    status: Optional[str] = None


def _format(c: dict, db=None) -> dict:
    return {
        "id": str(c["_id"]),
        "name": c.get("name", ""),
        "industry": c.get("industry", ""),
        "status": c.get("status", "Active"),
        "projects": c.get("project_count", 0),
        "contact": c.get("contact", ""),
        "phone": c.get("phone", ""),
        "website": c.get("website", ""),
    }


@router.get("/", response_model=List[Dict])
async def list_clients(current_user: UserResponse = Depends(require_admin)):
    db = get_database()
    cursor = db.clients.find({}).sort("name", 1)
    clients = await cursor.to_list(length=200)
    result = []
    for c in clients:
        # Count projects linked to this client
        proj_count = await db.projects.count_documents({"client": c.get("name", "")})
        c["project_count"] = proj_count
        result.append(_format(c))
    return result


@router.post("/", response_model=Dict)
async def create_client(body: ClientCreate, current_user: UserResponse = Depends(require_admin)):
    db = get_database()
    doc = {**body.dict(), "created_at": datetime.now(timezone.utc)}
    result = await db.clients.insert_one(doc)
    doc["_id"] = result.inserted_id
    doc["project_count"] = 0
    return _format(doc)


@router.patch("/{client_id}", response_model=Dict)
async def update_client(client_id: str, body: ClientUpdate, current_user: UserResponse = Depends(require_admin)):
    db = get_database()
    update_data = {k: v for k, v in body.dict().items() if v is not None}
    if not update_data:
        raise HTTPException(400, "No fields to update")
    await db.clients.update_one({"_id": ObjectId(client_id)}, {"$set": update_data})
    c = await db.clients.find_one({"_id": ObjectId(client_id)})
    if not c:
        raise HTTPException(404, "Client not found")
    proj_count = await db.projects.count_documents({"client": c.get("name", "")})
    c["project_count"] = proj_count
    return _format(c)


@router.delete("/{client_id}")
async def delete_client(client_id: str, current_user: UserResponse = Depends(require_admin)):
    db = get_database()
    result = await db.clients.delete_one({"_id": ObjectId(client_id)})
    if result.deleted_count == 0:
        raise HTTPException(404, "Client not found")
    return {"success": True}
