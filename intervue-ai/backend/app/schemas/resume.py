from pydantic import BaseModel, Field
from typing import List, Optional

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

class ResumeProfileResponse(BaseModel):
    candidate_name: str
    email: Optional[str] = None
    phone: Optional[str] = None
    summary: Optional[str] = None
    skills: List[str] = Field(default_factory=list)
    programming_languages: List[str] = Field(default_factory=list)
    frameworks_and_tools: List[str] = Field(default_factory=list)
    databases: List[str] = Field(default_factory=list)
    projects: List[ProjectSchema] = Field(default_factory=list)
    experience: List[ExperienceSchema] = Field(default_factory=list)
    education: List[EducationSchema] = Field(default_factory=list)
    certifications: List[str] = Field(default_factory=list)
    raw_text: Optional[str] = None
    file_name: Optional[str] = None
    uploaded_at: Optional[str] = None
