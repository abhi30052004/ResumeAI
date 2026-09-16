from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import List, Optional, Any, Dict
from datetime import datetime, timezone
from bson import ObjectId

from ..database import get_database
from ..dependencies import get_current_user, require_admin, require_manager
from ..models.user import UserResponse

router = APIRouter(prefix="/api/projects", tags=["projects"])


class ProjectCreate(BaseModel):
    name: str
    client: Optional[str] = None
    description: Optional[str] = None
    status: str = "Planning"
    deadline: Optional[str] = None


class ProjectUpdate(BaseModel):
    name: Optional[str] = None
    status: Optional[str] = None
    progress: Optional[int] = None
    deadline: Optional[str] = None


def _format(p: dict) -> dict:
    return {
        "id": str(p["_id"]),
        "name": p.get("name", ""),
        "client": p.get("client", ""),
        "manager": p.get("manager_name", ""),
        "manager_id": p.get("manager_id", ""),
        "teamSize": len(p.get("member_ids", [])),
        "status": p.get("status", "Planning"),
        "progress": p.get("progress", 0),
        "deadline": p.get("deadline", ""),
        "description": p.get("description", ""),
        "role": p.get("roles", {}).get(p.get("_current_user_id", ""), "Contributor"),
    }


# ── Employee: view own projects ────────────────────────────────────────────

@router.get("/my", response_model=List[Dict])
async def get_my_projects(current_user: UserResponse = Depends(get_current_user)):
    db = get_database()
    cursor = db.projects.find({"member_ids": current_user.id})
    projects = await cursor.to_list(length=100)
    result = []
    for p in projects:
        p["_current_user_id"] = current_user.id
        result.append(_format(p))
    return result


# ── Manager: view and create projects they manage ──────────────────────────

@router.get("/managed", response_model=List[Dict])
async def get_managed_projects(current_user: UserResponse = Depends(require_manager)):
    db = get_database()
    cursor = db.projects.find({"manager_id": current_user.id})
    projects = await cursor.to_list(length=100)
    return [_format(p) for p in projects]


@router.post("/", response_model=Dict)
async def create_project(body: ProjectCreate, current_user: UserResponse = Depends(require_manager)):
    db = get_database()
    now = datetime.now(timezone.utc)
    doc = {
        **body.dict(),
        "manager_id": current_user.id,
        "manager_name": current_user.full_name,
        "member_ids": [],
        "roles": {},
        "progress": 0,
        "created_at": now,
    }
    result = await db.projects.insert_one(doc)
    doc["_id"] = result.inserted_id
    return _format(doc)


@router.patch("/{project_id}", response_model=Dict)
async def update_project(project_id: str, body: ProjectUpdate, current_user: UserResponse = Depends(require_manager)):
    db = get_database()
    update_data = {k: v for k, v in body.dict().items() if v is not None}
    if not update_data:
        raise HTTPException(400, "No fields to update")
    await db.projects.update_one({"_id": ObjectId(project_id)}, {"$set": update_data})
    p = await db.projects.find_one({"_id": ObjectId(project_id)})
    if not p:
        raise HTTPException(404, "Project not found")
    return _format(p)


# ── Admin: view all projects ───────────────────────────────────────────────

@router.get("/all", response_model=List[Dict])
async def get_all_projects(current_user: UserResponse = Depends(require_admin)):
    db = get_database()
    cursor = db.projects.find({}).sort("created_at", -1)
    projects = await cursor.to_list(length=200)
    return [_format(p) for p in projects]


# ── Admin: platform-wide stats ─────────────────────────────────────────────

@router.get("/stats", response_model=Dict)
async def get_platform_stats(current_user: UserResponse = Depends(require_admin)):
    db = get_database()
    total_employees = await db.users.count_documents({"role": "employee"})
    pending_managers = await db.users.count_documents({"role": "manager", "account_status": "pending"})
    active_clients = await db.clients.count_documents({"status": "Active"})
    benched = await db.users.count_documents({"role": "employee", "status": "active", "allocation": "benched"})
    total_projects = await db.projects.count_documents({})
    return {
        "total_employees": total_employees,
        "pending_managers": pending_managers,
        "active_clients": active_clients,
        "benched_employees": benched,
        "total_projects": total_projects,
    }
