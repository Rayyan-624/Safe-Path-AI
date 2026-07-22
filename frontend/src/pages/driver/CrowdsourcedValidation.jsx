import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  IoPeopleOutline, IoTrendingUpOutline, IoCheckmarkCircleOutline,
  IoCloseCircleOutline, IoCalendarOutline, IoChevronForwardOutline
} from 'react-icons/io5';

export default function DriverCrowdsourcedValidation() {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('All');

  const validations = [
    {
      id: "val-1",
      type: "Pothole",
      desc: "Large pothole detected in left lane.",
      severity: "High Risk",
      severityColor: "bg-red-50 text-red-600",
      confBefore: 72,
      confAfter: 94,
      changeText: "+22% increase",
      changeColor: "text-green-600",
      usersPassed: 28,
      usersTotal: 30,
      avatars: ["https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=50&auto=format&fit=crop", "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&auto=format&fit=crop", "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=50&auto=format&fit=crop"],
      avatarCount: 18,
      status: "Verified",
      statusColor: "bg-green-50 text-green-700 border-green-100",
      date: "24 May 2024, 10:45 AM",
      location: "Shahrah-e-Faisal, Karachi",
      photo: "https://images.unsplash.com/photo-1515162305285-0293e4767cc2?w=100&auto=format&fit=crop"
    },
    {
      id: "val-2",
      type: "Road Crack",
      desc: "Multiple longitudinal cracks detected.",
      severity: "Medium Risk",
      severityColor: "bg-orange-50 text-orange-600",
      confBefore: 65,
      confAfter: 82,
      changeText: "+17% increase",
      changeColor: "text-green-600",
      usersPassed: 15,
      usersTotal: 22,
      avatars: ["https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=50&auto=format&fit=crop", "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=50&auto=format&fit=crop", "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=50&auto=format&fit=crop"],
      avatarCount: 7,
      status: "Pending",
      statusColor: "bg-yellow-50 text-yellow-600 border-yellow-100",
      date: "24 May 2024, 09:32 AM",
      location: "University Road, Karachi",
      photo: "https://images.unsplash.com/photo-1584467541268-b040f83be3fd?w=100&auto=format&fit=crop"
    },
    {
      id: "val-3",
      type: "Road Construction",
      desc: "Ongoing road construction ahead.",
      severity: "Medium Risk",
      severityColor: "bg-orange-50 text-orange-600",
      confBefore: 68,
      confAfter: 68,
      changeText: "— No change",
      changeColor: "text-slate-400",
      usersPassed: 8,
      usersTotal: 15,
      avatars: ["https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=50&auto=format&fit=crop", "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=50&auto=format&fit=crop", "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=50&auto=format&fit=crop"],
      avatarCount: 3,
      status: "Pending",
      statusColor: "bg-yellow-50 text-yellow-600 border-yellow-100",
      date: "24 May 2024, 08:15 AM",
      location: "Korangi Crossing, Karachi",
      photo: "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=100&auto=format&fit=crop"
    },
    {
      id: "val-4",
      type: "Open Manhole",
      desc: "Open manhole detected on road.",
      severity: "Low Risk",
      severityColor: "bg-green-50 text-green-700",
      confBefore: 60,
      confAfter: 35,
      changeText: "↓ 25% decrease",
      changeColor: "text-red-500",
      usersPassed: 5,
      usersTotal: 17,
      avatars: ["https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=50&auto=format&fit=crop", "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=50&auto=format&fit=crop", "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=50&auto=format&fit=crop"],
      avatarCount: 12,
      status: "False Detection",
      statusColor: "bg-red-50 text-red-600 border-red-100",
      date: "24 May 2024, 11:20 PM",
      location: "Gulshan-e-Iqbal, Karachi",
      photo: "https://images.unsplash.com/photo-1508873696983-2df519f0397e?w=100&auto=format&fit=crop"
    },
    {
      id: "val-5",
      type: "Water Accumulation",
      desc: "Water accumulation due to rain.",
      severity: "Low Risk",
      severityColor: "bg-green-50 text-green-700",
      confBefore: 75,
      confAfter: 91,
      changeText: "+16% increase",
      changeColor: "text-green-600",
      usersPassed: 32,
      usersTotal: 40,
      avatars: ["https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=50&auto=format&fit=crop", "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=50&auto=format&fit=crop", "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=50&auto=format&fit=crop"],
      avatarCount: 21,
      status: "Verified",
      statusColor: "bg-green-50 text-green-700 border-green-100",
      date: "23 May 2024, 06:40 PM",
      location: "Clifton, Block 5, Karachi",
      photo: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=100&auto=format&fit=crop"
    }
  ];

  // Filter list
  const filteredValidations = validations.filter(v => {
    if (activeTab === 'All') return true;
    return v.status === activeTab;
  });

  return (
    <div className="space-y-6 text-left font-sans">
      
      {/* Top Banner statistics cards grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        
        <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-green-50 flex items-center justify-center text-green-600">
            <IoPeopleOutline className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Users Passed</span>
            <span className="block text-2xl font-extrabold text-slate-800">1,248</span>
            <span className="text-[9px] font-bold text-green-600">↑ 18% this week</span>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600">
            <IoTrendingUpOutline className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">AI Conf Increased</span>
            <span className="block text-2xl font-extrabold text-slate-800">24%</span>
            <span className="text-[9px] font-bold text-slate-400">Average increase</span>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-green-50 flex items-center justify-center text-green-700">
            <IoCheckmarkCircleOutline className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Verified Hazards</span>
            <span className="block text-2xl font-extrabold text-slate-800">932</span>
            <span className="text-[9px] font-bold text-green-600">76% of total</span>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-red-50 flex items-center justify-center text-red-500">
            <IoCloseCircleOutline className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">False Detections</span>
            <span className="block text-2xl font-extrabold text-slate-800">128</span>
            <span className="text-[9px] font-bold text-red-500">10% of total</span>
          </div>
        </div>

      </div>

      {/* Tabs navigation panel */}
      <div className="bg-white border border-slate-100 rounded-3xl p-4 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center border-b border-slate-100 w-full md:w-auto">
          {[
            { id: 'All', label: 'All Validations' },
            { id: 'Verified', label: 'Verified' },
            { id: 'Pending', label: 'Pending' },
            { id: 'False Detection', label: 'False Detection' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 text-xs font-bold border-b-2 transition-all focus:outline-none -mb-[2px] ${
                activeTab === tab.id
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-slate-400 hover:text-slate-600'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Dropdowns */}
        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
          <select className="px-3 py-2 border border-slate-200 rounded-xl text-xs bg-white text-slate-600 font-semibold focus:outline-none">
            <option>All Hazard Types</option>
            <option>Potholes</option>
            <option>Cracks</option>
          </select>
          <div className="flex items-center gap-1.5 px-3 py-2 border border-slate-200 rounded-xl text-xs font-semibold text-slate-600 bg-white">
            <IoCalendarOutline className="w-4 h-4 text-slate-400" />
            <span>18 May 2024 - 24 May 2024</span>
          </div>
        </div>
      </div>

      {/* Main Validation Log Table view */}
      <div className="bg-white border border-slate-100 rounded-3xl shadow-sm overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[700px]">
          <thead>
            <tr className="border-b border-slate-100 text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">
              <th className="p-4 pl-6">Detected Hazard</th>
              <th className="p-4">AI Confidence</th>
              <th className="p-4">Community Validation</th>
              <th className="p-4">Status</th>
              <th className="p-4 pr-6">Date & Location</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs">
            {filteredValidations.map((val) => (
              <tr key={val.id} className="hover:bg-slate-50/50 transition-colors group cursor-pointer" onClick={() => navigate('/driver/hazard/HZ-2024-05-18-1023')}>
                {/* Info block */}
                <td className="p-4 pl-6 flex gap-3.5 items-start">
                  <div className="w-14 h-14 rounded-xl overflow-hidden border border-slate-200 bg-slate-900 shrink-0">
                    <img src={val.photo} alt={val.type} className="w-full h-full object-cover" />
                  </div>
                  <div className="space-y-1 text-left leading-tight">
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-slate-800 block group-hover:text-blue-600 transition-colors">{val.type}</span>
                      <span className={`px-1.5 py-0.5 text-[8px] font-bold rounded ${val.severityColor} uppercase tracking-wider`}>{val.severity}</span>
                    </div>
                    <p className="text-[10px] text-slate-400 font-semibold">{val.desc}</p>
                  </div>
                </td>

                {/* AI Stats */}
                <td className="p-4 leading-tight">
                  <div className="flex items-center gap-1.5">
                    <span className="text-slate-500 font-semibold">{val.confBefore}%</span>
                    <span className="text-slate-400">→</span>
                    <span className="font-extrabold text-slate-800">{val.confAfter}%</span>
                  </div>
                  <span className={`text-[9px] font-bold ${val.changeColor} block mt-1`}>{val.changeText}</span>
                </td>

                {/* User validation stats */}
                <td className="p-4">
                  <div className="flex items-center gap-2">
                    {/* Avatars stacked list */}
                    <div className="flex -space-x-2 overflow-hidden">
                      {val.avatars.map((av, idx) => (
                        <img key={idx} className="inline-block h-6 w-6 rounded-full ring-2 ring-white object-cover" src={av} alt="user avatar" />
                      ))}
                      <div className="inline-block h-6 w-6 rounded-full ring-2 ring-white bg-slate-100 flex items-center justify-center text-[9px] font-bold text-slate-500">+{val.avatarCount}</div>
                    </div>
                    <span className="text-[10px] font-bold text-slate-600">{val.usersPassed} / {val.usersTotal} passed</span>
                  </div>
                  {/* Progress bar */}
                  <div className="w-32 bg-slate-100 h-1 rounded-full mt-2 overflow-hidden">
                    <div className={`h-full ${val.status === 'False Detection' ? 'bg-red-500' : val.status === 'Pending' ? 'bg-yellow-500' : 'bg-green-500'}`} style={{ width: `${(val.usersPassed/val.usersTotal)*100}%` }}></div>
                  </div>
                </td>

                {/* Status */}
                <td className="p-4">
                  <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-wider border ${val.statusColor}`}>
                    {val.status}
                  </span>
                </td>

                {/* Date location details */}
                <td className="p-4 pr-6 leading-tight">
                  <div className="flex justify-between items-center gap-4">
                    <div>
                      <span className="block text-slate-800 font-bold">{val.location}</span>
                      <span className="text-[9px] text-slate-400 font-semibold">{val.date}</span>
                    </div>
                    <IoChevronForwardOutline className="w-4 h-4 text-slate-300 group-hover:text-blue-500 transition-colors" />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="flex items-center justify-between text-xs font-bold text-slate-400 border-t border-slate-100 pt-4">
        <span>Showing 1 to 5 of 245 validations</span>
        <div className="flex items-center gap-1.5">
          <button className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-400 disabled:opacity-40 select-none">&lt;</button>
          <span className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center">1</span>
          <span className="w-7 h-7 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 flex items-center justify-center cursor-pointer">2</span>
          <span className="w-7 h-7 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 flex items-center justify-center cursor-pointer">3</span>
          <span className="px-1">...</span>
          <span className="w-7 h-7 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 flex items-center justify-center cursor-pointer">49</span>
          <button className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600 select-none">&gt;</button>
        </div>
      </div>

    </div>
  );
}
