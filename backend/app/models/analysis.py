from pydantic import BaseModel, Field
from typing import List, Dict, Optional
from datetime import datetime

class SectionFeedback(BaseModel):
    score: int
    feedback: str
    suggestion: str

class SectionAnalysis(BaseModel):
    summary: Optional[SectionFeedback] = None
    skills: Optional[SectionFeedback] = None
    experience: Optional[SectionFeedback] = None
    projects: Optional[SectionFeedback] = None
    education: Optional[SectionFeedback] = None

class AnalysisBase(BaseModel):
    resume_id: str
    ats_score: int
    job_match_score: int
    keyword_score: int
    strengths: List[str]
    weaknesses: List[str]
    missing_keywords: List[str]
    section_analysis: SectionAnalysis
    ai_summary: str

class AnalysisInDB(AnalysisBase):
    id: str = Field(alias="_id")
    user_id: str
    created_at: datetime

class AnalysisResponse(AnalysisBase):
    id: str
    user_id: str
    created_at: datetime
    
class ImprovementRequest(BaseModel):
    section_name: str
    original_text: str
    
class ImprovementResponse(BaseModel):
    improved_text: str
    explanation: str

class GenerateSectionRequest(BaseModel):
    section_name: str
    current_content: str = ""
