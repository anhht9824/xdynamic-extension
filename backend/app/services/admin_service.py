from sqlalchemy.orm import Session
from sqlalchemy import func
from datetime import datetime, timedelta
from typing import List, Optional
import random

from app.models.user import User
from app.models.usage_log import UsageLog
from app.schemas.admin import (
    OverviewStats, UsageStats, UsageDataPoint, AccuracyStats,
    TopCategory, Activity, ActivityType, Report, ReportStatus, ReportAction
)

# Mock Data Store for Reports (In-memory for demo purposes)
# In a real app, this would be a database table
MOCK_REPORTS = []

def _generate_mock_reports():
    if MOCK_REPORTS:
        return
    
    categories = ["Nudity", "Violence", "Hate Speech", "Spam", "Harassment"]
    statuses = [ReportStatus.PENDING, ReportStatus.APPROVED, ReportStatus.REJECTED, ReportStatus.REVIEWED]
    
    for i in range(50):
        report_id = f"rpt_{i+100}"
        MOCK_REPORTS.append(Report(
            id=report_id,
            content_preview=f"https://example.com/content/{i}.jpg" if i % 2 == 0 else f"Offensive comment #{i}",
            report_reason=random.choice(["Inappropriate Content", "Spam", "Harassment", "Hate Speech"]),
            reporter=f"user_{random.randint(1, 100)}",
            submission_date=datetime.utcnow() - timedelta(days=random.randint(0, 30)),
            status=random.choice(statuses),
            category=random.choice(categories)
        ))

_generate_mock_reports()

class AdminService:
    
    @staticmethod
    def get_overview_stats(db: Session) -> OverviewStats:
        total_users = db.query(User).count()
        
        today = datetime.utcnow().date()
        active_today = db.query(UsageLog.user_id).filter(
            func.date(UsageLog.created_at) == today
        ).distinct().count()
        
        # Mocking blocked content count based on usage logs (assuming 10% block rate for demo)
        total_usage = db.query(UsageLog).count()
        content_blocked = int(total_usage * 0.12) 
        
        pending_reports = len([r for r in MOCK_REPORTS if r.status == ReportStatus.PENDING])
        
        return OverviewStats(
            total_users=total_users,
            active_today=active_today,
            content_blocked=content_blocked,
            pending_reports=pending_reports
        )

    @staticmethod
    def get_usage_stats(db: Session, range_str: str = "30d") -> UsageStats:
        # Simple implementation for 30d
        end_date = datetime.utcnow()
        start_date = end_date - timedelta(days=30)
        
        logs = db.query(
            func.date(UsageLog.created_at).label("date"),
            func.count(UsageLog.id).label("count")
        ).filter(
            UsageLog.created_at >= start_date
        ).group_by(
            func.date(UsageLog.created_at)
        ).all()
        
        usage_map = {str(log.date): log.count for log in logs}
        usage_over_time = []
        
        current = start_date
        while current <= end_date:
            date_str = str(current.date())
            usage_over_time.append(UsageDataPoint(
                date=date_str,
                value=usage_map.get(date_str, 0)
            ))
            current += timedelta(days=1)
            
        return UsageStats(
            usage_over_time=usage_over_time,
            growth_percentage=12.5 # Mock growth
        )

    @staticmethod
    def get_accuracy_stats(db: Session, range_str: str = "30d") -> AccuracyStats:
        # Fully mock for now as we don't store prediction feedback loop yet
        return AccuracyStats(
            accuracy_percentage=95.2,
            last_30_days_change=1.5,
            accurate_count=950,
            inaccurate_count=48
        )

    @staticmethod
    def get_top_categories(db: Session, range_str: str = "30d") -> List[TopCategory]:
        # Mock categories
        return [
            TopCategory(category="Hate Speech", percentage=30.0),
            TopCategory(category="Violence", percentage=25.0),
            TopCategory(category="Nudity", percentage=20.0),
            TopCategory(category="Misinformation", percentage=15.0),
            TopCategory(category="Spam", percentage=10.0),
        ]

    @staticmethod
    def get_recent_activities(db: Session, limit: int = 5) -> List[Activity]:
        activities = []
        
        # Get recent logins/usage
        recent_logs = db.query(UsageLog).order_by(UsageLog.created_at.desc()).limit(limit).all()
        
        for log in recent_logs:
            activities.append(Activity(
                id=str(log.id),
                content=log.endpoint,
                user=f"User {log.user_id}",
                date=log.created_at,
                action="Accessed",
                type=ActivityType.LOGIN
            ))
            
        # Add some mock report activities
        for i, report in enumerate(MOCK_REPORTS[:2]):
             activities.append(Activity(
                id=f"act_rpt_{i}",
                content=report.report_reason,
                user=report.reporter,
                date=report.submission_date,
                action="Reported",
                type=ActivityType.REPORT
            ))
            
        # Sort by date desc and limit
        activities.sort(key=lambda x: x.date, reverse=True)
        return activities[:limit]

    @staticmethod
    def get_reports(
        db: Session, 
        page: int = 1, 
        limit: int = 10, 
        status: Optional[str] = None,
        date_range: Optional[str] = None,
        category: Optional[str] = None,
        search: Optional[str] = None
    ) -> dict:
        filtered = MOCK_REPORTS
        
        if status and status != "all":
            filtered = [r for r in filtered if r.status == status]
            
        if category and category != "all":
            filtered = [r for r in filtered if r.category == category]
            
        if search:
            search = search.lower()
            filtered = [r for r in filtered if search in r.report_reason.lower() or search in r.reporter.lower()]
            
        # Pagination
        total = len(filtered)
        start = (page - 1) * limit
        end = start + limit
        
        return {
            "data": filtered[start:end],
            "total": total,
            "page": page,
            "limit": limit
        }

    @staticmethod
    def handle_report_action(db: Session, action_data: ReportAction):
        count = 0
        for report in MOCK_REPORTS:
            if report.id in action_data.report_ids:
                if action_data.action == "approve":
                    report.status = ReportStatus.APPROVED
                elif action_data.action == "reject":
                    report.status = ReportStatus.REJECTED
                elif action_data.action == "review":
                    report.status = ReportStatus.REVIEWED
                count += 1
        return {"processed": count, "action": action_data.action}
