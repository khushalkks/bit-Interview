from fastapi import APIRouter, HTTPException, Depends, status
from app.schemas.recruiter import JDAnalysisRequest, JDAnalysisResponse, RecruiterDashboardResponse
from app.services.jd_service import JDService
from app.services.recruiter_service import RecruiterService
from app.api.auth import get_current_user

router = APIRouter(tags=["Recruiter & JD Intelligence"])

@router.post("/jd/analyze", response_model=JDAnalysisResponse, status_code=status.HTTP_201_CREATED)
def analyze_job_description(
    payload: JDAnalysisRequest,
    current_user: dict = Depends(get_current_user)
):
    try:
        if not payload.jd_text.trim() if hasattr(payload.jd_text, 'trim') else not payload.jd_text.strip():
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Job description text cannot be empty.")
        
        analysis = JDService.analyze_jd(
            jd_text=payload.jd_text,
            target_role=payload.target_role or "Software Engineer",
            company_name=payload.company_name or "Target Company",
            user_id=current_user.get("id")
        )
        return analysis
    except HTTPException as he:
        raise he
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to analyze job description: {str(e)}"
        )

@router.get("/jd/{analysis_id}", response_model=JDAnalysisResponse)
def get_jd_analysis(
    analysis_id: str,
    current_user: dict = Depends(get_current_user)
):
    try:
        return JDService.get_analysis(analysis_id)
    except ValueError as ve:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(ve))
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))

@router.get("/recruiter/leaderboard", response_model=RecruiterDashboardResponse)
def get_recruiter_leaderboard(
    current_user: dict = Depends(get_current_user)
):
    try:
        return RecruiterService.get_dashboard_summary()
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch recruiter leaderboard: {str(e)}"
        )
