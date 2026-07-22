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
