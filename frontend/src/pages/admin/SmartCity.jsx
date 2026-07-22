import React, { useState } from 'react';
import MapPlaceholder from '../../components/MapPlaceholder';
import { mockHazards } from '../../data/mockData';
import {
  IoPulseOutline, IoCheckmarkCircleOutline, IoWifiOutline, IoThermometerOutline,
  IoSettingsOutline, IoStatsChartOutline, IoConstructOutline, IoHardwareChipOutline
} from 'react-icons/io5';
import { AreaChart, Area, ResponsiveContainer, XAxis, YAxis } from 'recharts';

export default function AdminSmartCity() {
  const [controls, setControls] = useState({
    lights: true,
    floods: true,
    heating: false,
    dimming: true
  });

  const iotDevices = [
    { id: "TL-045", name: "Traffic Light Node", loc: "Shahrah-e-Faisal x Korangi", status: "Online", latency: "8ms", color: "text-green-500 bg-green-500/10" },
    { id: "VS-102", name: "Road Vibration Sensor", loc: "NIPA Chowrangi Flyover", status: "Online", latency: "12ms", color: "text-green-500 bg-green-500/10" },
    { id: "WG-088", name: "Water Level Gauge", loc: "University Road Underpass", status: "Online", latency: "15ms", color: "text-green-500 bg-green-500/10" },
    { id: "AQ-204", name: "Air Quality Sensor", loc: "Gulshan Chowrangi", status: "Offline", latency: "—", color: "text-slate-400 bg-slate-100" }
  ];

  const trafficData = [
    { time: '08:00', flow: 85 },
    { time: '10:00', flow: 70 },
    { time: '12:00', flow: 60 },
    { time: '14:00', flow: 65 },
    { time: '16:00', flow: 80 },
    { time: '18:00', flow: 90 },
    { time: '20:00', flow: 75 }
  ];

  return (
    <div className="space-y-6 text-left font-sans text-slate-800">
      
      {/* Top Banner Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        
        <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center shrink-0"><IoWifiOutline className="w-6 h-6" /></div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Smart Infrastructure Sync</span>
            <span className="block text-2xl font-extrabold text-slate-800">98%</span>
            <span className="text-[9px] font-bold text-green-600">All systems sync active</span>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0"><IoHardwareChipOutline className="w-6 h-6" /></div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">IoT Connected Sensors</span>
            <span className="block text-2xl font-extrabold text-slate-800">1,248</span>
            <span className="text-[9px] font-bold text-green-600">Active telemetry feeds</span>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0"><IoPulseOutline className="w-6 h-6" /></div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Avg Network Latency</span>
            <span className="block text-2xl font-extrabold text-slate-800">12ms</span>
            <span className="text-[9px] font-bold text-indigo-600">Ultra-low latency</span>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-green-50 text-green-700 flex items-center justify-center shrink-0"><IoCheckmarkCircleOutline className="w-6 h-6" /></div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">System Uptime</span>
            <span className="block text-2xl font-extrabold text-slate-800">99.9%</span>
            <span className="text-[9px] font-bold text-green-600">Cloud servers active</span>
          </div>
        </div>

      </div>

      {/* Row 1: Digital Twin Map & IoT List */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Digital Twin Map (Col 1-2) */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-5 border border-slate-100 shadow-sm flex flex-col justify-between h-[380px]">
          <span className="text-xs font-extrabold text-slate-800 border-b border-slate-50 pb-2 block">Digital Twin Road Grid</span>
          <div className="w-full h-72 rounded-2xl overflow-hidden border border-slate-150 relative">
            <MapPlaceholder hazards={mockHazards} mode="admin" />
          </div>
        </div>

        {/* IoT Node List (Col 3) */}
        <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm flex flex-col justify-between h-[380px]">
          <span className="text-xs font-extrabold text-slate-800 border-b border-slate-50 pb-2 block">IoT Connected Nodes</span>
          
          <div className="divide-y divide-slate-100 flex-1 overflow-y-auto pr-1 text-xs">
            {iotDevices.map((dev, i) => (
              <div key={i} className="flex items-center justify-between py-3 first:pt-1 last:pb-0">
                <div className="text-left leading-tight">
                  <span className="font-extrabold text-slate-800 block">{dev.name}</span>
                  <span className="text-[9px] text-slate-400 font-semibold block mt-0.5">{dev.id} • {dev.loc}</span>
                </div>
                <div className="flex items-center gap-3 text-right">
                  <span className={`px-2 py-0.5 text-[8px] font-bold rounded-full uppercase tracking-wider ${dev.color}`}>{dev.status}</span>
                  <span className="text-[10px] text-slate-400 font-bold whitespace-nowrap">{dev.latency}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Row 2: Traffic chart & Controls checklist */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Traffic Flow chart */}
        <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm flex flex-col justify-between h-72">
          <span className="text-xs font-extrabold text-slate-800 border-b border-slate-50 pb-2 block">Traffic Flow Projections</span>
          
          <div className="w-full h-44 pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trafficData} margin={{ top: 10, right: 10, left: -30, bottom: 0 }}>
                <XAxis dataKey="time" stroke="#64748b" fontSize={9} tickLine={false} axisLine={false} />
                <YAxis stroke="#64748b" fontSize={9} tickLine={false} axisLine={false} />
                <Tooltip />
                <Area type="monotone" dataKey="flow" name="Flow Rate" stroke="#14b8a6" fill="#14b8a6" fillOpacity={0.05} strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Controls checklist */}
        <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm flex flex-col justify-between h-72">
          <span className="text-xs font-extrabold text-slate-800 border-b border-slate-50 pb-2 block">Smart Infrastructure Controls</span>
          
          <div className="flex-1 flex flex-col gap-4 justify-center text-xs font-bold text-slate-650">
            {[
              { key: "lights", title: "Auto-adjust traffic lights", desc: "Change timings based on road congestion" },
              { key: "floods", title: "Auto-trigger flood alerts", desc: "Activate warning boards when water level rises" },
              { key: "heating", title: "Enable road heating", desc: "Warm road surface to prevent frost (disabled)" },
              { key: "dimming", title: "Smart Street Light Dimming", desc: "Lower power during low traffic hours" }
            ].map((item) => (
              <div key={item.key} className="flex items-center justify-between">
                <div className="text-left leading-tight">
                  <span className="text-xs font-bold text-slate-800 block">{item.title}</span>
                  <span className="text-[9px] text-slate-400 font-semibold block mt-0.5">{item.desc}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setControls(c => ({ ...c, [item.key]: !c[item.key] }))}
                  className={`w-10 h-5.5 rounded-full transition-colors relative focus:outline-none flex-shrink-0 ${controls[item.key] ? 'bg-teal-600' : 'bg-slate-200'}`}
                >
                  <span className={`absolute top-0.5 left-0.5 w-4.5 h-4.5 rounded-full bg-white transition-transform ${controls[item.key] ? 'translate-x-4.5' : ''}`} />
                </button>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
