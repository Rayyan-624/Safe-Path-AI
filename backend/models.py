"""
SafePath AI — SQLAlchemy ORM Models
======================================
Defines all database tables.  Models are written against standard SQLAlchemy
column types so they work with both SQLite (prototype) and PostgreSQL (production).

When migrating to PostgreSQL + PostGIS:
  - Replace latitude/longitude Float columns with a PostGIS GEOMETRY(Point, 4326)
    column using geoalchemy2.  The geospatial query helpers in routers/hazards.py
    are already abstracted behind a helper function so only that helper needs updating.
  - Run: alembic revision --autogenerate -m "add postgis geometry"
"""

from __future__ import annotations

import uuid
from datetime import datetime, timezone
from enum import Enum as PyEnum

from sqlalchemy import (
    Boolean,
    DateTime,
    Float,
    ForeignKey,
    Integer,
    String,
    Text,
    UniqueConstraint,
)
from sqlalchemy import Index
from sqlalchemy.orm import Mapped, mapped_column, relationship

from database import Base


# ---------------------------------------------------------------------------
# Enumerations
# ---------------------------------------------------------------------------

class HazardType(str, PyEnum):
    POTHOLE = "Pothole"
    ROAD_CRACK = "Road Crack"
    SPEED_BREAKER = "Speed Breaker"
    OPEN_MANHOLE = "Open Manhole"
    UNEVEN_ROAD = "Uneven Road"
    FLOODED_ROAD = "Flooded Road"
    NORMAL = "Normal"


class SeverityLevel(str, PyEnum):
    NORMAL = "Normal"        # Green
    MINOR = "Minor"          # Yellow
    MODERATE = "Moderate"    # Orange
    CRITICAL = "Critical"    # Red


class RepairStatus(str, PyEnum):
    REPORTED = "Reported"
    ACKNOWLEDGED = "Acknowledged"
    IN_PROGRESS = "In Progress"
    RESOLVED = "Resolved"
    DISMISSED = "Dismissed"


class UserRole(str, PyEnum):
    DRIVER = "driver"
    ADMIN = "admin"


class NotificationType(str, PyEnum):
    HAZARD_ALERT = "hazard_alert"
    SYSTEM = "system"
    MAINTENANCE = "maintenance"
    MUNICIPALITY = "municipality"


# ---------------------------------------------------------------------------
# Utility
# ---------------------------------------------------------------------------

def _utcnow() -> datetime:
    return datetime.now(timezone.utc)


def _new_uuid() -> str:
    return str(uuid.uuid4())


# ---------------------------------------------------------------------------
# User
# ---------------------------------------------------------------------------

class User(Base):
    """
    Represents an authenticated user.  Firebase handles credential storage;
    we store only the Firebase UID so we can associate reports with users.
    """

    __tablename__ = "users"

    id: Mapped[str] = mapped_column(
        String(36), primary_key=True, default=_new_uuid
    )
    firebase_uid: Mapped[str] = mapped_column(
        String(128), unique=True, nullable=False, index=True
    )
    email: Mapped[str] = mapped_column(String(254), unique=True, nullable=False)
    display_name: Mapped[str | None] = mapped_column(String(128), nullable=True)
    role: Mapped[str] = mapped_column(
        String(16), default=UserRole.DRIVER.value, nullable=False
    )
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=_utcnow, nullable=False
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=_utcnow, onupdate=_utcnow, nullable=False
    )

    # Relationships
    reports: Mapped[list["HazardReport"]] = relationship(
        "HazardReport", back_populates="reporter", lazy="select"
    )
    gps_locations: Mapped[list["GPSLocation"]] = relationship(
        "GPSLocation", back_populates="user", lazy="select"
    )
    notifications: Mapped[list["Notification"]] = relationship(
        "Notification", back_populates="user", lazy="select"
    )

    def __repr__(self) -> str:
        return f"<User id={self.id} email={self.email} role={self.role}>"


# ---------------------------------------------------------------------------
# HazardReport
# ---------------------------------------------------------------------------

class HazardReport(Base):
    """
    A single detected road hazard.  Multiple raw sensor readings that fall
    within CROWDSOURCE_RADIUS_METRES of each other are merged into one record
    by incrementing crowdsource_count and re-averaging coordinates.
    """

    __tablename__ = "hazard_reports"

    id: Mapped[str] = mapped_column(
        String(36), primary_key=True, default=_new_uuid
    )

    # Reporter
    user_id: Mapped[str | None] = mapped_column(
        String(36), ForeignKey("users.id", ondelete="SET NULL"), nullable=True, index=True
    )
    reporter: Mapped["User | None"] = relationship("User", back_populates="reports")

    # Location
    latitude: Mapped[float] = mapped_column(Float, nullable=False)
    longitude: Mapped[float] = mapped_column(Float, nullable=False)

    # Classification
    hazard_type: Mapped[str] = mapped_column(
        String(32), nullable=False, default=HazardType.POTHOLE.value
    )
    severity: Mapped[str] = mapped_column(
        String(16), nullable=False, default=SeverityLevel.MINOR.value
    )
    confidence: Mapped[float] = mapped_column(Float, nullable=False, default=0.0)

    # Sensor snapshot (stored for audit / model re-training)
    accelerometer_x: Mapped[float | None] = mapped_column(Float, nullable=True)
    accelerometer_y: Mapped[float | None] = mapped_column(Float, nullable=True)
    accelerometer_z: Mapped[float | None] = mapped_column(Float, nullable=True)
    gyroscope_x: Mapped[float | None] = mapped_column(Float, nullable=True)
    gyroscope_y: Mapped[float | None] = mapped_column(Float, nullable=True)
    gyroscope_z: Mapped[float | None] = mapped_column(Float, nullable=True)
    speed_kmh: Mapped[float | None] = mapped_column(Float, nullable=True)

    # Optional image
    image_path: Mapped[str | None] = mapped_column(String(512), nullable=True)

    # Crowdsourcing
    crowdsource_count: Mapped[int] = mapped_column(Integer, default=1, nullable=False)
    is_verified: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)

    # Admin workflow
    status: Mapped[str] = mapped_column(
        String(24), default=RepairStatus.REPORTED.value, nullable=False, index=True
    )

    # Timestamps
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=_utcnow, nullable=False, index=True
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=_utcnow, onupdate=_utcnow, nullable=False
    )

    def __repr__(self) -> str:
        return (
            f"<HazardReport id={self.id} type={self.hazard_type} "
            f"severity={self.severity} lat={self.latitude:.4f} lng={self.longitude:.4f}>"
        )


# ---------------------------------------------------------------------------
# GPSLocation
# ---------------------------------------------------------------------------

class GPSLocation(Base):
    """
    Stores GPS location pings from authenticated users.
    Used for trip history, route replay, and future heatmap analytics.
    """

    __tablename__ = "gps_locations"

    id: Mapped[str] = mapped_column(
        String(36), primary_key=True, default=_new_uuid
    )
    user_id: Mapped[str] = mapped_column(
        String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True
    )
    user: Mapped["User"] = relationship("User", back_populates="gps_locations")

    latitude: Mapped[float] = mapped_column(Float, nullable=False)
    longitude: Mapped[float] = mapped_column(Float, nullable=False)
    speed_kmh: Mapped[float | None] = mapped_column(Float, nullable=True)
    accuracy_metres: Mapped[float | None] = mapped_column(Float, nullable=True)
    heading: Mapped[float | None] = mapped_column(Float, nullable=True)  # degrees 0–360

    recorded_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=_utcnow, nullable=False, index=True
    )

    __table_args__ = (
        Index("ix_gps_user_recorded", "user_id", "recorded_at"),
    )

    def __repr__(self) -> str:
        return f"<GPSLocation user={self.user_id} lat={self.latitude:.4f} lng={self.longitude:.4f}>"


# ---------------------------------------------------------------------------
# Notification
# ---------------------------------------------------------------------------

class Notification(Base):
    """
    Per-user notifications.  Created server-side when hazards are reported nearby
    or when an admin broadcasts a system message.
    """

    __tablename__ = "notifications"

    id: Mapped[str] = mapped_column(
        String(36), primary_key=True, default=_new_uuid
    )
    user_id: Mapped[str] = mapped_column(
        String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True
    )
    user: Mapped["User"] = relationship("User", back_populates="notifications")

    type: Mapped[str] = mapped_column(
        String(32), default=NotificationType.HAZARD_ALERT.value, nullable=False
    )
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    message: Mapped[str] = mapped_column(Text, nullable=False)
    is_read: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)

    # Optional link to a related hazard
    hazard_id: Mapped[str | None] = mapped_column(
        String(36), ForeignKey("hazard_reports.id", ondelete="SET NULL"), nullable=True
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=_utcnow, nullable=False, index=True
    )

    def __repr__(self) -> str:
        return f"<Notification id={self.id} user={self.user_id} type={self.type} read={self.is_read}>"
