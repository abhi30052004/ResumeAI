from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File, Form
from typing import List, Optional
from datetime import datetime, timezone
from bson import ObjectId

from ..database import get_database
from ..models.user import UserResponse
from ..models.resume import ResumeResponse, ResumeCreate
from ..models.analysis import ImprovementRequest, ImprovementResponse, GenerateSectionRequest
from ..dependencies import get_current_user
from ..services.resume_parser import extract_text_from_file
from ..services.openai_service import improve_resume_section_with_ai, generate_resume_section_with_ai

router = APIRouter(prefix="/api/resumes", tags=["resumes"])

@router.post("", response_model=ResumeResponse)
async def create_resume(
    resume: ResumeCreate,
    current_user: UserResponse = Depends(get_current_user)
):
    db = get_database()
    now = datetime.now(timezone.utc)
    
    resume_dict = resume.model_dump()
    resume_dict["user_id"] = current_user.id
    resume_dict["created_at"] = now
    resume_dict["updated_at"] = now
    
    result = await db.resumes.insert_one(resume_dict)
    
    return ResumeResponse(
        id=str(result.inserted_id),
        **resume_dict
    )

@router.post("/upload", response_model=ResumeResponse)
async def upload_resume(
    file: UploadFile = File(...),
    name: str = Form(...),
    target_role: Optional[str] = Form(None),
    job_description: Optional[str] = Form(None),
    current_user: UserResponse = Depends(get_current_user)
):
    try:
        db = get_database()
        now = datetime.now(timezone.utc)
        
        # Extract text from file
        file_bytes = await file.read()
        filename = file.filename or "unknown.txt"
        resume_text = extract_text_from_file(filename.lower(), file_bytes)
        
        resume_dict = {
            "name": name,
            "target_role": target_role,
            "resume_text": resume_text,
            "job_description": job_description,
            "user_id": current_user.id,
            "created_at": now,
            "updated_at": now
        }
        
        result = await db.resumes.insert_one(resume_dict)
        
        return ResumeResponse(
            id=str(result.inserted_id),
            **resume_dict
        )
    except Exception as e:
        import traceback
        with open("upload_error.log", "w") as f:
            f.write(traceback.format_exc())
        raise HTTPException(status_code=500, detail=str(e))

@router.get("", response_model=List[ResumeResponse])
async def list_resumes(current_user: UserResponse = Depends(get_current_user)):
    db = get_database()
    cursor = db.resumes.find({"user_id": current_user.id}).sort("updated_at", -1)
    resumes = await cursor.to_list(length=100)
    
    return [ResumeResponse(id=str(r["_id"]), **r) for r in resumes]

@router.get("/{id}", response_model=ResumeResponse)
async def get_resume(id: str, current_user: UserResponse = Depends(get_current_user)):
    db = get_database()
    resume = await db.resumes.find_one({"_id": ObjectId(id), "user_id": current_user.id})
    
    if not resume:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Resume not found")
        
    return ResumeResponse(id=str(resume["_id"]), **resume)

@router.post("/{id}/improve-section", response_model=ImprovementResponse)
async def improve_section(
    id: str,
    request: ImprovementRequest,
    current_user: UserResponse = Depends(get_current_user)
):
    db = get_database()
    resume = await db.resumes.find_one({"_id": ObjectId(id), "user_id": current_user.id})
    
    if not resume:
        raise HTTPException(status_code=404, detail="Resume not found")
        
    job_description = resume.get("job_description", "")
    if not job_description:
        raise HTTPException(status_code=400, detail="Job description is required to generate tailored improvements")
        
    result = await improve_resume_section_with_ai(
        section_name=request.section_name,
        original_text=request.original_text,
        job_description=job_description
    )
    
    return result

@router.post("/generate-section")
async def generate_section(
    request: GenerateSectionRequest,
    current_user: UserResponse = Depends(get_current_user)
):
    result = await generate_resume_section_with_ai(
        section_name=request.section_name,
        current_content=request.current_content
    )
    return result

@router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_resume(id: str, current_user: UserResponse = Depends(get_current_user)):
    db = get_database()
    result = await db.resumes.delete_one({"_id": ObjectId(id), "user_id": current_user.id})
    
    if result.deleted_count == 0:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Resume not found")
