from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from typing import Optional, List

from ..database import get_database
from ..models.user import UserResponse
from ..dependencies import get_current_user

router = APIRouter(prefix="/api/users", tags=["users"])

class ProfileUpdate(BaseModel):
    full_name: Optional[str] = None
    target_role: Optional[str] = None
    experience_level: Optional[str] = None
    skills: Optional[List[str]] = None

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
        target_role=user.get("target_role"),
        experience_level=user.get("experience_level"),
        skills=user.get("skills", [])
    )
