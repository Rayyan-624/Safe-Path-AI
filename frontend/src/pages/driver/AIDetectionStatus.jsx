import React from 'react';
import { AreaChart, Area, ResponsiveContainer } from 'recharts';
import {
  IoPulseOutline, IoSpeedometerOutline, IoCompassOutline, IoCameraOutline,
  IoCloudUploadOutline, IoCheckmarkCircleOutline, IoAlertCircleOutline,
  IoInformationCircleOutline
} from 'react-icons/io5';

export default function DriverAIDetectionStatus() {
  
  // Mock sparkline details for sensors
  const accelData = [{ v: 0.3 }, { v: 0.4 }, { v: 0.35 }, { v: 0.5 }, { v: 0.35 }, { v: 0.45 }, { v: 0.35 }];
  const gyroData = [{ v: 2.0 }, { v: 2.5 }, { v: 1.8 }, { v: 2.8 }, { v: 2.15 }, { v: 2.6 }, { v: 2.15 }];
  const gpsData = [{ v: 40 }, { v: 43 }, { v: 42 }, { v: 46 }, { v: 45 }, { v: 44 }, { v: 45 }];

  return (
    <div className="space-y-6 text-left font-sans">
      
      {/* Real-time Status Alert Banner */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-slate-900 text-white rounded-3xl p-6 shadow-md flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
        {/* Abstract road vector background */}
        <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-15 hidden md:block">
          <svg className="w-full h-full text-white" viewBox="0 0 100 100" fill="currentColor">
            <path d="M 0,100 L 40,0 L 60,0 L 100,100 Z" />
          </svg>
        </div>

        <div className="flex items-center gap-4 relative z-10">
          <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center border border-white/25">
            <IoCheckmarkCircleOutline className="w-7 h-7 text-white" />
          </div>
          <div>
            <h3 className="text-base font-extrabold">All systems operational</h3>
            <p className="text-xs text-blue-200">Your device is actively monitoring road conditions</p>
          </div>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-500/20 border border-red-500/30 text-red-100 font-extrabold text-[10px] uppercase tracking-wider relative z-10">
          <span className="w-2 h-2 bg-red-500 rounded-full animate-ping" />
          <span>Live Telemetry</span>
        </div>
      </div>

      {/* Row of 5 Sensor Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
        
        {/* Accelerometer */}
        <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm flex flex-col justify-between h-48">
          <div className="flex items-center justify-between border-b border-slate-50 pb-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Accelerometer</span>
            <span className="px-2 py-0.5 bg-green-50 text-green-700 text-[8px] font-bold rounded-full uppercase tracking-wider">Active</span>
          </div>
          {/* Sparkline */}
          <div className="w-full h-10 my-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={accelData}>
                <Area type="monotone" dataKey="v" stroke="#10b981" fill="#10b981" fillOpacity={0.1} strokeWidth={1.5} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div>
            <span className="text-xl font-extrabold text-slate-800">0.35 g</span>
            <p className="text-[9px] text-slate-400 font-semibold mt-0.5">Vibration Level</p>
          </div>
          <span className="text-[10px] font-bold text-green-600 bg-green-50 rounded-xl px-2.5 py-1 text-center w-full block mt-2 border border-green-100/50">Status: Normal</span>
        </div>

        {/* Gyroscope */}
        <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm flex flex-col justify-between h-48">
          <div className="flex items-center justify-between border-b border-slate-50 pb-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Gyroscope</span>
            <span className="px-2 py-0.5 bg-green-50 text-green-700 text-[8px] font-bold rounded-full uppercase tracking-wider">Active</span>
          </div>
          {/* Sparkline */}
          <div className="w-full h-10 my-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={gyroData}>
                <Area type="monotone" dataKey="v" stroke="#a855f7" fill="#a855f7" fillOpacity={0.1} strokeWidth={1.5} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div>
            <span className="text-xl font-extrabold text-slate-800">2.15 °/s</span>
            <p className="text-[9px] text-slate-400 font-semibold mt-0.5">Rotation Speed</p>
          </div>
          <span className="text-[10px] font-bold text-green-600 bg-green-50 rounded-xl px-2.5 py-1 text-center w-full block mt-2 border border-green-100/50">Status: Normal</span>
        </div>

        {/* GPS */}
        <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm flex flex-col justify-between h-48">
          <div className="flex items-center justify-between border-b border-slate-50 pb-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">GPS Sensor</span>
            <span className="px-2 py-0.5 bg-green-50 text-green-700 text-[8px] font-bold rounded-full uppercase tracking-wider">Active</span>
          </div>
          {/* Sparkline */}
          <div className="w-full h-10 my-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={gpsData}>
                <Area type="monotone" dataKey="v" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.1} strokeWidth={1.5} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div>
            <span className="text-xl font-extrabold text-slate-800">45 km/h</span>
            <p className="text-[9px] text-slate-400 font-semibold mt-0.5">Current Speed</p>
          </div>
          <span className="text-[10px] font-bold text-blue-600 bg-blue-50 rounded-xl px-2.5 py-1 text-center w-full block mt-2 border border-blue-100/50">Status: Good</span>
        </div>

        {/* Camera */}
        <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm flex flex-col justify-between h-48">
          <div className="flex items-center justify-between border-b border-slate-50 pb-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Road Camera</span>
            <span className="px-2 py-0.5 bg-green-50 text-green-700 text-[8px] font-bold rounded-full uppercase tracking-wider">Active</span>
          </div>
          {/* Mini road photo */}
          <div className="w-full h-14 rounded-xl overflow-hidden border border-slate-200 shadow-inner relative my-1">
            <img src="https://images.unsplash.com/photo-1515162305285-0293e4767cc2?w=200&auto=format&fit=crop&q=80" alt="camera feed" className="w-full h-full object-cover" />
            <span className="absolute bottom-1 right-1 px-1 bg-black/60 text-white text-[7px] rounded">Feed</span>
          </div>
          <div>
            <span className="text-sm font-extrabold text-slate-800">Objects Detected: 2</span>
            <p className="text-[9px] text-slate-400 font-semibold">Potholes detected</p>
          </div>
          <span className="text-[10px] font-bold text-orange-600 bg-orange-50 rounded-xl px-2.5 py-1 text-center w-full block mt-2 border border-orange-100/50">Status: Monitoring</span>
        </div>

        {/* Cloud Sync */}
        <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm flex flex-col justify-between h-48">
          <div className="flex items-center justify-between border-b border-slate-50 pb-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Cloud Sync</span>
            <span className="px-2 py-0.5 bg-blue-50 text-blue-700 text-[8px] font-bold rounded-full uppercase tracking-wider">Connected</span>
          </div>
          <div className="w-full flex justify-center py-2 text-blue-600 animate-pulse">
            <IoCloudUploadOutline className="w-10 h-10" />
          </div>
          <div>
            <span className="text-xl font-extrabold text-slate-800">100%</span>
            <p className="text-[9px] text-slate-400 font-semibold mt-0.5">Last synced: Just now</p>
          </div>
          <span className="text-[10px] font-bold text-green-600 bg-green-50 rounded-xl px-2.5 py-1 text-center w-full block mt-2 border border-green-100/50">Status: Synced</span>
        </div>

      </div>

      {/* Detail Analysis and Gauges */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* AI Detection pipeline list (Col 1-2) */}
        <div className="lg:col-span-2 bg-slate-900 text-slate-200 rounded-3xl p-6 shadow-lg flex flex-col md:flex-row gap-8 items-center border border-slate-800">
          
          <div className="flex-1 space-y-4">
            <div className="text-left border-b border-slate-800 pb-2">
              <span className="text-sm font-extrabold text-white">AI Detection Running</span>
              <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Our AI is continuously analyzing data to detect road hazards</p>
            </div>

            <div className="space-y-2.5">
              {[
                { step: "Data Collection", desc: "Receiving sensor data" },
                { step: "Feature Extraction", desc: "Analyzing patterns" },
                { step: "Hazard Detection", desc: "Scanning for anomalies" },
                { step: "Risk Assessment", desc: "Calculating severity" },
                { step: "Alert Generation", desc: "Updating system" }
              ].map((item, idx) => (
                <div key={idx} className="flex items-center gap-3 text-xs leading-none">
                  <div className="w-4 h-4 rounded-full bg-green-500 text-slate-900 flex items-center justify-center font-bold text-[9px]">✓</div>
                  <div>
                    <span className="font-bold text-slate-100 block">{item.step}</span>
                    <span className="text-[9px] text-slate-500 font-semibold">{item.desc}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* AI Engine circular gauge */}
          <div className="w-48 h-48 relative flex items-center justify-center">
            {/* Pulsing visual glow ring */}
            <div className="absolute inset-0 rounded-full border-4 border-dashed border-blue-500/30 animate-spin-slow"></div>
            <div className="absolute inset-4 rounded-full border-2 border-blue-500/50 flex flex-col items-center justify-center bg-slate-950 p-4">
              <span className="text-[10px] font-bold text-blue-400 uppercase tracking-widest leading-none">AI Engine</span>
              <span className="text-2xl font-extrabold text-green-500 tracking-wide mt-1.5 mb-1 text-center">Active</span>
              <span className="text-[8px] text-slate-500 text-center font-semibold max-w-[80px] leading-tight">Scanning road conditions...</span>
            </div>
          </div>
        </div>

        {/* Live detection summary telemetry (Col 3) */}
        <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm flex flex-col justify-between gap-4">
          <span className="text-xs font-extrabold text-slate-800 border-b border-slate-50 pb-2 block">Live Detection Summary</span>
          
          <div className="space-y-3.5 text-xs font-semibold text-slate-500">
            <div className="flex justify-between items-center">
              <span>Road Segments Analyzed</span>
              <span className="text-slate-800 font-extrabold">1.24 km</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Potential Hazards</span>
              <span className="text-red-500 font-extrabold">2</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Last Hazard Detected</span>
              <span className="text-slate-800 font-extrabold">1.2 km ago</span>
            </div>
            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <span>AI Confidence</span>
                <span className="text-green-600 font-extrabold">92%</span>
              </div>
              <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                <div className="bg-green-500 h-full" style={{ width: '92%' }}></div>
              </div>
            </div>
            <div className="flex justify-between items-center pt-1 border-t border-slate-50">
              <span>System Uptime</span>
              <span className="text-slate-800 font-bold tracking-wider">02:45:18</span>
            </div>
          </div>
        </div>

      </div>

      {/* Alert info bar footer */}
      <div className="bg-slate-50 border border-slate-100 p-4 rounded-3xl flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <IoInformationCircleOutline className="w-5 h-5 text-blue-600 flex-shrink-0" />
          <span className="text-xs font-semibold text-slate-600">
            AI is learning and improving! The more you drive, the smarter our detection becomes.
          </span>
        </div>
        <button className="px-4 py-2 border border-slate-200 hover:bg-slate-100 text-slate-700 rounded-xl text-xs font-bold focus:outline-none">
          Learn More
        </button>
      </div>

    </div>
  );
}
