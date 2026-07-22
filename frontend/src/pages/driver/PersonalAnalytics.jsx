import React from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell, AreaChart, Area
} from 'recharts';
import {
  IoCalendarOutline, IoChevronDownOutline, IoLeafOutline, IoPeopleOutline,
  IoStarOutline, IoTrendingUpOutline, IoTimeOutline, IoSpeedometerOutline,
  IoAlertCircleOutline, IoCheckmarkCircleOutline
} from 'react-icons/io5';

export default function DriverPersonalAnalytics() {
  
  // Sparkline data for top cards
  const sparkData = [{v: 10}, {v: 15}, {v: 12}, {v: 18}, {v: 14}, {v: 22}, {v: 25}];

  // Weekly overview line chart data (3 lines)
  const weeklyData = [
    { name: 'Mon 18', distance: 42, hazards: 25, reports: 5 },
    { name: 'Tue 19', distance: 70, hazards: 40, reports: 12 },
    { name: 'Wed 20', distance: 48, hazards: 28, reports: 7 },
    { name: 'Thu 21', distance: 75, hazards: 40, reports: 10 },
    { name: 'Fri 22', distance: 60, hazards: 35, reports: 6 },
    { name: 'Sat 23', distance: 82, hazards: 50, reports: 15 },
    { name: 'Sun 24', distance: 68, hazards: 38, reports: 8 }
  ];

  // Road Quality Breakdown (Donut chart data)
  const qualityData = [
    { name: 'Excellent (80-100)', value: 42, color: '#10b981' },
    { name: 'Good (60-79)', value: 33, color: '#3b82f6' },
    { name: 'Average (40-59)', value: 15, color: '#f59e0b' },
    { name: 'Poor (20-39)', value: 7, color: '#f97316' },
    { name: 'Very Poor (0-19)', value: 3, color: '#ef4444' }
  ];

  return (
    <div className="space-y-6 text-left font-sans">
      
      {/* Date filter top bar */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div>
          <h2 className="text-sm font-extrabold text-slate-800">Personal Analytics</h2>
          <p className="text-[10px] text-slate-500 font-semibold mt-0.5">Track your driving insights and road safety impact</p>
        </div>
        
        {/* Date Selector */}
        <div className="flex items-center gap-1.5 px-3 py-2 border border-slate-200 rounded-xl text-xs font-semibold text-slate-600 bg-white">
          <IoCalendarOutline className="w-4 h-4 text-slate-400" />
          <span>18 May 2024 - 24 May 2024</span>
          <IoChevronDownOutline className="w-3.5 h-3.5 text-slate-400" />
        </div>
      </div>

      {/* Top 5 Metrics Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-6">
        
        {/* Distance */}
        <div className="bg-white rounded-3xl p-4 border border-slate-100 shadow-sm flex flex-col justify-between h-36">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Distance Traveled</span>
            <span className="text-[9px] font-bold text-green-600">↑ 18% vs last week</span>
          </div>
          <div className="w-full h-8 my-1">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={sparkData}>
                <Area type="monotone" dataKey="v" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.05} strokeWidth={1.5} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <span className="block text-xl font-extrabold text-slate-800 leading-none">126.4 km</span>
        </div>

        {/* Road Quality */}
        <div className="bg-white rounded-3xl p-4 border border-slate-100 shadow-sm flex flex-col justify-between h-36">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Road Quality Score</span>
            <span className="text-[9px] font-bold text-green-600">↑ 12 pts vs last week</span>
          </div>
          <div className="w-full h-8 my-1">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={sparkData}>
                <Area type="monotone" dataKey="v" stroke="#10b981" fill="#10b981" fillOpacity={0.05} strokeWidth={1.5} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <span className="block text-xl font-extrabold text-slate-800 leading-none">78 / 100</span>
        </div>

        {/* Hazards Avoided */}
        <div className="bg-white rounded-3xl p-4 border border-slate-100 shadow-sm flex flex-col justify-between h-36">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Hazards Avoided</span>
            <span className="text-[9px] font-bold text-green-600">↑ 20% vs last week</span>
          </div>
          <div className="w-full h-8 my-1">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={sparkData}>
                <Area type="monotone" dataKey="v" stroke="#a855f7" fill="#a855f7" fillOpacity={0.05} strokeWidth={1.5} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <span className="block text-xl font-extrabold text-slate-800 leading-none">24</span>
        </div>

        {/* Reports Submitted */}
        <div className="bg-white rounded-3xl p-4 border border-slate-100 shadow-sm flex flex-col justify-between h-36">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Reports Submitted</span>
            <span className="text-[9px] font-bold text-green-600">↑ 36% vs last week</span>
          </div>
          <div className="w-full h-8 my-1">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={sparkData}>
                <Area type="monotone" dataKey="v" stroke="#f97316" fill="#f97316" fillOpacity={0.05} strokeWidth={1.5} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <span className="block text-xl font-extrabold text-slate-800 leading-none">15</span>
        </div>

        {/* Safe Driving Score Gauge */}
        <div className="bg-white rounded-3xl p-4 border border-slate-100 shadow-sm flex items-center gap-3 h-36 col-span-2 lg:col-span-1">
          <div className="w-16 h-16 relative flex items-center justify-center flex-shrink-0">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={[{v:92}, {v:8}]} cx="50%" cy="50%" innerRadius={22} outerRadius={28} startAngle={90} endAngle={-270} dataKey="v">
                  <Cell fill="#3b82f6" />
                  <Cell fill="#f1f5f9" />
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <span className="absolute text-xs font-extrabold">92%</span>
          </div>
          <div className="leading-tight text-left">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide block">Safe Driving Score</span>
            <span className="text-sm font-extrabold text-slate-800 block">92 / 100</span>
            <span className="text-[9px] font-bold text-green-600 block mt-0.5">Excellent!</span>
            <div className="flex text-amber-400 text-[9px] mt-1">★★★★★</div>
          </div>
        </div>

      </div>

      {/* Charts and summary split panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Weekly Overview Line chart */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-5 border border-slate-100 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-50 pb-2">
            <span className="text-xs font-extrabold text-slate-800">Weekly Overview</span>
            <select className="px-2.5 py-1.5 border border-slate-200 rounded-lg text-xs font-semibold focus:outline-none bg-white text-slate-600">
              <option>This Week</option>
            </select>
          </div>

          <div className="w-full h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={weeklyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} />
                <Tooltip />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '11px', fontWeight: 'bold' }} />
                <Line type="monotone" dataKey="distance" name="Distance (km)" stroke="#3b82f6" strokeWidth={2} activeDot={{ r: 6 }} />
                <Line type="monotone" dataKey="hazards" name="Hazards Avoided" stroke="#a855f7" strokeWidth={2} />
                <Line type="monotone" dataKey="reports" name="Reports Submitted" stroke="#10b981" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Driving Summary Metrics list */}
        <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm flex flex-col justify-between gap-4">
          <span className="text-xs font-extrabold text-slate-800 border-b border-slate-50 pb-2 block">Driving Summary</span>
          
          <div className="flex-1 flex flex-col gap-4 justify-center">
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center"><IoTimeOutline className="w-5 h-5" /></div>
                <span className="text-xs font-bold text-slate-700">Total Drive Time</span>
              </div>
              <div className="text-right">
                <span className="text-xs font-extrabold text-slate-800 block">6h 42m</span>
                <span className="text-[8px] font-bold text-green-600">↑ 14% vs last week</span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-green-50 text-green-600 flex items-center justify-center"><IoSpeedometerOutline className="w-5 h-5" /></div>
                <span className="text-xs font-bold text-slate-700">Average Speed</span>
              </div>
              <div className="text-right">
                <span className="text-xs font-extrabold text-slate-800 block">42 km/h</span>
                <span className="text-[8px] font-bold text-red-500">↓ 3% vs last week</span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-orange-50 text-orange-500 flex items-center justify-center"><IoAlertCircleOutline className="w-5 h-5" /></div>
                <span className="text-xs font-bold text-slate-700">Harsh Braking</span>
              </div>
              <div className="text-right">
                <span className="text-xs font-extrabold text-slate-800 block">8 times</span>
                <span className="text-[8px] font-bold text-green-600">↓ 33% vs last week</span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-red-50 text-red-500 flex items-center justify-center"><IoAlertCircleOutline className="w-5 h-5" /></div>
                <span className="text-xs font-bold text-slate-700">High Risk Alerts</span>
              </div>
              <div className="text-right">
                <span className="text-xs font-extrabold text-slate-800 block">5</span>
                <span className="text-[8px] font-bold text-green-600">↓ 17% vs last week</span>
              </div>
            </div>

          </div>
        </div>

      </div>

      {/* Bottom Breakdown details row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* Donut score breakdown */}
        <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm flex flex-col justify-between gap-4 h-64">
          <span className="text-xs font-extrabold text-slate-800 border-b border-slate-50 pb-2 block">Road Quality Breakdown</span>
          
          <div className="flex items-center gap-4 flex-1">
            <div className="w-24 h-24 relative flex items-center justify-center shrink-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={qualityData} cx="50%" cy="50%" innerRadius={30} outerRadius={40} dataKey="value">
                    {qualityData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pt-1">
                <span className="text-lg font-extrabold text-slate-800">78</span>
                <span className="text-[8px] text-slate-400 font-bold uppercase tracking-wider">/ 100</span>
              </div>
            </div>

            <div className="flex-1 space-y-1 text-[9px] font-bold text-slate-500">
              {qualityData.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />{item.name}</span>
                  <span className="text-slate-800">{item.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Top Encountered Hazards */}
        <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm flex flex-col justify-between gap-4 h-64 text-left">
          <span className="text-xs font-extrabold text-slate-800 border-b border-slate-50 pb-2 block">Top Hazard Types Encountered</span>
          
          <div className="flex-1 flex flex-col gap-2.5 justify-center">
            {[
              { label: "Potholes", val: 12, total: 26, color: "bg-red-500" },
              { label: "Road Cracks", val: 8, total: 26, color: "bg-orange-500" },
              { label: "Open Manholes", val: 3, total: 26, color: "bg-amber-500" },
              { label: "Road Construction", val: 2, total: 26, color: "bg-purple-500" },
              { label: "Water Accumulation", val: 1, total: 26, color: "bg-blue-500" }
            ].map((item, i) => (
              <div key={i} className="space-y-1">
                <div className="flex justify-between items-center text-[10px] font-bold text-slate-600">
                  <span>{item.label}</span>
                  <span>{item.val}</span>
                </div>
                <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                  <div className={`h-full ${item.color}`} style={{ width: `${(item.val/item.total)*100}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Impact cards */}
        <div className="flex flex-col gap-4 justify-between h-64">
          <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm flex flex-col justify-between flex-1">
            <span className="text-xs font-extrabold text-slate-800 border-b border-slate-50 pb-2 block">Your Impact</span>
            
            <div className="grid grid-cols-2 gap-4 my-auto">
              <div className="bg-green-50/50 border border-green-100/50 rounded-2xl p-3 text-left space-y-1">
                <IoLeafOutline className="w-5 h-5 text-green-600" />
                <span className="text-xl font-extrabold text-green-600 block">12.4 kg</span>
                <span className="text-[9px] text-slate-400 font-bold block leading-none">CO₂ Saved</span>
              </div>

              <div className="bg-blue-50/50 border border-blue-100/50 rounded-2xl p-3 text-left space-y-1">
                <IoPeopleOutline className="w-5 h-5 text-blue-600" />
                <span className="text-xl font-extrabold text-blue-600 block">89</span>
                <span className="text-[9px] text-slate-400 font-bold block leading-none">Community Helped</span>
              </div>
            </div>

            <div className="bg-green-50 border border-green-100 rounded-xl px-3 py-1.5 text-[9px] text-green-700 font-bold text-center">
              ✓ Great job! You're making our roads safer for everyone.
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
