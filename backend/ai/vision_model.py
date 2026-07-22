"""
SafePath AI — Computer Vision Model (YOLOv8 Nano)
===================================================
Current mode: MOCK (Week 2)

The public interface is `classify_from_image(base64_image)`.  It returns either:
    (hazard_type: str, severity: str, confidence: float)
or None if the image cannot be processed.

Architecture designed for a single-function swap in Week 5:
  - Replace the body of `_run_yolo_inference()` with an ONNX Runtime call.
  - Everything else (decoding, resizing, output mapping) stays identical.

Mock strategy:
  - Validates that the base64 string is a decodable image.
  - Returns weighted-random classifications that reflect realistic YOLO output.
"""

from __future__ import annotations

import base64
import io
import logging
import random
from typing import Optional, Tuple

logger = logging.getLogger(__name__)

# ---------------------------------------------------------------------------
# Label maps — will be used by the real YOLO model output index → label
# ---------------------------------------------------------------------------

YOLO_CLASS_MAP: dict[int, str] = {
    0: "Pothole",
    1: "Road Crack",
    2: "Speed Breaker",
    3: "Open Manhole",
    4: "Uneven Road",
    5: "Flooded Road",
}

SEVERITY_BY_TYPE: dict[str, list[str]] = {
    "Pothole":       ["Minor", "Moderate", "Critical"],
    "Road Crack":    ["Minor", "Minor", "Moderate"],
    "Speed Breaker": ["Minor", "Minor", "Minor"],
    "Open Manhole":  ["Moderate", "Critical", "Critical"],
    "Uneven Road":   ["Minor", "Moderate", "Moderate"],
    "Flooded Road":  ["Moderate", "Critical", "Critical"],
}

# Weighted distribution over class indices for mock
_CLASS_WEIGHTS = [0.35, 0.20, 0.15, 0.10, 0.12, 0.08]


# ---------------------------------------------------------------------------
# Internal helpers
# ---------------------------------------------------------------------------

def _decode_image(base64_string: str) -> Optional[bytes]:
    """
    Decode a base64-encoded image string into raw bytes.
    Returns None if decoding fails.
    """
    try:
        image_bytes = base64.b64decode(base64_string, validate=True)
        return image_bytes
    except Exception as exc:
        logger.warning("Failed to decode base64 image: %s", exc)
        return None


def _validate_image_bytes(image_bytes: bytes) -> bool:
    """
    Validate that the bytes represent a supported image format (JPEG/PNG).
    Uses magic bytes — no PIL dependency required for validation.
    """
    # JPEG magic bytes: FF D8 FF
    # PNG magic bytes: 89 50 4E 47
    if image_bytes[:3] == b"\xff\xd8\xff":
        return True
    if image_bytes[:4] == b"\x89PNG":
        return True
    logger.warning("Unsupported image format — expected JPEG or PNG.")
    return False


# ---------------------------------------------------------------------------
# Core inference function — SWAP THIS in Week 5
# ---------------------------------------------------------------------------

def _run_yolo_inference(image_bytes: bytes) -> Tuple[str, str, float]:
    """
    Mock YOLO inference.

    In production, replace this function body with:
        import onnxruntime as ort
        import numpy as np
        from PIL import Image

        session = ort.InferenceSession(settings.VISION_MODEL_PATH)
        img = Image.open(io.BytesIO(image_bytes)).resize((640, 640))
        tensor = np.array(img, dtype=np.float32) / 255.0
        tensor = np.transpose(tensor, (2, 0, 1))[np.newaxis]  # NCHW

        outputs = session.run(None, {session.get_inputs()[0].name: tensor})
        # Parse YOLOv8 output: shape [1, 84, 8400] for 80 COCO classes
        # or your custom class count
        boxes = outputs[0][0].T  # [8400, 84]
        scores = boxes[:, 4:]
        best_idx = scores.max(axis=1).argmax()
        class_id = scores[best_idx].argmax()
        confidence = float(scores[best_idx].max())
        hazard_type = YOLO_CLASS_MAP.get(class_id, "Pothole")
        severity = pick_severity(hazard_type, confidence)
        return hazard_type, severity, confidence

    Returns
    -------
    (hazard_type, severity, confidence)
    """
    # Mock: weighted random class selection
    class_id = random.choices(range(len(YOLO_CLASS_MAP)), weights=_CLASS_WEIGHTS, k=1)[0]
    hazard_type = YOLO_CLASS_MAP[class_id]

    # Severity: pick from type-specific list with slight critical bias
    severity_options = SEVERITY_BY_TYPE[hazard_type]
    severity = random.choice(severity_options)

    # Confidence: realistically high when vision model "sees" something
    confidence = round(random.uniform(0.62, 0.97), 4)

    return hazard_type, severity, confidence


# ---------------------------------------------------------------------------
# Public API
# ---------------------------------------------------------------------------

def classify_from_image(base64_image: str) -> Optional[Tuple[str, str, float]]:
    """
    Classify road hazard from a camera image.

    Parameters
    ----------
    base64_image : str
        Raw base64-encoded image (data URI prefix already stripped).

    Returns
    -------
    (hazard_type, severity, confidence) or None
        Returns None when the image cannot be decoded or is invalid.
    """
    image_bytes = _decode_image(base64_image)
    if image_bytes is None:
        return None

    if not _validate_image_bytes(image_bytes):
        return None

    hazard_type, severity, confidence = _run_yolo_inference(image_bytes)

    logger.debug(
        "Vision classification: %s / %s (conf=%.2f) — image_size=%d bytes",
        hazard_type,
        severity,
        confidence,
        len(image_bytes),
    )

    return hazard_type, severity, confidence
