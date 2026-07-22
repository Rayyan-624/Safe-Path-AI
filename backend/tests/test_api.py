"""
SafePath AI — Core API Tests
==============================
Tests for health, auth, hazard reporting, nearby query, GeoJSON, and analytics.
"""

from __future__ import annotations

import json
import pytest
import pytest_asyncio
from httpx import AsyncClient
from unittest.mock import patch

# ---------------------------------------------------------------------------
# Health
# ---------------------------------------------------------------------------

@pytest.mark.asyncio
async def test_health_check(client: AsyncClient):
    response = await client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert "version" in data


# ---------------------------------------------------------------------------
# Auth — Register
# ---------------------------------------------------------------------------

@pytest.mark.asyncio
async def test_register_new_user(client: AsyncClient):
    response = await client.post(
        "/auth/register",
        json={
            "firebase_token": "mock-valid-token",
            "display_name": "Test Driver",
        },
    )
    assert response.status_code == 201
    data = response.json()
    assert data["email"] == "test@safepath.ai"
    assert data["role"] == "driver"
    assert "id" in data


@pytest.mark.asyncio
async def test_register_idempotent(client: AsyncClient):
    """Calling register twice returns 201 both times (upsert)."""
    for _ in range(2):
        response = await client.post(
            "/auth/register",
            json={"firebase_token": "mock-valid-token"},
        )
        assert response.status_code == 201


# ---------------------------------------------------------------------------
# Auth — Login
# ---------------------------------------------------------------------------

@pytest.mark.asyncio
async def test_login_after_register(client: AsyncClient):
    # First register
    await client.post(
        "/auth/register",
        json={"firebase_token": "mock-valid-token"},
    )
    # Then login
    response = await client.post(
        "/auth/login",
        json={"firebase_token": "mock-valid-token"},
    )
    assert response.status_code == 200
    assert response.json()["email"] == "test@safepath.ai"


@pytest.mark.asyncio
async def test_login_without_register_returns_404(client: AsyncClient):
    mock_claims = {
        "uid": "unknown-uid-9999",
        "email": "ghost@example.com",
    }
    with patch("auth_utils.firebase_auth.verify_id_token", return_value=mock_claims):
        response = await client.post(
            "/auth/login",
            json={"firebase_token": "ghost-token"},
        )
    assert response.status_code == 404


# ---------------------------------------------------------------------------
# Hazard report — helper
# ---------------------------------------------------------------------------

SENSOR_PAYLOAD = {
    "latitude": 24.8607,
    "longitude": 67.0011,
    "accelerometer_x": 0.12,
    "accelerometer_y": 0.45,
    "accelerometer_z": 15.5,   # high Z → large impact
    "gyroscope_x": 0.01,
    "gyroscope_y": 0.02,
    "gyroscope_z": 0.00,
    "speed_kmh": 30,
}


async def _register_and_get_token(client: AsyncClient) -> str:
    """Register user and return a mock bearer token."""
    await client.post("/auth/register", json={"firebase_token": "mock-valid-token"})
    return "mock-valid-token"


# ---------------------------------------------------------------------------
# POST /hazards/report
# ---------------------------------------------------------------------------

@pytest.mark.asyncio
async def test_report_hazard_success(client: AsyncClient):
    token = await _register_and_get_token(client)
    response = await client.post(
        "/hazards/report",
        json=SENSOR_PAYLOAD,
        headers={"Authorization": f"Bearer {token}"},
    )
    # May return 201 (hazard created) or 200 (normal road / low confidence)
    assert response.status_code in (200, 201)

    if response.status_code == 201:
        data = response.json()
        assert "hazard_id" in data
        assert data["latitude"] == pytest.approx(24.8607, rel=1e-4)
        assert data["longitude"] == pytest.approx(67.0011, rel=1e-4)
        assert data["confidence"] >= 0.0
        assert data["severity"] in ("Minor", "Moderate", "Critical")


@pytest.mark.asyncio
async def test_report_hazard_requires_auth(client: AsyncClient):
    response = await client.post("/hazards/report", json=SENSOR_PAYLOAD)
    assert response.status_code == 403  # No Authorization header


# ---------------------------------------------------------------------------
# GET /hazards/nearby
# ---------------------------------------------------------------------------

@pytest.mark.asyncio
async def test_get_nearby_hazards(client: AsyncClient):
    token = await _register_and_get_token(client)

    # Submit a report first
    await client.post(
        "/hazards/report",
        json=SENSOR_PAYLOAD,
        headers={"Authorization": f"Bearer {token}"},
    )

    response = await client.get(
        "/hazards/nearby",
        params={"lat": 24.8607, "lng": 67.0011, "radius": 1000},
    )
    assert response.status_code == 200
    assert isinstance(response.json(), list)


# ---------------------------------------------------------------------------
# GET /hazards/geojson
# ---------------------------------------------------------------------------

@pytest.mark.asyncio
async def test_geojson_format(client: AsyncClient):
    response = await client.get("/hazards/geojson")
    assert response.status_code == 200
    data = response.json()
    assert data["type"] == "FeatureCollection"
    assert "features" in data
    for feature in data["features"]:
        assert feature["type"] == "Feature"
        assert feature["geometry"]["type"] == "Point"
        assert len(feature["geometry"]["coordinates"]) == 2


# ---------------------------------------------------------------------------
# AI Models (unit tests)
# ---------------------------------------------------------------------------

def test_sensor_model_returns_valid_output():
    from schemas import SensorDataIn
    from ai.accelerometer_model import classify_from_sensors

    data = SensorDataIn(
        latitude=24.86,
        longitude=67.00,
        accelerometer_x=0.1,
        accelerometer_y=0.2,
        accelerometer_z=12.5,
        gyroscope_x=0.0,
        gyroscope_y=0.0,
        gyroscope_z=0.0,
        speed_kmh=25.0,
    )

    for _ in range(10):
        hazard_type, severity, confidence = classify_from_sensors(data)
        assert hazard_type in (
            "Pothole", "Road Crack", "Speed Breaker",
            "Open Manhole", "Uneven Road", "Flooded Road", "Normal"
        )
        assert severity in ("Normal", "Minor", "Moderate", "Critical")
        assert 0.0 <= confidence <= 1.0


def test_vision_model_returns_valid_output_or_none():
    import base64
    from ai.vision_model import classify_from_image

    # Create a minimal valid JPEG header
    fake_jpeg = b"\xff\xd8\xff\xe0" + b"\x00" * 100
    encoded = base64.b64encode(fake_jpeg).decode()

    result = classify_from_image(encoded)
    if result is not None:
        hazard_type, severity, confidence = result
        assert hazard_type in (
            "Pothole", "Road Crack", "Speed Breaker",
            "Open Manhole", "Uneven Road", "Flooded Road"
        )
        assert severity in ("Minor", "Moderate", "Critical")
        assert 0.0 <= confidence <= 1.0


def test_vision_model_rejects_invalid_image():
    from ai.vision_model import classify_from_image
    import base64

    garbage = base64.b64encode(b"this is not an image").decode()
    result = classify_from_image(garbage)
    assert result is None


# ---------------------------------------------------------------------------
# Geospatial utilities
# ---------------------------------------------------------------------------

def test_haversine_distance():
    from geo_utils import haversine_distance_metres, points_within_radius

    # Karachi landmarks roughly 1km apart
    d = haversine_distance_metres(24.8607, 67.0011, 24.8700, 67.0100)
    assert 1000 < d < 2000  # ~1.4 km

    assert points_within_radius(24.8607, 67.0011, 24.8607, 67.0011, 10)  # same point
    assert not points_within_radius(24.8607, 67.0011, 25.0, 68.0, 100)   # far away
