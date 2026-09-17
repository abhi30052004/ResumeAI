from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from datetime import datetime
from enum import Enum

class RoleEnum(str, Enum):
    admin = "admin"
    manager = "manager"
    employee = "employee"

class AccountStatusEnum(str, Enum):
    pending = "pending"
    approved = "approved"
    rejected = "rejected"

class UserStatusEnum(str, Enum):
    active = "active"
    inactive = "inactive"

class UserBase(BaseModel):
    email: EmailStr
    full_name: str
    employee_id: Optional[str] = None
    photo_url: Optional[str] = None
    resume_text: Optional[str] = None

class UserCreate(UserBase):
    password: str

class UserRegister(UserCreate):
    role: RoleEnum = RoleEnum.employee

class ProjectHistoryItem(BaseModel):
    project_name: str
    client: Optional[str] = None
    role: str
    technologies: list[str] = []
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None
    responsibilities: list[str] = []
    achievements: list[str] = []

class EducationItem(BaseModel):
    degree: str
    institution: str
    year: str

class CertificationItem(BaseModel):
    name: str
    issuer: str
    year: str

class AvailabilityStatusEnum(str, Enum):
    available = "available"
    partially_allocated = "partially_allocated"
    allocated = "allocated"
    on_leave = "on_leave"
    bench = "bench"

class UserInDB(UserBase):
    id: str = Field(alias="_id")
    hashed_password: str
    role: str = "employee"
    status: UserStatusEnum = UserStatusEnum.active
    account_status: AccountStatusEnum = AccountStatusEnum.approved
    target_role: Optional[str] = None
    experience_level: Optional[str] = None
    skills: Optional[list[str]] = []
    project_history: Optional[list[ProjectHistoryItem]] = []
    education: Optional[list[EducationItem]] = []
    certifications: Optional[list[CertificationItem]] = []
    availability_status: AvailabilityStatusEnum = AvailabilityStatusEnum.available
    created_at: datetime
    
class UserResponse(UserBase):
    id: str
    role: str
    status: str
    account_status: str
    target_role: Optional[str] = None
    experience_level: Optional[str] = None
    skills: Optional[list[str]] = []
    project_history: Optional[list[ProjectHistoryItem]] = []
    education: Optional[list[EducationItem]] = []
    certifications: Optional[list[CertificationItem]] = []
    availability_status: str = "available"
    has_resume: bool = False

class UserUpdateRole(BaseModel):
    role: RoleEnum

class UserUpdateStatus(BaseModel):
    status: Optional[UserStatusEnum] = None
    account_status: Optional[AccountStatusEnum] = None

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None
