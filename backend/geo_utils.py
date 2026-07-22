"""
SafePath AI — Geospatial Utilities
====================================
Provides distance calculation and nearby-hazard querying that works with both
SQLite (prototype) and PostgreSQL + PostGIS (production).

Production swap guide:
  Instead of the Python-level Haversine filter, replace `get_nearby_hazards()`
  with a PostGIS ST_DWithin query:

      from geoalchemy2.functions import ST_DWithin, ST_MakePoint
      stmt = select(HazardReport).where(
          ST_DWithin(
              HazardReport.geom,
              ST_MakePoint(longitude, latitude).cast(Geometry),
              radius_metres / 111320,  # degrees approximation — or use geography type
          )
      )
"""

from __future__ import annotations

import math
from typing import List, Optional, Tuple

from geopy.distance import geodesic


# ---------------------------------------------------------------------------
# Distance helpers
# ---------------------------------------------------------------------------

def haversine_distance_metres(
    lat1: float, lon1: float, lat2: float, lon2: float
) -> float:
    """
    Return the great-circle distance in metres between two (lat, lon) points.
    Uses the geopy library for accuracy.
    """
    return geodesic((lat1, lon1), (lat2, lon2)).meters


def points_within_radius(
    origin_lat: float,
    origin_lon: float,
    candidate_lat: float,
    candidate_lon: float,
    radius_metres: float,
) -> bool:
    """Return True if the candidate point is within radius_metres of origin."""
    return (
        haversine_distance_metres(origin_lat, origin_lon, candidate_lat, candidate_lon)
        <= radius_metres
    )


# ---------------------------------------------------------------------------
# Bounding-box pre-filter (reduces candidates before precise distance calc)
# ---------------------------------------------------------------------------

def bounding_box(
    lat: float, lon: float, radius_metres: float
) -> Tuple[float, float, float, float]:
    """
    Return a (min_lat, max_lat, min_lon, max_lon) bounding box for a circle.
    Used as a coarse SQL WHERE filter before the precise Haversine check.

    1 degree latitude ≈ 111,320 m
    1 degree longitude ≈ 111,320 * cos(lat) m
    """
    delta_lat = radius_metres / 111_320.0
    delta_lon = radius_metres / (111_320.0 * math.cos(math.radians(lat)))
    return (
        lat - delta_lat,
        lat + delta_lat,
        lon - delta_lon,
        lon + delta_lon,
    )
