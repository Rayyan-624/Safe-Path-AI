import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { IoAddOutline, IoRemoveOutline, IoLocateOutline, IoLayersOutline } from 'react-icons/io5';

// Component to dynamically pan/zoom map on coordinate changes
function ChangeMapView({ center, zoom }) {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.setView(center, zoom);
    }
  }, [center, zoom, map]);
  return null;
}

export default function MapPlaceholder({ theme = 'light', mode = 'user', hazards = [], showTraffic = true }) {
  const [zoom, setZoom] = useState(14);
  const [layersOpen, setLayersOpen] = useState(false);
  const [activeLayer, setActiveLayer] = useState('road'); // road, satellite, heatmap

  // Center on the first hazard if available, else center on Karachi
  const centerCoords = hazards.length > 0 && hazards[0].lat && hazards[0].lng
    ? [hazards[0].lat, hazards[0].lng]
    : [24.8607, 67.0099];

  const colors = {
    Good: '#22c55e',
    Minor: '#eab308',
    Moderate: '#f97316',
    Critical: '#ef4444',
    Normal: '#22c55e',
    High: '#ef4444',
    Low: '#22c55e'
  };

  // Custom DIV marker icons to resolve Vite/Leaflet path hashing issues
  const getMarkerIcon = (severity) => {
    const pinColor = colors[severity] || colors.Good;
    return L.divIcon({
      className: 'custom-div-icon',
      html: `
        <div style="position: relative; width: 30px; height: 30px; display: flex; align-items: center; justify-content: center;">
          ${severity === 'Critical' ? `
            <div style="position: absolute; width: 28px; height: 28px; border-radius: 50%; background-color: ${pinColor}; opacity: 0.35; animation: pulse 1.5s infinite;"></div>
          ` : ''}
          <div style="background-color: ${pinColor}; width: 14px; height: 14px; border-radius: 50%; border: 2.5px solid white; box-shadow: 0 2px 5px rgba(0,0,0,0.3); z-index: 10;"></div>
        </div>
      `,
      iconSize: [30, 30],
      iconAnchor: [15, 15]
    });
  };

  return (
    <div className={`relative w-full h-full rounded-2xl overflow-hidden shadow-inner border border-slate-200 select-none ${theme === 'dark' ? 'bg-[#0f172a]' : 'bg-[#e2e8f0]'}`}>
      
      {/* Real Leaflet Map */}
      <MapContainer
        center={centerCoords}
        zoom={zoom}
        style={{ width: '100%', height: '100%', background: theme === 'dark' ? '#0f172a' : '#f1f5f9', zIndex: 1 }}
        zoomControl={false}
      >
        <ChangeMapView center={centerCoords} zoom={zoom} />
        
        {theme === 'dark' ? (
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          />
        ) : (
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
        )}

        {/* User Live GPS Marker */}
        {mode === 'user' && (
          <Marker
            position={[24.8607, 67.0099]}
            icon={L.divIcon({
              className: 'user-gps-icon',
              html: `
                <div style="position: relative; width: 34px; height: 34px; display: flex; align-items: center; justify-content: center;">
                  <div style="position: absolute; width: 30px; height: 30px; border-radius: 50%; background-color: #3b82f6; opacity: 0.3; animation: pulse 2s infinite;"></div>
                  <div style="background-color: white; width: 14px; height: 14px; border-radius: 50%; border: 3px solid #3b82f6; box-shadow: 0 2px 4px rgba(0,0,0,0.3); z-index: 10;"></div>
                </div>
              `
            })}
          />
        )}

        {/* Hazard Markers */}
        {hazards.map((haz, idx) => {
          const lat = haz.lat || haz.latitude;
          const lng = haz.lng || haz.longitude;
          if (!lat || !lng) return null;

          return (
            <Marker
              key={haz.id || idx}
              position={[lat, lng]}
              icon={getMarkerIcon(haz.severity)}
            >
              <Popup>
                <div className="text-xs p-1 text-slate-800 leading-normal font-sans text-left">
                  <strong className="block text-sm border-b pb-1 mb-1 text-slate-900 font-extrabold">{haz.type || haz.hazard_type}</strong>
                  <div className="mt-1 font-bold">Severity: <span className={haz.severity === 'Critical' ? 'text-red-600' : 'text-orange-600'}>{haz.severity}</span></div>
                  <div>Confidence: {haz.confidence ? `${Math.round(haz.confidence * 100)}%` : '85%'}</div>
                  {haz.desc && <div className="text-slate-500 mt-1 italic">{haz.desc}</div>}
                  <div className="text-[10px] text-slate-400 mt-1">Status: {haz.status || 'Reported'}</div>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>

      {/* Floating Header */}
      <div className={`absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-semibold shadow backdrop-blur-md z-[100] ${theme === 'dark' ? 'bg-slate-900/80 text-blue-400 border border-slate-700' : 'bg-white/80 text-blue-600 border border-slate-200'}`}>
        Live Monitoring Area
      </div>

      {/* Map Controls */}
      <div className="absolute right-4 top-4 flex flex-col gap-2 z-[100]">
        <button
          onClick={() => setZoom(z => Math.min(z + 1, 18))}
          className={`p-2 rounded-lg shadow-md border focus:outline-none transition-colors ${theme === 'dark' ? 'bg-slate-800 border-slate-700 hover:bg-slate-700 text-slate-200' : 'bg-white border-slate-200 hover:bg-slate-100 text-slate-600'}`}
        >
          <IoAddOutline className="w-5 h-5" />
        </button>
        <button
          onClick={() => setZoom(z => Math.max(z - 1, 10))}
          className={`p-2 rounded-lg shadow-md border focus:outline-none transition-colors ${theme === 'dark' ? 'bg-slate-800 border-slate-700 hover:bg-slate-700 text-slate-200' : 'bg-white border-slate-200 hover:bg-slate-100 text-slate-600'}`}
        >
          <IoRemoveOutline className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
