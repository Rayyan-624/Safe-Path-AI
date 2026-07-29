/**
 * SafePath AI — Interactive Leaflet Map Component
 * ================================================
 * Replaces the old static placeholder with a full react-leaflet map.
 *
 * Props:
 *   hazards   - Array of hazard objects {id, type, severity, lat, lng, ...}
 *   mode      - 'user' | 'admin' (affects clustering and controls shown)
 *   height    - CSS height string (default: '100%')
 *   center    - [lat, lng] override (default: Karachi)
 *   zoom      - Initial zoom level (default: 12)
 *   showCurrentLocation - show blue dot for user's location (default: true)
 *   onMarkerClick - callback(hazard) when a marker is clicked
 */

import React, { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix Leaflet's default icon paths (broken in Vite/Webpack by default)
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// ---------------------------------------------------------------------------
// Severity colour mapping
// ---------------------------------------------------------------------------
const SEVERITY_COLORS = {
  Critical: '#ef4444',   // red-500
  Moderate: '#f97316',   // orange-500
  Minor: '#eab308',      // yellow-500
  Normal: '#22c55e',     // green-500
  // Legacy / mock data support
  High: '#ef4444',
  Medium: '#f97316',
  Low: '#eab308',
};

const SEVERITY_BORDER = {
  Critical: '#b91c1c',
  Moderate: '#c2410c',
  Minor: '#a16207',
  Normal: '#15803d',
  High: '#b91c1c',
  Medium: '#c2410c',
  Low: '#a16207',
};

// Create a custom circular SVG marker icon for each severity
function createSeverityIcon(severity) {
  const color = SEVERITY_COLORS[severity] || '#6b7280';
  const border = SEVERITY_BORDER[severity] || '#374151';
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="34" viewBox="0 0 28 34">
      <ellipse cx="14" cy="30" rx="6" ry="3" fill="rgba(0,0,0,0.25)"/>
      <circle cx="14" cy="14" r="12" fill="${color}" stroke="${border}" stroke-width="2.5"/>
      <circle cx="14" cy="14" r="5" fill="white" opacity="0.9"/>
    </svg>
  `;
  return L.divIcon({
    html: svg,
    className: '',
    iconSize: [28, 34],
    iconAnchor: [14, 32],
    popupAnchor: [0, -30],
  });
}

// Current location blue dot icon
const currentLocationIcon = L.divIcon({
  html: `
    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 22 22">
      <circle cx="11" cy="11" r="10" fill="#3b82f6" stroke="white" stroke-width="3"/>
      <circle cx="11" cy="11" r="4" fill="white"/>
    </svg>
  `,
  className: '',
  iconSize: [22, 22],
  iconAnchor: [11, 11],
  popupAnchor: [0, -14],
});

// ---------------------------------------------------------------------------
// Sub-component: auto-recenter when center prop changes
// ---------------------------------------------------------------------------
function MapController({ center, zoom }) {
  const map = useMap();
  useEffect(() => {
    if (center && center[0] !== 0) {
      map.setView(center, zoom || map.getZoom(), { animate: true });
    }
  }, [center, zoom, map]);
  return null;
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------
export default function SafePathMap({
  hazards = [],
  mode = 'user',
  height = '100%',
  center,
  zoom = 12,
  showCurrentLocation = true,
  onMarkerClick,
}) {
  // Default center to Karachi
  const mapCenter = center || [24.8607, 67.0099];

  // Current user position state
  const [userPos, setUserPos] = React.useState(null);

  useEffect(() => {
    if (!showCurrentLocation) return;
    if (!navigator.geolocation) return;
    const id = navigator.geolocation.watchPosition(
      (pos) => setUserPos([pos.coords.latitude, pos.coords.longitude]),
      () => {},
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 5000 }
    );
    return () => navigator.geolocation.clearWatch(id);
  }, [showCurrentLocation]);

  const getSeverityLabel = (h) => {
    return h.severity || 'Minor';
  };

  const formatTimestamp = (ts) => {
    if (!ts) return '';
    try { return new Date(ts).toLocaleString(); } catch { return ts; }
  };

  return (
    <div style={{ height, width: '100%', borderRadius: '1rem', overflow: 'hidden', position: 'relative' }}>
      <MapContainer
        center={mapCenter}
        zoom={zoom}
        style={{ height: '100%', width: '100%' }}
        zoomControl={true}
        attributionControl={false}
      >
        {/* Tile Layer — OpenStreetMap */}
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          maxZoom={19}
        />

        {/* Auto-recenter controller */}
        <MapController center={center ? center : (userPos || mapCenter)} zoom={zoom} />

        {/* Current user location */}
        {showCurrentLocation && userPos && (
          <>
            <Circle
              center={userPos}
              radius={80}
              pathOptions={{ color: '#3b82f6', fillColor: '#93c5fd', fillOpacity: 0.25, weight: 1 }}
            />
            <Marker position={userPos} icon={currentLocationIcon}>
              <Popup>
                <div style={{ fontFamily: 'Inter, sans-serif', minWidth: 140 }}>
                  <strong style={{ color: '#1e40af' }}>📍 Your Location</strong>
                  <p style={{ margin: '4px 0 0', fontSize: 11, color: '#64748b' }}>
                    {userPos[0].toFixed(5)}, {userPos[1].toFixed(5)}
                  </p>
                </div>
              </Popup>
            </Marker>
          </>
        )}

        {/* Hazard markers */}
        {hazards.map((hazard, idx) => {
          const lat = hazard.lat ?? hazard.latitude;
          const lng = hazard.lng ?? hazard.longitude;
          if (!lat || !lng) return null;
          const severity = getSeverityLabel(hazard);
          const icon = createSeverityIcon(severity);
          const color = SEVERITY_COLORS[severity] || '#6b7280';

          return (
            <Marker
              key={hazard.id || idx}
              position={[lat, lng]}
              icon={icon}
              eventHandlers={{
                click: () => onMarkerClick && onMarkerClick(hazard),
              }}
            >
              <Popup>
                <div style={{ fontFamily: 'Inter, sans-serif', minWidth: 200, maxWidth: 240 }}>
                  {/* Header */}
                  <div style={{
                    display: 'flex', alignItems: 'center', gap: 8,
                    marginBottom: 8, paddingBottom: 8,
                    borderBottom: '1px solid #f1f5f9'
                  }}>
                    <span style={{
                      width: 10, height: 10, borderRadius: '50%',
                      backgroundColor: color, flexShrink: 0, display: 'inline-block'
                    }} />
                    <strong style={{ fontSize: 13, color: '#1e293b' }}>
                      {hazard.type || hazard.hazard_type || 'Hazard'}
                    </strong>
                  </div>

                  {/* Severity badge */}
                  <div style={{ marginBottom: 6 }}>
                    <span style={{
                      display: 'inline-block', padding: '2px 8px',
                      borderRadius: 20, fontSize: 10, fontWeight: 700,
                      backgroundColor: color + '22', color: color,
                      border: `1px solid ${color}44`
                    }}>
                      {severity}
                    </span>
                    {hazard.is_verified && (
                      <span style={{
                        display: 'inline-block', marginLeft: 6, padding: '2px 8px',
                        borderRadius: 20, fontSize: 10, fontWeight: 700,
                        backgroundColor: '#d1fae5', color: '#065f46'
                      }}>
                        ✓ Verified
                      </span>
                    )}
                  </div>

                  {/* Details */}
                  <table style={{ fontSize: 11, color: '#475569', width: '100%', borderCollapse: 'collapse' }}>
                    <tbody>
                      {hazard.confidence != null && (
                        <tr>
                          <td style={{ paddingRight: 8, paddingBottom: 3, fontWeight: 600, color: '#64748b' }}>Confidence</td>
                          <td style={{ paddingBottom: 3 }}>
                            {typeof hazard.confidence === 'number' && hazard.confidence <= 1
                              ? `${(hazard.confidence * 100).toFixed(0)}%`
                              : `${hazard.confidence}%`}
                          </td>
                        </tr>
                      )}
                      {hazard.crowdsource_count != null && (
                        <tr>
                          <td style={{ paddingRight: 8, paddingBottom: 3, fontWeight: 600, color: '#64748b' }}>Reports</td>
                          <td style={{ paddingBottom: 3 }}>{hazard.crowdsource_count} reports</td>
                        </tr>
                      )}
                      {hazard.status && (
                        <tr>
                          <td style={{ paddingRight: 8, paddingBottom: 3, fontWeight: 600, color: '#64748b' }}>Status</td>
                          <td style={{ paddingBottom: 3 }}>{hazard.status}</td>
                        </tr>
                      )}
                      {(hazard.location || hazard.description) && (
                        <tr>
                          <td colSpan={2} style={{ paddingTop: 4, color: '#94a3b8', fontSize: 10 }}>
                            {hazard.location || hazard.description}
                          </td>
                        </tr>
                      )}
                      {hazard.created_at && (
                        <tr>
                          <td colSpan={2} style={{ paddingTop: 4, color: '#94a3b8', fontSize: 10 }}>
                            {formatTimestamp(hazard.created_at)}
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>

      {/* Map Legend */}
      <div style={{
        position: 'absolute', bottom: 16, left: 16, zIndex: 1000,
        backgroundColor: 'rgba(255,255,255,0.95)',
        borderRadius: 12, padding: '8px 12px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
        fontSize: 10, fontFamily: 'Inter, sans-serif',
        backdropFilter: 'blur(8px)',
      }}>
        <div style={{ fontWeight: 700, color: '#475569', marginBottom: 5, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Severity
        </div>
        {[
          { label: 'Critical', color: SEVERITY_COLORS.Critical },
          { label: 'Moderate', color: SEVERITY_COLORS.Moderate },
          { label: 'Minor', color: SEVERITY_COLORS.Minor },
          { label: 'Normal', color: SEVERITY_COLORS.Normal },
        ].map(({ label, color }) => (
          <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 3 }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: color, display: 'inline-block' }} />
            <span style={{ color: '#64748b', fontWeight: 600 }}>{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
