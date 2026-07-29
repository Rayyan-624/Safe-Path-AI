import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import MapPlaceholder from '../../components/MapPlaceholder';
import { mockHazards } from '../../data/mockData';
import {
  IoSwapVerticalOutline, IoShieldCheckmarkOutline, IoTimeOutline, IoConstructOutline,
  IoAlertCircleOutline, IoVolumeHighOutline, IoCloseOutline, IoCloseCircleOutline
} from 'react-icons/io5';

export default function DriverNavigation() {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Navigation states
  const [fromLoc, setFromLoc] = useState('Shahrah-e-Faisal, Karachi');
  const [toLoc, setToLoc] = useState('NIPA Chowrangi, Karachi');
  const [routePref, setRoutePref] = useState('safe'); // safe or fast
  const [avoidHazards, setAvoidHazards] = useState({
    Potholes: true, Cracks: false, Flood: true, Construction: true, Manhole: false
  });
  
  const [isNavigating, setIsNavigating] = useState(false);
  const [hazardModal, setHazardModal] = useState(false);
  const [voiceAlerts, setVoiceAlerts] = useState(true);

  // Check URL params for ?hazard=true on load to display Screen 8
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('hazard') === 'true') {
      setHazardModal(true);
      setIsNavigating(true);
    }
  }, [location]);

  const handleSwap = () => {
    const tmp = fromLoc;
    setFromLoc(toLoc);
    setToLoc(tmp);
  };

  const handleStartNavigation = () => {
    setIsNavigating(true);
    // Simulate auto-alerting pothole ahead 1 second later for interactive feel
    setTimeout(() => {
      setHazardModal(true);
    }, 800);
  };

  return (
    <div className="relative space-y-6">
      
      {/* Navigation Layout grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Left Side: Route Planning Form Panel */}
        <div className="lg:col-span-1 bg-white rounded-3xl p-5 border border-slate-100 shadow-sm flex flex-col gap-5 text-left">
          <span className="text-xs font-extrabold text-slate-800 border-b border-slate-50 pb-2">Plan Route</span>
          
          {/* Location inputs with swap button */}
          <div className="relative space-y-3">
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">From</span>
              <input
                type="text"
                value={fromLoc}
                onChange={(e) => setFromLoc(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none bg-slate-50/50"
              />
            </div>
            
            {/* Swap Button */}
            <div className="absolute right-4 top-7 z-10">
              <button
                onClick={handleSwap}
                className="p-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-xl shadow-md focus:outline-none"
              >
                <IoSwapVerticalOutline className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">To</span>
              <input
                type="text"
                value={toLoc}
                onChange={(e) => setToLoc(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none bg-slate-50/50"
              />
            </div>
          </div>

          {/* Route Preferences */}
          <div className="space-y-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Route Preference</span>
            <div className="flex flex-col gap-2">
              <button
                type="button"
                onClick={() => setRoutePref('safe')}
                className={`flex items-center gap-3 p-3 rounded-2xl border text-left focus:outline-none transition-all ${
                  routePref === 'safe'
                    ? 'border-blue-600 bg-blue-50/20 text-blue-600 font-bold ring-1 ring-blue-600'
                    : 'border-slate-100 hover:bg-slate-50 text-slate-600'
                }`}
              >
                <IoShieldCheckmarkOutline className="w-5 h-5" />
                <div className="leading-tight">
                  <span className="text-xs font-bold block">Safe Route</span>
                  <span className="text-[9px] font-semibold text-slate-400">Avoid hazards, recommended</span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setRoutePref('fast')}
                className={`flex items-center gap-3 p-3 rounded-2xl border text-left focus:outline-none transition-all ${
                  routePref === 'fast'
                    ? 'border-blue-600 bg-blue-50/20 text-blue-600 font-bold ring-1 ring-blue-600'
                    : 'border-slate-100 hover:bg-slate-50 text-slate-600'
                }`}
              >
                <IoTimeOutline className="w-5 h-5" />
                <div className="leading-tight">
                  <span className="text-xs font-bold block">Fastest Route</span>
                  <span className="text-[9px] font-semibold text-slate-400">Save travel time</span>
                </div>
              </button>
            </div>
          </div>

          {/* Avoid on route checkboxes */}
          <div className="space-y-2">
            <div className="flex justify-between items-center"><span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Avoid On Route</span><span className="text-[9px] font-bold text-blue-600 cursor-pointer">Edit</span></div>
            <div className="flex flex-wrap gap-2">
              {['Potholes', 'Cracks', 'Flood', 'Construction', 'Manhole'].map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setAvoidHazards(h => ({ ...h, [item]: !h[item] }))}
                  className={`px-3 py-1.5 rounded-full border text-[10px] font-bold focus:outline-none select-none transition-all ${
                    avoidHazards[item]
                      ? 'bg-blue-600 text-white border-blue-600 shadow'
                      : 'bg-slate-50 text-slate-500 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Center: Live Navigation Map Panel (Col 2-3) */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-5 border border-slate-100 shadow-sm flex flex-col gap-4">
          <div className="flex items-center justify-between border-b border-slate-50 pb-2">
            <div className="text-left">
              <span className="text-sm font-extrabold text-slate-800">Navigation</span>
              <p className="text-[10px] text-slate-500 font-semibold mt-0.5">Get real-time directions and drive safely</p>
            </div>
            <span className="px-2 py-0.5 bg-green-100 text-green-700 font-bold text-[8px] rounded-full uppercase tracking-wider">AI Monitoring Active</span>
          </div>

          <div className="w-full h-96 rounded-2xl overflow-hidden relative border border-slate-100 shadow-inner">
            <MapPlaceholder hazards={mockHazards.slice(0, 3)} mode="user" />
          </div>
        </div>

        {/* Right Side: Route Overview & Hazards */}
        <div className="lg:col-span-1 flex flex-col gap-6 text-left">
          
          {/* Route details */}
          <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm space-y-4">
            <span className="text-xs font-extrabold text-slate-800 border-b border-slate-50 pb-2 block">Route Overview</span>
            
            <div className="space-y-2">
              <div className={`p-3 rounded-2xl border text-xs font-bold ${routePref === 'safe' ? 'border-green-200 bg-green-50/10' : 'border-slate-100'}`}>
                <div className="flex justify-between items-center"><span className="text-green-700">Safe Route (Recommended)</span><span className="text-slate-800 text-sm">24 min</span></div>
                <div className="flex justify-between items-center text-[10px] text-slate-400 font-medium mt-1"><span>12.4 km</span><span>ETA 10:24 AM</span></div>
              </div>

              <div className={`p-3 rounded-2xl border text-xs font-bold ${routePref === 'fast' ? 'border-green-200 bg-green-50/10' : 'border-slate-100'}`}>
                <div className="flex justify-between items-center"><span>Fastest Route</span><span className="text-slate-800 text-sm">21 min</span></div>
                <div className="flex justify-between items-center text-[10px] text-slate-400 font-medium mt-1"><span>13.7 km</span><span>ETA 10:21 AM</span></div>
              </div>
            </div>
          </div>

          {/* Hazards on route list */}
          <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm flex flex-col gap-3 flex-1">
            <div className="flex items-center justify-between border-b border-slate-50 pb-2">
              <span className="text-xs font-extrabold text-slate-800">Hazards on Your Route</span>
              <span className="text-[10px] font-bold text-blue-600 hover:underline cursor-pointer" onClick={() => navigate('/driver/map')}>View All</span>
            </div>

            <div className="space-y-3 flex-1 overflow-y-auto max-h-48 pr-1">
              {[
                { type: "Pothole Detected", severity: "High Risk", text: "1.2 km ahead", color: "text-red-600 bg-red-50" },
                { type: "Road Construction", severity: "Moderate Risk", text: "3.4 km ahead", color: "text-orange-500 bg-orange-50/50" },
                { type: "Open Manhole", severity: "Minor Risk", text: "5.6 km ahead", color: "text-yellow-600 bg-yellow-50" }
              ].map((haz, idx) => (
                <div key={idx} className="flex justify-between items-center p-2.5 rounded-xl border border-slate-100">
                  <div className="text-left">
                    <span className="text-xs font-bold text-slate-800 block">{haz.type}</span>
                    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${haz.color} inline-block mt-0.5`}>{haz.severity}</span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-semibold">{haz.text}</span>
                </div>
              ))}
            </div>

            {/* Bottom route summary & Action button */}
            <div className="border-t border-slate-100 pt-3 space-y-3">
              <div className="grid grid-cols-4 gap-2 text-center text-[10px] font-bold text-slate-500">
                <div className="bg-slate-50 p-2 rounded-xl flex flex-col items-center justify-center">
                  <span className="text-xs mb-0.5">⏱️</span>
                  <span className="text-slate-800 font-extrabold text-[11px] block">24 min</span>
                  <span className="text-[8px] text-slate-400 font-medium">ETA 10:24</span>
                </div>
                <div className="bg-slate-50 p-2 rounded-xl flex flex-col items-center justify-center">
                  <span className="text-xs mb-0.5">🛣️</span>
                  <span className="text-slate-800 font-extrabold text-[11px] block">12.4 km</span>
                  <span className="text-[8px] text-slate-400 font-medium">Distance</span>
                </div>
                <div className="bg-slate-50 p-2 rounded-xl flex flex-col items-center justify-center">
                  <span className="text-xs mb-0.5">⚠️</span>
                  <span className="text-red-500 font-extrabold text-[11px] block">3</span>
                  <span className="text-[8px] text-slate-400 font-medium">Hazards</span>
                </div>
                <div className="bg-slate-50 p-2 rounded-xl flex flex-col items-center justify-center">
                  <span className="text-xs mb-0.5">🏎️</span>
                  <span className="text-slate-800 font-extrabold text-[11px] block">48 km/h</span>
                  <span className="text-[8px] text-slate-400 font-medium">Speed</span>
                </div>
              </div>

              <button
                onClick={handleStartNavigation}
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md hover:shadow-lg transition-all focus:outline-none flex items-center justify-center gap-1 cursor-pointer"
              >
                <span>{isNavigating ? 'Continue Navigation' : 'Start Navigation'}</span>
                <span>→</span>
              </button>
            </div>

          </div>

        </div>

      </div>

      {/* Pothole Ahead Alert Modal Overlay (Screen 8) */}
      {hazardModal && (
        <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-sm z-50 flex items-center justify-center p-6 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl shadow-2xl p-6 w-full max-w-sm border border-slate-100 text-center relative space-y-5 animate-in zoom-in-95 duration-200">
            {/* Close Button */}
            <button
              onClick={() => setHazardModal(false)}
              className="absolute top-4 right-4 p-1.5 rounded-xl hover:bg-slate-100 text-slate-400 focus:outline-none"
            >
              <IoCloseOutline className="w-5 h-5" />
            </button>

            {/* Main Warning Graphic */}
            <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto text-red-500 border border-red-200 shadow-inner">
              <IoAlertCircleOutline className="w-9 h-9 animate-bounce" />
            </div>

            <div className="space-y-1">
              <h3 className="text-lg font-extrabold text-slate-800">Pothole Ahead</h3>
              <p className="text-slate-500 text-xs font-semibold">Please drive carefully and slow down</p>
            </div>

            {/* Warning details */}
            <div className="space-y-2.5 bg-slate-50 border border-slate-100 rounded-2xl p-4 text-xs font-bold text-slate-600">
              <div className="flex items-center justify-between">
                <span>Distance</span>
                <span className="text-red-500">250 m ahead</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Severity</span>
                <span className="text-red-500 uppercase tracking-wide">High</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Recommended Speed</span>
                <span className="text-orange-500">20 km/h</span>
              </div>
            </div>

            {/* Voice alert toggle */}
            <div className="flex items-center justify-between p-3 border border-slate-100 rounded-2xl">
              <div className="flex items-center gap-2">
                <IoVolumeHighOutline className="w-4 h-4 text-blue-600" />
                <span className="text-[10px] font-bold text-slate-700">Voice Alert</span>
              </div>
              <button
                type="button"
                onClick={() => setVoiceAlerts(!voiceAlerts)}
                className={`w-10 h-5.5 rounded-full transition-colors relative focus:outline-none ${voiceAlerts ? 'bg-blue-600' : 'bg-slate-200'}`}
              >
                <span className={`absolute top-0.5 left-0.5 w-4.5 h-4.5 rounded-full bg-white transition-transform ${voiceAlerts ? 'translate-x-4.5' : ''}`} />
              </button>
            </div>

            {/* Dismiss action */}
            <button
              onClick={() => setHazardModal(false)}
              className="w-full py-3 border border-slate-200 hover:bg-slate-50 text-slate-800 rounded-xl text-xs font-bold transition-all focus:outline-none cursor-pointer"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
