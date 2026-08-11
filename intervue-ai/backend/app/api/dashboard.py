from fastapi import APIRouter, Depends
from app.schemas.user import DashboardSummaryResponse
from app.api.auth import get_current_user
from app.services.dashboard_service import DashboardService

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])

@router.get("/summary", response_model=DashboardSummaryResponse)
def get_dashboard_summary(current_user: dict = Depends(get_current_user)):
    return DashboardService.get_dashboard_summary(
        user_id=current_user["id"],
        target_role=current_user.get("target_role", "Full Stack Engineer")
    )
