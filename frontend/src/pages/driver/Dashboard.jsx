import React from 'react';
import { useNavigate } from 'react-router-dom';
import { mockHazards, mockStats } from '../../data/mockData';
import MapPlaceholder from '../../components/MapPlaceholder';
import {
  IoSpeedometerOutline, IoTrendingUpOutline, IoTimeOutline, IoCarOutline,
  IoCheckmarkCircleOutline, IoPulseOutline, IoChevronForwardOutline,
  IoWarningOutline, IoCompassOutline, IoShareSocialOutline, IoVolumeHighOutline,
  IoAlertCircleOutline, IoPersonAddOutline, IoShieldCheckmarkOutline
} from 'react-icons/io5';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

export default function DriverDashboard() {
  const navigate = useNavigate();

  // Gauge Chart Data for Road Health Score (78%)
  const gaugeData = [
    { value: 78, color: '#22c55e' },
    { value: 22, color: '#e2e8f0' }
  ];

  const recentAlerts = [
    { type: "Pothole detected", road: "Shahrah-e-Faisal", severity: "High", color: "bg-red-500", label: "120 m ahead", time: "2 min ago" },
    { type: "Road construction", road: "Korangi Road", severity: "Medium", color: "bg-orange-500", label: "450 m ahead", time: "15 min ago" },
    { type: "Water logging reported", road: "University Road", severity: "Low", color: "bg-yellow-500", label: "800 m ahead", time: "35 min ago" },
    { type: "Heavy traffic reported", road: "I.I Chundrigar Road", severity: "Info", color: "bg-blue-500", label: "1.2 km ahead", time: "50 min ago" }
  ];

  return (
    <div className="space-y-6">
      
      {/* Top Map and Gauge Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Interactive Map Block */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-5 border border-slate-100 shadow-sm flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-extrabold text-slate-800">Interactive Map</span>
            <span
              onClick={() => navigate('/driver/map')}
              className="text-xs font-bold text-blue-600 hover:underline cursor-pointer flex items-center gap-1"
            >
              View All Hazards →
            </span>
          </div>

          <div className="w-full h-80 rounded-2xl overflow-hidden relative">
            <MapPlaceholder hazards={mockHazards} mode="user" />
          </div>

          {/* Map Legend */}
          <div className="flex items-center justify-between text-[11px] font-semibold text-slate-500 pt-1">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-green-500"></span>Good</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-yellow-500"></span>Minor</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-orange-500"></span>Moderate</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-red-500"></span>Poor</span>
            </div>
            <span className="text-slate-400">Live Karachi Coverage</span>
          </div>
        </div>

        {/* Right Info Column */}
        <div className="flex flex-col gap-6">
          
          {/* Road Health Score Card */}
          <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm flex flex-col justify-between h-[210px]">
            <div className="flex items-center justify-between border-b border-slate-50 pb-2">
              <span className="text-xs font-extrabold text-slate-800">Road Health Score</span>
              <span className="text-[10px] font-bold text-blue-600 cursor-pointer hover:underline" onClick={() => navigate('/driver/analytics')}>View Details</span>
            </div>
            
            <div className="flex items-center gap-4 py-2">
              {/* Half-donut gauge chart */}
              <div className="w-24 h-24 relative flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={gaugeData}
                      cx="50%"
                      cy="50%"
                      innerRadius={30}
                      outerRadius={40}
                      startAngle={180}
                      endAngle={-180}
                      dataKey="value"
                    >
                      <Cell fill="#22c55e" />
                      <Cell fill="#f1f5f9" />
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center pt-1">
                  <span className="text-2xl font-extrabold text-slate-800">78</span>
                  <span className="text-[9px] font-bold uppercase text-green-600 tracking-wider">Good</span>
                </div>
              </div>

              {/* Legends list */}
              <div className="flex-1 space-y-1.5 text-xs font-bold text-slate-600">
                <div className="flex items-center justify-between"><span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-green-500"></span>Smooth Roads</span><span className="text-slate-800">62%</span></div>
                <div className="flex items-center justify-between"><span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-yellow-500"></span>Needs Attention</span><span className="text-slate-800">28%</span></div>
                <div className="flex items-center justify-between"><span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-red-500"></span>Poor Conditions</span><span className="text-slate-800">10%</span></div>
              </div>
            </div>

            {/* Alert bar */}
            <div className="bg-green-50 border border-green-100 rounded-xl px-3 py-1.5 text-[10px] text-green-700 font-bold text-center">
              Great! You're driving in better than average roads today.
            </div>
          </div>

          {/* AI Monitoring Status Card */}
          <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm flex flex-col justify-between h-[210px]">
            <div className="flex items-center justify-between border-b border-slate-50 pb-2">
              <span className="text-xs font-extrabold text-slate-800">AI Monitoring Status</span>
              <span className="px-2 py-0.5 bg-green-100 text-green-700 font-bold text-[8px] rounded-full uppercase tracking-wider">Active</span>
            </div>

            {/* Sensor grids */}
            <div className="grid grid-cols-5 gap-2 py-3 text-center">
              {[
                { name: "GPS", icon: IoCompassOutline, color: "text-green-600 bg-green-50" },
                { name: "Camera", icon: IoCarOutline, color: "text-green-600 bg-green-50" },
                { name: "Accel", icon: IoPulseOutline, color: "text-green-600 bg-green-50" },
                { name: "Gyro", icon: IoSpeedometerOutline, color: "text-green-600 bg-green-50" },
                { name: "Sync", icon: IoCheckmarkCircleOutline, color: "text-blue-600 bg-blue-50" }
              ].map((item, i) => {
                const Icon = item.icon;
                return (
                  <div key={i} className="flex flex-col items-center gap-1">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${item.color}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="text-[9px] font-bold text-slate-500 leading-none">{item.name}</span>
                  </div>
                );
              })}
            </div>

            {/* Alert text */}
            <div className="bg-blue-50/50 border border-blue-100/50 rounded-xl px-3 py-2 text-[10px] text-blue-700 font-medium leading-normal text-left flex items-start gap-2">
              <IoShieldCheckmarkOutline className="w-4 h-4 text-blue-600 flex-shrink-0" />
              <span>AI system is actively monitoring road conditions. Analyzing data in real-time for your safety.</span>
            </div>
          </div>

        </div>

      </div>

      {/* Driver telemetry widgets */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Speed Card */}
        <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600">
            <IoSpeedometerOutline className="w-6 h-6" />
          </div>
          <div className="text-left">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Current Speed</span>
            <span className="block text-xl font-extrabold text-slate-800">48 km/h</span>
            <span className="text-[9px] font-bold text-green-600 bg-green-100/50 px-1.5 py-0.5 rounded-full">Safe</span>
          </div>
        </div>

        {/* Distance Card */}
        <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-green-50 flex items-center justify-center text-green-600">
            <IoTrendingUpOutline className="w-6 h-6" />
          </div>
          <div className="text-left flex-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Today's Distance</span>
            <span className="block text-xl font-extrabold text-slate-800">{mockStats.todayDistance} km</span>
            <div className="w-full bg-slate-100 h-1.5 rounded-full mt-1 overflow-hidden">
              <div className="bg-green-500 h-full" style={{ width: '60%' }}></div>
            </div>
            <span className="text-[8px] font-semibold text-slate-400">Goal: 60 km (60%)</span>
          </div>
        </div>

        {/* Drive Time Card */}
        <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-purple-50 flex items-center justify-center text-purple-600">
            <IoTimeOutline className="w-6 h-6" />
          </div>
          <div className="text-left">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Drive Time</span>
            <span className="block text-xl font-extrabold text-slate-800">{mockStats.driveTime}</span>
            <span className="text-[8px] font-semibold text-slate-400">Total Driving Time</span>
          </div>
        </div>

        {/* Total Trips Card */}
        <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-600">
            <IoCarOutline className="w-6 h-6" />
          </div>
          <div className="text-left">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Total Trips</span>
            <span className="block text-xl font-extrabold text-slate-800">{mockStats.totalTripsToday}</span>
            <span className="text-[8px] font-semibold text-slate-400">Detections Synced</span>
          </div>
        </div>

      </div>

      {/* Recent Alerts and Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Recent Alerts (Col 1-2) */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-5 border border-slate-100 shadow-sm flex flex-col gap-4">
          <div className="flex items-center justify-between border-b border-slate-50 pb-2">
            <span className="text-sm font-extrabold text-slate-800">Recent Alerts</span>
            <span onClick={() => navigate('/driver/notifications')} className="text-xs font-bold text-blue-600 hover:underline cursor-pointer">View All</span>
          </div>

          <div className="divide-y divide-slate-100">
            {recentAlerts.map((alert, i) => (
              <div key={i} className="flex items-center justify-between py-3 group cursor-pointer hover:bg-slate-50/50 px-2 rounded-xl transition-colors" onClick={() => navigate('/driver/hazard/HZ-2024-05-18-1023')}>
                <div className="flex items-center gap-3">
                  <div className={`w-2.5 h-2.5 rounded-full ${alert.color}`}></div>
                  <div className="text-left">
                    <span className="text-xs font-bold text-slate-800 block group-hover:text-blue-600 transition-colors">{alert.type}</span>
                    <span className="text-[10px] text-slate-400 font-semibold">{alert.road}</span>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-right">
                  <div className="text-left">
                    <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                      alert.severity === 'High' ? 'bg-red-50 text-red-600' : alert.severity === 'Medium' ? 'bg-orange-50 text-orange-500' : 'bg-yellow-50 text-yellow-600'
                    }`}>{alert.severity}</span>
                    <span className="block text-[10px] text-slate-400 mt-0.5">{alert.label}</span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-bold whitespace-nowrap">{alert.time}</span>
                  <IoChevronForwardOutline className="w-4 h-4 text-slate-300" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions (Col 3) */}
        <div className="flex flex-col gap-6">
          <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm flex flex-col gap-4">
            <span className="text-xs font-extrabold text-slate-800 border-b border-slate-50 pb-2">Quick Actions</span>
            
            <div className="grid grid-cols-3 gap-3">
              {[
                { name: "Report Hazard", icon: IoWarningOutline, color: "text-red-500 bg-red-50 hover:bg-red-100/50", path: "/driver/report" },
                { name: "Navigate", icon: IoCompassOutline, color: "text-blue-500 bg-blue-50 hover:bg-blue-100/50", path: "/driver/navigation" },
                { name: "Share Status", icon: IoShareSocialOutline, color: "text-green-500 bg-green-50 hover:bg-green-100/50", path: "/driver/profile" },
                { name: "Voice Alert", icon: IoVolumeHighOutline, color: "text-amber-500 bg-amber-50 hover:bg-amber-100/50", path: "/driver/settings" },
                { name: "Emergency", icon: IoAlertCircleOutline, color: "text-red-600 bg-red-100/50 hover:bg-red-200/50 font-bold", path: "/driver/navigation" },
                { name: "Invite Friends", icon: IoPersonAddOutline, color: "text-indigo-500 bg-indigo-50 hover:bg-indigo-100/50", path: "/driver/profile" }
              ].map((act, i) => {
                const Icon = act.icon;
                return (
                  <button
                    key={i}
                    onClick={() => navigate(act.path)}
                    className={`flex flex-col items-center justify-center p-3 rounded-2xl border border-transparent transition-all focus:outline-none select-none cursor-pointer ${act.color}`}
                  >
                    <Icon className="w-5 h-5 mb-1.5" />
                    <span className="text-[9px] font-bold text-center leading-none tracking-wide">{act.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* See Impact card */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-3xl p-5 shadow-lg flex items-center justify-between gap-4">
            <div className="text-left space-y-1 flex-1">
              <span className="block text-xs font-extrabold tracking-wide uppercase text-blue-200">Your reports make a difference!</span>
              <p className="text-[10px] text-slate-100 leading-normal">Together we can build safer and smarter roads for everyone.</p>
            </div>
            <button onClick={() => navigate('/driver/analytics')} className="px-4 py-2.5 bg-white text-blue-600 rounded-xl text-xs font-bold shadow-md hover:scale-105 active:scale-95 transition-all whitespace-nowrap focus:outline-none">
              See Impact
            </button>
          </div>
        </div>

      </div>

    </div>
  );
}
