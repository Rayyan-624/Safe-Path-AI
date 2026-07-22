"""
SafePath AI — Hazard Reports Router
=====================================
Endpoints:
  POST /hazards/report              — Submit sensor data, run AI, store hazard
  GET  /hazards/nearby              — Hazards within a radius of a coordinate
  GET  /hazards/all                 — Admin: all hazards with filters
  GET  /hazards/geojson             — GeoJSON FeatureCollection for map rendering
  PUT  /hazards/{hazard_id}/status  — Admin: update repair status
"""

from __future__ import annotations

import logging
import uuid
from datetime import datetime, timezone
from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import and_, select, update
from sqlalchemy.ext.asyncio import AsyncSession

from ai.accelerometer_model import classify_from_sensors
from ai.vision_model import classify_from_image
from auth_utils import get_current_user, get_current_user_optional, require_admin
from config import settings
from database import get_db
from geo_utils import bounding_box, haversine_distance_metres
from models import HazardReport, HazardType, RepairStatus, SeverityLevel, User
from routers.websocket import alert_manager
from schemas import (
    GeoJSONFeature,
    GeoJSONFeatureCollection,
    GeoJSONFeatureProperties,
    GeoJSONGeometry,
    HazardListItem,
    HazardReportOut,
    HazardStatusUpdate,
    SensorDataIn,
)

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/hazards", tags=["Hazards"])


# ---------------------------------------------------------------------------
# Severity ordering (for merging sensor + vision results)
# ---------------------------------------------------------------------------

_SEVERITY_RANK: dict[str, int] = {
    "Normal": 0,
    "Minor": 1,
    "Moderate": 2,
    "Critical": 3,
}


def _merge_classifications(
    sensor_result: tuple[str, str, float],
    vision_result: Optional[tuple[str, str, float]],
) -> tuple[str, str, float]:
    """
    Combine sensor and vision model results.
    Vision result wins on hazard type (higher precision).
    Worst-case severity wins (conservative / safety-first).
    Confidence is the weighted average (vision 60%, sensor 40% if both present).
    """
    s_type, s_severity, s_conf = sensor_result

    if vision_result is None:
        return s_type, s_severity, s_conf

    v_type, v_severity, v_conf = vision_result

    # Take higher severity
    final_severity = (
        v_severity
        if _SEVERITY_RANK[v_severity] >= _SEVERITY_RANK[s_severity]
        else s_severity
    )

    # Vision type is more reliable; only use sensor type if vision says Normal
    final_type = v_type if v_type != "Normal" else s_type

    # Weighted confidence
    final_confidence = round(0.6 * v_conf + 0.4 * s_conf, 4)

    return final_type, final_severity, final_confidence


# ---------------------------------------------------------------------------
# Crowdsource deduplication helper
# ---------------------------------------------------------------------------

async def _find_nearby_existing_hazard(
    db: AsyncSession,
    lat: float,
    lon: float,
    hazard_type: str,
) -> Optional[HazardReport]:
    """
    Look for an existing unresolved hazard of the same type within
    CROWDSOURCE_RADIUS_METRES of the given coordinates.
    Returns the closest match or None.
    """
    radius = settings.CROWDSOURCE_RADIUS_METRES
    min_lat, max_lat, min_lon, max_lon = bounding_box(lat, lon, radius)

    result = await db.execute(
        select(HazardReport).where(
            and_(
                HazardReport.latitude.between(min_lat, max_lat),
                HazardReport.longitude.between(min_lon, max_lon),
                HazardReport.hazard_type == hazard_type,
                HazardReport.status.notin_(
                    [RepairStatus.RESOLVED.value, RepairStatus.DISMISSED.value]
                ),
            )
        )
    )
    candidates = result.scalars().all()

    # Precise distance filter
    close_enough = [
        h
        for h in candidates
        if haversine_distance_metres(lat, lon, h.latitude, h.longitude) <= radius
    ]

    if not close_enough:
        return None

    # Return the one with the most crowdsource reports (most confirmed)
    return max(close_enough, key=lambda h: h.crowdsource_count)


# ---------------------------------------------------------------------------
# POST /hazards/report
# ---------------------------------------------------------------------------

@router.post(
    "/report",
    response_model=HazardReportOut,
    status_code=status.HTTP_201_CREATED,
    summary="Submit sensor data and report a road hazard",
)
async def report_hazard(
    body: SensorDataIn,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> HazardReportOut:
    """
    Full AI pipeline:
    1. Run accelerometer/sensor model → (type, severity, confidence)
    2. Run vision model if image provided → (type, severity, confidence)
    3. Merge results
    4. Discard if confidence < threshold
    5. Deduplicate via crowdsourcing
    6. Persist and push WebSocket alert
    """
    # ── Step 1: Sensor model ────────────────────────────────────────────
    sensor_result = classify_from_sensors(body)

    # ── Step 2: Vision model (optional) ────────────────────────────────
    vision_result = None
    if body.image_base64:
        vision_result = classify_from_image(body.image_base64)

    # ── Step 3: Merge ───────────────────────────────────────────────────
    hazard_type, severity, confidence = _merge_classifications(sensor_result, vision_result)

    # ── Step 4: Confidence gate ─────────────────────────────────────────
    if confidence < settings.CONFIDENCE_THRESHOLD:
        logger.info(
            "Discarding low-confidence detection: type=%s conf=%.2f", hazard_type, confidence
        )
        raise HTTPException(
            status_code=status.HTTP_200_OK,
            detail={
                "message": "Detection confidence too low — no hazard recorded.",
                "confidence": confidence,
                "threshold": settings.CONFIDENCE_THRESHOLD,
            },
        )

    # Skip storing "Normal" road conditions
    if hazard_type == HazardType.NORMAL.value or severity == SeverityLevel.NORMAL.value:
        raise HTTPException(
            status_code=status.HTTP_200_OK,
            detail={"message": "Normal road condition — no hazard recorded."},
        )

    # ── Step 5: Crowdsource deduplication ───────────────────────────────
    existing = await _find_nearby_existing_hazard(
        db, body.latitude, body.longitude, hazard_type
    )

    if existing is not None:
        # Update existing record — re-average coordinates, boost count
        total = existing.crowdsource_count + 1
        existing.latitude = (existing.latitude * existing.crowdsource_count + body.latitude) / total
        existing.longitude = (existing.longitude * existing.crowdsource_count + body.longitude) / total
        existing.crowdsource_count = total
        # Escalate severity if new report is worse
        if _SEVERITY_RANK[severity] > _SEVERITY_RANK[existing.severity]:
            existing.severity = severity
        # Update confidence as running average
        existing.confidence = round(
            (existing.confidence * (total - 1) + confidence) / total, 4
        )
        existing.is_verified = total >= settings.CROWDSOURCE_MIN_REPORTS
        existing.updated_at = datetime.now(timezone.utc)
        hazard = existing
        logger.info(
            "Crowdsource update: hazard_id=%s count=%d verified=%s",
            hazard.id, hazard.crowdsource_count, hazard.is_verified,
        )
    else:
        # Create new hazard record
        hazard = HazardReport(
            user_id=current_user.id,
            latitude=body.latitude,
            longitude=body.longitude,
            hazard_type=hazard_type,
            severity=severity,
            confidence=confidence,
            accelerometer_x=body.accelerometer_x,
            accelerometer_y=body.accelerometer_y,
            accelerometer_z=body.accelerometer_z,
            gyroscope_x=body.gyroscope_x,
            gyroscope_y=body.gyroscope_y,
            gyroscope_z=body.gyroscope_z,
            speed_kmh=body.speed_kmh,
            crowdsource_count=1,
            is_verified=False,
            status=RepairStatus.REPORTED.value,
        )
        db.add(hazard)
        await db.flush()
        logger.info(
            "New hazard created: id=%s type=%s severity=%s conf=%.2f",
            hazard.id, hazard_type, severity, confidence,
        )

    # ── Step 6: WebSocket broadcast ──────────────────────────────────────
    await alert_manager.broadcast_hazard(
        hazard_id=hazard.id,
        hazard_type=hazard.hazard_type,
        severity=hazard.severity,
        confidence=hazard.confidence,
        latitude=hazard.latitude,
        longitude=hazard.longitude,
    )

    return HazardReportOut(
        hazard_id=hazard.id,
        type=hazard.hazard_type,
        severity=hazard.severity,
        confidence=hazard.confidence,
        latitude=hazard.latitude,
        longitude=hazard.longitude,
        crowdsource_count=hazard.crowdsource_count,
        is_verified=hazard.is_verified,
        status=hazard.status,
        created_at=hazard.created_at,
    )


# ---------------------------------------------------------------------------
# GET /hazards/nearby
# ---------------------------------------------------------------------------

@router.get(
    "/nearby",
    response_model=List[HazardListItem],
    status_code=status.HTTP_200_OK,
    summary="Get hazards near a GPS coordinate",
)
async def get_nearby_hazards(
    lat: float = Query(..., ge=-90.0, le=90.0, description="Latitude"),
    lng: float = Query(..., ge=-180.0, le=180.0, description="Longitude"),
    radius: float = Query(500.0, ge=50.0, le=50_000.0, description="Search radius in metres"),
    severity: Optional[str] = Query(None, description="Filter by severity level"),
    db: AsyncSession = Depends(get_db),
    _: Optional[User] = Depends(get_current_user_optional),
) -> List[HazardListItem]:
    """Return all active hazards within `radius` metres of (lat, lng)."""
    min_lat, max_lat, min_lon, max_lon = bounding_box(lat, lng, radius)

    stmt = select(HazardReport).where(
        and_(
            HazardReport.latitude.between(min_lat, max_lat),
            HazardReport.longitude.between(min_lon, max_lon),
            HazardReport.status.notin_(
                [RepairStatus.RESOLVED.value, RepairStatus.DISMISSED.value]
            ),
        )
    )

    if severity:
        stmt = stmt.where(HazardReport.severity == severity)

    result = await db.execute(stmt)
    candidates = result.scalars().all()

    # Precise distance filter
    nearby = [
        h
        for h in candidates
        if haversine_distance_metres(lat, lng, h.latitude, h.longitude) <= radius
    ]

    return [HazardListItem.model_validate(h) for h in nearby]


# ---------------------------------------------------------------------------
# GET /hazards/all  (admin)
# ---------------------------------------------------------------------------

@router.get(
    "/all",
    response_model=List[HazardListItem],
    status_code=status.HTTP_200_OK,
    summary="Admin: retrieve all hazard reports",
)
async def get_all_hazards(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    severity: Optional[str] = Query(None),
    hazard_type: Optional[str] = Query(None),
    repair_status: Optional[str] = Query(None),
    db: AsyncSession = Depends(get_db),
    _: User = Depends(require_admin),
) -> List[HazardListItem]:
    stmt = select(HazardReport)

    if severity:
        stmt = stmt.where(HazardReport.severity == severity)
    if hazard_type:
        stmt = stmt.where(HazardReport.hazard_type == hazard_type)
    if repair_status:
        stmt = stmt.where(HazardReport.status == repair_status)

    stmt = stmt.order_by(HazardReport.created_at.desc()).offset(skip).limit(limit)

    result = await db.execute(stmt)
    hazards = result.scalars().all()
    return [HazardListItem.model_validate(h) for h in hazards]


# ---------------------------------------------------------------------------
# GET /hazards/geojson
# ---------------------------------------------------------------------------

@router.get(
    "/geojson",
    response_model=GeoJSONFeatureCollection,
    status_code=status.HTTP_200_OK,
    summary="GeoJSON FeatureCollection for map rendering",
    description="Returns all active hazards as a GeoJSON FeatureCollection consumable by Mapbox/Leaflet.",
)
async def get_geojson(
    severity: Optional[str] = Query(None, description="Filter by severity"),
    hazard_type: Optional[str] = Query(None, description="Filter by type"),
    verified_only: bool = Query(False, description="Return only crowdsource-verified hazards"),
    db: AsyncSession = Depends(get_db),
) -> GeoJSONFeatureCollection:
    stmt = select(HazardReport).where(
        HazardReport.status.notin_(
            [RepairStatus.RESOLVED.value, RepairStatus.DISMISSED.value]
        )
    )

    if severity:
        stmt = stmt.where(HazardReport.severity == severity)
    if hazard_type:
        stmt = stmt.where(HazardReport.hazard_type == hazard_type)
    if verified_only:
        stmt = stmt.where(HazardReport.is_verified == True)  # noqa: E712

    result = await db.execute(stmt)
    hazards = result.scalars().all()

    features = [
        GeoJSONFeature(
            geometry=GeoJSONGeometry(
                coordinates=[h.longitude, h.latitude]  # GeoJSON: [lng, lat]
            ),
            properties=GeoJSONFeatureProperties(
                hazard_id=h.id,
                hazard_type=h.hazard_type,
                severity=h.severity,
                confidence=h.confidence,
                crowdsource_count=h.crowdsource_count,
                is_verified=h.is_verified,
                status=h.status,
                created_at=h.created_at.isoformat(),
            ),
        )
        for h in hazards
    ]

    return GeoJSONFeatureCollection(features=features)


# ---------------------------------------------------------------------------
# PUT /hazards/{hazard_id}/status  (admin)
# ---------------------------------------------------------------------------

@router.put(
    "/{hazard_id}/status",
    response_model=HazardListItem,
    status_code=status.HTTP_200_OK,
    summary="Admin: update repair status of a hazard",
)
async def update_hazard_status(
    hazard_id: str,
    body: HazardStatusUpdate,
    db: AsyncSession = Depends(get_db),
    _: User = Depends(require_admin),
) -> HazardListItem:
    result = await db.execute(
        select(HazardReport).where(HazardReport.id == hazard_id)
    )
    hazard = result.scalar_one_or_none()

    if hazard is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Hazard with id '{hazard_id}' not found.",
        )

    hazard.status = body.status
    hazard.updated_at = datetime.now(timezone.utc)

    logger.info("Admin updated hazard %s status → %s", hazard_id, body.status)
    return HazardListItem.model_validate(hazard)
