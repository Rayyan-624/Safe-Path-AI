"""
SafePath AI — WebSocket Alert Manager & Router
================================================
Endpoint:
  WS /ws/alerts  — Real-time hazard push to nearby connected clients

Protocol:
  1. Client connects to ws://host/ws/alerts
  2. Client sends a JSON message:
       {"action": "subscribe", "latitude": 24.86, "longitude": 67.00}
  3. Server registers the client's location.
  4. When a new hazard is reported, server broadcasts to all clients within
     ALERT_BROADCAST_RADIUS_METRES of the hazard.
  5. Clients receive JSON:
       {
         "event": "new_hazard",
         "hazard_id": "...",
         "type": "Pothole",
         "severity": "Critical",
         "confidence": 0.94,
         "latitude": 24.86,
         "longitude": 67.00,
         "distance_metres": 143.2,
         "timestamp": "2025-01-01T00:00:00Z"
       }

Connection lifecycle:
  - Stale connections (client disconnect) are silently pruned.
  - Clients can update their location by sending a new subscribe message.
"""

from __future__ import annotations

import asyncio
import json
import logging
from datetime import datetime, timezone
from typing import Optional

from fastapi import APIRouter, WebSocket, WebSocketDisconnect

from config import settings
from geo_utils import haversine_distance_metres
from schemas import WSAlertMessage, WSSubscribeMessage

logger = logging.getLogger(__name__)

router = APIRouter(tags=["WebSocket"])


# ---------------------------------------------------------------------------
# Connection Manager
# ---------------------------------------------------------------------------

class AlertConnectionManager:
    """
    Manages all active WebSocket connections and their last-known positions.
    Thread-safe for use with asyncio (single-threaded event loop).
    """

    def __init__(self) -> None:
        # Maps WebSocket → (latitude, longitude)
        self._connections: dict[WebSocket, tuple[float, float]] = {}

    async def connect(self, websocket: WebSocket) -> None:
        await websocket.accept()
        # Register with a null location until the client subscribes
        self._connections[websocket] = (0.0, 0.0)
        logger.info(
            "WebSocket connected. Total connections: %d", len(self._connections)
        )

    def disconnect(self, websocket: WebSocket) -> None:
        self._connections.pop(websocket, None)
        logger.info(
            "WebSocket disconnected. Total connections: %d", len(self._connections)
        )

    def update_location(
        self, websocket: WebSocket, lat: float, lon: float
    ) -> None:
        if websocket in self._connections:
            self._connections[websocket] = (lat, lon)

    async def broadcast_hazard(
        self,
        hazard_id: str,
        hazard_type: str,
        severity: str,
        confidence: float,
        latitude: float,
        longitude: float,
    ) -> None:
        """
        Send a hazard alert to all connected clients within
        ALERT_BROADCAST_RADIUS_METRES of the hazard location.
        Disconnected clients are pruned during iteration.
        """
        radius = settings.ALERT_BROADCAST_RADIUS_METRES
        timestamp = datetime.now(timezone.utc).isoformat()

        dead: list[WebSocket] = []

        for ws, (client_lat, client_lon) in self._connections.items():
            # Skip clients that haven't subscribed yet (position is 0,0)
            if client_lat == 0.0 and client_lon == 0.0:
                continue

            distance = haversine_distance_metres(
                latitude, longitude, client_lat, client_lon
            )

            if distance > radius:
                continue

            message = WSAlertMessage(
                hazard_id=hazard_id,
                type=hazard_type,
                severity=severity,
                confidence=confidence,
                latitude=latitude,
                longitude=longitude,
                distance_metres=round(distance, 1),
                timestamp=timestamp,
            )

            try:
                await ws.send_text(message.model_dump_json())
            except Exception as exc:
                logger.warning("Failed to send alert to WebSocket: %s", exc)
                dead.append(ws)

        # Prune dead connections
        for ws in dead:
            self.disconnect(ws)

    @property
    def active_count(self) -> int:
        return len(self._connections)


# Module-level singleton — imported by hazards router to trigger broadcasts
alert_manager = AlertConnectionManager()


# ---------------------------------------------------------------------------
# WebSocket endpoint
# ---------------------------------------------------------------------------

@router.websocket("/ws/alerts")
async def websocket_alerts(websocket: WebSocket) -> None:
    """
    WebSocket endpoint for real-time hazard alerts.

    Clients must send a subscribe message with their GPS position after
    connecting to receive spatially-filtered alerts.
    """
    await alert_manager.connect(websocket)

    try:
        while True:
            raw_data = await websocket.receive_text()

            try:
                payload = json.loads(raw_data)
            except json.JSONDecodeError:
                await websocket.send_text(
                    json.dumps({"error": "Invalid JSON"})
                )
                continue

            action = payload.get("action")

            if action == "subscribe":
                try:
                    msg = WSSubscribeMessage(**payload)
                    alert_manager.update_location(
                        websocket, msg.latitude, msg.longitude
                    )
                    await websocket.send_text(
                        json.dumps({
                            "event": "subscribed",
                            "latitude": msg.latitude,
                            "longitude": msg.longitude,
                            "broadcast_radius_metres": settings.ALERT_BROADCAST_RADIUS_METRES,
                        })
                    )
                    logger.debug(
                        "Client subscribed at (%.4f, %.4f)", msg.latitude, msg.longitude
                    )
                except Exception as exc:
                    await websocket.send_text(
                        json.dumps({"error": f"Invalid subscribe payload: {exc}"})
                    )

            elif action == "ping":
                await websocket.send_text(json.dumps({"event": "pong"}))

            else:
                await websocket.send_text(
                    json.dumps({"error": f"Unknown action: '{action}'"})
                )

    except WebSocketDisconnect:
        alert_manager.disconnect(websocket)

    except Exception as exc:
        logger.error("Unexpected WebSocket error: %s", exc, exc_info=True)
        alert_manager.disconnect(websocket)
