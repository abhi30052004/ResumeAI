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
    project_id: Optional[str] = None
    client_id: Optional[str] = None
    location: Optional[str] = "Remote"
    employment_type: Optional[str] = "Full-time"
    seniority: Optional[str] = "Mid-Level"
    experience: Optional[str] = ""
    duration: Optional[str] = None
    required_hours: Optional[int] = 40
    description: Optional[str] = None
    responsibilities: Optional[List[str]] = []
    required_skills: Optional[List[str]] = []
    preferred_skills: Optional[List[str]] = []


class JDUpdate(BaseModel):
    title: Optional[str] = None
    status: Optional[str] = None
    description: Optional[str] = None


@router.get("/jds/all", response_model=List[Dict])
async def list_all_jds(current_user: UserResponse = Depends(get_current_user)):
    db = get_database()
    cursor = db.job_descriptions.find({"status": "Active"}).sort("created_at", -1)
    jds = await cursor.to_list(length=100)
    
    # Get current user's skills
    emp = await db.users.find_one({"_id": ObjectId(current_user.id)})
    emp_skills = set([s.lower() for s in emp.get("skills", [])]) if emp else set()
    
    result = []
    for jd in jds:
        created = jd.get("created_at")
        days_ago = ""
        if created:
            delta = (datetime.now(timezone.utc) - created.replace(tzinfo=timezone.utc) if created.tzinfo is None else datetime.now(timezone.utc) - created)
            days_ago = f"{delta.days} days ago" if delta.days > 0 else "Today"
            
        jd_skills = set([s.lower() for s in jd.get("required_skills", [])])
        matched = jd_skills.intersection(emp_skills)
        missing = jd_skills - emp_skills
        
        score = 85
        if len(jd_skills) > 0:
            score = int((len(matched) / len(jd_skills)) * 100)
            
        result.append({
            "id": str(jd["_id"]),
            "title": jd.get("title", ""),
            "project_id": jd.get("project_id", ""),
            "location": jd.get("location", "Remote"),
            "description": jd.get("description", ""),
            "skills": jd.get("required_skills", []),
            "match": score,
            "matched_skills": [s.title() for s in matched],
            "missing_skills": [s.title() for s in missing],
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
            "project_id": jd.get("project_id", ""),
            "location": jd.get("location", "Remote"),
            "description": jd.get("description", ""),
            "skills": jd.get("required_skills", []),
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


class ApplyRequest(BaseModel):
    tailored_resume_text: Optional[str] = None

@router.post("/jds/{jd_id}/apply")
async def apply_to_jd(jd_id: str, body: Optional[ApplyRequest] = None, current_user: UserResponse = Depends(get_current_user)):
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
        "applied_at": datetime.now(timezone.utc),
        "tailored_resume_text": body.tailored_resume_text if body else None
    }
    await db.jd_applications.insert_one(doc)
    return {"success": True}

from ..services.openai_service import tailor_resume_for_job

@router.post("/jds/{jd_id}/score-resume")
async def score_resume(jd_id: str, current_user: UserResponse = Depends(get_current_user)):
    db = get_database()
    jd = await db.job_descriptions.find_one({"_id": ObjectId(jd_id)})
    if not jd:
        raise HTTPException(404, "JD not found")
        
    user = await db.users.find_one({"_id": ObjectId(current_user.id)})
    resume_text = user.get("resume_text")
    if not resume_text:
        raise HTTPException(400, "No resume uploaded. Please upload a resume in your profile first.")
        
    jd_text = f"Title: {jd.get('title')}\nDescription: {jd.get('description')}\nSkills: {', '.join(jd.get('required_skills', []))}"
    
    result = await tailor_resume_for_job(resume_text, jd_text)
    return result


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

@router.get("/jds/{jd_id}/matches", response_model=Dict)
async def get_jd_matches(jd_id: str, current_user: UserResponse = Depends(require_manager)):
    db = get_database()
    jd = await db.job_descriptions.find_one({"_id": ObjectId(jd_id)})
    if not jd:
        raise HTTPException(404, "Requirement not found")
        
    # Get all active employees (simplified matching logic for MVP)
    cursor = db.users.find({"role": "employee", "status": "active"})
    employees = await cursor.to_list(length=100)
    
    matches = []
    jd_skills = set([s.lower() for s in jd.get("required_skills", [])])
    
    for emp in employees:
        emp_skills = set([s.lower() for s in emp.get("skills", [])])
        matched = jd_skills.intersection(emp_skills)
        missing = jd_skills - emp_skills
        
        # Calculate a mock score based on skills matched
        score = 85
        if len(jd_skills) > 0:
            score = int((len(matched) / len(jd_skills)) * 100)
            if score < 50:
                continue # Skip low matches
                
        # Mock AI Explanation
        if score >= 90:
            explanation = f"{emp.get('full_name')} is an excellent fit, possessing {len(matched)} of the required skills including {', '.join(list(matched)[:3])}."
        elif score >= 70:
            explanation = f"{emp.get('full_name')} is a strong candidate but would need to upskill in {', '.join(list(missing)[:2])}."
        else:
            explanation = f"{emp.get('full_name')} meets basic requirements."

        matches.append({
            "id": str(emp["_id"]),
            "name": emp.get("full_name", ""),
            "role": emp.get("target_role") or emp.get("experience_level") or "Employee",
            "photo_url": emp.get("photo_url"),
            "location": emp.get("location", "Remote"),
            "match_score": score,
            "ai_explanation": explanation,
            "matched_skills": [s.title() for s in matched],
            "missing_skills": [s.title() for s in missing],
        })
        
    # Sort matches by score descending
    matches.sort(key=lambda x: x["match_score"], reverse=True)

    return {
        "jd": {
            "title": jd.get("title", ""),
            "description": jd.get("description", "")
        },
        "matches": matches[:10] # Return top 10
    }


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
