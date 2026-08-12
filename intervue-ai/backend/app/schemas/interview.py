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
    strengths: List[str] = Field(default_factory=list)
    areas_for_improvement: List[str] = Field(default_factory=list)
    overall_feedback: str
    completed_at: str
