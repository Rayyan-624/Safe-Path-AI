import React, { useState, useEffect, useCallback } from 'react';
import { notificationService } from '../../services/api';
import {
  IoNotificationsOutline, IoWarningOutline, IoBusinessOutline,
  IoConstructOutline, IoCloudyNightOutline, IoFunnelOutline,
  IoChevronDownOutline, IoEllipsisVerticalOutline, IoCheckmarkDoneOutline,
  IoRefreshOutline
} from 'react-icons/io5';

const TYPE_CONFIG = {
  'Road Alert':          { icon: IoWarningOutline,      iconBg: 'bg-red-50 text-red-500',     tagColor: 'bg-red-50 text-red-600' },
  'Municipality Notice': { icon: IoBusinessOutline,    iconBg: 'bg-blue-50 text-blue-600',   tagColor: 'bg-blue-50 text-blue-600' },
  'Construction Alert':  { icon: IoConstructOutline,   iconBg: 'bg-orange-50 text-orange-500', tagColor: 'bg-orange-50 text-orange-600' },
  'Flood Warning':       { icon: IoCloudyNightOutline, iconBg: 'bg-purple-50 text-purple-600', tagColor: 'bg-purple-50 text-purple-600' },
  default:               { icon: IoNotificationsOutline, iconBg: 'bg-slate-50 text-slate-500', tagColor: 'bg-slate-100 text-slate-600' },
};

function getConfig(type) {
  return TYPE_CONFIG[type] || TYPE_CONFIG.default;
}

export default function DriverNotifications() {
  const [activeTab, setActiveTab] = useState('All');
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const fetchNotifications = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await notificationService.getAll({ limit: 100 });
      setNotifications(res.data || []);
    } catch (err) {
      console.error('Notifications fetch error:', err);
      setError('Could not load notifications. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  // Mark a single notification read
  const handleMarkRead = async (id, e) => {
    e.stopPropagation();
    try {
      await notificationService.markRead(id);
      setNotifications(prev =>
        prev.map(n => n.id === id ? { ...n, is_read: true } : n)
      );
    } catch (err) {
      console.error('Mark read error:', err);
    }
  };

  // Mark all read
  const handleMarkAllRead = async () => {
    try {
      await notificationService.markAllRead();
      setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
    } catch (err) {
      console.error('Mark all read error:', err);
    }
  };

  // Filter by active tab
  const filteredNotifications = notifications.filter(n => {
    if (activeTab === 'All') return true;
    return (n.type || n.notification_type) === activeTab;
  });

  // Pagination
  const totalPages = Math.ceil(filteredNotifications.length / pageSize);
  const pageSlice = filteredNotifications.slice((page - 1) * pageSize, page * pageSize);
  const unreadCount = notifications.filter(n => !n.is_read).length;

  // Tab counts from live data
  const tabs = [
    { id: 'All',                  label: 'All',                   icon: IoNotificationsOutline, color: 'text-blue-600 bg-blue-50' },
    { id: 'Road Alert',           label: 'Road Alerts',           icon: IoWarningOutline,       color: 'text-red-500 bg-red-50' },
    { id: 'Municipality Notice',  label: 'Municipality',          icon: IoBusinessOutline,      color: 'text-blue-600 bg-blue-50' },
    { id: 'Construction Alert',   label: 'Construction',          icon: IoConstructOutline,     color: 'text-orange-500 bg-orange-50' },
    { id: 'Flood Warning',        label: 'Flood Warnings',        icon: IoCloudyNightOutline,   color: 'text-purple-600 bg-purple-50' },
  ].map(tab => ({
    ...tab,
    count: tab.id === 'All'
      ? notifications.length
      : notifications.filter(n => (n.type || n.notification_type) === tab.id).length,
  }));

  return (
    <div className="space-y-6 text-left font-sans">
      
      {/* Page Title Header */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div>
          <h2 className="text-sm font-extrabold text-slate-800">Notifications</h2>
          <p className="text-[10px] text-slate-500 font-semibold mt-0.5">Stay informed about road conditions and important updates</p>
        </div>
        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllRead}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-blue-600 border border-blue-200 rounded-xl hover:bg-blue-50 transition-colors focus:outline-none"
            >
              <IoCheckmarkDoneOutline className="w-4 h-4" />
              Mark all read
            </button>
          )}
          <button
            onClick={fetchNotifications}
            className="p-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-400 focus:outline-none"
          >
            <IoRefreshOutline className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => { setActiveTab(tab.id); setPage(1); }}
              className={`flex items-center justify-between p-3.5 rounded-2xl border text-xs font-bold focus:outline-none transition-all cursor-pointer ${
                isActive
                  ? 'border-blue-600 bg-blue-50/20 text-blue-600 ring-1 ring-blue-600'
                  : 'border-slate-100 bg-white hover:bg-slate-50 text-slate-600'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${tab.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <span>{tab.label}</span>
              </div>
              <span className="px-2 py-0.5 bg-slate-100 text-slate-500 text-[10px] rounded-full">{tab.count}</span>
            </button>
          );
        })}
      </div>

      {/* Loading / Error state */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
            <span className="text-xs font-semibold text-slate-500">Loading notifications…</span>
          </div>
        </div>
      )}

      {!loading && error && (
        <div className="bg-red-50 border border-red-100 rounded-2xl p-5 text-center text-sm font-semibold text-red-600">
          {error}
        </div>
      )}

      {/* Notifications list */}
      {!loading && !error && (
        <div className="space-y-4">
          {pageSlice.length === 0 ? (
            <div className="bg-white rounded-3xl border border-slate-100 p-10 text-center">
              <IoNotificationsOutline className="w-10 h-10 text-slate-300 mx-auto mb-3" />
              <p className="text-sm font-bold text-slate-500">No notifications in this category</p>
            </div>
          ) : (
            pageSlice.map((notif) => {
              const notifType = notif.type || notif.notification_type || 'default';
              const cfg = getConfig(notifType);
              const NotifIcon = cfg.icon;
              const isUnread = !notif.is_read;

              return (
                <div
                  key={notif.id}
                  className={`bg-white border rounded-3xl p-5 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:border-blue-100 transition-colors ${
                    isUnread ? 'border-blue-200' : 'border-slate-100'
                  }`}
                >
                  {/* Left Column: Icon and text */}
                  <div className="flex gap-4 items-start">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 border border-slate-50 ${cfg.iconBg}`}>
                      <NotifIcon className="w-6 h-6" />
                    </div>

                    <div className="text-left space-y-1 leading-tight">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className={`px-2 py-0.5 text-[8px] font-bold rounded-full uppercase tracking-wider ${cfg.tagColor}`}>{notifType}</span>
                        {isUnread && (
                          <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-[8px] font-bold rounded-full uppercase tracking-wider">New</span>
                        )}
                      </div>
                      <span className="block font-extrabold text-sm text-slate-800">{notif.title}</span>
                      <p className="text-xs text-slate-500 font-semibold">{notif.message || notif.description}</p>
                      <span className="text-[10px] text-slate-400 font-semibold flex items-center gap-1 pt-1">
                        <span>🕐 {notif.created_at ? new Date(notif.created_at).toLocaleString() : '—'}</span>
                      </span>
                    </div>
                  </div>

                  {/* Right Column: Actions */}
                  <div className="flex items-center gap-3 shrink-0">
                    {isUnread && (
                      <button
                        onClick={(e) => handleMarkRead(notif.id, e)}
                        className="text-xs font-bold text-blue-600 hover:underline focus:outline-none"
                      >
                        Mark read
                      </button>
                    )}
                    <button className="text-slate-300 hover:text-slate-500 focus:outline-none">
                      <IoEllipsisVerticalOutline className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* Pagination Footer */}
      {!loading && totalPages > 1 && (
        <div className="flex items-center justify-between text-xs font-bold text-slate-400 border-t border-slate-100 pt-4">
          <span>
            Showing {(page - 1) * pageSize + 1} to {Math.min(page * pageSize, filteredNotifications.length)} of {filteredNotifications.length} notifications
          </span>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-400 disabled:opacity-40 select-none"
            >&lt;</button>
            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1).map(p => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold transition-colors ${
                  p === page
                    ? 'bg-blue-600 text-white'
                    : 'border border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >{p}</button>
            ))}
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600 select-none"
            >&gt;</button>
          </div>
        </div>
      )}

    </div>
  );
}
