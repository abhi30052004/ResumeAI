from fastapi import APIRouter, Depends, HTTPException, status
from typing import List
from datetime import datetime
from bson import ObjectId

from app.database import get_database
from app.dependencies import get_current_user
from app.models.application import ApplicationCreate, ApplicationResponse, ApplicationUpdate

router = APIRouter()

@router.post("/", response_model=ApplicationResponse, status_code=status.HTTP_201_CREATED)
async def create_application(application: ApplicationCreate, current_user=Depends(get_current_user)):
    db = get_database()
    
    app_dict = application.model_dump()
    app_dict["user_id"] = current_user["_id"]
    app_dict["created_at"] = datetime.utcnow()
    app_dict["updated_at"] = app_dict["created_at"]
    
    result = await db.applications.insert_one(app_dict)
    
    created_app = await db.applications.find_one({"_id": result.inserted_id})
    created_app["id"] = str(created_app["_id"])
    return created_app

@router.get("/", response_model=List[ApplicationResponse])
async def get_applications(current_user=Depends(get_current_user)):
    db = get_database()
    
    cursor = db.applications.find({"user_id": current_user["_id"]}).sort("updated_at", -1)
    applications = await cursor.to_list(length=100)
    
    for app in applications:
        app["id"] = str(app["_id"])
        
    return applications

@router.patch("/{app_id}", response_model=ApplicationResponse)
async def update_application_status(app_id: str, app_update: ApplicationUpdate, current_user=Depends(get_current_user)):
    db = get_database()
    
    try:
        obj_id = ObjectId(app_id)
    except:
        raise HTTPException(status_code=400, detail="Invalid application ID")
        
    # Verify ownership
    existing = await db.applications.find_one({"_id": obj_id, "user_id": current_user["_id"]})
    if not existing:
        raise HTTPException(status_code=404, detail="Application not found")
        
    update_data = {
        "status": app_update.status,
        "updated_at": datetime.utcnow()
    }
    
    await db.applications.update_one(
        {"_id": obj_id},
        {"$set": update_data}
    )
    
    updated_app = await db.applications.find_one({"_id": obj_id})
    updated_app["id"] = str(updated_app["_id"])
    
    return updated_app
