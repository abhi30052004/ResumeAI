from fastapi import APIRouter, Depends
from typing import Dict, Any
from ..database import get_database
from ..models.user import UserResponse
from ..dependencies import get_current_user

router = APIRouter(tags=["dashboard"])

@router.get("/api/dashboard/stats", response_model=Dict[str, Any])
async def get_dashboard_stats(current_user: UserResponse = Depends(get_current_user)):
    db = get_database()
    
    # 1. Total Resumes
    resumes_count = await db.resumes.count_documents({"user_id": current_user.id})
    
    # 2. Analytics based on past analyses
    analyses_cursor = db.analyses.find({"user_id": current_user.id})
    analyses = await analyses_cursor.to_list(length=1000)
    
    avg_ats_score = 0
    best_match_score = 0
    improvements_made = len(analyses) # Using number of analyses as a proxy for improvements
    
    # 3. Active Applications
    active_applications = await db.applications.count_documents({
        "user_id": current_user.id, 
        "status": {"$nin": ["Rejected", "Offer"]}
    })
    
    # 4. Internal JD Applications
    active_internal_apps = await db.jd_applications.count_documents({
        "applicant_id": current_user.id,
        "status": {"$nin": ["Rejected", "Offer"]}
    })
    
    total_active_applications = active_applications + active_internal_apps

    # 5. Projects Completed
    projects_completed = await db.projects.count_documents({
        "member_ids": current_user.id,
        "status": "Completed"
    })

    # 6. Profile Completeness (mocked based on fields)
    completeness = 40
    if current_user.target_role: completeness += 20
    if current_user.experience_level: completeness += 20
    if current_user.skills: completeness += 20
    
    if analyses:
        total_ats = sum(a.get("ats_score", 0) for a in analyses)
        avg_ats_score = round(total_ats / len(analyses))
        best_match_score = max(a.get("job_match_score", 0) for a in analyses)
        
    return {
        "resumes_analyzed": resumes_count,
        "average_ats_score": avg_ats_score,
        "best_match_score": best_match_score,
        "improvements_made": improvements_made,
        "profile_completeness": completeness,
        "active_applications": total_active_applications,
        "projects_completed": projects_completed
    }
