from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

class ResumeBase(BaseModel):
    name: str
    target_role: Optional[str] = None
    resume_text: str
    job_description: Optional[str] = None

class ResumeCreate(ResumeBase):
    pass

class ResumeInDB(ResumeBase):
    id: str = Field(alias="_id")
    user_id: str
    created_at: datetime
    updated_at: datetime

class ResumeResponse(ResumeBase):
    id: str
    user_id: str
    created_at: datetime
    updated_at: datetime
