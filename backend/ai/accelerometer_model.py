"""
SafePath AI — Accelerometer / Sensor Fusion AI Model
======================================================
Current mode: MOCK (Week 2)

The public interface is `classify_from_sensors(data)`.  It returns a tuple of
    (hazard_type: str, severity: str, confidence: float)

Architecture designed for a single-function swap in Week 5:
  - Replace the body of `_run_inference()` with a real CNN-LSTM model call.
  - Everything else (input preprocessing, output mapping) stays identical.

Mock strategy:
  - Computes accelerometer vector magnitude and gyroscope angular velocity.
  - Uses empirically-tuned thresholds to bucket detections into severity levels.
  - Adds calibrated noise so responses look realistic during frontend dev.
"""

from __future__ import annotations

import logging
import math
import random
from typing import Tuple

from schemas import SensorDataIn

logger = logging.getLogger(__name__)

# ---------------------------------------------------------------------------
# Configuration — thresholds for mock heuristic
# These will be replaced by model weights in production.
# ---------------------------------------------------------------------------

# Accelerometer magnitude thresholds (m/s²)
_THRESH_MINOR = 1.5
_THRESH_MODERATE = 3.5
_THRESH_CRITICAL = 6.0

# Gyroscope magnitude threshold that hints at lateral road instability
_GYRO_MODIFIER_THRESH = 0.5

# Weighted probability tables for hazard type given severity
_TYPE_WEIGHTS: dict[str, dict[str, float]] = {
    "Normal": {
        "Normal": 0.95,
        "Pothole": 0.02,
        "Road Crack": 0.02,
        "Speed Breaker": 0.01,
    },
    "Minor": {
        "Road Crack": 0.35,
        "Speed Breaker": 0.30,
        "Uneven Road": 0.20,
        "Pothole": 0.15,
    },
    "Moderate": {
        "Pothole": 0.40,
        "Road Crack": 0.25,
        "Uneven Road": 0.20,
        "Open Manhole": 0.10,
        "Flooded Road": 0.05,
    },
    "Critical": {
        "Pothole": 0.45,
        "Open Manhole": 0.25,
        "Flooded Road": 0.20,
        "Uneven Road": 0.10,
    },
}


# ---------------------------------------------------------------------------
# Internal helpers
# ---------------------------------------------------------------------------

def _vector_magnitude(x: float, y: float, z: float) -> float:
    """Euclidean magnitude of a 3-axis vector."""
    return math.sqrt(x**2 + y**2 + z**2)


def _weighted_choice(weights: dict[str, float]) -> str:
    """Pick a key from a dict of {label: probability} weights."""
    population = list(weights.keys())
    probabilities = list(weights.values())
    return random.choices(population, weights=probabilities, k=1)[0]


# ---------------------------------------------------------------------------
# Core inference function — SWAP THIS in Week 5
# ---------------------------------------------------------------------------

def _run_inference(
    acc_magnitude: float,
    gyro_magnitude: float,
    speed_kmh: float,
) -> Tuple[str, str, float]:
    """
    Mock inference using sensor heuristics.

    In production, replace this function body with:
        tensor = preprocess([acc_x, acc_y, acc_z, gyro_x, gyro_y, gyro_z, speed])
        output = cnn_lstm_model.predict(tensor)
        hazard_type = LABEL_MAP[output.argmax()]
        severity = SEVERITY_MAP[output.severity_index]
        confidence = float(output.max())
        return hazard_type, severity, confidence

    Returns
    -------
    (hazard_type, severity, confidence)
    """
    # ── Determine severity from accelerometer magnitude ──────────────────
    if acc_magnitude < _THRESH_MINOR:
        severity = "Normal"
        base_confidence = random.uniform(0.70, 0.95)
    elif acc_magnitude < _THRESH_MODERATE:
        severity = "Minor"
        base_confidence = random.uniform(0.55, 0.80)
    elif acc_magnitude < _THRESH_CRITICAL:
        severity = "Moderate"
        base_confidence = random.uniform(0.65, 0.88)
    else:
        severity = "Critical"
        base_confidence = random.uniform(0.78, 0.98)

    # ── Gyroscope modifier — lateral instability boosts severity ─────────
    if gyro_magnitude > _GYRO_MODIFIER_THRESH and severity == "Minor":
        severity = "Moderate"
        base_confidence = min(base_confidence + 0.05, 0.99)

    # ── Speed modifier — low speed + high acceleration = likely pothole ──
    if speed_kmh is not None and speed_kmh < 20 and severity in ("Moderate", "Critical"):
        # Pothole probability increases at low speed (driver slowing for hazard)
        pass  # Already handled in type weights

    # ── Pick hazard type based on severity weights ────────────────────────
    hazard_type = _weighted_choice(_TYPE_WEIGHTS.get(severity, _TYPE_WEIGHTS["Minor"]))

    # Add small Gaussian noise to confidence
    noise = random.gauss(0, 0.02)
    confidence = float(min(max(base_confidence + noise, 0.0), 1.0))

    return hazard_type, severity, confidence


# ---------------------------------------------------------------------------
# Public API
# ---------------------------------------------------------------------------

def classify_from_sensors(data: SensorDataIn) -> Tuple[str, str, float]:
    """
    Classify road condition from smartphone sensor data.

    Parameters
    ----------
    data : SensorDataIn
        Validated sensor reading from the mobile app.

    Returns
    -------
    (hazard_type, severity, confidence)
        hazard_type : one of HazardType enum values
        severity    : one of SeverityLevel enum values
        confidence  : float in [0, 1]
    """
    # Subtract gravitational component from Z for a crude tilt correction.
    # In production, use complementary or Kalman filter for proper orientation.
    acc_x = data.accelerometer_x
    acc_y = data.accelerometer_y
    acc_z = data.accelerometer_z - 9.81  # remove gravity (assuming upright phone)

    acc_magnitude = _vector_magnitude(acc_x, acc_y, acc_z)
    gyro_magnitude = _vector_magnitude(
        data.gyroscope_x, data.gyroscope_y, data.gyroscope_z
    )

    hazard_type, severity, confidence = _run_inference(
        acc_magnitude=acc_magnitude,
        gyro_magnitude=gyro_magnitude,
        speed_kmh=data.speed_kmh or 0.0,
    )

    logger.debug(
        "Sensor classification: mag=%.3f gyro=%.3f → %s / %s (conf=%.2f)",
        acc_magnitude,
        gyro_magnitude,
        hazard_type,
        severity,
        confidence,
    )

    return hazard_type, severity, confidence
