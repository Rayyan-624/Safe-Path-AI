import React from 'react';
import { AreaChart, Area, ResponsiveContainer } from 'recharts';
import {
  IoPulseOutline, IoCheckmarkCircleOutline, IoAlertCircleOutline,
  IoCompassOutline, IoCameraOutline, IoCloudUploadOutline, IoSunnyOutline
} from 'react-icons/io5';

export default function AdminAIMonitoring() {
  
  // Model performance charts data
  const accuracyData = [
    { name: '01:00', acc: 91.5 },
    { name: '02:00', acc: 92.4 },
    { name: '03:00', acc: 91.8 },
    { name: '04:00', acc: 93.2 },
    { name: '05:00', acc: 93.6 },
    { name: '06:00', acc: 93.0 },
    { name: '07:00', acc: 93.6 }
  ];

  const syncLogs = [
    { device: "Driver-104", type: "Honda CG 125", sensor: "GPS + Accel", status: "Synced", time: "Just now", color: "text-green-500 bg-green-500/10" },
    { device: "Driver-208", type: "Toyota Corolla", sensor: "Camera + Gyro", status: "Synced", time: "2s ago", color: "text-green-500 bg-green-500/10" },
    { device: "Driver-095", type: "Suzuki Alto", sensor: "GPS + Accel", status: "Syncing", time: "5s ago", color: "text-blue-500 bg-blue-500/10" },
    { device: "Driver-112", type: "Yamaha YBR", sensor: "GPS only", status: "Synced", time: "12s ago", color: "text-green-500 bg-green-500/10" }
  ];

  return (
    <div className="space-y-6 text-left font-sans text-slate-200">
      
      {/* Page Title Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div>
          <h2 className="text-sm font-extrabold text-white">AI Monitoring</h2>
          <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Real-time monitoring of AI system performance and detection accuracy</p>
        </div>
      </div>

      {/* Top statistics cards row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-400 flex items-center justify-center shrink-0">
            <IoPulseOutline className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Total Scanned</span>
            <span className="block text-2xl font-extrabold text-white">1,248 km</span>
            <span className="text-[9px] font-bold text-green-500">↑ 12% vs last month</span>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-green-500/10 text-green-400 flex items-center justify-center shrink-0">
            <IoCheckmarkCircleOutline className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Avg Confidence</span>
            <span className="block text-2xl font-extrabold text-white">93.6%</span>
            <span className="text-[9px] font-bold text-green-500">↑ 2.4% vs last month</span>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-400 flex items-center justify-center shrink-0">
            <IoCloudUploadOutline className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Active Sensors</span>
            <span className="block text-2xl font-extrabold text-white">1,256</span>
            <span className="text-[9px] font-bold text-green-500">Connected</span>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-red-500/10 text-red-400 flex items-center justify-center shrink-0">
            <IoAlertCircleOutline className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">False Detections</span>
            <span className="block text-2xl font-extrabold text-white">128</span>
            <span className="text-[9px] font-bold text-red-400">10% rate</span>
          </div>
        </div>

      </div>

      {/* Middle row: Live feed & Model metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Live detections feed (Col 1-2) */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-sm flex flex-col justify-between h-[360px]">
          <span className="text-xs font-extrabold text-white border-b border-slate-800 pb-2 block">Live Detections Feed</span>
          
          <div className="divide-y divide-slate-800 flex-1 overflow-y-auto pr-1">
            {[
              { type: "Pothole", id: "HZ-2024-05-18-1023", road: "Shahrah-e-Faisal, Karachi", confidence: "92%", time: "2 mins ago", color: "text-red-400 bg-red-500/10 border-red-500/20", photo: "https://images.unsplash.com/photo-1515162305285-0293e4767cc2?w=100&auto=format&fit=crop" },
              { type: "Road Crack", id: "HZ-2024-05-18-1024", road: "University Road, Karachi", confidence: "88%", time: "5 mins ago", color: "text-orange-400 bg-orange-500/10 border-orange-500/20", photo: "https://images.unsplash.com/photo-1584467541268-b040f83be3fd?w=100&auto=format&fit=crop" },
              { type: "Construction", id: "HZ-2024-05-18-1025", road: "Korangi Crossing, Karachi", confidence: "85%", time: "12 mins ago", color: "text-purple-400 bg-purple-500/10 border-purple-500/20", photo: "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=100&auto=format&fit=crop" }
            ].map((det, i) => (
              <div key={i} className="flex items-center gap-4 py-3 first:pt-1 last:pb-0">
                <div className="w-12 h-12 rounded-xl overflow-hidden border border-slate-800 bg-slate-950 shrink-0">
                  <img src={det.photo} alt={det.type} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 text-left leading-tight">
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-white text-xs block">{det.type}</span>
                    <span className="text-[9px] text-slate-500 font-semibold">{det.id}</span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-semibold block mt-0.5">{det.road}</span>
                  <span className="text-[9px] text-slate-500 font-bold block mt-1">AI Confidence: {det.confidence}</span>
                </div>
                <span className="text-[10px] text-slate-400 font-bold shrink-0">{det.time}</span>
              </div>
            ))}
          </div>
        </div>

        {/* AI Model performance metrics (Col 3) */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-sm flex flex-col justify-between h-[360px]">
          <span className="text-xs font-extrabold text-white border-b border-slate-800 pb-2 block">AI Model Performance</span>
          
          <div className="w-full h-32 py-2 border-b border-slate-800">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={accuracyData} margin={{ top: 10, right: 0, left: -30, bottom: 0 }}>
                <XAxis dataKey="name" stroke="#64748b" fontSize={8} tickLine={false} axisLine={false} />
                <YAxis stroke="#64748b" fontSize={8} tickLine={false} axisLine={false} domain={[90, 95]} />
                <Tooltip />
                <Area type="monotone" dataKey="acc" stroke="#10b981" fill="#10b981" fillOpacity={0.05} strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* KPI list */}
          <div className="grid grid-cols-2 gap-4 text-xs font-semibold text-slate-400 py-2">
            <div><span className="text-[9px] font-bold text-slate-500 block">Training Loss</span><span className="text-white font-extrabold text-sm block mt-0.5">0.015</span></div>
            <div><span className="text-[9px] font-bold text-slate-500 block">Validation Loss</span><span className="text-white font-extrabold text-sm block mt-0.5">0.024</span></div>
            <div><span className="text-[9px] font-bold text-slate-500 block">Precision</span><span className="text-green-400 font-extrabold text-sm block mt-0.5">94.2%</span></div>
            <div><span className="text-[9px] font-bold text-slate-500 block">Recall</span><span className="text-green-400 font-extrabold text-sm block mt-0.5">92.8%</span></div>
          </div>
        </div>

      </div>

      {/* Bottom row: Sensor Sync and Diagnostics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Sensor Sync list (Col 1-2) */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-sm flex flex-col justify-between h-[300px]">
          <span className="text-xs font-extrabold text-white border-b border-slate-800 pb-2 block">Live Sensor Sync Status</span>
          
          <div className="divide-y divide-slate-800 flex-1 overflow-y-auto pr-1 text-xs">
            {syncLogs.map((log, idx) => (
              <div key={idx} className="flex items-center justify-between py-3 first:pt-1 last:pb-0">
                <div className="text-left leading-tight">
                  <span className="font-extrabold text-white block">{log.device}</span>
                  <span className="text-[9px] text-slate-400 font-semibold block mt-0.5">{log.type} • {log.sensor}</span>
                </div>
                <div className="flex items-center gap-3 text-right">
                  <span className={`px-2 py-0.5 text-[8px] font-bold rounded-full uppercase tracking-wider ${log.color}`}>{log.status}</span>
                  <span className="text-[10px] text-slate-400 font-bold whitespace-nowrap">{log.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Diagnostics (Col 3) */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-sm flex flex-col justify-between h-[300px]">
          <span className="text-xs font-extrabold text-white border-b border-slate-800 pb-2 block">AI Diagnostics</span>
          
          <div className="flex-1 flex flex-col gap-4 justify-center text-xs font-semibold text-slate-400">
            <div className="flex justify-between items-center">
              <span>CPU Load</span>
              <div className="flex items-center gap-2">
                <div className="w-24 bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-blue-500 h-full" style={{ width: '45%' }}></div>
                </div>
                <span className="text-white font-extrabold">45%</span>
              </div>
            </div>

            <div className="flex justify-between items-center">
              <span>Memory Usage</span>
              <div className="flex items-center gap-2">
                <div className="w-24 bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-blue-500 h-full" style={{ width: '60%' }}></div>
                </div>
                <span className="text-white font-extrabold">60%</span>
              </div>
            </div>

            <div className="flex justify-between items-center">
              <span>GPU Temp</span>
              <div className="flex items-center gap-2">
                <div className="w-24 bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-red-500 h-full" style={{ width: '68%' }}></div>
                </div>
                <span className="text-white font-extrabold">68°C</span>
              </div>
            </div>

            <div className="flex justify-between items-center">
              <span>Network Latency</span>
              <span className="text-green-400 font-extrabold">12ms</span>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
