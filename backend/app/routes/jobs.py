from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import List, Optional
from app.dependencies import get_current_user
from app.services.apify_service import apify_service
from app.database import get_database

router = APIRouter()

class JobSearchRequest(BaseModel):
    search_term: str
    location: Optional[str] = "Worldwide"
    max_items: Optional[int] = 10

class JobMatchResponse(BaseModel):
    id: str
    title: str
    company: str
    location: str
    salary: str
    type: str
    url: str
    postedAt: str
    logo: str
    matchScore: int

@router.post("/search", response_model=List[JobMatchResponse])
async def search_jobs(request: JobSearchRequest, current_user=Depends(get_current_user)):
    """
    Search for jobs using Apify scraper based on the provided search terms.
    Returns a list of jobs mapped to our frontend UI format.
    """
    try:
        db = get_database()
        # Find the most recently generated resume for this user
        resume = await db.resumes.find_one(
            {"user_id": current_user["_id"]},
            sort=[("created_at", -1)]
        )
        
        user_resume_text = ""
        if resume and "content" in resume:
            # Simple dump of resume content to text for the LLM
            user_resume_text = str(resume["content"])
            
        jobs = await apify_service.search_jobs(
            search_term=request.search_term,
            location=request.location,
            max_items=request.max_items,
            user_resume=user_resume_text
        )
        return jobs
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to scrape jobs: {str(e)}")
