import React from 'react';
import { useNavigate } from 'react-router-dom';
import { mockDriverInfo, mockStats } from '../../data/mockData';
import {
  IoCameraOutline, IoShareOutline, IoSettingsOutline, IoStatsChartOutline,
  IoAwardOutline, IoShieldOutline, IoChevronForwardOutline, IoCalendarOutline,
  IoLockClosedOutline, IoCallOutline, IoPersonOutline, IoLocationOutline, IoMailOutline
} from 'react-icons/io5';

export default function DriverProfile() {
  const navigate = useNavigate();

  const badges = [
    { name: "Road Guard", level: "Level 5", icon: "🛡️", desc: "For hazard spotters", color: "bg-blue-50 text-blue-600 border-blue-100" },
    { name: "Eco Driver", level: "Level 3", icon: "🌱", desc: "For carbon savers", color: "bg-green-50 text-green-700 border-green-100" },
    { name: "Community Hero", level: "Level 2", icon: "👥", desc: "For group helpers", color: "bg-purple-50 text-purple-600 border-purple-100" },
    { name: "Reporter", level: "Level 4", icon: "📢", desc: "For bulk reporting", color: "bg-amber-50 text-amber-700 border-amber-100" }
  ];

  const achievements = [
    { title: "100 Safe Drives", date: "10 May 2024", desc: "Completed 100 safe drives without any high risk alerts." },
    { title: "Top Reporter", date: "03 May 2024", desc: "Submitted 50+ verified reports." },
    { title: "Hazard Avoider", date: "28 Apr 2024", desc: "Avoided 20 high risk hazards." },
    { title: "Week Warrior", date: "21 Apr 2024", desc: "Active for 7 days in a row." }
  ];

  return (
    <div className="space-y-6 text-left font-sans">
      
      {/* Top Banner Header Title */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div>
          <h2 className="text-sm font-extrabold text-slate-800">My Profile</h2>
          <p className="text-[10px] text-slate-500 font-semibold mt-0.5">Manage your profile, vehicle, statistics and settings</p>
        </div>
      </div>

      {/* Main Profile Info Card */}
      <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex flex-col md:flex-row gap-8 items-center justify-between">
        
        {/* Left Side avatar */}
        <div className="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left">
          <div className="relative w-24 h-24 rounded-full bg-slate-100 border-4 border-white shadow-lg overflow-hidden shrink-0 group cursor-pointer">
            <img src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200&auto=format&fit=crop" alt="avatar" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-white text-xs">
              <IoCameraOutline className="w-6 h-6" />
            </div>
          </div>

          <div className="space-y-2 leading-tight">
            <div className="flex flex-wrap items-center gap-2 justify-center sm:justify-start">
              <h3 className="text-lg font-extrabold text-slate-800">{mockDriverInfo.name}</h3>
              <span className="px-2.5 py-0.5 bg-blue-100 text-blue-700 font-extrabold text-[9px] rounded-full uppercase tracking-wider">Premium Member</span>
            </div>
            
            <div className="space-y-1 text-slate-500 text-xs font-semibold">
              <span className="block flex items-center gap-1.5 justify-center sm:justify-start"><IoMailOutline className="w-4 h-4 text-slate-400" />{mockDriverInfo.email}</span>
              <span className="block flex items-center gap-1.5 justify-center sm:justify-start"><IoCallOutline className="w-4 h-4 text-slate-400" />{mockDriverInfo.phone}</span>
              <span className="block flex items-center gap-1.5 justify-center sm:justify-start"><IoLocationOutline className="w-4 h-4 text-slate-400" />{mockDriverInfo.location}</span>
            </div>

            <div className="flex gap-2 justify-center sm:justify-start pt-1">
              <button className="px-3.5 py-1.5 border border-slate-200 hover:bg-slate-50 rounded-xl text-xs font-bold text-slate-700 focus:outline-none">Edit Profile</button>
              <button className="px-3.5 py-1.5 border border-slate-200 hover:bg-slate-50 rounded-xl text-xs font-bold text-slate-700 focus:outline-none"><IoShareOutline className="w-4 h-4" /></button>
            </div>
          </div>
        </div>

        {/* Middle Stats */}
        <div className="grid grid-cols-2 gap-8 text-center sm:text-left border-y sm:border-y-0 sm:border-x border-slate-100 py-4 sm:py-0 px-8">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Member Since</span>
            <span className="text-sm font-extrabold text-slate-800 mt-1 block">{mockDriverInfo.memberSince}</span>
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Total Points</span>
            <span className="text-sm font-extrabold text-green-600 mt-1 block">{mockDriverInfo.totalPoints} pts</span>
          </div>
        </div>

        {/* Right Level gauge */}
        <div className="w-full md:w-64 space-y-2 text-left bg-slate-50 border border-slate-100 p-4 rounded-2xl">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🏆</span>
            <div>
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wide">Level {mockDriverInfo.level}</span>
              <span className="text-xs font-extrabold text-slate-800 block leading-none">{mockDriverInfo.levelName}</span>
            </div>
          </div>
          <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
            <div className="bg-blue-600 h-full" style={{ width: '71%' }}></div>
          </div>
          <div className="flex justify-between items-center text-[9px] font-bold text-slate-500">
            <span>2,840 pts</span>
            <span>4,000 pts</span>
          </div>
          <span className="text-[8px] font-semibold text-slate-400 block border-t border-slate-200/60 pt-1.5">1,160 pts to reach Level 8</span>
        </div>

      </div>

      {/* Middle Row Layout: Vehicle and Driving stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* My Vehicle Card (Col 1) */}
        <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm flex flex-col justify-between gap-4">
          <div className="flex items-center justify-between border-b border-slate-50 pb-2">
            <span className="text-xs font-extrabold text-slate-800">My Vehicle</span>
          </div>

          <div className="space-y-4">
            <div className="w-full h-32 rounded-2xl overflow-hidden border border-slate-200 bg-slate-50 relative flex items-center justify-center">
              <img src="https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=400&auto=format&fit=crop&q=80" alt="Motorcycle" className="w-full h-full object-cover" />
            </div>

            <div className="space-y-2 text-xs font-bold text-slate-500">
              <div className="flex justify-between items-center"><span className="text-slate-800 text-sm font-extrabold">{mockDriverInfo.vehicle.name}</span><span className="px-2 py-0.5 bg-green-100 text-green-700 text-[8px] rounded-full uppercase tracking-wider">Active</span></div>
              <div className="flex justify-between items-center"><span>Registration</span><span className="text-slate-800 font-extrabold">{mockDriverInfo.vehicle.registration}</span></div>
              <div className="flex justify-between items-center"><span>Vehicle Type</span><span className="text-slate-800 font-extrabold">{mockDriverInfo.vehicle.type}</span></div>
              <div className="flex justify-between items-center"><span>Model Year</span><span className="text-slate-800 font-extrabold">{mockDriverInfo.vehicle.year}</span></div>
              <div className="flex justify-between items-center"><span>Color</span><span className="text-slate-800 font-extrabold">{mockDriverInfo.vehicle.color}</span></div>
              <div className="flex justify-between items-center"><span>Added On</span><span className="text-slate-800 font-semibold">{mockDriverInfo.vehicle.addedOn}</span></div>
            </div>
          </div>

          <button className="w-full py-2.5 border border-slate-200 hover:bg-slate-50 rounded-xl text-xs font-bold text-slate-700 focus:outline-none flex items-center justify-center gap-1 cursor-pointer">
            <IoSettingsOutline className="w-4 h-4 text-slate-400" />
            <span>Manage Vehicles</span>
          </button>
        </div>

        {/* Driving Statistics Grid (Col 2-3) */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-5 border border-slate-100 shadow-sm flex flex-col justify-between gap-4">
          <div className="flex items-center justify-between border-b border-slate-50 pb-2">
            <span className="text-xs font-extrabold text-slate-800">Driving Statistics</span>
            <div className="flex items-center gap-1 text-[10px] text-slate-400 font-bold">
              <IoCalendarOutline className="w-4 h-4" />
              <span>18 May 2024 - 24 May 2024</span>
            </div>
          </div>

          {/* 4 large stats cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-slate-50/50 border border-slate-100 rounded-2xl p-4 text-left leading-tight">
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wide block">Distance Traveled</span>
              <span className="text-lg font-extrabold text-slate-800 block mt-1">126.4 km</span>
              <span className="text-[8px] font-bold text-green-600">↑ 18% vs last week</span>
            </div>
            <div className="bg-slate-50/50 border border-slate-100 rounded-2xl p-4 text-left leading-tight">
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wide block">Avg. Speed</span>
              <span className="text-lg font-extrabold text-slate-800 block mt-1">42 km/h</span>
              <span className="text-[8px] font-bold text-red-500">↓ 3% vs last week</span>
            </div>
            <div className="bg-slate-50/50 border border-slate-100 rounded-2xl p-4 text-left leading-tight">
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wide block">Safe Driving Score</span>
              <span className="text-lg font-extrabold text-slate-800 block mt-1">92 / 100</span>
              <span className="text-[8px] font-bold text-green-600">↑ 8% vs last week</span>
            </div>
            <div className="bg-slate-50/50 border border-slate-100 rounded-2xl p-4 text-left leading-tight">
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wide block">Harsh Braking</span>
              <span className="text-lg font-extrabold text-slate-800 block mt-1">8 times</span>
              <span className="text-[8px] font-bold text-green-600">↓ 33% vs last week</span>
            </div>
          </div>

          {/* 4 smaller stats list */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 border-t border-slate-50 pt-4 text-xs font-semibold text-slate-500">
            <div className="text-left"><span className="text-[10px] font-bold text-slate-400 block">Reports Submitted</span><span className="text-slate-800 font-extrabold text-sm mt-0.5 block">15</span><span className="text-[8px] text-green-600 font-bold">↑ 36%</span></div>
            <div className="text-left"><span className="text-[10px] font-bold text-slate-400 block">Hazards Avoided</span><span className="text-slate-800 font-extrabold text-sm mt-0.5 block">24</span><span className="text-[8px] text-green-600 font-bold">↑ 20%</span></div>
            <div className="text-left"><span className="text-[10px] font-bold text-slate-400 block">Total Drive Time</span><span className="text-slate-800 font-extrabold text-sm mt-0.5 block">6h 42m</span><span className="text-[8px] text-green-600 font-bold">↑ 14%</span></div>
            <div className="text-left"><span className="text-[10px] font-bold text-slate-400 block">High Risk Alerts</span><span className="text-slate-800 font-extrabold text-sm mt-0.5 block">5</span><span className="text-[8px] text-green-600 font-bold">↓ 17%</span></div>
          </div>
        </div>

      </div>

      {/* Bottom Row: Badges, Achievements and settings links */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Badges list (Col 1) */}
        <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm flex flex-col gap-4">
          <div className="flex items-center justify-between border-b border-slate-50 pb-2">
            <span className="text-xs font-extrabold text-slate-800">Badges</span>
            <span className="text-[10px] font-bold text-blue-600 cursor-pointer hover:underline">View All</span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {badges.map((badge, idx) => (
              <div key={idx} className={`p-3 rounded-2xl border text-center space-y-2 flex flex-col items-center justify-center ${badge.color}`}>
                <span className="text-3xl">{badge.icon}</span>
                <div className="leading-tight">
                  <span className="text-[10px] font-bold text-slate-800 block">{badge.name}</span>
                  <span className="text-[9px] font-semibold text-slate-500 block mt-0.5">{badge.level}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Achievements list (Col 2) */}
        <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm flex flex-col gap-4">
          <div className="flex items-center justify-between border-b border-slate-50 pb-2">
            <span className="text-xs font-extrabold text-slate-800">Achievements</span>
            <span className="text-[10px] font-bold text-blue-600 cursor-pointer hover:underline">View All</span>
          </div>

          <div className="space-y-3.5 overflow-y-auto max-h-48 pr-1">
            {achievements.map((item, idx) => (
              <div key={idx} className="flex gap-3 items-start border-b border-slate-50 pb-2 last:border-0 last:pb-0 text-left">
                <span className="text-xl pt-0.5">⭐</span>
                <div className="leading-tight">
                  <div className="flex items-center justify-between w-full">
                    <span className="text-xs font-extrabold text-slate-800">{item.title}</span>
                    <span className="text-[9px] text-slate-400 font-bold">{item.date}</span>
                  </div>
                  <p className="text-[10px] text-slate-500 mt-1 font-semibold leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Settings list (Col 3) */}
        <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm flex flex-col gap-4">
          <span className="text-xs font-extrabold text-slate-800 border-b border-slate-50 pb-2 block">Quick Settings</span>
          
          <div className="flex-1 flex flex-col gap-1">
            {[
              { title: "Personal Information", sub: "Update name, email and phone number", icon: IoPersonOutline },
              { title: "Notification Preferences", sub: "Manage your notification settings", icon: IoAwardOutline },
              { title: "Privacy Settings", sub: "Control your data and visibility", icon: IoLockClosedOutline },
              { title: "Connected Devices", sub: "Manage your connected devices", icon: IoSettingsOutline },
              { title: "Account Settings", sub: "Change password and security options", icon: IoShieldOutline }
            ].map((set, idx) => {
              const SetIcon = set.icon;
              return (
                <div
                  key={idx}
                  onClick={() => navigate('/driver/settings')}
                  className="flex items-center justify-between p-2.5 rounded-xl border border-transparent hover:bg-slate-50 transition-colors cursor-pointer text-slate-700 hover:text-blue-600 group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-slate-50 text-slate-400 group-hover:text-blue-600 flex items-center justify-center shrink-0"><SetIcon className="w-4 h-4" /></div>
                    <div className="text-left leading-tight">
                      <span className="text-xs font-bold block">{set.title}</span>
                      <span className="text-[9px] text-slate-400 font-semibold group-hover:text-slate-500 transition-colors">{set.sub}</span>
                    </div>
                  </div>
                  <IoChevronForwardOutline className="w-4 h-4 text-slate-300 group-hover:text-blue-500 transition-colors" />
                </div>
              );
            })}
          </div>
        </div>

      </div>

    </div>
  );
}
