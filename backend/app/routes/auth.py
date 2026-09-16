from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from datetime import datetime, timezone, timedelta
from pydantic import BaseModel

from ..database import get_database
from ..models.user import UserRegister, UserResponse, Token
from ..utils.auth import get_password_hash, verify_password, create_access_token
from ..config import settings
from ..dependencies import get_current_user

router = APIRouter(prefix="/api/auth", tags=["auth"])

# Using a custom model for JSON login, but also supporting form data if needed
class LoginRequest(BaseModel):
    email: str
    password: str

@router.post("/register", response_model=UserResponse)
async def register(user: UserRegister):
    db = get_database()
    
    # Check if user exists
    existing_user = await db.users.find_one({"email": user.email})
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
        
    # Determine account status based on role
    # Managers require admin approval to log in
    account_status = "pending" if user.role == "manager" else "approved"
        
    # Create new user
    hashed_password = get_password_hash(user.password)
    user_dict = {
        "email": user.email,
        "full_name": user.full_name,
        "employee_id": user.employee_id,
        "photo_url": user.photo_url,
        "hashed_password": hashed_password,
        "created_at": datetime.now(timezone.utc),
        "role": user.role,
        "status": "active",
        "account_status": account_status,
        "target_role": None,
        "experience_level": None,
        "skills": []
    }
    
    result = await db.users.insert_one(user_dict)
    
    return UserResponse(
        id=str(result.inserted_id),
        email=user.email,
        full_name=user.full_name,
        employee_id=user.employee_id,
        photo_url=user.photo_url,
        role=user.role,
        status="active",
        account_status=account_status
    )

@router.post("/login", response_model=Token)
async def login(login_data: LoginRequest):
    db = get_database()
    user = await db.users.find_one({"email": login_data.email})
    
    if not user or not verify_password(login_data.password, user["hashed_password"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
        
    if user.get("account_status") == "pending":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Account pending approval by administrator"
        )
        
    if user.get("status") == "inactive":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Account is inactive"
        )
        
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"email": user["email"]}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

@router.get("/me", response_model=UserResponse)
async def get_me(current_user: UserResponse = Depends(get_current_user)):
    return current_user
