from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from typing import Optional, List

from ..database import get_database
from ..models.user import UserResponse
from ..dependencies import get_current_user
from bson import ObjectId

router = APIRouter(prefix="/api/users", tags=["users"])

class ProfileUpdate(BaseModel):
    full_name: Optional[str] = None
    employee_id: Optional[str] = None
    target_role: Optional[str] = None
    experience_level: Optional[str] = None
    skills: Optional[List[str]] = None

class PasswordUpdate(BaseModel):
    current_password: str
    new_password: str

@router.put("/profile", response_model=UserResponse)
async def update_profile(
    update_data: ProfileUpdate,
    current_user: UserResponse = Depends(get_current_user)
):
    db = get_database()
    
    update_dict = {k: v for k, v in update_data.model_dump().items() if v is not None}
    
    if not update_dict:
        return current_user
        
    await db.users.update_one(
        {"email": current_user.email},
        {"$set": update_dict}
    )
    
    user = await db.users.find_one({"email": current_user.email})
    
    return UserResponse(
        id=str(user["_id"]),
        email=user["email"],
        full_name=user["full_name"],
        employee_id=user.get("employee_id"),
        target_role=user.get("target_role"),
        experience_level=user.get("experience_level"),
        skills=user.get("skills", []),
        role=user.get("role", "employee"),
        status=user.get("status", "active"),
        account_status=user.get("account_status", "approved"),
        availability_status=user.get("availability_status", "available"),
        project_history=user.get("project_history", []),
        education=user.get("education", []),
        certifications=user.get("certifications", []),
        photo_url=user.get("photo_url"),
        has_resume=bool(user.get("resume_text")),
        resume_text=user.get("resume_text")
    )

from fastapi import UploadFile, File
from ..services.resume_parser import extract_text_from_file

@router.post("/resume", response_model=UserResponse)
async def upload_user_resume(
    file: UploadFile = File(...),
    current_user: UserResponse = Depends(get_current_user)
):
    db = get_database()
    file_bytes = await file.read()
    filename = file.filename or "unknown.txt"
    resume_text = extract_text_from_file(filename.lower(), file_bytes)
    
    await db.users.update_one(
        {"email": current_user.email},
        {"$set": {"resume_text": resume_text}}
    )
    
    user = await db.users.find_one({"email": current_user.email})
    return UserResponse(
        id=str(user["_id"]),
        email=user["email"],
        full_name=user["full_name"],
        employee_id=user.get("employee_id"),
        target_role=user.get("target_role"),
        experience_level=user.get("experience_level"),
        skills=user.get("skills", []),
        role=user.get("role", "employee"),
        status=user.get("status", "active"),
        account_status=user.get("account_status", "approved"),
        availability_status=user.get("availability_status", "available"),
        project_history=user.get("project_history", []),
        education=user.get("education", []),
        certifications=user.get("certifications", []),
        photo_url=user.get("photo_url"),
        has_resume=True,
        resume_text=resume_text
    )

from ..utils.auth import verify_password, get_password_hash

@router.put("/password")
async def update_password(
    data: PasswordUpdate,
    current_user: UserResponse = Depends(get_current_user)
):
    db = get_database()
    user = await db.users.find_one({"email": current_user.email})
    
    if not user or not verify_password(data.current_password, user["hashed_password"]):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Incorrect current password"
        )
        
    hashed_password = get_password_hash(data.new_password)
    
    await db.users.update_one(
        {"email": current_user.email},
        {"$set": {"hashed_password": hashed_password}}
    )
    
    return {"message": "Password updated successfully"}

@router.get("", response_model=List[dict])
async def get_all_users(
    current_user: UserResponse = Depends(get_current_user)
):
    db = get_database()
    # Get all active users except current user
    cursor = db.users.find({"_id": {"$ne": ObjectId(current_user.id)}, "status": "active"})
    users = await cursor.to_list(length=1000)
    
    return [
        {
            "id": str(u["_id"]),
            "name": u.get("full_name", ""),
            "role": u.get("role", ""),
            "photo_url": u.get("photo_url", "")
        }
        for u in users
    ]
