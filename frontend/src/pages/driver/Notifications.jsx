import React, { useState } from 'react';
import { mockNotifications } from '../../data/mockData';
import {
  IoNotificationsOutline, IoWarningOutline, IoBusinessOutline,
  IoConstructOutline, IoCloudyNightOutline, IoFunnelOutline,
  IoChevronDownOutline, IoEllipsisVerticalOutline
} from 'react-icons/io5';

export default function DriverNotifications() {
  const [activeTab, setActiveTab] = useState('All');

  const tabs = [
    { id: 'All', label: 'All', count: 24, icon: IoNotificationsOutline, color: 'text-blue-600 bg-blue-50' },
    { id: 'Road Alert', label: 'Road Alerts', count: 8, icon: IoWarningOutline, color: 'text-red-500 bg-red-50' },
    { id: 'Municipality Notice', label: 'Municipality Notices', count: 6, icon: IoBusinessOutline, color: 'text-blue-600 bg-blue-50' },
    { id: 'Construction Alert', label: 'Construction Alerts', count: 6, icon: IoConstructOutline, color: 'text-orange-500 bg-orange-50' },
    { id: 'Flood Warning', label: 'Flood Warnings', count: 4, icon: IoCloudyNightOutline, color: 'text-purple-600 bg-purple-50' }
  ];

  const filteredNotifications = mockNotifications.filter(n => {
    if (activeTab === 'All') return true;
    return n.type === activeTab;
  });

  return (
    <div className="space-y-6 text-left font-sans">
      
      {/* Page Title Header */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div>
          <h2 className="text-sm font-extrabold text-slate-800">Notifications</h2>
          <p className="text-[10px] text-slate-500 font-semibold mt-0.5">Stay informed about road conditions and important updates</p>
        </div>
      </div>

      {/* Filter Tabs Header */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center justify-between p-3.5 rounded-2xl border text-xs font-bold focus:outline-none transition-all cursor-pointer ${
                isActive
                  ? 'border-blue-600 bg-blue-50/20 text-blue-600 ring-1 ring-blue-600'
                  : 'border-slate-100 bg-white hover:bg-slate-50 text-slate-600'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${tab.color}`}>
                  <Icon className="w-4.5 h-4.5" />
                </div>
                <span>{tab.label}</span>
              </div>
              <span className="px-2 py-0.5 bg-slate-100 text-slate-500 text-[10px] rounded-full">{tab.count}</span>
            </button>
          );
        })}
      </div>

      {/* Filters row actions */}
      <div className="flex items-center justify-between gap-4 text-xs font-bold text-slate-600">
        <button className="px-4 py-2 border border-slate-200 hover:bg-slate-50 rounded-xl flex items-center gap-1.5 focus:outline-none">
          <IoFunnelOutline className="w-4 h-4 text-slate-400" />
          <span>Filter</span>
        </button>

        <button className="px-4 py-2 border border-slate-200 hover:bg-slate-50 rounded-xl flex items-center gap-1 focus:outline-none">
          <span>Most Recent</span>
          <IoChevronDownOutline className="w-4 h-4 text-slate-400" />
        </button>
      </div>

      {/* Notifications list */}
      <div className="space-y-4">
        {filteredNotifications.map((notif) => {
          
          let itemColor = {
            iconBg: 'bg-red-50 text-red-500',
            icon: IoWarningOutline,
            tagColor: 'bg-red-50 text-red-600'
          };

          if (notif.type === 'Municipality Notice') {
            itemColor = {
              iconBg: 'bg-blue-50 text-blue-600',
              icon: IoBusinessOutline,
              tagColor: 'bg-blue-50 text-blue-600'
            };
          } else if (notif.type === 'Construction Alert') {
            itemColor = {
              iconBg: 'bg-orange-50 text-orange-500',
              icon: IoConstructOutline,
              tagColor: 'bg-orange-50 text-orange-600'
            };
          } else if (notif.type === 'Flood Warning') {
            itemColor = {
              iconBg: 'bg-purple-50 text-purple-600',
              icon: IoCloudyNightOutline,
              tagColor: 'bg-purple-50 text-purple-600'
            };
          }

          const NotifIcon = itemColor.icon;

          return (
            <div key={notif.id} className="bg-white border border-slate-100 rounded-3xl p-5 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:border-blue-100 transition-colors">
              
              {/* Left Column: Icon and text */}
              <div className="flex gap-4 items-start">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 border border-slate-50 ${itemColor.iconBg}`}>
                  <NotifIcon className="w-6 h-6" />
                </div>

                <div className="text-left space-y-1 leading-tight">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`px-2 py-0.5 text-[8px] font-bold rounded-full uppercase tracking-wider ${itemColor.tagColor}`}>{notif.type}</span>
                    {notif.severity && (
                      <span className="px-2 py-0.5 bg-slate-100 text-slate-500 text-[8px] font-bold rounded-full uppercase tracking-wider">{notif.severity}</span>
                    )}
                  </div>
                  <span className="block font-extrabold text-sm text-slate-800">{notif.title}</span>
                  <p className="text-xs text-slate-500 font-semibold">{notif.description}</p>
                  <span className="text-[10px] text-slate-400 font-semibold flex items-center gap-1 pt-1">
                    <span>📍 {notif.location}</span>
                  </span>
                </div>
              </div>

              {/* Right Column: Time and Image */}
              <div className="flex items-center gap-6 text-right w-full sm:w-auto shrink-0 self-end sm:self-center justify-between sm:justify-end">
                <div className="leading-tight text-left sm:text-right">
                  <span className="text-xs font-bold text-slate-800 block">{notif.time}</span>
                  <span className="text-[10px] text-slate-400 font-semibold block">{notif.date}</span>
                  <span className="inline-block text-[9px] font-extrabold text-red-500 mt-1">● {notif.severity}</span>
                </div>

                {/* Photo thumbnail */}
                <div className="w-24 h-16 rounded-xl overflow-hidden border border-slate-200 bg-slate-900 shrink-0">
                  <img src={notif.image} alt={notif.title} className="w-full h-full object-cover" />
                </div>

                <button className="text-slate-300 hover:text-slate-500 focus:outline-none hidden sm:block">
                  <IoEllipsisVerticalOutline className="w-4 h-4" />
                </button>
              </div>

            </div>
          );
        })}
      </div>

      {/* Pagination Footer */}
      <div className="flex items-center justify-between text-xs font-bold text-slate-400 border-t border-slate-100 pt-4">
        <span>Showing 1 to 4 of 24 notifications</span>
        <div className="flex items-center gap-1.5">
          <button className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-400 disabled:opacity-40 select-none">&lt;</button>
          <span className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center">1</span>
          <span className="w-7 h-7 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 flex items-center justify-center cursor-pointer">2</span>
          <span className="w-7 h-7 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 flex items-center justify-center cursor-pointer">3</span>
          <button className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600 select-none">&gt;</button>
        </div>
      </div>

    </div>
  );
}

// Simple placeholder for construction icons
function IoConstructOutline(props) {
  return (
    <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
    </svg>
  );
}
