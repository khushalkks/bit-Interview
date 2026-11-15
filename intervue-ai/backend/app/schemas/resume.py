from pydantic import BaseModel, Field
from typing import List, Optional, Dict

class ProjectSchema(BaseModel):
    name: str
    description: str
    technologies: List[str] = Field(default_factory=list)

class ExperienceSchema(BaseModel):
    title: str
    company: str
    duration: str
    highlights: List[str] = Field(default_factory=list)

class EducationSchema(BaseModel):
    degree: str
    institution: str
    year: str

class EnhancedBulletSchema(BaseModel):
    original: str
    improved: str
    impact_factor: str

class AtsBreakdownSchema(BaseModel):
    impact_score: int = 85
    keyword_density: int = 90
    structure_score: int = 88
    skills_depth: int = 82

class ResumeProfileResponse(BaseModel):
    candidate_name: str
    email: Optional[str] = None
    phone: Optional[str] = None
    summary: Optional[str] = None
    skills: List[str] = Field(default_factory=list)
    programming_languages: List[str] = Field(default_factory=list)
    frameworks_and_tools: List[str] = Field(default_factory=list)
    databases: List[str] = Field(default_factory=list)
    cloud_and_devops: List[str] = Field(default_factory=list)
    ai_and_data: List[str] = Field(default_factory=list)
    projects: List[ProjectSchema] = Field(default_factory=list)
    experience: List[ExperienceSchema] = Field(default_factory=list)
    education: List[EducationSchema] = Field(default_factory=list)
    certifications: List[str] = Field(default_factory=list)
    ats_score: Optional[int] = 85
    ats_breakdown: Optional[AtsBreakdownSchema] = None
    quantified_metrics: List[str] = Field(default_factory=list)
    strengths: List[str] = Field(default_factory=list)
    improvement_suggestions: List[str] = Field(default_factory=list)
    enhanced_bullets: List[EnhancedBulletSchema] = Field(default_factory=list)
    detected_role_fit: Optional[str] = "Full Stack Engineer"
    raw_text: Optional[str] = None
    file_name: Optional[str] = None
    uploaded_at: Optional[str] = None
