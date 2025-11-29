from pydantic import BaseModel
from typing import List, Optional
from datetime import date, datetime
from enum import Enum

class OverviewStats(BaseModel):
    total_users: int
    active_today: int
    content_blocked: int
    pending_reports: int

class UsageDataPoint(BaseModel):
    date: str
    value: int

class UsageStats(BaseModel):
    usage_over_time: List[UsageDataPoint]
    growth_percentage: float

class AccuracyStats(BaseModel):
    accuracy_percentage: float
    last_30_days_change: float
    accurate_count: int
    inaccurate_count: int

class TopCategory(BaseModel):
    category: str
    percentage: float

class ActivityType(str, Enum):
    FILTERED_CONTENT = "filtered_content"
    LOGIN = "login"
    REPORT = "report"

class Activity(BaseModel):
    id: str
    content: str
    user: str
    date: datetime
    action: str
    type: ActivityType

class ReportStatus(str, Enum):
    PENDING = "pending"
    APPROVED = "approved"
    REJECTED = "rejected"
    REVIEWED = "reviewed"

class Report(BaseModel):
    id: str
    content_preview: str # URL or text snippet
    report_reason: str
    reporter: str
    submission_date: datetime
    status: ReportStatus
    category: Optional[str] = None

class ReportAction(BaseModel):
    report_ids: List[str]
    action: str # 'approve' | 'reject' | 'review'
