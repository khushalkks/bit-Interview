from pydantic import BaseModel, Field
from typing import List, Optional, Dict

class JDAnalysisRequest(BaseModel):
    jd_text: str
    target_role: Optional[str] = "Software Engineer"
    company_name: Optional[str] = "Target Company"

class JDAnalysisResponse(BaseModel):
    id: str
    target_role: str
    company_name: str
    match_score: int
    resume_match_score: int = 78
    experience_level: str
    extracted_skills: List[str] = Field(default_factory=list)
    matching_skills: List[str] = Field(default_factory=list)
    missing_skills: List[str] = Field(default_factory=list)
    ats_recommendations: List[str] = Field(default_factory=list)
    prep_study_plan: List[str] = Field(default_factory=list)
    company_culture_notes: str = ""
    key_focus_areas: List[str] = Field(default_factory=list)
    suggested_interview_questions: List[str] = Field(default_factory=list)
    recommended_track: str
    created_at: str

class CandidateRankItem(BaseModel):
    user_id: str
    candidate_name: str
    target_role: str
    track_title: str
    overall_score: int
    technical_accuracy: int
    problem_solving: int
    communication: int
    integrity_score: int
    completed_sessions: int
    last_active: str

class RecruiterDashboardResponse(BaseModel):
    total_candidates_assessed: int
    avg_score: int
    top_performers_count: int
    active_job_roles: int
    leaderboard: List[CandidateRankItem] = Field(default_factory=list)
    recent_jd_searches: List[Dict[str, str]] = Field(default_factory=list)
