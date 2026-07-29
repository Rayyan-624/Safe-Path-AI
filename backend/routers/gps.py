"""
SafePath AI — GPS Router
==========================
Endpoints:
  POST /gps          — Store a GPS location ping (authenticated)
  GET  /gps/history  — Get current user's GPS location history
"""

from __future__ import annotations

import logging
from datetime import datetime, timezone, timedelta
from typing import List, Optional

from fastapi import APIRouter, Depends, Query, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from auth_utils import get_current_user
from database import get_db
from models import GPSLocation, User
from schemas import GPSPingIn, GPSPingOut

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/gps", tags=["GPS"])


# ---------------------------------------------------------------------------
# POST /gps  — Store a GPS ping
# ---------------------------------------------------------------------------

@router.post(
    "",
    response_model=GPSPingOut,
    status_code=status.HTTP_201_CREATED,
    summary="Store a GPS location ping",
    description=(
        "Stores the user's current GPS coordinates.  "
        "Call this periodically (e.g. every 5 seconds while the app is active) "
        "to build trip history.  Does NOT trigger AI detection — use POST /hazards/report for that."
    ),
)
async def store_gps_ping(
    body: GPSPingIn,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> GPSPingOut:
    ping = GPSLocation(
        user_id=current_user.id,
        latitude=body.latitude,
        longitude=body.longitude,
        speed_kmh=body.speed_kmh,
        accuracy_metres=body.accuracy_metres,
        heading=body.heading,
    )
    db.add(ping)
    await db.flush()

    logger.debug(
        "GPS ping stored: user=%s lat=%.4f lng=%.4f",
        current_user.id, body.latitude, body.longitude,
    )
    return GPSPingOut.model_validate(ping)


# ---------------------------------------------------------------------------
# GET /gps/history  — Current user's GPS trail
# ---------------------------------------------------------------------------

@router.get(
    "/history",
    response_model=List[GPSPingOut],
    status_code=status.HTTP_200_OK,
    summary="Get GPS location history for the current user",
)
async def get_gps_history(
    hours: int = Query(24, ge=1, le=168, description="Number of hours of history to retrieve"),
    limit: int = Query(500, ge=1, le=5000, description="Max records to return"),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> List[GPSPingOut]:
    since = datetime.now(timezone.utc) - timedelta(hours=hours)

    result = await db.execute(
        select(GPSLocation)
        .where(
            GPSLocation.user_id == current_user.id,
            GPSLocation.recorded_at >= since,
        )
        .order_by(GPSLocation.recorded_at.asc())
        .limit(limit)
    )
    pings = result.scalars().all()
    return [GPSPingOut.model_validate(p) for p in pings]
