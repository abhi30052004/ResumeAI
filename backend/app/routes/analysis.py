from fastapi import APIRouter, Depends, HTTPException, status
from typing import List
from datetime import datetime, timezone
from bson import ObjectId

from ..database import get_database
from ..models.user import UserResponse
from ..models.analysis import AnalysisResponse, ImprovementRequest, ImprovementResponse
from ..dependencies import get_current_user
from ..services.openai_service import analyze_resume_with_ai, improve_resume_section_with_ai

router = APIRouter(tags=["analysis"])

@router.post("/api/analysis", response_model=AnalysisResponse)
async def analyze_resume(
    resume_id: str,
    current_user: UserResponse = Depends(get_current_user)
):
    db = get_database()
    
    # Fetch resume
    resume = await db.resumes.find_one({"_id": ObjectId(resume_id), "user_id": current_user.id})
    if not resume:
        raise HTTPException(status_code=404, detail="Resume not found")
        
    job_description = resume.get("job_description", "")
    if not job_description:
        raise HTTPException(status_code=400, detail="Job description is required for analysis")
        
    # Analyze with AI
    ai_result = await analyze_resume_with_ai(resume["resume_text"], job_description)
    
    # Save analysis
    now = datetime.now(timezone.utc)
    analysis_dict = ai_result
    
    # Handle potential AI hallucination of key name
    if "summary" in analysis_dict and "ai_summary" not in analysis_dict:
        analysis_dict["ai_summary"] = analysis_dict.pop("summary")
        
    analysis_dict["resume_id"] = resume_id
    analysis_dict["user_id"] = current_user.id
    analysis_dict["created_at"] = now
    
    result = await db.analyses.insert_one(analysis_dict)
    
    return AnalysisResponse(
        id=str(result.inserted_id),
        **analysis_dict
    )

@router.get("/api/analysis/history", response_model=List[AnalysisResponse])
async def get_analysis_history(current_user: UserResponse = Depends(get_current_user)):
    db = get_database()
    cursor = db.analyses.find({"user_id": current_user.id}).sort("created_at", -1)
    analyses = await cursor.to_list(length=100)
    
    return [AnalysisResponse(id=str(a["_id"]), **a) for a in analyses]

@router.get("/api/analysis/{id}", response_model=AnalysisResponse)
async def get_analysis(id: str, current_user: UserResponse = Depends(get_current_user)):
    db = get_database()
    analysis = await db.analyses.find_one({"_id": ObjectId(id), "user_id": current_user.id})
    
    if not analysis:
        raise HTTPException(status_code=404, detail="Analysis not found")
        
    return AnalysisResponse(id=str(analysis["_id"]), **analysis)

@router.post("/api/resumes/{id}/improve-section", response_model=ImprovementResponse)
async def improve_section(
    id: str,
    request: ImprovementRequest,
    current_user: UserResponse = Depends(get_current_user)
):
    db = get_database()
    resume = await db.resumes.find_one({"_id": ObjectId(id), "user_id": current_user.id})
    
    if not resume:
        raise HTTPException(status_code=404, detail="Resume not found")
        
    job_desc = resume.get("job_description", "")
    
    improvement = await improve_resume_section_with_ai(
        request.section_name, 
        request.original_text, 
        job_desc
    )
    
    return improvement
