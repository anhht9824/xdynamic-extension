from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import datetime

from app.database import get_db
from app.services.subscription_service import SubscriptionService
from app.schemas.subscription import SubscriptionResponse, PurchasePlanRequest
from app.middleware.auth_middleware import get_current_user_id

router = APIRouter(prefix="/api/subscription", tags=["Subscription"])


def _success_response(data: object) -> dict:
    """Wrap response in standard API format"""
    return {
        "success": True,
        "data": data,
        "metadata": {"timestamp": datetime.utcnow().isoformat()},
    }


@router.get("/current")
def get_current_subscription(
    db: Session = Depends(get_db),
    user_id: int = Depends(get_current_user_id)
):
    """Get current active subscription (requires authentication)"""
    subscription_service = SubscriptionService(db)
    
    subscription = subscription_service.get_active_subscription(user_id)
    
    # If no subscription exists, create a default FREE subscription
    if not subscription:
        from app.models.subscription import PlanType
        from app.config import get_settings
        settings = get_settings()
        
        subscription = subscription_service.subscription_repo.create(
            user_id=user_id,
            plan=PlanType.FREE,
            monthly_quota=settings.PLAN_FREE_MONTHLY_QUOTA
        )
    
    # Convert to dict for response
    return _success_response({
        "id": subscription.id,
        "plan": subscription.plan.value if hasattr(subscription.plan, 'value') else subscription.plan,
        "status": subscription.status.value if hasattr(subscription.status, 'value') else subscription.status,
        "monthly_quota": subscription.monthly_quota,
        "used_quota": subscription.used_quota,
        "expires_at": subscription.expires_at.isoformat() if subscription.expires_at else None,
        "created_at": subscription.created_at.isoformat(),
    })



@router.post("/purchase")
def purchase_plan(
    plan_data: PurchasePlanRequest,
    db: Session = Depends(get_db),
    user_id: int = Depends(get_current_user_id)
):
    """Purchase a subscription plan (requires authentication)"""
    subscription_service = SubscriptionService(db)
    
    try:
        subscription = subscription_service.purchase_plan(user_id, plan_data.plan)
        return _success_response({
            "id": subscription.id,
            "plan": subscription.plan.value if hasattr(subscription.plan, 'value') else subscription.plan,
            "status": subscription.status.value if hasattr(subscription.status, 'value') else subscription.status,
            "monthly_quota": subscription.monthly_quota,
            "used_quota": subscription.used_quota,
            "expires_at": subscription.expires_at.isoformat() if subscription.expires_at else None,
            "created_at": subscription.created_at.isoformat(),
        })
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.post("/cancel")
def cancel_subscription(
    db: Session = Depends(get_db),
    user_id: int = Depends(get_current_user_id)
):
    """Cancel current subscription and downgrade to FREE (requires authentication)"""
    subscription_service = SubscriptionService(db)
    
    try:
        subscription = subscription_service.cancel_subscription(user_id)
        return _success_response({
            "id": subscription.id,
            "plan": subscription.plan.value if hasattr(subscription.plan, 'value') else subscription.plan,
            "status": subscription.status.value if hasattr(subscription.status, 'value') else subscription.status,
            "monthly_quota": subscription.monthly_quota,
            "used_quota": subscription.used_quota,
            "expires_at": subscription.expires_at.isoformat() if subscription.expires_at else None,
            "created_at": subscription.created_at.isoformat(),
        })
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
