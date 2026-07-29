"""
SafePath AI — Dashboard Router
================================
Endpoints:
  GET /dashboard        — User (driver) dashboard summary
  GET /dashboard/admin  — Admin dashboard summary (alias of /analytics/summary with extra user stats)
"""

from __future__ import annotations

import logging
from collections import Counter, defaultdict
from datetime import datetime, timedelta, timezone
from typing import Dict, List

from fastapi import APIRouter, Depends, Query, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from auth_utils import get_current_user, require_admin
from config import settings
from database import get_db
from geo_utils import bounding_box, haversine_distance_metres
from models import HazardReport, Notification, RepairStatus, User
from routers.analytics import _cluster_into_hotspots
from schemas import AdminDashboardData, HotspotZone, UserDashboardData

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])


# ---------------------------------------------------------------------------
# GET /dashboard  — user dashboard
# ---------------------------------------------------------------------------

@router.get(
    "",
    response_model=UserDashboardData,
    status_code=status.HTTP_200_OK,
    summary="Get driver dashboard summary data",
)
async def get_user_dashboard(
    lat: float = Query(24.8607, description="User's current latitude"),
    lng: float = Query(67.0099, description="User's current longitude"),
    radius: float = Query(1000.0, ge=100.0, le=50_000.0, description="Nearby hazard search radius (m)"),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> UserDashboardData:
    now = datetime.now(timezone.utc)
    week_ago = now - timedelta(days=7)

    # Count user's own reports
    result = await db.execute(
        select(HazardReport).where(HazardReport.user_id == current_user.id)
    )
    my_reports: List[HazardReport] = result.scalars().all()

    # Make created_at tz-aware for SQLite naive datetimes
    reports_this_week = sum(
        1 for r in my_reports
        if (r.created_at.replace(tzinfo=timezone.utc) if r.created_at.tzinfo is None else r.created_at) >= week_ago
    )

    # Count nearby active hazards
    min_lat, max_lat, min_lon, max_lon = bounding_box(lat, lng, radius)
    nearby_result = await db.execute(
        select(HazardReport).where(
            HazardReport.latitude.between(min_lat, max_lat),
            HazardReport.longitude.between(min_lon, max_lon),
            HazardReport.status.notin_(
                [RepairStatus.RESOLVED.value, RepairStatus.DISMISSED.value]
            ),
        )
    )
    nearby_candidates = nearby_result.scalars().all()
    nearby_count = sum(
        1 for h in nearby_candidates
        if haversine_distance_metres(lat, lng, h.latitude, h.longitude) <= radius
    )

    # Count unread notifications
    notif_result = await db.execute(
        select(Notification).where(
            Notification.user_id == current_user.id,
            Notification.is_read == False,  # noqa: E712
        )
    )
    unread_count = len(notif_result.scalars().all())

    return UserDashboardData(
        total_reports=len(my_reports),
        reports_this_week=reports_this_week,
        nearby_hazard_count=nearby_count,
        unread_notifications=unread_count,
    )


# ---------------------------------------------------------------------------
# GET /dashboard/admin  — admin dashboard
# ---------------------------------------------------------------------------

@router.get(
    "/admin",
    response_model=AdminDashboardData,
    status_code=status.HTTP_200_OK,
    summary="Admin: get full dashboard statistics",
)
async def get_admin_dashboard(
    db: AsyncSession = Depends(get_db),
    _: User = Depends(require_admin),
) -> AdminDashboardData:
    now = datetime.now(timezone.utc)
    last_7 = now - timedelta(days=7)
    last_30 = now - timedelta(days=30)

    # All hazards
    hazard_result = await db.execute(select(HazardReport))
    all_hazards: List[HazardReport] = hazard_result.scalars().all()

    # All users
    user_result = await db.execute(select(User))
    all_users: List[User] = user_result.scalars().all()

    by_severity: Dict[str, int] = defaultdict(int)
    by_type: Dict[str, int] = defaultdict(int)
    by_status: Dict[str, int] = defaultdict(int)
    verified_count = 0
    count_7d = 0
    count_30d = 0

    for h in all_hazards:
        by_severity[h.severity] += 1
        by_type[h.hazard_type] += 1
        by_status[h.status] += 1
        if h.is_verified:
            verified_count += 1
        created = h.created_at.replace(tzinfo=timezone.utc) if h.created_at.tzinfo is None else h.created_at
        if created >= last_7:
            count_7d += 1
        if created >= last_30:
            count_30d += 1

    active_users = sum(1 for u in all_users if u.is_active)
    hotspots = _cluster_into_hotspots(all_hazards)

    return AdminDashboardData(
        total_hazards=len(all_hazards),
        total_users=len(all_users),
        active_users=active_users,
        verified_hazards=verified_count,
        reports_last_7_days=count_7d,
        reports_last_30_days=count_30d,
        by_severity=dict(by_severity),
        by_type=dict(by_type),
        by_status=dict(by_status),
        hotspot_zones=hotspots,
    )
