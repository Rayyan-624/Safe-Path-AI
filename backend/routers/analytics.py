"""
SafePath AI — Analytics Router
================================
Endpoints:
  GET /analytics/summary — Aggregated stats for the admin dashboard
"""

from __future__ import annotations

import logging
from collections import Counter, defaultdict
from datetime import datetime, timedelta, timezone
from typing import Dict, List

from fastapi import APIRouter, Depends
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from auth_utils import require_admin
from database import get_db
from models import HazardReport, User
from schemas import AnalyticsSummary, HotspotZone

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/analytics", tags=["Analytics"])


# ---------------------------------------------------------------------------
# Hotspot clustering (simple grid-based — replace with DBSCAN in production)
# ---------------------------------------------------------------------------

def _cluster_into_hotspots(
    hazards: List[HazardReport],
    cell_size_degrees: float = 0.002,  # ≈ 200m grid cells
    min_reports: int = 3,
) -> List[HotspotZone]:
    """
    Group hazards into grid cells.  Cells with ≥ min_reports are considered
    hotspots.  Returns the top 10 by report count.
    """
    grid: dict[tuple, list[HazardReport]] = defaultdict(list)

    for h in hazards:
        cell_lat = round(h.latitude / cell_size_degrees) * cell_size_degrees
        cell_lon = round(h.longitude / cell_size_degrees) * cell_size_degrees
        grid[(cell_lat, cell_lon)].append(h)

    hotspots: List[HotspotZone] = []
    for (cell_lat, cell_lon), reports in grid.items():
        if len(reports) < min_reports:
            continue

        type_counter = Counter(r.hazard_type for r in reports)
        severity_counter = Counter(r.severity for r in reports)

        hotspots.append(
            HotspotZone(
                latitude=cell_lat,
                longitude=cell_lon,
                report_count=len(reports),
                dominant_type=type_counter.most_common(1)[0][0],
                dominant_severity=severity_counter.most_common(1)[0][0],
            )
        )

    # Sort by report count descending, return top 10
    hotspots.sort(key=lambda z: z.report_count, reverse=True)
    return hotspots[:10]


# ---------------------------------------------------------------------------
# GET /analytics/summary
# ---------------------------------------------------------------------------

@router.get(
    "/summary",
    response_model=AnalyticsSummary,
    summary="Admin dashboard statistics",
    description=(
        "Returns aggregated hazard counts broken down by severity, type, and "
        "repair status.  Also returns top 10 hotspot zones and recent report counts."
    ),
)
async def get_analytics_summary(
    db: AsyncSession = Depends(get_db),
    _: User = Depends(require_admin),
) -> AnalyticsSummary:
    # Fetch all hazards (in production, use COUNT GROUP BY SQL instead)
    result = await db.execute(select(HazardReport))
    all_hazards: List[HazardReport] = result.scalars().all()

    now = datetime.now(timezone.utc)
    last_7 = now - timedelta(days=7)
    last_30 = now - timedelta(days=30)

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

        # Make created_at timezone-aware if it is naive (SQLite returns naive)
        created = h.created_at
        if created.tzinfo is None:
            created = created.replace(tzinfo=timezone.utc)

        if created >= last_7:
            count_7d += 1
        if created >= last_30:
            count_30d += 1

    hotspot_zones = _cluster_into_hotspots(all_hazards)

    return AnalyticsSummary(
        total_reports=len(all_hazards),
        verified_reports=verified_count,
        by_severity=dict(by_severity),
        by_type=dict(by_type),
        by_status=dict(by_status),
        hotspot_zones=hotspot_zones,
        reports_last_7_days=count_7d,
        reports_last_30_days=count_30d,
    )
