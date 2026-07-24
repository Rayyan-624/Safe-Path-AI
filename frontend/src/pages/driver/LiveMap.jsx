import React, { useState } from 'react';
import { mockHazards } from '../../data/mockData';
import MapPlaceholder from '../../components/MapPlaceholder';
import { IoSearchOutline, IoRefreshOutline, IoFunnelOutline, IoCheckmarkCircleOutline } from 'react-icons/io5';
import { useHazards } from '../../context/HazardContext';

export default function DriverLiveMap() {
  const { geojson, loading } = useHazards();
  const [searchQuery, setSearchQuery] = useState('');
  const [hazardFilters, setHazardFilters] = useState({
    Potholes: true,
    Cracks: true,
    Flood: true,
    Construction: true,
    Manhole: true,
  });
  const [riskLevel, setRiskLevel] = useState('All');

  const toggleFilter = (key) => {
    setHazardFilters(f => ({ ...f, [key]: !f[key] }));
  };

  const handleReset = () => {
    setHazardFilters({ Potholes: true, Cracks: true, Flood: true, Construction: true, Manhole: true });
    setRiskLevel('All');
  };

  // Convert GeoJSON to standard hazard structure
  const rawHazards = geojson?.features?.map(f => ({
    id: f.properties.hazard_id,
    type: f.properties.hazard_type,
    severity: f.properties.severity,
    confidence: f.properties.confidence,
    lat: f.geometry.coordinates[1],
    lng: f.geometry.coordinates[0],
    crowdsource_count: f.properties.crowdsource_count,
    is_verified: f.properties.is_verified,
    status: f.properties.status,
    created_at: f.properties.created_at
  })) || [];

  const activeHazardsList = rawHazards.length > 0 ? rawHazards : mockHazards;

  // Filter hazards
  const filteredHazards = activeHazardsList.filter(h => {
    // Hazard type filtering
    if (h.type === 'Pothole' && !hazardFilters.Potholes) return false;
    if (h.type === 'Road Crack' && !hazardFilters.Cracks) return false;
    if (h.type === 'Flooded Road' && !hazardFilters.Flood) return false;
    if (h.type === 'Construction Area' && !hazardFilters.Construction) return false;
    if (h.type === 'Open Manhole' && !hazardFilters.Manhole) return false;

    // Severity level filtering
    if (riskLevel !== 'All') {
      if (riskLevel === 'Critical' && h.severity !== 'Critical') return false;
      if (riskLevel === 'Moderate' && h.severity !== 'High' && h.severity !== 'Moderate') return false;
      if (riskLevel === 'Minor' && h.severity !== 'Medium' && h.severity !== 'Low') return false;
    }
    return true;
  });

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-140px)]">
      
      {/* Central Map Canvas Panel */}
      <div className="flex-1 bg-white rounded-3xl p-5 border border-slate-100 shadow-sm flex flex-col gap-4 h-full relative">
        {/* Map Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-50 pb-3">
          <div className="text-left">
            <span className="text-sm font-extrabold text-slate-800">Live Road Map</span>
            <p className="text-[10px] text-slate-500 font-semibold mt-0.5">Real-time road conditions and hazard updates</p>
          </div>
          <div className="flex items-center gap-2 text-xs font-bold">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-green-50 border border-green-100 text-green-700">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-ping" />
              <span>Live Updates: Just now</span>
            </div>
          </div>
        </div>

        {/* The Map Component */}
        <div className="flex-1 w-full rounded-2xl overflow-hidden relative border border-slate-100">
          
          {/* Overlay Search Input bar */}
          <div className="absolute top-4 left-4 z-10 w-72">
            <div className="relative shadow-md rounded-xl">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <IoSearchOutline className="w-4 h-4" />
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search location..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl text-xs border border-transparent focus:ring-1 focus:ring-blue-500 focus:outline-none bg-white text-slate-700 shadow-lg"
              />
            </div>
          </div>

          <MapPlaceholder hazards={filteredHazards} mode="user" />
        </div>

        {/* Map Legend Overlay at Bottom */}
        <div className="flex flex-wrap items-center gap-5 justify-between text-[10px] font-bold text-slate-500 pt-1">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-green-500"></span>Safe Road</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-yellow-500"></span>Minor Hazard</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-orange-500"></span>Moderate Hazard</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-red-500"></span>Critical Hazard</span>
          </div>
          <div className="flex items-center gap-1 text-slate-400">
            <IoRefreshOutline className="w-3.5 h-3.5" />
            <span>Live Data Updates</span>
          </div>
        </div>
      </div>

      {/* Right Filters Panel Sidebar */}
      <div className="w-full lg:w-72 bg-white rounded-3xl p-5 border border-slate-100 shadow-sm flex flex-col gap-6 h-auto lg:h-full justify-between">
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-slate-50 pb-2">
            <span className="text-xs font-extrabold text-slate-800 flex items-center gap-1">
              <IoFunnelOutline className="w-4 h-4 text-blue-600" />
              Filters
            </span>
            <button
              onClick={handleReset}
              className="text-[10px] font-bold text-slate-400 hover:text-slate-600 focus:outline-none"
            >
              Reset
            </button>
          </div>

          {/* Hazard Types Checklist */}
          <div className="space-y-3">
            <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest text-left">Hazard Types</span>
            <div className="flex flex-col gap-2">
              {[
                { key: 'Potholes', label: 'Potholes', color: 'border-red-200 text-red-700 bg-red-50/20' },
                { key: 'Cracks', label: 'Cracks', color: 'border-purple-200 text-purple-700 bg-purple-50/20' },
                { key: 'Flood', label: 'Flood/Water', color: 'border-blue-200 text-blue-700 bg-blue-50/20' },
                { key: 'Construction', label: 'Construction', color: 'border-orange-200 text-orange-700 bg-orange-50/20' },
                { key: 'Manhole', label: 'Open Manholes', color: 'border-amber-200 text-amber-700 bg-amber-50/20' }
              ].map((item) => (
                <label key={item.key} className={`flex items-center justify-between p-2.5 rounded-xl border text-xs font-bold cursor-pointer select-none leading-none hover:bg-slate-50 transition-colors ${item.color}`}>
                  <span>{item.label}</span>
                  <input
                    type="checkbox"
                    checked={hazardFilters[item.key]}
                    onChange={() => toggleFilter(item.key)}
                    className="rounded text-blue-600 focus:ring-blue-500 border-slate-300 w-4 h-4 cursor-pointer"
                  />
                </label>
              ))}
            </div>
          </div>

          {/* Risk Level Radios */}
          <div className="space-y-3">
            <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest text-left">Risk Level</span>
            <div className="flex flex-col gap-2">
              {[
                { id: 'All', label: 'All Levels', color: 'border-slate-200 text-slate-700' },
                { id: 'Critical', label: 'Critical Risk', color: 'border-red-200 text-red-600 bg-red-50/10' },
                { id: 'Moderate', label: 'Moderate Risk', color: 'border-orange-200 text-orange-500 bg-orange-50/10' },
                { id: 'Minor', label: 'Minor Risk', color: 'border-yellow-200 text-yellow-600 bg-yellow-50/10' }
              ].map((item) => (
                <label key={item.id} className="flex items-center gap-3 p-2.5 rounded-xl border border-slate-100 hover:bg-slate-50 text-xs font-bold text-slate-600 cursor-pointer select-none">
                  <input
                    type="radio"
                    name="risk"
                    checked={riskLevel === item.id}
                    onChange={() => setRiskLevel(item.id)}
                    className="text-blue-600 focus:ring-blue-500 border-slate-300 w-4 h-4 cursor-pointer"
                  />
                  <span>{item.label}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Apply Filters */}
        <button className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md hover:shadow-lg transition-all focus:outline-none flex items-center justify-center gap-1 cursor-pointer">
          Apply Filters
        </button>
      </div>

    </div>
  );
}
