"""
SafePath AI — FastAPI Application Entry Point
==============================================
Brings together all routers, middleware, and startup/shutdown logic.

Run locally:
    uvicorn main:app --reload --host 0.0.0.0 --port 8000

Production (Google Cloud Run):
    uvicorn main:app --host 0.0.0.0 --port $PORT --workers 1
"""

from __future__ import annotations

import logging
import sys
from contextlib import asynccontextmanager
from typing import AsyncGenerator

from fastapi import FastAPI, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from auth_utils import init_firebase_app
from config import settings
from database import init_db
from routers import analytics, auth, hazards, websocket
from routers import users, gps, notifications, dashboard

# ---------------------------------------------------------------------------
# Logging
# ---------------------------------------------------------------------------

logging.basicConfig(
    level=getattr(logging, settings.LOG_LEVEL.upper(), logging.INFO),
    format="%(asctime)s | %(levelname)-8s | %(name)s | %(message)s",
    datefmt="%Y-%m-%dT%H:%M:%S",
    stream=sys.stdout,
)
logger = logging.getLogger(__name__)


# ---------------------------------------------------------------------------
# Lifespan (startup / shutdown)
# ---------------------------------------------------------------------------

@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncGenerator[None, None]:
    """
    Runs once at startup and once at shutdown.
    Replaces the deprecated @app.on_event("startup") pattern.
    """
    # ── Startup ─────────────────────────────────────────────────────────
    logger.info("SafePath AI backend starting up (env=%s)…", settings.APP_ENV)

    # 1. Initialise database (create tables if they don't exist)
    await init_db()

    # 2. Initialise Firebase Admin SDK
    try:
        init_firebase_app()
    except Exception as exc:
        logger.warning(
            "Firebase could not be initialised: %s — auth endpoints will fail.", exc
        )

    logger.info("Startup complete. Ready to serve requests.")
    yield  # ← app is running here

    # ── Shutdown ─────────────────────────────────────────────────────────
    logger.info("SafePath AI backend shutting down…")


# ---------------------------------------------------------------------------
# FastAPI application
# ---------------------------------------------------------------------------

app = FastAPI(
    title="SafePath AI",
    description=(
        "AI-powered predictive pothole detection and smart road safety monitoring "
        "system.  Processes smartphone sensor data (GPS, accelerometer, gyroscope, "
        "camera) to detect, classify, and crowdsource road hazards in real time."
    ),
    version="1.0.0",
    contact={
        "name": "SafePath AI Development Team",
        "url": "https://github.com/Rayyan-624/Safe-Path-AI",
    },
    license_info={"name": "MIT"},
    docs_url="/docs",           # Swagger UI
    redoc_url="/redoc",         # ReDoc UI
    openapi_url="/openapi.json",
    lifespan=lifespan,
)


# ---------------------------------------------------------------------------
# CORS Middleware
# ---------------------------------------------------------------------------
# Configured for both local dev (React on 3000/5173) and future production domain.

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.allowed_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["X-Request-ID"],
)


# ---------------------------------------------------------------------------
# Global exception handler
# ---------------------------------------------------------------------------

@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception) -> JSONResponse:
    logger.error(
        "Unhandled exception on %s %s: %s",
        request.method,
        request.url.path,
        exc,
        exc_info=True,
    )
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={"detail": "An internal server error occurred."},
    )


# ---------------------------------------------------------------------------
# Routers
# ---------------------------------------------------------------------------

app.include_router(auth.router)
app.include_router(hazards.router)
app.include_router(analytics.router)
app.include_router(websocket.router)
app.include_router(users.router)
app.include_router(gps.router)
app.include_router(notifications.router)
app.include_router(dashboard.router)


# ---------------------------------------------------------------------------
# Health check
# ---------------------------------------------------------------------------

@app.get(
    "/health",
    tags=["Health"],
    summary="Health check endpoint",
    description="Returns 200 OK with service status. Used by load balancers and uptime monitors.",
)
async def health_check() -> dict:
    return {
        "status": "healthy",
        "service": "SafePath AI Backend",
        "version": "1.0.0",
        "environment": settings.APP_ENV,
    }


@app.get("/", include_in_schema=False)
async def root() -> dict:
    return {
        "message": "SafePath AI API is running.",
        "docs": "/docs",
        "health": "/health",
    }
