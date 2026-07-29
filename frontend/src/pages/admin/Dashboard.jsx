import React, { useState, useEffect } from 'react';
import { useNavigate as useNav } from 'react-router-dom';
import MapPlaceholder from '../../components/MapPlaceholder';
import { useHazards } from '../../context/HazardContext';
import api from '../../services/api';
import {
  IoWarningOutline, IoShieldOutline, IoPeopleOutline, IoDocumentTextOutline,
  IoPulseOutline, IoBuildOutline, IoAlertCircleOutline, IoVolumeHighOutline,
  IoInformationCircleOutline, IoCheckmarkCircleOutline, IoChevronForwardOutline,
  IoAddCircleOutline, IoLocationOutline, IoStatsChartOutline, IoCalendarOutline
} from 'react-icons/io5';
import {
  PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip
} from 'recharts';

export default function AdminDashboard() {
  const navigate = useNav();
  const { geojson } = useHazards();
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  // Convert GeoJSON to hazard array for the mini-map
  const mapHazards = geojson?.features?.slice(0, 8).map(f => ({
    id: f.properties.hazard_id,
    type: f.properties.hazard_type,
    severity: f.properties.severity,
    lat: f.geometry.coordinates[1],
    lng: f.geometry.coordinates[0],
    confidence: f.properties.confidence,
    crowdsource_count: f.properties.crowdsource_count,
    is_verified: f.properties.is_verified,
    status: f.properties.status,
  })) || [];

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const response = await api.get('/analytics/summary');
        setSummary(response.data);
      } catch (err) {
        console.error('Failed to load analytics summary:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchSummary();
  }, []);

  const totalReportsCount = summary?.total_reports || 4892;

  // Charts Data
  const severityData = summary ? [
    { name: 'Critical', value: summary.by_severity?.Critical || 0, color: '#ef4444' },
    { name: 'Moderate', value: summary.by_severity?.Moderate || 0, color: '#f97316' },
    { name: 'Minor', value: summary.by_severity?.Minor || 0, color: '#eab308' },
    { name: 'Safe', value: summary.by_severity?.Normal || 0, color: '#22c55e' }
  ] : [
    { name: 'Critical', value: 342, color: '#ef4444' },
    { name: 'Moderate', value: 1256, color: '#f97316' },
    { name: 'Minor', value: 1842, color: '#eab308' },
    { name: 'Safe', value: 1452, color: '#22c55e' }
  ];

  const maintenanceData = summary ? [
    { name: 'Pending/Reported', value: summary.by_status?.Reported || 0, color: '#f97316' },
    { name: 'In Progress', value: summary.by_status?.['In Progress'] || 0, color: '#3b82f6' },
    { name: 'Resolved', value: summary.by_status?.Resolved || 0, color: '#22c55e' }
  ] : [
    { name: 'Pending', value: 78, color: '#f97316' },
    { name: 'In Progress', value: 92, color: '#3b82f6' },
    { name: 'Completed', value: 75, color: '#22c55e' }
  ];

  const totalTasks = maintenanceData.reduce((acc, curr) => acc + curr.value, 0) || 245;

  const overTimeData = [
    { name: 'May 15', hazards: Math.round(totalReportsCount * 0.4) },
    { name: 'May 16', hazards: Math.round(totalReportsCount * 0.6) },
    { name: 'May 17', hazards: Math.round(totalReportsCount * 0.7) },
    { name: 'May 18', hazards: Math.round(totalReportsCount * 0.8) },
    { name: 'May 19', hazards: Math.round(totalReportsCount * 0.85) },
    { name: 'May 20', hazards: Math.round(totalReportsCount * 0.95) },
    { name: 'May 21', hazards: totalReportsCount }
  ];

  const warnings = [
    { type: "High number of potholes detected on Ferozepur Road", time: "5 min ago", icon: IoAlertCircleOutline, color: "text-red-500 bg-red-50 border-red-100" },
    { type: "Heavy rain forecast for tomorrow. Possible road flooding.", time: "30 min ago", icon: IoWarningOutline, color: "text-orange-500 bg-orange-50 border-orange-100" },
    { type: "Maintenance team assigned to Johar Town (3 new tasks)", time: "1 hour ago", icon: IoInformationCircleOutline, color: "text-blue-500 bg-blue-50 border-blue-100" },
    { type: "Road repair completed on Canal Road", time: "2 hours ago", icon: IoCheckmarkCircleOutline, color: "text-green-600 bg-green-50 border-green-100" }
  ];

  return (
    <div className="space-y-6 text-left font-sans">
      
      {/* Top Admin KPI Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-6">
        
        {/* Total Hazards */}
        <div className="bg-white rounded-3xl p-4 border border-slate-100 shadow-sm flex flex-col justify-between h-28 relative">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Total Hazards</span>
            <div className="w-8 h-8 rounded-lg bg-red-50 text-red-500 flex items-center justify-center"><IoWarningOutline className="w-4.5 h-4.5" /></div>
          </div>
          <div>
            <span className="block text-2xl font-extrabold text-slate-800">{totalReportsCount.toLocaleString()}</span>
            <span className="text-[9px] font-bold text-red-500">↑ 12.5% from yesterday</span>
          </div>
        </div>

        {/* Critical Hazards */}
        <div className="bg-white rounded-3xl p-4 border border-slate-100 shadow-sm flex flex-col justify-between h-28 relative">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Critical Hazards</span>
            <div className="w-8 h-8 rounded-lg bg-red-100 text-red-600 flex items-center justify-center"><IoShieldOutline className="w-4.5 h-4.5" /></div>
          </div>
          <div>
            <span className="block text-2xl font-extrabold text-slate-800">{summary?.by_severity?.Critical || 342}</span>
            <span className="text-[9px] font-bold text-red-600">↑ 8.7% from yesterday</span>
          </div>
        </div>

        {/* Active Drivers */}
        <div className="bg-white rounded-3xl p-4 border border-slate-100 shadow-sm flex flex-col justify-between h-28 relative">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Active Drivers</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center"><IoPeopleOutline className="w-4.5 h-4.5" /></div>
          </div>
          <div>
            <span className="block text-2xl font-extrabold text-slate-800">12,845</span>
            <span className="text-[9px] font-bold text-green-600">↑ 15.3% from yesterday</span>
          </div>
        </div>

        {/* Today's Reports */}
        <div className="bg-white rounded-3xl p-4 border border-slate-100 shadow-sm flex flex-col justify-between h-28 relative">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Recent (7 Days)</span>
            <div className="w-8 h-8 rounded-lg bg-orange-50 text-orange-500 flex items-center justify-center"><IoDocumentTextOutline className="w-4.5 h-4.5" /></div>
          </div>
          <div>
            <span className="block text-2xl font-extrabold text-slate-800">{summary?.reports_last_7_days || 1256}</span>
            <span className="text-[9px] font-bold text-green-600">↑ 18.6% from yesterday</span>
          </div>
        </div>

        {/* AI Accuracy */}
        <div className="bg-white rounded-3xl p-4 border border-slate-100 shadow-sm flex flex-col justify-between h-28 relative">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">AI Accuracy</span>
            <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center"><IoPulseOutline className="w-4.5 h-4.5" /></div>
          </div>
          <div>
            <span className="block text-2xl font-extrabold text-slate-800">93.6%</span>
            <span className="text-[9px] font-bold text-green-600">↑ 2.4% improvement</span>
          </div>
        </div>

        {/* Repair Requests */}
        <div className="bg-white rounded-3xl p-4 border border-slate-100 shadow-sm flex flex-col justify-between h-28 relative">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Active Jobs</span>
            <div className="w-8 h-8 rounded-lg bg-green-50 text-green-600 flex items-center justify-center"><IoBuildOutline className="w-4.5 h-4.5" /></div>
          </div>
          <div>
            <span className="block text-2xl font-extrabold text-slate-800">{summary?.by_status?.['In Progress'] || 92}</span>
            <span className="text-[9px] text-slate-500 font-semibold">{summary?.by_status?.Reported || 78} Pending</span>
          </div>
        </div>

      </div>

      {/* Row 1: Donut Charts and Trends */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Severity Overview donut */}
        <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm flex flex-col justify-between h-80">
          <span className="text-xs font-extrabold text-slate-800 border-b border-slate-50 pb-2 block">Hazard Severity Overview</span>
          
          <div className="flex items-center gap-4 flex-1 py-2">
            <div className="w-32 h-32 relative flex items-center justify-center shrink-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={severityData} cx="50%" cy="50%" innerRadius={35} outerRadius={48} dataKey="value">
                    {severityData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pt-1 leading-none">
                <span className="text-xl font-extrabold text-slate-800">{totalReportsCount}</span>
                <span className="text-[8px] text-slate-400 font-bold uppercase mt-0.5">Hazards</span>
              </div>
            </div>

            <div className="flex-1 space-y-1.5 text-[10px] font-bold text-slate-500">
              {severityData.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />{item.name}</span>
                  <span className="text-slate-850">{item.value} ({totalReportsCount > 0 ? ((item.value/totalReportsCount)*100).toFixed(1) : 0}%)</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Hazards over time line chart */}
        <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm flex flex-col justify-between h-80">
          <div className="flex items-center justify-between border-b border-slate-50 pb-2">
            <span className="text-xs font-extrabold text-slate-800">Hazards Over Time</span>
            <select className="px-2 py-1 border border-slate-200 rounded-lg text-xs font-semibold focus:outline-none bg-white text-slate-600">
              <option>7 Days</option>
            </select>
          </div>

          <div className="w-full h-44 py-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={overTimeData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={9} tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" fontSize={9} tickLine={false} axisLine={false} />
                <Tooltip />
                <Line type="monotone" dataKey="hazards" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.05} strokeWidth={2.5} activeDot={{ r: 5 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <span className="text-[9px] text-slate-400 font-bold block text-center">Total hazards reported in the last 7 days</span>
        </div>

        {/* Top Hazard Types bars */}
        <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm flex flex-col justify-between h-80">
          <span className="text-xs font-extrabold text-slate-800 border-b border-slate-50 pb-2 block">Top Hazard Types</span>
          
          <div className="flex-1 flex flex-col gap-3 justify-center py-2 text-xs">
            {[
              { label: "Potholes", val: 2145, pct: "43.8%", color: "bg-red-500" },
              { label: "Road Cracks", val: 1254, pct: "25.6%", color: "bg-orange-500" },
              { label: "Open Manholes", val: 652, pct: "13.3%", color: "bg-amber-500" },
              { label: "Flooded Roads", val: 421, pct: "8.6%", color: "bg-blue-500" },
              { label: "Construction Areas", val: 420, pct: "8.7%", color: "bg-purple-500" }
            ].map((item, i) => (
              <div key={i} className="space-y-1">
                <div className="flex justify-between items-center text-[10px] font-bold text-slate-600">
                  <span>{item.label}</span>
                  <span className="text-slate-800">{item.val.toLocaleString()} ({item.pct})</span>
                </div>
                <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                  <div className={`h-full ${item.color}`} style={{ width: item.pct }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Row 2: Maps and lists */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* City Road Quality map */}
        <div className="lg:col-span-1 bg-white rounded-3xl p-5 border border-slate-100 shadow-sm flex flex-col justify-between h-[360px]">
          <span className="text-xs font-extrabold text-slate-800 border-b border-slate-50 pb-2 block">City Road Quality Map</span>
          <div className="w-full h-64 rounded-2xl overflow-hidden border border-slate-100 relative">
            <MapPlaceholder hazards={mapHazards} mode="admin" />
          </div>
        </div>

        {/* Recent Reports list */}
        <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm flex flex-col justify-between h-[360px]">
          <div className="flex items-center justify-between border-b border-slate-50 pb-2">
            <span className="text-xs font-extrabold text-slate-800">Recent Reports</span>
            <span className="text-[10px] font-bold text-blue-600 hover:underline cursor-pointer" onClick={() => navigate('/admin/hazards')}>View All</span>
          </div>

          <div className="divide-y divide-slate-100 flex-1 overflow-y-auto pr-1">
            {[
              { type: "Pothole", road: "Main Boulevard, Gulberg", severity: "Critical", time: "10 min ago", color: "text-red-600 bg-red-50", photo: "https://images.unsplash.com/photo-1515162305285-0293e4767cc2?w=100&auto=format&fit=crop" },
              { type: "Road Crack", road: "Ferozepur Road", severity: "Moderate", time: "25 min ago", color: "text-orange-500 bg-orange-50", photo: "https://images.unsplash.com/photo-1584467541268-b040f83be3fd?w=100&auto=format&fit=crop" },
              { type: "Open Manhole", road: "Model Town", severity: "Minor", time: "45 min ago", color: "text-yellow-600 bg-yellow-50", photo: "https://images.unsplash.com/photo-1508873696983-2df519f0397e?w=100&auto=format&fit=crop" },
              { type: "Construction Area", road: "DHA Phase 1", severity: "Minor", time: "1 hour ago", color: "text-purple-600 bg-purple-50", photo: "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=100&auto=format&fit=crop" }
            ].map((rep, idx) => (
              <div key={idx} className="flex items-center gap-3.5 py-3 first:pt-1 group cursor-pointer" onClick={() => navigate('/admin/hazards')}>
                <div className="w-10 h-10 rounded-lg overflow-hidden border border-slate-200 bg-slate-900 shrink-0">
                  <img src={rep.photo} alt={rep.type} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 leading-tight text-left">
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-slate-800 text-xs block group-hover:text-blue-600 transition-colors">{rep.type}</span>
                    <span className={`px-1.5 py-0.5 text-[8px] font-bold rounded ${rep.color}`}>{rep.severity}</span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-semibold">{rep.road}</span>
                </div>
                <span className="text-[10px] text-slate-400 font-bold shrink-0">{rep.time}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Maintenance Job Status donut */}
        <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm flex flex-col justify-between h-[360px]">
          <div className="flex items-center justify-between border-b border-slate-50 pb-2">
            <span className="text-xs font-extrabold text-slate-800">Maintenance Status</span>
            <span className="text-[10px] font-bold text-blue-600 hover:underline cursor-pointer" onClick={() => navigate('/admin/maintenance')}>View All</span>
          </div>

          <div className="flex flex-col items-center gap-4 flex-1 justify-center py-4">
            <div className="w-32 h-32 relative flex items-center justify-center shrink-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={maintenanceData} cx="50%" cy="50%" innerRadius={35} outerRadius={48} dataKey="value">
                    {maintenanceData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pt-1 leading-none">
                <span className="text-xl font-extrabold text-slate-800">{totalTasks}</span>
                <span className="text-[8px] text-slate-400 font-bold uppercase mt-0.5">Total Tasks</span>
              </div>
            </div>

            <div className="w-full space-y-2 text-[10px] font-bold text-slate-500">
              {maintenanceData.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between border-b border-slate-50 pb-1.5 last:border-0 last:pb-0">
                  <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />{item.name}</span>
                  <span className="text-slate-850">{item.value} ({totalTasks > 0 ? ((item.value/totalTasks)*100).toFixed(1) : 0}%)</span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* Row 3: Alerts & Alarms Notifications panel */}
      <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-50 pb-2">
          <div className="flex items-center gap-2">
            <span className="text-sm font-extrabold text-slate-800">Alerts & Notifications</span>
            <span className="px-2 py-0.5 bg-red-100 text-red-700 text-[9px] font-extrabold rounded-full">12</span>
          </div>
          <span className="text-[10px] font-bold text-blue-600 hover:underline cursor-pointer" onClick={() => navigate('/admin/reports')}>View All Alerts</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {warnings.map((warn, i) => {
            const WarnIcon = warn.icon;
            return (
              <div key={i} className={`flex items-start justify-between gap-4 p-4 rounded-2xl border text-xs font-semibold leading-relaxed ${warn.color}`}>
                <div className="flex items-start gap-3">
                  <div className="mt-0.5"><WarnIcon className="w-5 h-5 shrink-0" /></div>
                  <div className="text-left">
                    <span className="text-slate-800 block font-bold">{warn.type}</span>
                    <span className="text-[9px] text-slate-400 block mt-1 font-semibold">{warn.time}</span>
                  </div>
                </div>
                <IoChevronForwardOutline className="w-4 h-4 text-slate-400 shrink-0 self-center" />
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
