import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { mockHazards } from '../../data/mockData';
import {
  IoGridOutline, IoStatsChartOutline, IoAlertCircleOutline, IoPulseOutline,
  IoCalendarOutline, IoChevronForwardOutline, IoFunnelOutline, IoCloudDownloadOutline
} from 'react-icons/io5';

export default function DriverDetectionHistory() {
  const navigate = useNavigate();

  const [search, setSearch] = useState('');
  const [hazardType, setHazardType] = useState('All');
  const [severity, setSeverity] = useState('All');

  // Hardcode matching Screen 13 timeline items
  const timelineDetections = [
    {
      id: "HZ-1",
      time: "10:45 AM",
      date: "24 May 2024",
      tag: "Just now",
      type: "Pothole Detected",
      severity: "High Risk",
      desc: "Large pothole detected in left lane.",
      labels: ["AI Detection", "Auto Detected"],
      confidence: "96%",
      location: "Shahrah-e-Faisal, Near Teen Hatti, Karachi",
      coords: "24.8607° N, 67.0099° E",
      color: "border-red-500 bg-red-50 text-red-600",
      nodeColor: "bg-red-500 shadow-red-500/50",
      photo: "https://images.unsplash.com/photo-1515162305285-0293e4767cc2?w=200&auto=format&fit=crop&q=80"
    },
    {
      id: "HZ-2",
      time: "09:32 AM",
      date: "24 May 2024",
      tag: "",
      type: "Road Crack Detected",
      severity: "Medium Risk",
      desc: "Multiple longitudinal cracks detected.",
      labels: ["AI Detection", "Auto Detected"],
      confidence: "88%",
      location: "University Road, Karachi",
      coords: "24.8921° N, 67.0345° E",
      color: "border-orange-200 bg-orange-50 text-orange-600",
      nodeColor: "bg-orange-500 shadow-orange-500/50",
      photo: "https://images.unsplash.com/photo-1584467541268-b040f83be3fd?w=200&auto=format&fit=crop&q=80"
    },
    {
      id: "HZ-3",
      time: "08:15 AM",
      date: "24 May 2024",
      tag: "",
      type: "Road Construction",
      severity: "Medium Risk",
      desc: "Ongoing road construction ahead.",
      labels: ["AI Detection", "Auto Detected"],
      confidence: "85%",
      location: "Korangi Crossing, Karachi",
      coords: "24.8210° N, 67.1023° E",
      color: "border-orange-200 bg-orange-50 text-orange-600",
      nodeColor: "bg-orange-500 shadow-orange-500/50",
      photo: "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=200&auto=format&fit=crop&q=80"
    },
    {
      id: "HZ-4",
      time: "Yesterday",
      date: "23 May 2024",
      tag: "11:20 PM",
      type: "Open Manhole",
      severity: "Low Risk",
      desc: "Open manhole detected on road.",
      labels: ["AI Detection", "Auto Detected"],
      confidence: "90%",
      location: "Gulshan-e-Iqbal, Block 13, Karachi",
      coords: "24.9104° N, 67.0726° E",
      color: "border-green-200 bg-green-50 text-green-700",
      nodeColor: "bg-green-500 shadow-green-500/50",
      photo: "https://images.unsplash.com/photo-1508873696983-2df519f0397e?w=200&auto=format&fit=crop&q=80"
    },
    {
      id: "HZ-5",
      time: "Yesterday",
      date: "23 May 2024",
      tag: "06:40 PM",
      type: "Water Accumulation",
      severity: "Low Risk",
      desc: "Water accumulation due to rain.",
      labels: ["AI Detection", "Auto Detected"],
      confidence: "83%",
      location: "Clifton, Block 5, Karachi",
      coords: "24.8138° N, 67.0442° E",
      color: "border-green-200 bg-green-50 text-green-700",
      nodeColor: "bg-green-500 shadow-green-500/50",
      photo: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=200&auto=format&fit=crop&q=80"
    }
  ];

  return (
    <div className="space-y-6 text-left font-sans">
      
      {/* Top Banner stats cards row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        
        <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600">
            <IoGridOutline className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Total Detections</span>
            <span className="block text-2xl font-extrabold text-slate-800">245</span>
            <span className="text-[9px] font-bold text-green-600">↑ 18% this week</span>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-orange-50 flex items-center justify-center text-orange-500">
            <IoAlertCircleOutline className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">High Risk Hazards</span>
            <span className="block text-2xl font-extrabold text-slate-800">32</span>
            <span className="text-[9px] font-bold text-orange-500">↑ 8% this week</span>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-green-50 flex items-center justify-center text-green-600">
            <IoCheckmarkDoneCircleOutline className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">AI Avg Confidence</span>
            <span className="block text-2xl font-extrabold text-slate-800">92%</span>
            <span className="text-[9px] font-bold text-green-600">↑ 5% this week</span>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-purple-50 flex items-center justify-center text-purple-600">
            <IoStatsChartOutline className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">This Week</span>
            <span className="block text-2xl font-extrabold text-slate-800">56</span>
            <span className="text-[9px] font-bold text-slate-400">Detections synced</span>
          </div>
        </div>

      </div>

      {/* Main Filter actions bar */}
      <div className="bg-white border border-slate-100 rounded-3xl p-4 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {/* Search */}
          <div className="relative w-full md:w-48">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <IoSearchOutline className="w-4 h-4" />
            </span>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search detections..."
              className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-xl text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none bg-slate-50/50"
            />
          </div>

          {/* Types dropdown */}
          <select className="px-3 py-2 border border-slate-200 rounded-xl text-xs focus:outline-none bg-white text-slate-600 font-semibold cursor-pointer">
            <option>All Hazard Types</option>
            <option>Potholes</option>
            <option>Cracks</option>
            <option>Manholes</option>
          </select>

          {/* Severity dropdown */}
          <select className="px-3 py-2 border border-slate-200 rounded-xl text-xs focus:outline-none bg-white text-slate-600 font-semibold cursor-pointer">
            <option>All Severity</option>
            <option>Critical</option>
            <option>Moderate</option>
            <option>Minor</option>
          </select>

          {/* Sources dropdown */}
          <select className="px-3 py-2 border border-slate-200 rounded-xl text-xs focus:outline-none bg-white text-slate-600 font-semibold cursor-pointer">
            <option>All Sources</option>
            <option>AI Scanner</option>
            <option>User Reported</option>
          </select>

          {/* Date range picker */}
          <div className="flex items-center gap-1.5 px-3 py-2 border border-slate-200 rounded-xl text-xs font-semibold text-slate-600">
            <IoCalendarOutline className="w-4 h-4" />
            <span>18 May 2024 - 24 May 2024</span>
          </div>
        </div>

        <button className="px-5 py-2 border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold rounded-xl text-xs flex items-center gap-1.5 focus:outline-none cursor-pointer">
          <IoCloudDownloadOutline className="w-4 h-4" />
          <span>Export</span>
        </button>
      </div>

      {/* Detections Timeline log */}
      <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm relative">
        {/* Continuous vertical timeline connector bar */}
        <div className="absolute top-10 bottom-10 left-[121px] w-0.5 bg-slate-100 hidden md:block"></div>

        <div className="space-y-8 relative z-10">
          {timelineDetections.map((item) => (
            <div key={item.id} className="flex flex-col md:flex-row items-start gap-4 md:gap-8 group">
              
              {/* Left Column: Timestamp */}
              <div className="w-28 text-left md:text-right shrink-0 pt-1">
                <span className="text-xs font-extrabold text-slate-800 block">{item.time}</span>
                <span className="text-[10px] text-slate-400 block font-semibold">{item.date}</span>
                {item.tag && (
                  <span className="inline-block px-2 py-0.5 bg-red-100 text-red-600 text-[8px] font-bold rounded-full mt-1.5 uppercase tracking-wider">
                    {item.tag}
                  </span>
                )}
              </div>

              {/* Node indicator dot */}
              <div className="relative flex items-center justify-center pt-2 hidden md:flex">
                <div className={`w-3 h-3 rounded-full border-2 border-white ring-4 ring-white ${item.nodeColor}`}></div>
              </div>

              {/* Right Column: Card content */}
              <div className="flex-1 bg-slate-50/50 border border-slate-100 hover:border-blue-200 rounded-2xl p-4 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between transition-colors">
                
                {/* Photo Thumbnail & Info */}
                <div className="flex gap-4 items-start">
                  <div className="w-16 h-16 rounded-xl overflow-hidden border border-slate-200 bg-slate-900 shrink-0">
                    <img src={item.photo} alt={item.type} className="w-full h-full object-cover" />
                  </div>

                  <div className="text-left space-y-1.5 leading-tight">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs font-extrabold text-slate-800">{item.type}</span>
                      <span className={`px-2 py-0.5 text-[8px] font-bold rounded-full uppercase tracking-wider ${
                        item.severity.includes('High') ? 'bg-red-50 text-red-600' : 'bg-orange-50 text-orange-500'
                      }`}>{item.severity}</span>
                    </div>
                    <p className="text-[11px] text-slate-500 font-semibold">{item.desc}</p>
                    
                    {/* Source pills */}
                    <div className="flex gap-1.5 pt-0.5">
                      {item.labels.map((lbl, idx) => (
                        <span key={idx} className="px-2 py-0.5 border border-slate-200 text-slate-400 text-[8px] font-bold rounded bg-white uppercase tracking-wider">{lbl}</span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Accuracy gauge */}
                <div className="text-left sm:text-center shrink-0">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">AI Confidence</span>
                  <span className="block text-base font-extrabold text-green-600">{item.confidence}</span>
                  <div className="w-16 bg-slate-200 h-1 rounded-full mt-1.5 overflow-hidden">
                    <div className="bg-green-500 h-full" style={{ width: item.confidence }}></div>
                  </div>
                </div>

                {/* Location coordinates */}
                <div className="text-left sm:text-right shrink-0 leading-tight">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide block">Location</span>
                  <span className="block text-xs font-bold text-slate-800 truncate max-w-[150px]">{item.location.split(',')[0]}</span>
                  <span className="text-[9px] text-slate-400 font-semibold">{item.coords}</span>
                </div>

                {/* Detail arrow click */}
                <button
                  onClick={() => navigate('/driver/hazard/HZ-2024-05-18-1023')}
                  className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-400 focus:outline-none shrink-0 self-end sm:self-center"
                >
                  <IoChevronForwardOutline className="w-4 h-4" />
                </button>

              </div>

            </div>
          ))}
        </div>
      </div>

      {/* Footer pagination info */}
      <div className="flex items-center justify-between text-xs font-bold text-slate-400 border-t border-slate-100 pt-4">
        <span>Showing 1 to 5 of 245 detections</span>
        <div className="flex items-center gap-1.5">
          <button className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-400 disabled:opacity-40 select-none">&lt;</button>
          <span className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center">1</span>
          <span className="w-7 h-7 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 flex items-center justify-center cursor-pointer">2</span>
          <span className="w-7 h-7 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 flex items-center justify-center cursor-pointer">3</span>
          <span className="px-1">...</span>
          <span className="w-7 h-7 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 flex items-center justify-center cursor-pointer">25</span>
          <button className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600 select-none">&gt;</button>
        </div>
      </div>

    </div>
  );
}

// Sparkline area placeholder
function IoChevronBackOutline(props) {
  return (
    <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M15 18l-6-6 6-6" />
    </svg>
  );
}
