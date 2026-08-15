from fastapi import APIRouter, HTTPException, Depends, status
from typing import List
from app.schemas.interview import (
    StartInterviewRequest, CandidateAnswerRequest,
    InterviewSessionResponse, InterviewSummaryResponse, ProctoringEventRequest
)
from app.services.interview_service import InterviewService
from app.api.auth import get_current_user

router = APIRouter(prefix="/interview", tags=["Adaptive AI Interview"])

@router.post("/start", response_model=InterviewSessionResponse, status_code=status.HTTP_201_CREATED)
def start_interview_session(
    payload: StartInterviewRequest,
    current_user: dict = Depends(get_current_user)
):
    try:
        user_id = current_user["id"]
        target_role = payload.target_role or current_user.get("target_role", "Full Stack Engineer")
        session = InterviewService.start_session(
            user_id=user_id,
            track=payload.track,
            target_role=target_role,
            difficulty=payload.difficulty
        )
        return session
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to start interview session: {str(e)}"
        )

@router.get("/history")
def get_user_interview_history(current_user: dict = Depends(get_current_user)):
    user_id = current_user["id"]
    return InterviewService.get_user_history(user_id)

@router.post("/{session_id}/ai-hint")
def request_ai_hint(
    session_id: str,
    payload: dict = None,
    current_user: dict = Depends(get_current_user)
):
    try:
        current_code = payload.get("current_code", "") if payload else ""
        level = payload.get("level", 1) if payload else 1
        return InterviewService.generate_ai_hint(session_id, current_code, level)
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))

@router.get("/{session_id}", response_model=InterviewSessionResponse)
def get_interview_session(
    session_id: str,
    current_user: dict = Depends(get_current_user)
):
    try:
        user_id = current_user["id"]
        return InterviewService.get_session(user_id, session_id)
    except ValueError as ve:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(ve))
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))

@router.get("/{session_id}/report", response_model=InterviewSummaryResponse)
def get_interview_report(
    session_id: str,
    current_user: dict = Depends(get_current_user)
):
    try:
        user_id = current_user["id"]
        return InterviewService.get_session_summary(user_id, session_id)
    except ValueError as ve:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(ve))
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))

@router.post("/{session_id}/proctoring-event")
def record_proctoring_event(
    session_id: str,
    payload: ProctoringEventRequest,
    current_user: dict = Depends(get_current_user)
):
    try:
        user_id = current_user["id"]
        return InterviewService.log_proctoring_event(
            user_id=user_id,
            session_id=session_id,
            event_type=payload.event_type,
            details=payload.details
        )
    except ValueError as ve:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(ve))
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))

@router.post("/{session_id}/answer", response_model=InterviewSessionResponse)
def submit_candidate_answer(
    session_id: str,
    payload: CandidateAnswerRequest,
    current_user: dict = Depends(get_current_user)
):
    try:
        user_id = current_user["id"]
        session = InterviewService.submit_answer(
            user_id=user_id,
            session_id=session_id,
            answer_text=payload.answer_text,
            code_snippet=payload.code_snippet,
            code_language=payload.code_language
        )
        return session
    except ValueError as ve:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(ve))
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))

@router.post("/{session_id}/end", response_model=InterviewSummaryResponse)
def end_interview_session(
    session_id: str,
    current_user: dict = Depends(get_current_user)
):
    try:
        user_id = current_user["id"]
        summary = InterviewService.end_session(user_id, session_id)
        return summary
    except ValueError as ve:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(ve))
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))

