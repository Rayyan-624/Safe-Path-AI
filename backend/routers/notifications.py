"""
SafePath AI — Notifications Router
=====================================
Endpoints:
  GET  /notifications              — Get current user's notifications (paginated)
  PATCH /notifications/{id}/read   — Mark a single notification as read
  POST /notifications/read-all     — Mark all notifications as read
  POST /notifications              — Admin: broadcast a notification to all users
"""

from __future__ import annotations

import logging
from datetime import datetime, timezone
from typing import List

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import select, update
from sqlalchemy.ext.asyncio import AsyncSession

from auth_utils import get_current_user, require_admin
from database import get_db
from models import Notification, User
from schemas import MessageResponse, NotificationMarkReadRequest, NotificationOut

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/notifications", tags=["Notifications"])


# ---------------------------------------------------------------------------
# GET /notifications  — user's notifications
# ---------------------------------------------------------------------------

@router.get(
    "",
    response_model=List[NotificationOut],
    status_code=status.HTTP_200_OK,
    summary="Get the current user's notifications",
)
async def get_notifications(
    unread_only: bool = Query(False, description="If true, return only unread notifications"),
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=200),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> List[NotificationOut]:
    stmt = select(Notification).where(Notification.user_id == current_user.id)

    if unread_only:
        stmt = stmt.where(Notification.is_read == False)  # noqa: E712

    stmt = stmt.order_by(Notification.created_at.desc()).offset(skip).limit(limit)

    result = await db.execute(stmt)
    notifications = result.scalars().all()
    return [NotificationOut.model_validate(n) for n in notifications]


# ---------------------------------------------------------------------------
# PATCH /notifications/{notification_id}/read  — mark single as read
# ---------------------------------------------------------------------------

@router.patch(
    "/{notification_id}/read",
    response_model=NotificationOut,
    status_code=status.HTTP_200_OK,
    summary="Mark a single notification as read",
)
async def mark_notification_read(
    notification_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> NotificationOut:
    result = await db.execute(
        select(Notification).where(
            Notification.id == notification_id,
            Notification.user_id == current_user.id,
        )
    )
    notification = result.scalar_one_or_none()

    if notification is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Notification '{notification_id}' not found.",
        )

    notification.is_read = True
    return NotificationOut.model_validate(notification)


# ---------------------------------------------------------------------------
# POST /notifications/read-all  — mark all as read
# ---------------------------------------------------------------------------

@router.post(
    "/read-all",
    response_model=MessageResponse,
    status_code=status.HTTP_200_OK,
    summary="Mark all of the current user's notifications as read",
)
async def mark_all_read(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> MessageResponse:
    await db.execute(
        update(Notification)
        .where(
            Notification.user_id == current_user.id,
            Notification.is_read == False,  # noqa: E712
        )
        .values(is_read=True)
    )
    logger.info("Marked all notifications read for user %s", current_user.id)
    return MessageResponse(message="All notifications marked as read.")


# ---------------------------------------------------------------------------
# POST /notifications  — admin broadcast
# ---------------------------------------------------------------------------

class AdminBroadcastRequest:
    pass


from pydantic import BaseModel


class BroadcastRequest(BaseModel):
    title: str
    message: str
    type: str = "system"


@router.post(
    "",
    response_model=MessageResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Admin: broadcast a notification to all users",
)
async def broadcast_notification(
    body: BroadcastRequest,
    db: AsyncSession = Depends(get_db),
    admin: User = Depends(require_admin),
) -> MessageResponse:
    # Fetch all active users
    result = await db.execute(select(User).where(User.is_active == True))  # noqa: E712
    users = result.scalars().all()

    notifications = [
        Notification(
            user_id=u.id,
            type=body.type,
            title=body.title,
            message=body.message,
        )
        for u in users
    ]
    db.add_all(notifications)
    await db.flush()

    logger.info(
        "Admin %s broadcast notification to %d users: %s",
        admin.id, len(notifications), body.title,
    )
    return MessageResponse(message=f"Notification sent to {len(notifications)} users.")
