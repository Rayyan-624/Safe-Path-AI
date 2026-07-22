import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { mockHazards } from '../../data/mockData';
import {
  IoWarningOutline, IoShieldOutline, IoPulseOutline, IoCheckmarkCircleOutline,
  IoSearchOutline, IoFunnelOutline, IoCalendarOutline, IoChevronForwardOutline,
  IoEllipsisVerticalOutline, IoAddCircleOutline
} from 'react-icons/io5';

export default function AdminHazardManagement() {
  const navigate = useNavigate();

  const [search, setSearch] = useState('');
  const [activeStatus, setActiveStatus] = useState('All');

  const adminHazards = [
    {
      id: "HZ-2024-05-18-1023",
      type: "Pothole",
      desc: "Large pothole in the middle of Shahrah-e-Faisal",
      severity: "Critical",
      severityColor: "bg-red-50 text-red-600 border-red-100",
      confidence: "92%",
      usersPassed: 28,
      usersTotal: 30,
      avatars: ["https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=50", "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50"],
      avatarCount: 18,
      status: "Under Review",
      statusColor: "bg-yellow-50 text-yellow-600 border-yellow-100",
      photo: "https://images.unsplash.com/photo-1515162305285-0293e4767cc2?w=100&auto=format&fit=crop"
    },
    {
      id: "HZ-2024-05-18-1024",
      type: "Road Crack",
      desc: "Severe cracks on Korangi Road",
      severity: "Moderate",
      severityColor: "bg-orange-50 text-orange-500 border-orange-100",
      confidence: "85%",
      usersPassed: 15,
      usersTotal: 22,
      avatars: ["https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=50", "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=50"],
      avatarCount: 7,
      status: "Pending",
      statusColor: "bg-orange-50 text-orange-500 border-orange-100",
      photo: "https://images.unsplash.com/photo-1584467541268-b040f83be3fd?w=100&auto=format&fit=crop"
    },
    {
      id: "HZ-2024-05-18-1025",
      type: "Road Construction",
      desc: "Unmarked construction near University Road",
      severity: "Moderate",
      severityColor: "bg-orange-50 text-orange-500 border-orange-100",
      confidence: "88%",
      usersPassed: 8,
      usersTotal: 15,
      avatars: ["https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=50", "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=50"],
      avatarCount: 3,
      status: "Work In Progress",
      statusColor: "bg-blue-50 text-blue-600 border-blue-100",
      photo: "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=100&auto=format&fit=crop"
    },
    {
      id: "HZ-2024-05-18-1026",
      type: "Open Manhole",
      desc: "Open manhole on Clifton Beach road",
      severity: "Critical",
      severityColor: "bg-red-50 text-red-600 border-red-100",
      confidence: "90%",
      usersPassed: 22,
      usersTotal: 25,
      avatars: ["https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=50", "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=50"],
      avatarCount: 12,
      status: "Resolved",
      statusColor: "bg-green-50 text-green-700 border-green-100",
      photo: "https://images.unsplash.com/photo-1508873696983-2df519f0397e?w=100&auto=format&fit=crop"
    },
    {
      id: "HZ-2024-05-18-1027",
      type: "Flooded Road",
      desc: "Severe water logging near Stadium",
      severity: "High",
      severityColor: "bg-red-50 text-red-600 border-red-100",
      confidence: "95%",
      usersPassed: 38,
      usersTotal: 40,
      avatars: ["https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=50", "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=50"],
      avatarCount: 25,
      status: "Under Review",
      statusColor: "bg-yellow-50 text-yellow-600 border-yellow-100",
      photo: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=100&auto=format&fit=crop"
    }
  ];

  return (
    <div className="space-y-6 text-left font-sans">
      
      {/* Top statistics cards row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        
        <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-500 flex items-center justify-center shrink-0">
            <IoWarningOutline className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Total Reported</span>
            <span className="block text-2xl font-extrabold text-slate-800">4,892</span>
            <span className="text-[9px] font-bold text-red-500">↑ 12% vs last month</span>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center shrink-0">
            <IoShieldOutline className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Critical Hazards</span>
            <span className="block text-2xl font-extrabold text-slate-800">342</span>
            <span className="text-[9px] font-bold text-red-600">24 Assigned</span>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-yellow-50 text-yellow-600 flex items-center justify-center shrink-0">
            <IoPulseOutline className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Under Review</span>
            <span className="block text-2xl font-extrabold text-slate-800">1,256</span>
            <span className="text-[9px] font-bold text-yellow-600">↑ 18% vs last month</span>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-green-50 text-green-700 flex items-center justify-center shrink-0">
            <IoCheckmarkCircleOutline className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Resolved Hazards</span>
            <span className="block text-2xl font-extrabold text-slate-800">3,294</span>
            <span className="text-[9px] font-bold text-green-600">95% success rate</span>
          </div>
        </div>

      </div>

      {/* Filters row actions */}
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
              placeholder="Search hazards..."
              className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-xl text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none bg-slate-50/50"
            />
          </div>

          <select className="px-3 py-2 border border-slate-200 rounded-xl text-xs bg-white text-slate-600 font-semibold focus:outline-none cursor-pointer">
            <option>All Hazard Types</option>
            <option>Potholes</option>
            <option>Cracks</option>
          </select>

          <select className="px-3 py-2 border border-slate-200 rounded-xl text-xs bg-white text-slate-600 font-semibold focus:outline-none cursor-pointer">
            <option>All Severity</option>
            <option>Critical</option>
            <option>Moderate</option>
          </select>

          <select className="px-3 py-2 border border-slate-200 rounded-xl text-xs bg-white text-slate-600 font-semibold focus:outline-none cursor-pointer">
            <option>All Status</option>
            <option>Under Review</option>
            <option>Resolved</option>
          </select>

          <div className="flex items-center gap-1.5 px-3 py-2 border border-slate-200 rounded-xl text-xs font-semibold text-slate-600 bg-white">
            <IoCalendarOutline className="w-4 h-4 text-slate-400" />
            <span>18 May 2024 - 24 May 2024</span>
          </div>
        </div>

        <button
          onClick={() => navigate('/admin/maintenance')}
          className="px-5 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-xl text-xs font-bold shadow-md hover:shadow-lg transition-all focus:outline-none flex items-center gap-1.5 cursor-pointer"
        >
          <IoAddCircleOutline className="w-4.5 h-4.5" />
          <span>Assign Job</span>
        </button>

      </div>

      {/* Main Hazards table */}
      <div className="bg-white border border-slate-100 rounded-3xl shadow-sm overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[800px]">
          <thead>
            <tr className="border-b border-slate-100 text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">
              <th className="p-4 pl-6 w-12"><input type="checkbox" className="rounded text-blue-600 focus:ring-blue-500 border-slate-300 w-4 h-4" /></th>
              <th className="p-4">Hazard Details</th>
              <th className="p-4">Risk Level</th>
              <th className="p-4">Confidence</th>
              <th className="p-4">Community Validation</th>
              <th className="p-4">Status</th>
              <th className="p-4 pr-6 w-20">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs">
            {adminHazards.map((haz) => (
              <tr key={haz.id} className="hover:bg-slate-50/50 transition-colors group cursor-pointer" onClick={() => navigate('/driver/hazard/HZ-2024-05-18-1023')}>
                <td className="p-4 pl-6" onClick={(e) => e.stopPropagation()}><input type="checkbox" className="rounded text-blue-600 focus:ring-blue-500 border-slate-300 w-4 h-4" /></td>
                
                {/* Details */}
                <td className="p-4 flex gap-3.5 items-start">
                  <div className="w-14 h-14 rounded-xl overflow-hidden border border-slate-200 bg-slate-900 shrink-0">
                    <img src={haz.photo} alt={haz.type} className="w-full h-full object-cover" />
                  </div>
                  <div className="space-y-1 text-left leading-tight">
                    <div className="flex items-center gap-1.5">
                      <span className="font-extrabold text-slate-800 text-xs block group-hover:text-blue-600 transition-colors">{haz.type}</span>
                      <span className="text-[9px] text-slate-400 font-semibold">{haz.id}</span>
                    </div>
                    <p className="text-[10px] text-slate-400 font-semibold">{haz.desc}</p>
                  </div>
                </td>

                {/* Risk Level */}
                <td className="p-4">
                  <span className={`px-2 py-0.5 rounded text-[9px] font-extrabold uppercase tracking-wider border ${haz.severityColor}`}>
                    {haz.severity}
                  </span>
                </td>

                {/* Confidence */}
                <td className="p-4">
                  <span className="font-extrabold text-slate-800 text-xs block">{haz.confidence}</span>
                  <div className="w-14 bg-slate-100 h-1 rounded-full mt-1.5 overflow-hidden">
                    <div className="bg-blue-600 h-full" style={{ width: haz.confidence }}></div>
                  </div>
                </td>

                {/* Community validations */}
                <td className="p-4">
                  <div className="flex items-center gap-2">
                    <div className="flex -space-x-1.5 overflow-hidden">
                      {haz.avatars.map((av, idx) => (
                        <img key={idx} className="inline-block h-5.5 w-5.5 rounded-full ring-2 ring-white object-cover" src={av} alt="user avatar" />
                      ))}
                      <div className="inline-block h-5.5 w-5.5 rounded-full ring-2 ring-white bg-slate-50 flex items-center justify-center text-[8px] font-bold text-slate-400">+{haz.avatarCount}</div>
                    </div>
                    <span className="text-[10px] font-bold text-slate-500">{haz.usersPassed} / {haz.usersTotal} users</span>
                  </div>
                </td>

                {/* Status */}
                <td className="p-4">
                  <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-wider border ${haz.statusColor}`}>
                    {haz.status}
                  </span>
                </td>

                {/* Actions */}
                <td className="p-4 pr-6" onClick={(e) => e.stopPropagation()}>
                  <div className="flex items-center gap-2.5">
                    <button className="text-xs font-bold text-blue-600 hover:underline">Edit</button>
                    <button className="text-slate-350 hover:text-slate-500 focus:outline-none"><IoEllipsisVerticalOutline className="w-4 h-4" /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="flex items-center justify-between text-xs font-bold text-slate-400 border-t border-slate-100 pt-4">
        <span>Showing 1 to 5 of 4,892 hazards</span>
        <div className="flex items-center gap-1.5">
          <button className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-400 disabled:opacity-40 select-none">&lt;</button>
          <span className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center">1</span>
          <span className="w-7 h-7 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 flex items-center justify-center cursor-pointer">2</span>
          <span className="w-7 h-7 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 flex items-center justify-center cursor-pointer">3</span>
          <span className="px-1">...</span>
          <span className="w-7 h-7 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 flex items-center justify-center cursor-pointer">98</span>
          <button className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600 select-none">&gt;</button>
        </div>
      </div>

    </div>
  );
}
