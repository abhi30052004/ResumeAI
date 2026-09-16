from fastapi import APIRouter, Depends, HTTPException, status
from typing import List
from bson import ObjectId

from ..database import get_database
from ..models.user import UserResponse, UserUpdateRole, UserUpdateStatus
from ..dependencies import require_admin

router = APIRouter(prefix="/api/admin", tags=["admin"])

@router.get("/users", response_model=List[UserResponse])
async def get_all_users(current_user: UserResponse = Depends(require_admin)):
    db = get_database()
    cursor = db.users.find({})
    users = await cursor.to_list(length=100)
    
    return [
        UserResponse(
            id=str(user["_id"]),
            email=user["email"],
            full_name=user["full_name"],
            employee_id=user.get("employee_id"),
            photo_url=user.get("photo_url"),
            role=user.get("role", "employee"),
            status=user.get("status", "active"),
            account_status=user.get("account_status", "approved"),
            target_role=user.get("target_role"),
            experience_level=user.get("experience_level"),
            skills=user.get("skills", [])
        ) for user in users
    ]

@router.put("/users/{user_id}/role", response_model=UserResponse)
async def update_user_role(
    user_id: str, 
    role_update: UserUpdateRole, 
    current_user: UserResponse = Depends(require_admin)
):
    db = get_database()
    try:
        object_id = ObjectId(user_id)
    except:
        raise HTTPException(status_code=400, detail="Invalid user ID format")
        
    result = await db.users.update_one(
        {"_id": object_id},
        {"$set": {"role": role_update.role}}
    )
    
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="User not found")
        
    updated_user = await db.users.find_one({"_id": object_id})
    return UserResponse(
        id=str(updated_user["_id"]),
        email=updated_user["email"],
        full_name=updated_user["full_name"],
        employee_id=updated_user.get("employee_id"),
        photo_url=updated_user.get("photo_url"),
        role=updated_user.get("role", "employee"),
        status=updated_user.get("status", "active"),
        account_status=updated_user.get("account_status", "approved"),
        target_role=updated_user.get("target_role"),
        experience_level=updated_user.get("experience_level"),
        skills=updated_user.get("skills", [])
    )

@router.put("/users/{user_id}/status", response_model=UserResponse)
async def update_user_status(
    user_id: str, 
    status_update: UserUpdateStatus, 
    current_user: UserResponse = Depends(require_admin)
):
    db = get_database()
    try:
        object_id = ObjectId(user_id)
    except:
        raise HTTPException(status_code=400, detail="Invalid user ID format")
        
    update_data = {}
    if status_update.status is not None:
        update_data["status"] = status_update.status
    if status_update.account_status is not None:
        update_data["account_status"] = status_update.account_status
        
    if not update_data:
        raise HTTPException(status_code=400, detail="No status fields provided to update")
        
    result = await db.users.update_one(
        {"_id": object_id},
        {"$set": update_data}
    )
    
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="User not found")
        
    updated_user = await db.users.find_one({"_id": object_id})
    return UserResponse(
        id=str(updated_user["_id"]),
        email=updated_user["email"],
        full_name=updated_user["full_name"],
        employee_id=updated_user.get("employee_id"),
        photo_url=updated_user.get("photo_url"),
        role=updated_user.get("role", "employee"),
        status=updated_user.get("status", "active"),
        account_status=updated_user.get("account_status", "approved"),
        target_role=updated_user.get("target_role"),
        experience_level=updated_user.get("experience_level"),
        skills=updated_user.get("skills", [])
    )
