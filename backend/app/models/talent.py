from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime
from enum import Enum

class ProjectStatusEnum(str, Enum):
    active = "active"
    completed = "completed"
    on_hold = "on_hold"
    cancelled = "cancelled"

class ClientBase(BaseModel):
    name: str
    contact: Optional[str] = None
    industry: Optional[str] = None
    description: Optional[str] = None

class ClientInDB(ClientBase):
    id: str = Field(alias="_id")
    created_at: datetime
    updated_at: datetime

class ClientResponse(ClientBase):
    id: str
    
class ProjectBase(BaseModel):
    name: str
    client_id: str
    description: str
    manager_id: str
    required_skills: List[str] = []
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None
    status: ProjectStatusEnum = ProjectStatusEnum.active
    required_team_size: int = 1

class ProjectInDB(ProjectBase):
    id: str = Field(alias="_id")
    allocated_employee_ids: List[str] = []
    created_at: datetime
    updated_at: datetime

class ProjectResponse(ProjectBase):
    id: str
    allocated_employee_ids: List[str] = []

class JDStatusEnum(str, Enum):
    draft = "draft"
    published = "published"
    closed = "closed"

class JobDescriptionBase(BaseModel):
    title: str
    project_id: Optional[str] = None
    client_id: Optional[str] = None
    description: str
    responsibilities: List[str] = []
    required_skills: List[str] = []
    preferred_skills: List[str] = []
    experience: str
    seniority: str
    employment_type: str = "Full-time"
    required_hours: int = 40
    duration: Optional[str] = None
    location: str
    deadline: Optional[datetime] = None
    status: JDStatusEnum = JDStatusEnum.draft

class JobDescriptionInDB(JobDescriptionBase):
    id: str = Field(alias="_id")
    created_by_id: str
    created_at: datetime
    updated_at: datetime

class JobDescriptionResponse(JobDescriptionBase):
    id: str
    created_by_id: str

class EmployeeProfileBase(BaseModel):
    user_id: str
    headline: Optional[str] = None
    bio: Optional[str] = None
    experience_years: int = 0
    skills: List[str] = []
    certifications: List[str] = []
    location: Optional[str] = None
    availability_status: str = "available" # available, occupied, on_leave
    current_project_id: Optional[str] = None

class EmployeeProfileInDB(EmployeeProfileBase):
    id: str = Field(alias="_id")
    created_at: datetime
    updated_at: datetime

class EmployeeProfileResponse(EmployeeProfileBase):
    id: str
