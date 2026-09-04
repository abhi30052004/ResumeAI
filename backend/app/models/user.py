from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from datetime import datetime

class UserBase(BaseModel):
    email: EmailStr
    full_name: str

class UserCreate(UserBase):
    password: str

class UserInDB(UserBase):
    id: str = Field(alias="_id")
    hashed_password: str
    target_role: Optional[str] = None
    experience_level: Optional[str] = None
    skills: Optional[list[str]] = []
    created_at: datetime
    
class UserResponse(UserBase):
    id: str
    target_role: Optional[str] = None
    experience_level: Optional[str] = None
    skills: Optional[list[str]] = []

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None
