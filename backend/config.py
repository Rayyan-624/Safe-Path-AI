"""
SafePath AI — Application Settings
====================================
All configuration is loaded from environment variables (via .env file).
Using pydantic-settings ensures type-safety and clear error messages when
required variables are missing.
"""

from __future__ import annotations

from functools import lru_cache
from typing import List

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore",
    )

    # ── Database ──────────────────────────────────────────────────────────
    DATABASE_URL: str = "sqlite+aiosqlite:///./safepath.db"

    # ── Firebase ──────────────────────────────────────────────────────────
    FIREBASE_PROJECT_ID: str = ""
    FIREBASE_SERVICE_ACCOUNT_JSON: str = "./firebase-service-account.json"

    # ── Security ──────────────────────────────────────────────────────────
    SECRET_KEY: str = "dev-secret-key-replace-in-production"

    # ── CORS ──────────────────────────────────────────────────────────────
    # Stored as a comma-separated string in .env, parsed into a list here.
    ALLOWED_ORIGINS: str = "http://localhost:3000,http://localhost:5173"

    @property
    def allowed_origins_list(self) -> List[str]:
        return [o.strip() for o in self.ALLOWED_ORIGINS.split(",") if o.strip()]

    # ── Geospatial ────────────────────────────────────────────────────────
    CROWDSOURCE_RADIUS_METRES: float = 15.0
    CROWDSOURCE_MIN_REPORTS: int = 2
    CONFIDENCE_THRESHOLD: float = 0.35
    ALERT_BROADCAST_RADIUS_METRES: float = 500.0

    # ── AI Model Paths ────────────────────────────────────────────────────
    VISION_MODEL_PATH: str = ""   # Empty = mock mode
    SENSOR_MODEL_PATH: str = ""   # Empty = mock mode

    # ── Application ───────────────────────────────────────────────────────
    APP_ENV: str = "development"
    LOG_LEVEL: str = "INFO"


@lru_cache(maxsize=1)
def get_settings() -> Settings:
    return Settings()


# Convenience singleton — import this throughout the app
settings: Settings = get_settings()
