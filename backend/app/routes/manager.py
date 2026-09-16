from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import List, Optional, Dict
from datetime import datetime, timezone
from bson import ObjectId

from ..database import get_database
from ..dependencies import get_current_user, require_manager, require_admin
from ..models.user import UserResponse

router = APIRouter(prefix="/api/manager", tags=["manager"])


# ──────────────────────────────────────────────────────────────
# TEAM: employees allocated to this manager
# ──────────────────────────────────────────────────────────────

@router.get("/team", response_model=List[Dict])
async def get_team(current_user: UserResponse = Depends(require_manager)):
    db = get_database()
    cursor = db.users.find({"manager_id": current_user.id, "role": "employee"})
    members = await cursor.to_list(length=100)
    result = []
    for m in members:
        # Find current project
        project = await db.projects.find_one({"member_ids": str(m["_id"])})
        result.append({
            "id": str(m["_id"]),
            "name": m.get("full_name", ""),
            "role": m.get("target_role") or m.get("experience_level") or "Employee",
            "photo_url": m.get("photo_url"),
            "email": m.get("email", ""),
            "skills": m.get("skills", []),
            "score": m.get("profile_score", 0),
            "status": "Allocated" if project else "Benched",
            "project": project["name"] if project else None,
        })
    return result


# ──────────────────────────────────────────────────────────────
# JOB DESCRIPTIONS (manager creates internal postings)
# ──────────────────────────────────────────────────────────────

class JDCreate(BaseModel):
    title: str
    team: str
    location: Optional[str] = "Remote"
    type: Optional[str] = "Full-time"
    experience_level: Optional[str] = "Mid-Level"
    description: Optional[str] = None
    requirements: Optional[List[str]] = []
    skills: Optional[List[str]] = []


class JDUpdate(BaseModel):
    title: Optional[str] = None
    status: Optional[str] = None
    description: Optional[str] = None


@router.get("/jds/all", response_model=List[Dict])
async def list_all_jds(current_user: UserResponse = Depends(get_current_user)):
    db = get_database()
    cursor = db.job_descriptions.find({"status": "Active"}).sort("created_at", -1)
    jds = await cursor.to_list(length=100)
    result = []
    for jd in jds:
        created = jd.get("created_at")
        days_ago = ""
        if created:
            delta = (datetime.now(timezone.utc) - created.replace(tzinfo=timezone.utc) if created.tzinfo is None else datetime.now(timezone.utc) - created)
            days_ago = f"{delta.days} days ago" if delta.days > 0 else "Today"
        result.append({
            "id": str(jd["_id"]),
            "title": jd.get("title", ""),
            "team": jd.get("team", ""),
            "location": jd.get("location", "Remote"),
            "description": jd.get("description", ""),
            "skills": jd.get("skills", []),
            "match": 85, # Default match score for now, this could be calculated later based on profile
            "posted": days_ago,
        })
    return result


@router.get("/jds", response_model=List[Dict])
async def list_jds(current_user: UserResponse = Depends(require_manager)):
    db = get_database()
    cursor = db.job_descriptions.find({"manager_id": current_user.id}).sort("created_at", -1)
    jds = await cursor.to_list(length=100)
    result = []
    for jd in jds:
        applicant_count = await db.jd_applications.count_documents({"jd_id": str(jd["_id"])})
        created = jd.get("created_at")
        days_ago = ""
        if created:
            delta = (datetime.now(timezone.utc) - created.replace(tzinfo=timezone.utc) if created.tzinfo is None else datetime.now(timezone.utc) - created)
            days_ago = f"{delta.days} days ago" if delta.days > 0 else "Today"
        result.append({
            "id": str(jd["_id"]),
            "title": jd.get("title", ""),
            "team": jd.get("team", ""),
            "location": jd.get("location", "Remote"),
            "description": jd.get("description", ""),
            "skills": jd.get("skills", []),
            "status": jd.get("status", "Active"),
            "applicants": applicant_count,
            "posted": days_ago,
        })
    return result


@router.post("/jds", response_model=Dict)
async def create_jd(body: JDCreate, current_user: UserResponse = Depends(require_manager)):
    db = get_database()
    doc = {
        **body.dict(),
        "manager_id": current_user.id,
        "manager_name": current_user.full_name,
        "status": "Active",
        "created_at": datetime.now(timezone.utc),
    }
    result = await db.job_descriptions.insert_one(doc)
    doc["id"] = str(result.inserted_id)
    doc["applicants"] = 0
    doc["posted"] = "Today"
    if "_id" in doc:
        del doc["_id"]
    return doc


@router.patch("/jds/{jd_id}", response_model=Dict)
async def update_jd(jd_id: str, body: JDUpdate, current_user: UserResponse = Depends(require_manager)):
    db = get_database()
    update_data = {k: v for k, v in body.dict().items() if v is not None}
    await db.job_descriptions.update_one({"_id": ObjectId(jd_id)}, {"$set": update_data})
    jd = await db.job_descriptions.find_one({"_id": ObjectId(jd_id)})
    if not jd:
        raise HTTPException(404, "JD not found")
    return {"id": str(jd["_id"]), **jd}


@router.delete("/jds/{jd_id}")
async def delete_jd(jd_id: str, current_user: UserResponse = Depends(require_manager)):
    db = get_database()
    await db.job_descriptions.delete_one({"_id": ObjectId(jd_id)})
    return {"success": True}


@router.post("/jds/{jd_id}/apply")
async def apply_to_jd(jd_id: str, current_user: UserResponse = Depends(get_current_user)):
    db = get_database()
    jd = await db.job_descriptions.find_one({"_id": ObjectId(jd_id)})
    if not jd:
        raise HTTPException(404, "JD not found")
        
    # Check if already applied
    existing = await db.jd_applications.find_one({
        "jd_id": jd_id,
        "applicant_id": current_user.id
    })
    if existing:
        raise HTTPException(400, "Already applied to this role")
        
    doc = {
        "jd_id": jd_id,
        "applicant_id": current_user.id,
        "applicant_name": current_user.full_name,
        "status": "Applied",
        "match_score": 85, # Default match score, could be calculated
        "applied_at": datetime.now(timezone.utc)
    }
    await db.jd_applications.insert_one(doc)
    return {"success": True}


# ──────────────────────────────────────────────────────────────
# APPLICATIONS: employees who applied to manager's JDs
# ──────────────────────────────────────────────────────────────

@router.get("/applications", response_model=List[Dict])
async def list_applications(current_user: UserResponse = Depends(require_manager)):
    db = get_database()
    # Get all JDs for this manager
    jds = await db.job_descriptions.find({"manager_id": current_user.id}).to_list(length=100)
    jd_ids = [str(jd["_id"]) for jd in jds]
    jd_map = {str(jd["_id"]): jd for jd in jds}

    cursor = db.jd_applications.find({"jd_id": {"$in": jd_ids}}).sort("applied_at", -1)
    apps = await cursor.to_list(length=200)
    result = []
    for app in apps:
        # Get applicant user info
        try:
            applicant = await db.users.find_one({"_id": ObjectId(app["applicant_id"])})
        except Exception:
            applicant = None
        jd = jd_map.get(app["jd_id"], {})
        result.append({
            "id": str(app["_id"]),
            "applicant": applicant["full_name"] if applicant else "Unknown",
            "applicant_id": app["applicant_id"],
            "photo_url": applicant.get("photo_url") if applicant else None,
            "currentRole": applicant.get("target_role") or "Employee" if applicant else "Employee",
            "skills": applicant.get("skills", []) if applicant else [],
            "match": app.get("match_score", 0),
            "role": jd.get("title", ""),
            "jd_id": app["jd_id"],
            "status": app.get("status", "Applied"),
            "applied": str(app.get("applied_at", ""))[:10],
        })
    return result


@router.patch("/applications/{app_id}", response_model=Dict)
async def update_application_status(
    app_id: str,
    body: Dict,
    current_user: UserResponse = Depends(require_manager)
):
    db = get_database()
    await db.jd_applications.update_one(
        {"_id": ObjectId(app_id)},
        {"$set": {"status": body.get("status")}}
    )
    app = await db.jd_applications.find_one({"_id": ObjectId(app_id)})
    if not app:
        raise HTTPException(404, "Application not found")
    return {"id": str(app["_id"]), "status": app.get("status")}


# ──────────────────────────────────────────────────────────────
# DASHBOARD STATS (for manager overview)
# ──────────────────────────────────────────────────────────────

@router.get("/stats", response_model=Dict)
async def get_manager_stats(current_user: UserResponse = Depends(require_manager)):
    db = get_database()
    team_count = await db.users.count_documents({"manager_id": current_user.id, "role": "employee"})
    projects_count = await db.projects.count_documents({"manager_id": current_user.id, "status": {"$ne": "Completed"}})
    jds_count = await db.job_descriptions.count_documents({"manager_id": current_user.id, "status": "Active"})

    jds = await db.job_descriptions.find({"manager_id": current_user.id}).to_list(length=100)
    jd_ids = [str(jd["_id"]) for jd in jds]
    pending_apps = await db.jd_applications.count_documents({"jd_id": {"$in": jd_ids}, "status": "Applied"})

    return {
        "direct_reports": team_count,
        "active_projects": projects_count,
        "active_jds": jds_count,
        "pending_applications": pending_apps,
    }
