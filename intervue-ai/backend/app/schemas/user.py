from pydantic import BaseModel, EmailStr, Field
from typing import List, Optional
from datetime import datetime

class UserRegister(BaseModel):
    name: str = Field(..., min_length=2, example="Khushal Kumar")
    email: str = Field(..., example="khushal@example.com")
    password: str = Field(..., min_length=6, example="password123")
    target_role: Optional[str] = Field(default="Full Stack Engineer", example="Full Stack Engineer")

class UserLogin(BaseModel):
    email: str = Field(..., example="khushal@example.com")
    password: str = Field(..., example="password123")

class UserResponse(BaseModel):
    id: str
    name: str
    email: str
    target_role: str
    created_at: str

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse

class InterviewSessionSummary(BaseModel):
    id: str
    title: str
    domain: str
    date: str
    duration: str
    score: int
    status: str

class SkillScore(BaseModel):
    category: str
    score: int
    full_mark: int = 100

class DashboardSummaryResponse(BaseModel):
    readiness_score: int
    interviews_completed: int
    hours_practiced: float
    target_role: str
    recent_sessions: List[InterviewSessionSummary]
    skills: List[SkillScore]
    recommended_topics: List[str]
