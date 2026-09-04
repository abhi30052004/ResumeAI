from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

class ApplicationBase(BaseModel):
    title: str
    company: str
    location: Optional[str] = "Remote"
    salary: Optional[str] = None
    url: Optional[str] = None
    logo: Optional[str] = None
    status: str = "Applied"

class ApplicationCreate(ApplicationBase):
    pass

class ApplicationUpdate(BaseModel):
    status: str

class ApplicationInDB(ApplicationBase):
    id: str = Field(alias="_id")
    user_id: str
    created_at: datetime
    updated_at: datetime

class ApplicationResponse(ApplicationBase):
    id: str
    created_at: datetime
    updated_at: datetime
