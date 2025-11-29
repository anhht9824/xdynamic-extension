from sqlalchemy.orm import Session
from sqlalchemy import func
from datetime import datetime, timedelta
from typing import List, Optional
import random

from app.models.user import User
from app.models.usage_log import UsageLog
from app.schemas.admin import (
    OverviewStats, UsageStats, UsageDataPoint, AccuracyStats,
    TopCategory, Activity, ActivityType, Report, ReportStatus, ReportAction,
    AdminUser, AdminUserList, AdminUserUpdate, SystemSettingItem, SystemSettingsUpdate
)
from app.models.transaction import Transaction, TransactionStatus, TransactionType
from app.models.system_setting import SystemSetting
import json

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
        
        # Calculate total revenue
        total_revenue = db.query(func.sum(Transaction.amount)).filter(
            Transaction.status == TransactionStatus.SUCCESS,
            Transaction.type.in_([TransactionType.TOPUP, TransactionType.PURCHASE])
        ).scalar() or 0.0

        # Calculate blocked images count
        # We need to check meta_data for "blocked": true
        # Since meta_data is a string, we might need to do a like query or load and filter
        # For better performance in production, this should be a separate column or indexed JSONB
        # For now, we'll use a simple LIKE query as a heuristic
        blocked_images_count = db.query(UsageLog).filter(
            UsageLog.meta_data.like('%"blocked": true%')
        ).count()

        return OverviewStats(
            total_users=total_users,
            active_today=active_today,
            content_blocked=content_blocked, # This was the mock one, maybe we should replace it?
            pending_reports=pending_reports,
            total_revenue=total_revenue,
            blocked_images_count=blocked_images_count
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
    def get_users(
        db: Session, 
        page: int = 1, 
        limit: int = 10, 
        search: Optional[str] = None,
        status: Optional[str] = None,
        role: Optional[str] = None
    ) -> AdminUserList:
        query = db.query(User)
        
        if search:
            search = f"%{search}%"
            query = query.filter(
                (User.email.ilike(search)) | (User.name.ilike(search))
            )
            
        if status:
            if status == "Active":
                query = query.filter(User.is_active == True)
            elif status == "Banned":
                query = query.filter(User.is_active == False)
                
        if role:
            if role == "Admin":
                query = query.filter(User.is_admin == True)
            elif role == "User":
                query = query.filter(User.is_admin == False)
                
        total = query.count()
        users = query.offset((page - 1) * limit).limit(limit).all()
        
        admin_users = []
        for user in users:
            admin_users.append(AdminUser(
                id=user.id,
                email=user.email,
                full_name=user.name,
                is_active=user.is_active,
                is_admin=user.is_admin,
                created_at=user.created_at,
                last_login=datetime.utcnow() # Mock for now as User model might not have last_login
            ))
            
        return AdminUserList(
            users=admin_users,
            total=total,
            page=page,
            limit=limit
        )

    @staticmethod
    def update_user_status(db: Session, user_id: int, update_data: AdminUserUpdate):
        user = db.query(User).filter(User.id == user_id).first()
        if not user:
            raise ValueError("User not found")
            
        if update_data.is_active is not None:
            user.is_active = update_data.is_active
            
        if update_data.is_admin is not None:
            user.is_admin = update_data.is_admin
            
        db.commit()
        db.refresh(user)
        return {"success": True, "message": "User updated successfully"}

    @staticmethod
    def get_system_settings(db: Session) -> List[SystemSettingItem]:
        settings = db.query(SystemSetting).all()
        return [
            SystemSettingItem(key=s.key, value=s.value, description=s.description)
            for s in settings
        ]

    @staticmethod
    def update_system_settings(db: Session, settings_update: SystemSettingsUpdate):
        for item in settings_update.settings:
            setting = db.query(SystemSetting).filter(SystemSetting.key == item.key).first()
            if setting:
                setting.value = item.value
                if item.description:
                    setting.description = item.description
            else:
                new_setting = SystemSetting(
                    key=item.key,
                    value=item.value,
                    description=item.description
                )
                db.add(new_setting)
        
        db.commit()
        return {"success": True, "message": "Settings updated successfully"}
