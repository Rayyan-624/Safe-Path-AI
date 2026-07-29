"""
SafePath AI — Pydantic Schemas (Request / Response Models)
============================================================
All data shapes exchanged between the API and its clients are defined here.
Using Pydantic v2 with strict type annotations for automatic validation and
clear OpenAPI documentation.
"""

from __future__ import annotations

from datetime import datetime
from typing import Any, Dict, List, Optional

from pydantic import BaseModel, EmailStr, Field, field_validator


# ---------------------------------------------------------------------------
# Auth schemas
# ---------------------------------------------------------------------------

class UserRegisterRequest(BaseModel):
    """Body sent when registering a new user via Firebase token."""
    firebase_token: str = Field(
        ..., description="Firebase ID token obtained from the client SDK after sign-in."
    )
    display_name: Optional[str] = Field(None, max_length=128)


class UserLoginRequest(BaseModel):
    """Body sent when verifying an existing session."""
    firebase_token: str = Field(
        ..., description="Firebase ID token obtained from the client SDK."
    )


class UserResponse(BaseModel):
    """User profile returned after successful auth."""
    id: str
    firebase_uid: str
    email: str
    display_name: Optional[str]
    role: str
    is_active: bool
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}


class UserUpdateRequest(BaseModel):
    """Admin: update a user's role or active status."""
    display_name: Optional[str] = Field(None, max_length=128)
    role: Optional[str] = Field(None, description="driver | admin")
    is_active: Optional[bool] = None

    @field_validator("role")
    @classmethod
    def validate_role(cls, v: Optional[str]) -> Optional[str]:
        if v is not None and v not in {"driver", "admin"}:
            raise ValueError("role must be 'driver' or 'admin'")
        return v


# ---------------------------------------------------------------------------
# Sensor / hazard report schemas
# ---------------------------------------------------------------------------

class SensorDataIn(BaseModel):
    """
    Sensor payload submitted by the mobile app.
    image_base64 is optional — vision model only runs when it is provided.
    """
    latitude: float = Field(..., ge=-90.0, le=90.0)
    longitude: float = Field(..., ge=-180.0, le=180.0)

    accelerometer_x: float = Field(..., description="m/s²")
    accelerometer_y: float = Field(..., description="m/s²")
    accelerometer_z: float = Field(..., description="m/s²")

    gyroscope_x: float = Field(0.0, description="rad/s")
    gyroscope_y: float = Field(0.0, description="rad/s")
    gyroscope_z: float = Field(0.0, description="rad/s")

    speed_kmh: Optional[float] = Field(None, ge=0.0, le=400.0)

    image_base64: Optional[str] = Field(
        None, description="Base64-encoded JPEG/PNG from the device camera (optional)."
    )

    @field_validator("image_base64")
    @classmethod
    def strip_data_uri_prefix(cls, v: Optional[str]) -> Optional[str]:
        """Accept both raw base64 and data URI format (data:image/jpeg;base64,...)."""
        if v and v.startswith("data:"):
            _, _, data = v.partition(",")
            return data or None
        return v


class HazardReportOut(BaseModel):
    """Response after a successful hazard submission."""
    hazard_id: str
    type: str
    severity: str
    confidence: float = Field(..., ge=0.0, le=1.0)
    latitude: float
    longitude: float
    crowdsource_count: int
    is_verified: bool
    status: str
    created_at: datetime

    model_config = {"from_attributes": True}


class HazardListItem(BaseModel):
    """Compact hazard summary used in list endpoints."""
    id: str
    user_id: Optional[str] = None
    hazard_type: str
    severity: str
    confidence: float
    latitude: float
    longitude: float
    crowdsource_count: int
    is_verified: bool
    status: str
    description: Optional[str] = None
    image_path: Optional[str] = None
    created_at: datetime
    updated_at: Optional[datetime] = None

    model_config = {"from_attributes": True}


class HazardStatusUpdate(BaseModel):
    """Body for PUT /hazards/{id}/status — admin only."""
    status: str = Field(
        ...,
        description=(
            "One of: Reported, Acknowledged, In Progress, Resolved, Dismissed"
        ),
    )

    @field_validator("status")
    @classmethod
    def validate_status(cls, v: str) -> str:
        valid = {"Reported", "Acknowledged", "In Progress", "Resolved", "Dismissed"}
        if v not in valid:
            raise ValueError(f"status must be one of {sorted(valid)}")
        return v


# ---------------------------------------------------------------------------
# GeoJSON schemas
# ---------------------------------------------------------------------------

class GeoJSONGeometry(BaseModel):
    type: str = "Point"
    coordinates: List[float]  # [longitude, latitude] — GeoJSON spec


class GeoJSONFeatureProperties(BaseModel):
    hazard_id: str
    hazard_type: str
    severity: str
    confidence: float
    crowdsource_count: int
    is_verified: bool
    status: str
    created_at: str


class GeoJSONFeature(BaseModel):
    type: str = "Feature"
    geometry: GeoJSONGeometry
    properties: GeoJSONFeatureProperties


class GeoJSONFeatureCollection(BaseModel):
    type: str = "FeatureCollection"
    features: List[GeoJSONFeature]


# ---------------------------------------------------------------------------
# Analytics schemas
# ---------------------------------------------------------------------------

class SeverityBreakdown(BaseModel):
    Normal: int = 0
    Minor: int = 0
    Moderate: int = 0
    Critical: int = 0


class HazardTypeBreakdown(BaseModel):
    Pothole: int = 0
    Road_Crack: int = Field(0, alias="Road Crack")
    Speed_Breaker: int = Field(0, alias="Speed Breaker")
    Open_Manhole: int = Field(0, alias="Open Manhole")
    Uneven_Road: int = Field(0, alias="Uneven Road")
    Flooded_Road: int = Field(0, alias="Flooded Road")

    model_config = {"populate_by_name": True}


class StatusBreakdown(BaseModel):
    Reported: int = 0
    Acknowledged: int = 0
    In_Progress: int = Field(0, alias="In Progress")
    Resolved: int = 0
    Dismissed: int = 0

    model_config = {"populate_by_name": True}


class HotspotZone(BaseModel):
    latitude: float
    longitude: float
    report_count: int
    dominant_type: str
    dominant_severity: str


class AnalyticsSummary(BaseModel):
    total_reports: int
    verified_reports: int
    by_severity: Dict[str, int]
    by_type: Dict[str, int]
    by_status: Dict[str, int]
    hotspot_zones: List[HotspotZone]
    reports_last_7_days: int
    reports_last_30_days: int


# ---------------------------------------------------------------------------
# WebSocket schemas
# ---------------------------------------------------------------------------

class WSSubscribeMessage(BaseModel):
    """Message sent by a WebSocket client to announce its location."""
    action: str = "subscribe"
    latitude: float
    longitude: float


class WSAlertMessage(BaseModel):
    """Push message sent from server to nearby connected clients."""
    event: str = "new_hazard"
    hazard_id: str
    type: str
    severity: str
    confidence: float
    latitude: float
    longitude: float
    distance_metres: float
    timestamp: str


# ---------------------------------------------------------------------------
# Generic response wrappers
# ---------------------------------------------------------------------------

class MessageResponse(BaseModel):
    message: str


class ErrorDetail(BaseModel):
    detail: str


# ---------------------------------------------------------------------------
# GPS schemas
# ---------------------------------------------------------------------------

class GPSPingIn(BaseModel):
    """Single GPS location ping submitted by the client."""
    latitude: float = Field(..., ge=-90.0, le=90.0)
    longitude: float = Field(..., ge=-180.0, le=180.0)
    speed_kmh: Optional[float] = Field(None, ge=0.0, le=400.0)
    accuracy_metres: Optional[float] = Field(None, ge=0.0)
    heading: Optional[float] = Field(None, ge=0.0, le=360.0)


class GPSPingOut(BaseModel):
    """Response after storing a GPS ping."""
    id: str
    user_id: str
    latitude: float
    longitude: float
    speed_kmh: Optional[float]
    accuracy_metres: Optional[float]
    heading: Optional[float]
    recorded_at: datetime

    model_config = {"from_attributes": True}


# ---------------------------------------------------------------------------
# Notification schemas
# ---------------------------------------------------------------------------

class NotificationOut(BaseModel):
    """Single notification response object."""
    id: str
    user_id: str
    type: str
    title: str
    message: str
    is_read: bool
    hazard_id: Optional[str]
    created_at: datetime

    model_config = {"from_attributes": True}


class NotificationMarkReadRequest(BaseModel):
    """Request to mark specific notifications as read."""
    notification_ids: List[str]


# ---------------------------------------------------------------------------
# Dashboard schemas
# ---------------------------------------------------------------------------

class UserDashboardData(BaseModel):
    """Data bundle for the driver/user dashboard."""
    total_reports: int
    reports_this_week: int
    nearby_hazard_count: int
    unread_notifications: int


class AdminDashboardData(BaseModel):
    """Data bundle for the admin dashboard."""
    total_hazards: int
    total_users: int
    active_users: int
    verified_hazards: int
    reports_last_7_days: int
    reports_last_30_days: int
    by_severity: Dict[str, int]
    by_type: Dict[str, int]
    by_status: Dict[str, int]
    hotspot_zones: List["HotspotZone"]


# ---------------------------------------------------------------------------
# Report / export schema (named endpoint wrapper)
# ---------------------------------------------------------------------------

class ReportSummary(BaseModel):
    """Summary of a generated hazard report bundle."""
    total: int
    hazards: List[HazardListItem]
