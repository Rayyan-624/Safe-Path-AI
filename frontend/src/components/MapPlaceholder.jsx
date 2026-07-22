import React, { useState } from 'react';
import { IoAddOutline, IoRemoveOutline, IoLocateOutline, IoLayersOutline } from 'react-icons/io5';

export default function MapPlaceholder({ theme = 'light', mode = 'user', hazards = [], showTraffic = true }) {
  const [zoom, setZoom] = useState(14);
  const [layersOpen, setLayersOpen] = useState(false);
  const [activeLayer, setActiveLayer] = useState('road'); // road, satellite, heatmap

  const colors = {
    Good: '#22c55e',
    Minor: '#eab308',
    Moderate: '#f97316',
    Critical: '#ef4444',
    Low: '#22c55e',
    High: '#f97316',
    Info: '#3b82f6',
  };

  return (
    <div className={`relative w-full h-full rounded-2xl overflow-hidden shadow-inner border border-slate-200 select-none ${theme === 'dark' ? 'bg-[#0f172a]' : 'bg-[#e2e8f0]'}`}>
      {/* SVG Map Lines representing roads */}
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 800 500">
        {/* Grids / Background */}
        {theme === 'dark' ? (
          <>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#1e293b" strokeWidth="1" />
            </pattern>
            <rect width="100%" height="100%" fill="url(#grid)" />
            {/* Water Bodies */}
            <path d="M 0,200 Q 150,180 300,280 T 600,100 T 800,250 L 800,500 L 0,500 Z" fill="#0f2b46" opacity="0.4" />
          </>
        ) : (
          <>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#cbd5e1" strokeWidth="0.8" />
            </pattern>
            <rect width="100%" height="100%" fill="url(#grid)" />
            {/* Water Bodies */}
            <path d="M 0,200 Q 150,180 300,280 T 600,100 T 800,250 L 800,500 L 0,500 Z" fill="#93c5fd" opacity="0.3" />
          </>
        )}

        {/* Major Roads */}
        <g strokeWidth="8" strokeLinecap="round" fill="none" opacity="0.8">
          {/* Main Expressway (Shahrah-e-Faisal) */}
          <path d="M 50,50 Q 300,80 400,250 T 750,450" stroke={colors.Good} />
          {/* Alternative Ring Road */}
          <path d="M 100,450 C 200,300 250,200 450,100 T 700,50" stroke={colors.Minor} />
          {/* Connecting roads */}
          <path d="M 250,70 L 250,300" stroke={colors.Critical} />
          <path d="M 400,250 L 100,300" stroke={colors.Moderate} />
          <path d="M 450,100 L 700,350" stroke={colors.Good} />
        </g>

        {/* Minor Roads */}
        <g strokeWidth="4" strokeLinecap="round" fill="none" opacity="0.6">
          <path d="M 50,200 Q 200,220 300,100" stroke={theme === 'dark' ? '#334155' : '#94a3b8'} />
          <path d="M 300,400 Q 500,450 700,300" stroke={theme === 'dark' ? '#334155' : '#94a3b8'} />
          <path d="M 600,80 L 750,150" stroke={theme === 'dark' ? '#334155' : '#94a3b8'} />
        </g>

        {/* Heatmap overlay (if active) */}
        {activeLayer === 'heatmap' && (
          <g opacity="0.5">
            <circle cx="250" cy="180" r="80" fill="url(#heatRed)" />
            <circle cx="400" cy="250" r="100" fill="url(#heatOrange)" />
            <circle cx="600" cy="300" r="90" fill="url(#heatYellow)" />
            <circle cx="150" cy="350" r="70" fill="url(#heatGreen)" />
          </g>
        )}

        {/* Definitions for Heatmap Gradients */}
        <defs>
          <radialGradient id="heatRed" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ef4444" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#ef4444" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="heatOrange" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#f97316" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#f97316" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="heatYellow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#eab308" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#eab308" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="heatGreen" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#22c55e" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#22c55e" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Live Location Marker (User) */}
        {mode === 'user' && (
          <g>
            <circle cx="400" cy="250" r="22" fill="#3b82f6" fillOpacity="0.2" className="pulse-custom" />
            <circle cx="400" cy="250" r="10" fill="#ffffff" />
            <circle cx="400" cy="250" r="6" fill="#3b82f6" />
          </g>
        )}

        {/* Route Path (Active Direction Highlight) */}
        {hazards.length > 0 && mode === 'user' && (
          <path d="M 400,250 L 250,70 L 200,50" fill="none" stroke="#2563eb" strokeWidth="6" strokeLinecap="round" strokeDasharray="10, 5" />
        )}

        {/* Hazard Pins / Markers */}
        {hazards.map((haz, index) => {
          // Map latitude/longitude to SVG viewport
          // Standard range: Karachi Lat (24.8-24.9), Lng (67.0-67.1)
          // Lahore Lat (31.4-31.5), Lng (74.2-74.4)
          // Let's project them dynamically or use random anchors if out of bounds
          const x = haz.lng ? ((haz.lng - (haz.lng > 70 ? 74.2 : 67.0)) * 2500) + 150 : 200 + (index * 80);
          const y = haz.lat ? (500 - ((haz.lat - (haz.lat > 30 ? 31.4 : 24.8)) * 3000)) - 100 : 150 + (index * 60);

          const pinColor = colors[haz.severity] || colors.Good;

          return (
            <g key={haz.id} className="cursor-pointer group">
              {/* Outer pulsing ring for critical alerts */}
              {haz.severity === 'Critical' && (
                <circle cx={x} cy={y} r="18" fill={pinColor} fillOpacity="0.3" className="pulse-custom" />
              )}
              {/* Pin shape */}
              <path
                d={`M ${x},${y} C ${x - 8},${y - 12} ${x - 12},${y - 20} ${x},${y - 32} C ${x + 12},${y - 20} ${x + 8},${y - 12} ${x},${y} Z`}
                fill={pinColor}
                stroke="#ffffff"
                strokeWidth="1.5"
              />
              {/* Pin Inner Symbol (White exclamation mark or check) */}
              <circle cx={x} cy={y - 20} r="4" fill="#ffffff" />
              {haz.severity === 'Critical' || haz.severity === 'High' ? (
                <rect x={x - 1} y={y - 27} width="2" height="5" fill={pinColor} rx="0.5" />
              ) : (
                <circle cx={x} cy={y - 20} r="2" fill={pinColor} />
              )}

              {/* Hover Tooltip Card */}
              <g className="opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-200">
                <rect x={x - 70} y={y - 80} width="140" height="42" rx="6" fill="#1e293b" opacity="0.95" />
                <text x={x} y={y - 65} fill="#ffffff" fontSize="10" textAnchor="middle" fontWeight="bold">
                  {haz.type}
                </text>
                <text x={x} y={y - 50} fill="#cbd5e1" fontSize="8" textAnchor="middle">
                  {haz.severity} Severity
                </text>
              </g>
            </g>
          );
        })}
      </svg>

      {/* Floating Labels / Map annotations */}
      <div className={`absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-semibold shadow backdrop-blur-md ${theme === 'dark' ? 'bg-slate-900/80 text-blue-400 border border-slate-700' : 'bg-white/80 text-blue-600 border border-slate-200'}`}>
        Live Monitoring Area
      </div>

      {/* Map Controls */}
      <div className="absolute right-4 top-4 flex flex-col gap-2">
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
        <button
          className={`p-2 rounded-lg shadow-md border focus:outline-none transition-colors ${theme === 'dark' ? 'bg-slate-800 border-slate-700 hover:bg-slate-700 text-slate-200' : 'bg-white border-slate-200 hover:bg-slate-100 text-slate-600'}`}
        >
          <IoLocateOutline className="w-5 h-5" />
        </button>
      </div>

      {/* Map Layers Selector */}
      <div className="absolute right-4 bottom-4">
        <button
          onClick={() => setLayersOpen(!layersOpen)}
          className={`flex items-center gap-1 px-3 py-2 rounded-lg shadow-md border focus:outline-none text-xs font-medium transition-colors ${theme === 'dark' ? 'bg-slate-800 border-slate-700 hover:bg-slate-700 text-slate-200' : 'bg-white border-slate-200 hover:bg-slate-100 text-slate-600'}`}
        >
          <IoLayersOutline className="w-4 h-4" />
          <span>Layers</span>
        </button>
        {layersOpen && (
          <div className={`absolute bottom-12 right-0 w-36 rounded-lg shadow-lg border p-2 text-xs flex flex-col gap-1 z-30 ${theme === 'dark' ? 'bg-slate-800 border-slate-700 text-slate-200' : 'bg-white border-slate-200 text-slate-600'}`}>
            <button
              onClick={() => { setActiveLayer('road'); setLayersOpen(false); }}
              className={`text-left p-1 rounded hover:bg-blue-500 hover:text-white transition-colors ${activeLayer === 'road' ? 'bg-blue-600 text-white font-semibold' : ''}`}
            >
              Road Map
            </button>
            <button
              onClick={() => { setActiveLayer('heatmap'); setLayersOpen(false); }}
              className={`text-left p-1 rounded hover:bg-blue-500 hover:text-white transition-colors ${activeLayer === 'heatmap' ? 'bg-blue-600 text-white font-semibold' : ''}`}
            >
              Heatmap
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
