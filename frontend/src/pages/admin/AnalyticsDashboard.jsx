import React from 'react';
import {
  AreaChart, Area, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  BarChart, Bar, PieChart, Pie, Cell, LineChart, Line
} from 'recharts';
import { IoCalendarOutline, IoChevronDownOutline, IoCloudDownloadOutline } from 'react-icons/io5';

export default function AdminAnalyticsDashboard() {
  
  // Weekly data (Reported vs Resolved)
  const weeklyData = [
    { name: 'Mon 18', reported: 120, resolved: 85 },
    { name: 'Tue 19', reported: 150, resolved: 110 },
    { name: 'Wed 20', reported: 135, resolved: 95 },
    { name: 'Thu 21', reported: 175, resolved: 130 },
    { name: 'Fri 22', reported: 160, resolved: 120 },
    { name: 'Sat 23', reported: 195, resolved: 145 },
    { name: 'Sun 24', reported: 180, resolved: 140 }
  ];

  // Types distribution
  const typeData = [
    { name: 'Potholes', value: 2145, color: '#ef4444' },
    { name: 'Road Cracks', value: 1254, color: '#f97316' },
    { name: 'Open Manholes', value: 652, color: '#eab308' },
    { name: 'Flooded Roads', value: 421, color: '#3b82f6' },
    { name: 'Construction', value: 420, color: '#a855f7' }
  ];

  // Monthly trends (Bar)
  const monthlyData = [
    { name: 'Jan', hazards: 1200 },
    { name: 'Feb', hazards: 1900 },
    { name: 'Mar', hazards: 2400 },
    { name: 'Apr', hazards: 3600 },
    { name: 'May', hazards: 4892 }
  ];

  // Cost breakdown
  const costData = [
    { name: 'Materials', value: 45, color: '#10b981' },
    { name: 'Labor', value: 35, color: '#3b82f6' },
    { name: 'Equipment', value: 20, color: '#f59e0b' }
  ];

  return (
    <div className="space-y-6 text-left font-sans">
      
      {/* Date selector title */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div>
          <h2 className="text-sm font-extrabold text-slate-800">Analytics Dashboard</h2>
          <p className="text-[10px] text-slate-500 font-semibold mt-0.5">Track city-wide road safety insights, reports and stats</p>
        </div>
        
        <div className="flex items-center gap-3">
          {/* Date Picker */}
          <div className="flex items-center gap-1.5 px-3 py-2 border border-slate-200 rounded-xl text-xs font-semibold text-slate-650 bg-white">
            <IoCalendarOutline className="w-4 h-4 text-slate-400" />
            <span>18 May 2024 - 24 May 2024</span>
            <IoChevronDownOutline className="w-3.5 h-3.5 text-slate-400" />
          </div>

          <button className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-bold flex items-center gap-1.5 focus:outline-none cursor-pointer">
            <IoCloudDownloadOutline className="w-4 h-4 text-slate-400" />
            <span>Export Report</span>
          </button>
        </div>
      </div>

      {/* Top 4 Metrics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        
        <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm flex flex-col justify-between h-36">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Total Hazards</span>
            <span className="text-[9px] font-bold text-red-500">↑ 12.5% vs last month</span>
          </div>
          <div className="w-full h-8 my-1.5">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={[{v:10}, {v:14}, {v:12}, {v:18}, {v:15}, {v:22}, {v:25}]}>
                <Area type="monotone" dataKey="v" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.05} strokeWidth={1.5} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <span className="block text-2xl font-extrabold text-slate-800 leading-none">4,892</span>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm flex flex-col justify-between h-36">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Critical Hazards</span>
            <span className="text-[9px] font-bold text-red-500">↑ 8.7% vs last month</span>
          </div>
          <div className="w-full h-8 my-1.5">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={[{v:8}, {v:10}, {v:9}, {v:12}, {v:11}, {v:15}, {v:16}]}>
                <Area type="monotone" dataKey="v" stroke="#ef4444" fill="#ef4444" fillOpacity={0.05} strokeWidth={1.5} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <span className="block text-2xl font-extrabold text-slate-800 leading-none">342</span>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm flex flex-col justify-between h-36">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Active Drivers</span>
            <span className="text-[9px] font-bold text-green-600">↑ 15.3% vs last month</span>
          </div>
          <div className="w-full h-8 my-1.5">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={[{v:20}, {v:22}, {v:24}, {v:26}, {v:25}, {v:28}, {v:30}]}>
                <Area type="monotone" dataKey="v" stroke="#10b981" fill="#10b981" fillOpacity={0.05} strokeWidth={1.5} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <span className="block text-2xl font-extrabold text-slate-800 leading-none">12,845</span>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm flex flex-col justify-between h-36">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Today's Reports</span>
            <span className="text-[9px] font-bold text-green-600">↑ 18.6% vs last month</span>
          </div>
          <div className="w-full h-8 my-1.5">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={[{v:15}, {v:18}, {v:16}, {v:20}, {v:22}, {v:24}, {v:25}]}>
                <Area type="monotone" dataKey="v" stroke="#f97316" fill="#f97316" fillOpacity={0.05} strokeWidth={1.5} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <span className="block text-2xl font-extrabold text-slate-800 leading-none">1,256</span>
        </div>

      </div>

      {/* Row 2: Weekly Reported/Resolved & Type Distribution charts */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Weekly line chart (Col 1-2) */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-5 border border-slate-100 shadow-sm flex flex-col justify-between h-80">
          <span className="text-xs font-extrabold text-slate-800 border-b border-slate-50 pb-2 block">Weekly Hazards Overview</span>
          
          <div className="w-full h-56 pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={weeklyData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={9} tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" fontSize={9} tickLine={false} axisLine={false} />
                <Tooltip />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '10px', fontWeight: 'bold' }} />
                <Line type="monotone" dataKey="reported" name="Hazards Reported" stroke="#ef4444" strokeWidth={2} />
                <Line type="monotone" dataKey="resolved" name="Hazards Resolved" stroke="#10b981" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Hazard Type Donut (Col 3) */}
        <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm flex flex-col justify-between h-80">
          <span className="text-xs font-extrabold text-slate-800 border-b border-slate-50 pb-2 block">Hazard Type Distribution</span>
          
          <div className="flex items-center gap-4 flex-1 py-2">
            <div className="w-28 h-28 relative flex items-center justify-center shrink-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={typeData} cx="50%" cy="50%" innerRadius={28} outerRadius={38} dataKey="value">
                    {typeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pt-1 leading-none">
                <span className="text-base font-extrabold text-slate-800">4,892</span>
                <span className="text-[8px] text-slate-400 font-bold uppercase mt-0.5">Total</span>
              </div>
            </div>

            <div className="flex-1 space-y-1.5 text-[9px] font-bold text-slate-500">
              {typeData.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />{item.name}</span>
                  <span className="text-slate-850">{((item.value/4892)*100).toFixed(1)}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* Row 3: Monthly trend, Density list, and budget cost breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Monthly Hazards Trend Bar (Col 1) */}
        <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm flex flex-col justify-between h-80">
          <span className="text-xs font-extrabold text-slate-800 border-b border-slate-50 pb-2 block">Monthly Hazards Trend</span>
          
          <div className="w-full h-56 pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={9} tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" fontSize={9} tickLine={false} axisLine={false} />
                <Tooltip />
                <Bar dataKey="hazards" fill="#3b82f6" radius={[4, 4, 0, 0]} maxBarSize={30} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Hazard Density by Area list (Col 2) */}
        <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm flex flex-col justify-between h-80 text-left">
          <span className="text-xs font-extrabold text-slate-800 border-b border-slate-50 pb-2 block">Hazard Density by Area</span>
          
          <div className="flex-1 flex flex-col gap-3 justify-center py-2 text-xs">
            {[
              { label: "Johar Town, Lahore", val: 1248, max: 1248, color: "bg-red-500" },
              { label: "DHA Phase 1, Karachi", val: 932, max: 1248, color: "bg-orange-500" },
              { label: "Model Town, Lahore", val: 842, max: 1248, color: "bg-amber-500" },
              { label: "Gulberg III, Lahore", val: 654, max: 1248, color: "bg-blue-500" },
              { label: "Korangi Crossing, Karachi", val: 421, max: 1248, color: "bg-purple-500" }
            ].map((item, i) => (
              <div key={i} className="space-y-1">
                <div className="flex justify-between items-center text-[10px] font-bold text-slate-600">
                  <span>{item.label}</span>
                  <span className="text-slate-800 font-extrabold">{item.val.toLocaleString()}</span>
                </div>
                <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                  <div className={`h-full ${item.color}`} style={{ width: `${(item.val/item.max)*100}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Maintenance cost donut (Col 3) */}
        <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm flex flex-col justify-between h-80">
          <span className="text-xs font-extrabold text-slate-800 border-b border-slate-50 pb-2 block">Maintenance Cost Breakdown</span>
          
          <div className="flex items-center gap-4 flex-1 py-2">
            <div className="w-28 h-28 relative flex items-center justify-center shrink-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={costData} cx="50%" cy="50%" innerRadius={28} outerRadius={38} dataKey="value">
                    {costData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pt-1 leading-none">
                <span className="text-sm font-extrabold text-slate-800">$12,850</span>
                <span className="text-[8px] text-slate-400 font-bold uppercase mt-0.5">Total</span>
              </div>
            </div>

            <div className="flex-1 space-y-1.5 text-[9px] font-bold text-slate-500">
              {costData.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />{item.name}</span>
                  <span className="text-slate-800">{item.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
