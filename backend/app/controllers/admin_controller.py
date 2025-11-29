from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional

from app.database import get_db
from app.services.admin_service import AdminService
from app.schemas.admin import (
    OverviewStats, UsageStats, AccuracyStats, TopCategory, 
    Activity, Report, ReportAction
)
# Assuming there is a get_current_user dependency, likely in app.controllers.auth_controller or app.middleware
# Based on user_controller.py check, I will find out where it is.
# For now I will assume it's available or I'll check user_controller first.
from app.controllers.auth_controller import get_current_user
from app.models.user import User

router = APIRouter(
    prefix="/admin",
    tags=["admin"],
    responses={404: {"description": "Not found"}},
)

# Admin dependency (simple check for now, can be expanded)
def get_current_admin(current_user: User = Depends(get_current_user)):
    if not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Admin privileges required")
    return current_user

@router.get("/stats/overview", response_model=OverviewStats)
def get_overview_stats(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin)
):
    return AdminService.get_overview_stats(db)

@router.get("/stats/usage", response_model=UsageStats)
def get_usage_stats(
    range: str = "30d",
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin)
):
    return AdminService.get_usage_stats(db, range)

@router.get("/stats/accuracy", response_model=AccuracyStats)
def get_accuracy_stats(
    range: str = "30d",
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin)
):
    return AdminService.get_accuracy_stats(db, range)

@router.get("/stats/top-categories", response_model=List[TopCategory])
def get_top_categories(
    range: str = "30d",
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin)
):
    return AdminService.get_top_categories(db, range)

@router.get("/activities", response_model=List[Activity])
def get_recent_activities(
    limit: int = 5,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin)
):
    return AdminService.get_recent_activities(db, limit)

@router.get("/reports")
def get_reports(
    page: int = 1,
    limit: int = 10,
    status: Optional[str] = None,
    date_range: Optional[str] = None,
    category: Optional[str] = None,
    search: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin)
):
    return AdminService.get_reports(db, page, limit, status, date_range, category, search)

@router.post("/reports/action")
def handle_report_action(
    action_data: ReportAction,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin)
):
    return AdminService.handle_report_action(db, action_data)
