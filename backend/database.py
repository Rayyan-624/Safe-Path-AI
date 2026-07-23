"""
SafePath AI — Database Configuration
=====================================
Provides the SQLAlchemy engine, session factory, and declarative base.

Switching from SQLite → PostgreSQL + PostGIS:
1. Change DATABASE_URL in .env to:
   postgresql+asyncpg://user:pass@host:5432/safepath
2. Uncomment the asyncpg driver in requirements.txt and install it.
3. Run `alembic upgrade head` to apply migrations.
4. No application code changes are required.
"""

from __future__ import annotations

import logging
from typing import AsyncGenerator

from sqlalchemy.ext.asyncio import (
    AsyncSession,
    async_sessionmaker,
    create_async_engine,
)
from sqlalchemy.orm import DeclarativeBase

from config import settings

logger = logging.getLogger(__name__)

# ---------------------------------------------------------------------------
# Engine
# ---------------------------------------------------------------------------
# SQLite async driver requires the check_same_thread=False connect arg.
# For PostgreSQL this dict is simply ignored.
_connect_args: dict = {}
if settings.DATABASE_URL.startswith("sqlite"):
    _connect_args = {"check_same_thread": False}

engine = create_async_engine(
    settings.DATABASE_URL,
    echo=(settings.APP_ENV == "development"),  # SQL query logging in dev
    future=True,
    connect_args=_connect_args,
)

# ---------------------------------------------------------------------------
# Session factory
# ---------------------------------------------------------------------------
AsyncSessionLocal = async_sessionmaker(
    bind=engine,
    class_=AsyncSession,
    autocommit=False,
    autoflush=False,
    expire_on_commit=False,
)


# ---------------------------------------------------------------------------
# Declarative base — all ORM models inherit from this
# ---------------------------------------------------------------------------
class Base(DeclarativeBase):
    pass


# ---------------------------------------------------------------------------
# FastAPI dependency — yields an AsyncSession per request
# ---------------------------------------------------------------------------
async def get_db() -> AsyncGenerator[AsyncSession, None]:
    """
    FastAPI dependency that provides a database session scoped to a single
    request.  The session is automatically closed (and rolled back on error)
    after the request completes.
    """
    async with AsyncSessionLocal() as session:
        try:
            yield session
            await session.commit()
        except Exception:
            await session.rollback()
            raise
        finally:
            await session.close()


# ---------------------------------------------------------------------------
# Utility — create all tables (called on startup)
# ---------------------------------------------------------------------------
async def init_db() -> None:
    """
    Create all tables defined in ORM models.
    In production, prefer Alembic migrations over this function.
    """
    # Import models so SQLAlchemy registers them on Base.metadata
    import models  # noqa: F401  (side-effect import)

    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    logger.info("Database tables initialised.")

    # Seeding mock data for local development/testing
    from sqlalchemy.ext.asyncio import AsyncSession
    async with AsyncSession(engine) as session:
        from sqlalchemy import select
        from models import User, HazardReport, UserRole, HazardType, SeverityLevel, RepairStatus

        # Check if users already exist
        res = await session.execute(select(User))
        if not res.scalars().first():
            logger.info("Seeding database with mock data...")
            driver = User(
                firebase_uid="mock-uid-driver",
                email="ali.haider@gmail.com",
                display_name="Ali Haider",
                role=UserRole.DRIVER.value
            )
            admin = User(
                firebase_uid="mock-uid-admin",
                email="admin@safepath.gov",
                display_name="Admin User",
                role=UserRole.ADMIN.value
            )
            session.add_all([driver, admin])
            await session.flush()

            # Seed pre-populated hazards matching our frontend mocks
            hazards = [
                HazardReport(
                    user_id=driver.id,
                    latitude=24.8607,
                    longitude=67.0099,
                    hazard_type=HazardType.POTHOLE.value,
                    severity=SeverityLevel.CRITICAL.value,
                    confidence=0.92,
                    crowdsource_count=28,
                    is_verified=True,
                    status=RepairStatus.REPORTED.value
                ),
                HazardReport(
                    user_id=driver.id,
                    latitude=24.8921,
                    longitude=67.0345,
                    hazard_type=HazardType.ROAD_CRACK.value,
                    severity=SeverityLevel.MODERATE.value,
                    confidence=0.85,
                    crowdsource_count=15,
                    is_verified=False,
                    status=RepairStatus.ACKNOWLEDGED.value
                ),
                HazardReport(
                    user_id=driver.id,
                    latitude=24.8210,
                    longitude=67.1023,
                    hazard_type=HazardType.POTHOLE.value,
                    severity=SeverityLevel.CRITICAL.value,
                    confidence=0.88,
                    crowdsource_count=8,
                    is_verified=False,
                    status=RepairStatus.IN_PROGRESS.value
                ),
                HazardReport(
                    user_id=driver.id,
                    latitude=24.9104,
                    longitude=67.0726,
                    hazard_type=HazardType.OPEN_MANHOLE.value,
                    severity=SeverityLevel.CRITICAL.value,
                    confidence=0.90,
                    crowdsource_count=22,
                    is_verified=True,
                    status=RepairStatus.RESOLVED.value
                ),
                HazardReport(
                    user_id=driver.id,
                    latitude=24.8138,
                    longitude=67.0442,
                    hazard_type=HazardType.FLOODED_ROAD.value,
                    severity=SeverityLevel.CRITICAL.value,
                    confidence=0.95,
                    crowdsource_count=38,
                    is_verified=True,
                    status=RepairStatus.REPORTED.value
                )
            ]
            session.add_all(hazards)
            await session.commit()
            logger.info("Database successfully seeded.")
        else:
            logger.info("Database already has records, skipping seed.")
