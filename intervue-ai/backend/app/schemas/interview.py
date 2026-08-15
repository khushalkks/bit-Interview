from pydantic import BaseModel, Field
from typing import List, Optional
from enum import Enum

class TrackEnum(str, Enum):
    TECHNICAL = "technical"
    CODING = "coding"
    SYSTEM_DESIGN = "system_design"
    BEHAVIORAL = "behavioral"

class DifficultyEnum(str, Enum):
    EASY = "Easy"
    MEDIUM = "Medium"
    HARD = "Hard"
    ADVANCED = "Advanced"

class StartInterviewRequest(BaseModel):
    track: TrackEnum = TrackEnum.TECHNICAL
    target_role: Optional[str] = "Full Stack Engineer"
    difficulty: DifficultyEnum = DifficultyEnum.MEDIUM
    resume_text: Optional[str] = None
    jd_text: Optional[str] = None
    candidate_name: Optional[str] = None
    company_name: Optional[str] = None

class CandidateAnswerRequest(BaseModel):
    answer_text: str
    code_snippet: Optional[str] = None
    code_language: Optional[str] = None

class InterviewMessage(BaseModel):
    id: str
    sender: str  # "interviewer" | "candidate"
    content: str
    code_snippet: Optional[str] = None
    code_language: Optional[str] = None
    difficulty: Optional[str] = None
    timestamp: str
    evaluation_hint: Optional[str] = None

class InterviewSessionResponse(BaseModel):
    session_id: str
    track: str
    track_title: str
    target_role: str
    status: str  # "active" | "completed"
    current_difficulty: str
    question_count: int
    started_at: str
    messages: List[InterviewMessage] = Field(default_factory=list)

class QuestionAnalysisItem(BaseModel):
    id: str
    question: str
    candidate_answer: str
    code_snippet: Optional[str] = None
    score: int
    feedback: str
    ideal_answer: str
    time_complexity: Optional[str] = None
    space_complexity: Optional[str] = None

class ProctoringEventRequest(BaseModel):
    event_type: str  # "tab_switch" | "window_blur" | "code_paste"
    details: Optional[str] = None

class InterviewSummaryResponse(BaseModel):
    session_id: str
    track_title: str
    target_role: str
    overall_score: int
    duration: str
    total_questions: int
    technical_accuracy: int
    problem_solving: int
    communication: int
    code_efficiency: int
    architecture_design: int
    category_scores: dict = Field(default_factory=dict)
    question_analysis: List[QuestionAnalysisItem] = Field(default_factory=list)
    integrity_score: int = 100
    proctoring_flags: List[str] = Field(default_factory=list)
    strengths: List[str] = Field(default_factory=list)
    areas_for_improvement: List[str] = Field(default_factory=list)
    actionable_recommendations: List[str] = Field(default_factory=list)
    overall_feedback: str
    completed_at: str

