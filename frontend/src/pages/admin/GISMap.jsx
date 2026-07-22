import React, { useState } from 'react';
import MapPlaceholder from '../../components/MapPlaceholder';
import { mockHazards } from '../../data/mockData';
import {
  IoSearchOutline, IoRefreshOutline, IoFunnelOutline, IoLayersOutline,
  IoSettingsOutline, IoStatsChartOutline
} from 'react-icons/io5';

export default function AdminGISMap() {
  const [search, setSearch] = useState('');
  
  // Layer states
  const [layers, setLayers] = useState({
    density: true,
    traffic: false,
    quality: true,
    drainage: false
  });

  const [hazards, setHazards] = useState({
    Potholes: true, Cracks: true, Flood: true, Manhole: true, Construction: true
  });

  const [threshold, setThreshold] = useState('All');

  const toggleLayer = (key) => {
    setLayers(l => ({ ...l, [key]: !l[key] }));
  };

  const handleReset = () => {
    setLayers({ density: true, traffic: false, quality: true, drainage: false });
    setHazards({ Potholes: true, Cracks: true, Flood: true, Manhole: true, Construction: true });
    setThreshold('All');
  };

  // Filter coordinates based on selections
  const filteredHazards = mockHazards.filter(h => {
    if (h.type === 'Pothole' && !hazards.Potholes) return false;
    if (h.type === 'Road Crack' && !hazards.Cracks) return false;
    if (h.type === 'Flooded Road' && !hazards.Flood) return false;
    if (h.type === 'Open Manhole' && !hazards.Manhole) return false;
    if (h.type === 'Construction Area' && !hazards.Construction) return false;

    if (threshold !== 'All') {
      if (threshold === 'Critical' && h.severity !== 'Critical') return false;
      if (threshold === 'High' && h.severity !== 'High' && h.severity !== 'Critical') return false;
      if (threshold === 'Moderate' && h.severity !== 'Moderate') return false;
    }
    return true;
  });

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-140px)] font-sans text-left">
      
      {/* Heatmap Area (Left Panel) */}
      <div className="flex-1 bg-white rounded-3xl p-5 border border-slate-100 shadow-sm flex flex-col gap-4 h-full relative">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-50 pb-3">
          <div className="text-left">
            <span className="text-sm font-extrabold text-slate-800">GIS Heatmap</span>
            <p className="text-[10px] text-slate-500 font-semibold mt-0.5">Analyze city-wide hazard distribution and road density</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-green-50 border border-green-100 text-green-700 text-xs font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-ping" />
              <span>Real-time Layer Synced</span>
            </div>
          </div>
        </div>

        {/* Map Container */}
        <div className="flex-1 w-full rounded-2xl overflow-hidden relative border border-slate-100">
          
          {/* Overlay search location */}
          <div className="absolute top-4 left-4 z-10 w-72">
            <div className="relative shadow-md rounded-xl">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <IoSearchOutline className="w-4 h-4" />
              </span>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search district, road or coordinates..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl text-xs border border-transparent focus:ring-1 focus:ring-blue-500 focus:outline-none bg-white text-slate-700 shadow-lg"
              />
            </div>
          </div>

          <MapPlaceholder hazards={filteredHazards} mode="admin" />
        </div>

        {/* Map Legend & Metrics */}
        <div className="flex flex-wrap items-center gap-5 justify-between text-[10px] font-bold text-slate-500 pt-1">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-red-500/20 border border-red-500" />High Density</span>
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-orange-500/20 border border-orange-500" />Moderate Density</span>
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-yellow-500/20 border border-yellow-500" />Low Density</span>
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-green-500/20 border border-green-500" />Safe Zones</span>
          </div>
          <div className="flex items-center gap-1 text-slate-400">
            <IoRefreshOutline className="w-3.5 h-3.5" />
            <span>Map Layers Refresh: Auto</span>
          </div>
        </div>
      </div>

      {/* Layers & Filters Side panel (Right Panel) */}
      <div className="w-full lg:w-72 bg-white rounded-3xl p-5 border border-slate-100 shadow-sm flex flex-col justify-between h-auto lg:h-full gap-6">
        
        <div className="space-y-6 overflow-y-auto pr-1">
          <div className="flex items-center justify-between border-b border-slate-50 pb-2">
            <span className="text-xs font-extrabold text-slate-800 flex items-center gap-1">
              <IoLayersOutline className="w-4.5 h-4.5 text-blue-600" />
              Layers & Filters
            </span>
            <button
              onClick={handleReset}
              className="text-[10px] font-bold text-slate-400 hover:text-slate-600 focus:outline-none"
            >
              Reset
            </button>
          </div>

          {/* 1. Heatmap Layers */}
          <div className="space-y-2.5">
            <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest">Heatmap Layers</span>
            <div className="flex flex-col gap-2">
              {[
                { key: 'density', label: 'Hazard Density Heatmap' },
                { key: 'traffic', label: 'Traffic Flow Overlay' },
                { key: 'quality', label: 'Road Quality Index' },
                { key: 'drainage', label: 'Drainage Hazard Overlay' }
              ].map((layer) => (
                <label key={layer.key} className="flex items-center justify-between p-2.5 rounded-xl border border-slate-100 hover:bg-slate-50 text-xs font-bold text-slate-650 cursor-pointer select-none leading-none">
                  <span>{layer.label}</span>
                  <input
                    type="checkbox"
                    checked={layers[layer.key]}
                    onChange={() => toggleLayer(layer.key)}
                    className="rounded text-blue-600 focus:ring-blue-500 border-slate-300 w-4 h-4 cursor-pointer"
                  />
                </label>
              ))}
            </div>
          </div>

          {/* 2. Hazard Types */}
          <div className="space-y-2.5">
            <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest">Hazard Types Included</span>
            <div className="flex flex-col gap-2">
              {[
                { key: 'Potholes', label: 'Potholes' },
                { key: 'Cracks', label: 'Road Cracks' },
                { key: 'Flood', label: 'Flooded Roads' },
                { key: 'Manhole', label: 'Open Manholes' },
                { key: 'Construction', label: 'Construction Areas' }
              ].map((haz) => (
                <label key={haz.key} className="flex items-center justify-between p-2.5 rounded-xl border border-slate-100 hover:bg-slate-50 text-xs font-bold text-slate-650 cursor-pointer select-none leading-none">
                  <span>{haz.label}</span>
                  <input
                    type="checkbox"
                    checked={hazards[haz.key]}
                    onChange={() => setHazards(h => ({ ...h, [haz.key]: !h[haz.key] }))}
                    className="rounded text-blue-600 focus:ring-blue-500 border-slate-300 w-4 h-4 cursor-pointer"
                  />
                </label>
              ))}
            </div>
          </div>

          {/* 3. Risk Threshold */}
          <div className="space-y-2.5">
            <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest">Risk Threshold</span>
            <div className="flex flex-col gap-2">
              {[
                { id: 'All', label: 'All Risks' },
                { id: 'Critical', label: 'Critical Only' },
                { id: 'High', label: 'High & Critical Risk' },
                { id: 'Moderate', label: 'Moderate Risk' }
              ].map((th) => (
                <label key={th.id} className="flex items-center gap-3 p-2.5 rounded-xl border border-slate-100 hover:bg-slate-50 text-xs font-bold text-slate-600 cursor-pointer select-none">
                  <input
                    type="radio"
                    name="threshold"
                    checked={threshold === th.id}
                    onChange={() => setThreshold(th.id)}
                    className="text-blue-600 focus:ring-blue-500 border-slate-300 w-4 h-4 cursor-pointer"
                  />
                  <span>{th.label}</span>
                </label>
              ))}
            </div>
          </div>

        </div>

        {/* Apply Changes */}
        <button className="w-full py-3 bg-blue-700 hover:bg-blue-800 text-white rounded-xl text-xs font-bold shadow-md hover:shadow-lg transition-all focus:outline-none flex items-center justify-center gap-1 cursor-pointer">
          Apply Changes
        </button>

      </div>

    </div>
  );
}
