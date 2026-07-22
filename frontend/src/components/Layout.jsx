import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  IoGridOutline, IoMapOutline, IoCompassOutline, IoWarningOutline, IoDocumentTextOutline,
  IoPulseOutline, IoTimeOutline, IoCheckmarkDoneCircleOutline, IoStatsChartOutline,
  IoNotificationsOutline, IoPersonOutline, IoSettingsOutline, IoMenuOutline, IoCloseOutline,
  IoBuildOutline, IoPeopleOutline, IoBusinessOutline, IoTrendingUpOutline, IoSunnyOutline,
  IoSearchOutline, IoChevronDownOutline, IoLogOutOutline, IoCloudDownloadOutline, IoAddCircleOutline
} from 'react-icons/io5';
import { mockDriverInfo } from '../data/mockData';

export default function Layout({ children }) {
  const location = useLocation();
  const navigate = useNavigate();
  const path = location.pathname;
  const isAdmin = path.startsWith('/admin');
  const isGuest = !isAdmin && !path.startsWith('/driver');

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [notificationPaneOpen, setNotificationPaneOpen] = useState(false);

  // Driver Sidebar Menu
  const driverMenu = [
    { name: "Dashboard", path: "/driver/dashboard", icon: IoGridOutline },
    { name: "Live Road Map", path: "/driver/map", icon: IoMapOutline },
    { name: "Navigation", path: "/driver/navigation", icon: IoCompassOutline },
    { name: "Alerts", path: "/driver/notifications", icon: IoNotificationsOutline },
    { name: "Reports", path: "/driver/report", icon: IoDocumentTextOutline },
    { name: "AI Detection Status", path: "/driver/ai-status", icon: IoPulseOutline },
    { name: "Detection History", path: "/driver/history", icon: IoTimeOutline },
    { name: "Crowdsourced Validation", path: "/driver/validation", icon: IoCheckmarkDoneCircleOutline },
    { name: "Analytics", path: "/driver/analytics", icon: IoStatsChartOutline },
    { name: "Profile", path: "/driver/profile", icon: IoPersonOutline },
    { name: "Settings", path: "/driver/settings", icon: IoSettingsOutline },
  ];

  // Admin Sidebar Menu
  const adminMenu = [
    { name: "Dashboard", path: "/admin/dashboard", icon: IoGridOutline },
    { name: "Hazard Management", path: "/admin/hazards", icon: IoWarningOutline },
    { name: "GIS Map", path: "/admin/gis-map", icon: IoMapOutline },
    { name: "Maintenance Requests", path: "/admin/maintenance", icon: IoBuildOutline },
    { name: "Analytics", path: "/admin/analytics", icon: IoStatsChartOutline },
    { name: "AI Monitoring", path: "/admin/ai-monitoring", icon: IoPulseOutline },
    { name: "User Management", path: "/admin/users", icon: IoPeopleOutline },
    { name: "Reports & Export", path: "/admin/reports", icon: IoDocumentTextOutline },
    { name: "Smart City Dashboard", path: "/admin/smart-city", icon: IoBusinessOutline },
    { name: "Road Prediction", path: "/admin/predictions", icon: IoTrendingUpOutline },
  ];

  // Current Menu Array
  const currentMenu = isAdmin ? adminMenu : driverMenu;

  // Render Guest layout
  if (isGuest) {
    return (
      <div className="min-h-screen bg-slate-50 font-sans flex flex-col">
        {/* Guest Header */}
        <header className="sticky top-0 bg-white/80 backdrop-blur-md border-b border-slate-100 z-40 px-6 py-4 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg">
              <IoCompassOutline className="w-6 h-6" />
            </div>
            <div>
              <span className="font-bold text-lg tracking-tight text-slate-800">SafePath AI</span>
              <span className="block text-[10px] text-slate-500 font-medium">Smarter Roads, Safer Lives</span>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-600">
            <Link to="/" className="hover:text-blue-600 transition-colors">Home</Link>
            <span className="cursor-pointer hover:text-blue-600 transition-colors">Features</span>
            <span className="cursor-pointer hover:text-blue-600 transition-colors">How It Works</span>
            <span className="cursor-pointer hover:text-blue-600 transition-colors">For Municipalities</span>
            <span className="cursor-pointer hover:text-blue-600 transition-colors">Resources</span>
            <span className="cursor-pointer hover:text-blue-600 transition-colors">About Us</span>
          </nav>

          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/login')}
              className="px-4 py-2 border border-slate-200 rounded-xl text-sm font-bold text-slate-700 hover:bg-slate-50 transition-all focus:outline-none"
            >
              Login
            </button>
            <button
              onClick={() => navigate('/signup')}
              className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-bold shadow-md hover:shadow-lg transition-all focus:outline-none flex items-center gap-1"
            >
              Get Started →
            </button>
          </div>
        </header>

        {/* Content area */}
        <main className="flex-1">
          {children}
        </main>
      </div>
    );
  }

  // Theming & Branding overrides
  let portalBranding = {
    title: "SafePath AI",
    subtitle: "Smarter Roads, Safer Lives",
    iconBg: "bg-blue-600"
  };

  if (isAdmin) {
    if (path.includes('smart-city')) {
      portalBranding = {
        title: "FUTURE SMART CITY",
        subtitle: "Intelligent Road Management",
        iconBg: "bg-teal-600"
      };
    } else if (path.includes('predictions')) {
      portalBranding = {
        title: "RoadPredict AI",
        subtitle: "AI Monitoring System",
        iconBg: "bg-indigo-600"
      };
    } else if (path.includes('ai-monitoring')) {
      portalBranding = {
        title: "SafePath AI",
        subtitle: "AI Monitoring System",
        iconBg: "bg-blue-600"
      };
    } else {
      portalBranding = {
        title: "SafePath AI",
        subtitle: "Municipality Portal",
        iconBg: "bg-blue-700"
      };
    }
  }

  const isDarkThemePage = path.includes('/admin/ai-monitoring');

  return (
    <div className={`min-h-screen flex font-sans transition-colors duration-200 ${isDarkThemePage ? 'bg-[#0f172a] text-slate-100' : 'bg-slate-50 text-slate-800'}`}>
      
      {/* SIDEBAR NAVIGATION */}
      <aside
        className={`fixed inset-y-0 left-0 z-30 flex flex-col border-r shadow-sm transition-all duration-300 ${
          sidebarOpen ? 'w-64' : 'w-20'
        } ${isDarkThemePage ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}
      >
        {/* Logo Branding */}
        <div className={`p-4 border-b flex items-center justify-between ${isDarkThemePage ? 'border-slate-800' : 'border-slate-100'}`}>
          <div className="flex items-center gap-3 overflow-hidden cursor-pointer" onClick={() => navigate(isAdmin ? '/admin/dashboard' : '/driver/dashboard')}>
            <div className={`w-10 h-10 min-w-[40px] ${portalBranding.iconBg} rounded-xl flex items-center justify-center text-white shadow-lg`}>
              <IoCompassOutline className="w-6 h-6" />
            </div>
            {sidebarOpen && (
              <div className="animate-in fade-in slide-in-from-left-2 duration-200">
                <span className="font-extrabold text-base tracking-tight block whitespace-nowrap">{portalBranding.title}</span>
                <span className={`block text-[9px] font-semibold tracking-wide uppercase ${isDarkThemePage ? 'text-slate-400' : 'text-slate-500'}`}>{portalBranding.subtitle}</span>
              </div>
            )}
          </div>
          {sidebarOpen && (
            <button onClick={() => setSidebarOpen(false)} className={`p-1.5 rounded-lg lg:hidden hover:bg-slate-100 focus:outline-none ${isDarkThemePage ? 'hover:bg-slate-800 text-slate-400' : 'text-slate-500'}`}>
              <IoCloseOutline className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Sidebar Nav Links */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 flex flex-col gap-1.5">
          {currentMenu.map((item, idx) => {
            const Icon = item.icon;
            const isActive = path === item.path;
            return (
              <Link
                key={idx}
                to={item.path}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold tracking-tight transition-all focus:outline-none group ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                    : isDarkThemePage
                    ? 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <Icon className={`w-5 h-5 min-w-[20px] transition-transform group-hover:scale-105 ${isActive ? 'text-white' : isDarkThemePage ? 'text-slate-400' : 'text-slate-400'}`} />
                {sidebarOpen && <span className="animate-in fade-in duration-200">{item.name}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Admin Quick Actions section (Only if Admin is true & sidebar is expanded) */}
        {isAdmin && sidebarOpen && (
          <div className={`px-4 py-4 border-t ${isDarkThemePage ? 'border-slate-800' : 'border-slate-100'}`}>
            <h4 className={`text-[10px] font-bold tracking-widest uppercase mb-3 ${isDarkThemePage ? 'text-slate-500' : 'text-slate-400'}`}>Quick Actions</h4>
            <div className="grid grid-cols-2 gap-2">
              <button onClick={() => navigate('/admin/hazards')} className="flex flex-col items-center justify-center p-2 rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors text-center text-xs font-semibold focus:outline-none dark:border-slate-700 dark:hover:bg-slate-800">
                <IoAddCircleOutline className="w-5 h-5 text-green-600 mb-1" />
                <span className="text-[10px]">Add Hazard</span>
              </button>
              <button onClick={() => navigate('/admin/maintenance')} className="flex flex-col items-center justify-center p-2 rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors text-center text-xs font-semibold focus:outline-none dark:border-slate-700 dark:hover:bg-slate-800">
                <IoBuildOutline className="w-5 h-5 text-orange-500 mb-1" />
                <span className="text-[10px]">Maintenance</span>
              </button>
            </div>
          </div>
        )}

        {/* Driver rewards prompt */}
        {!isAdmin && sidebarOpen && (
          <div className="px-4 py-4 border-t border-slate-100">
            <div className="bg-blue-50 border border-blue-100/50 rounded-2xl p-4 text-center">
              <span className="block text-xs font-bold text-blue-700 mb-1">Drive Safe, Earn Rewards!</span>
              <p className="text-[10px] text-blue-600 mb-3">Report road hazards to earn loyalty points and gift items.</p>
              <button onClick={() => navigate('/driver/profile')} className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-sm focus:outline-none">
                View Rewards
              </button>
            </div>
          </div>
        )}

        {/* Profile Card Footer */}
        <div className={`p-4 border-t flex items-center justify-between gap-3 ${isDarkThemePage ? 'border-slate-800' : 'border-slate-100'}`}>
          <div className="flex items-center gap-3 overflow-hidden cursor-pointer" onClick={() => navigate(isAdmin ? '/admin/dashboard' : '/driver/profile')}>
            <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold overflow-hidden shadow">
              {isAdmin ? 'AD' : mockDriverInfo.name.charAt(0)}
            </div>
            {sidebarOpen && (
              <div className="overflow-hidden">
                <span className="font-bold text-xs block truncate leading-none">{isAdmin ? 'Admin User' : mockDriverInfo.name}</span>
                <span className={`text-[9px] font-semibold ${isDarkThemePage ? 'text-slate-500' : 'text-slate-400'}`}>{isAdmin ? 'Super Admin' : 'Premium Member'}</span>
              </div>
            )}
          </div>
          {sidebarOpen && (
            <button
              onClick={() => navigate('/login')}
              className={`p-1.5 rounded-lg hover:bg-slate-100 focus:outline-none ${isDarkThemePage ? 'hover:bg-slate-800 text-slate-400' : 'text-slate-400'}`}
              title="Logout"
            >
              <IoLogOutOutline className="w-5 h-5 text-red-500" />
            </button>
          )}
        </div>
      </aside>

      {/* MAIN VIEW AREA */}
      <div className={`flex-1 flex flex-col min-h-screen transition-all duration-300 ${sidebarOpen ? 'pl-64' : 'pl-20'}`}>
        
        {/* GLOBAL HEADER HEADER */}
        <header className={`sticky top-0 z-20 px-6 py-3 border-b flex items-center justify-between backdrop-blur-md ${
          isDarkThemePage ? 'bg-slate-900/80 border-slate-800 text-slate-200' : 'bg-white/80 border-slate-100 text-slate-800'
        }`}>
          {/* Left panel */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className={`p-2 rounded-xl border focus:outline-none transition-colors ${
                isDarkThemePage ? 'border-slate-800 bg-slate-800 hover:bg-slate-700' : 'border-slate-200 bg-white hover:bg-slate-50'
              }`}
            >
              <IoMenuOutline className="w-5 h-5" />
            </button>
            <div className="hidden sm:block">
              <h2 className="text-sm font-bold tracking-tight">
                {path === '/driver/dashboard' ? 'Welcome back, Ali! 👋' : path.includes('/admin') ? 'Welcome back, Admin! 🏢' : 'SafePath AI Navigation'}
              </h2>
              <span className={`block text-[10px] ${isDarkThemePage ? 'text-slate-400' : 'text-slate-500'}`}>
                {path === '/driver/dashboard' ? 'Stay safe and keep contributing to better roads.' : 'Real-time overview of road safety and smart infrastructure.'}
              </span>
            </div>
          </div>

          {/* Right panel */}
          <div className="flex items-center gap-3">
            
            {/* Search */}
            <div className="relative hidden md:block">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <IoSearchOutline className="w-4 h-4 text-slate-400" />
              </span>
              <input
                type="text"
                placeholder="Search..."
                className={`pl-9 pr-4 py-1.5 w-48 rounded-xl text-xs border focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all ${
                  isDarkThemePage ? 'bg-slate-800 border-slate-700 text-slate-200' : 'bg-slate-50 border-slate-200 text-slate-700'
                }`}
              />
            </div>

            {/* Weather widget */}
            <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold ${
              isDarkThemePage ? 'bg-slate-800 border-slate-700 text-yellow-400' : 'bg-amber-50 border-amber-100 text-amber-800'
            }`}>
              <IoSunnyOutline className="w-4 h-4 animate-spin-slow" />
              <span>28°C</span>
            </div>

            {/* City selector dropdown */}
            <div className="relative">
              <button
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold focus:outline-none ${
                  isDarkThemePage ? 'bg-slate-800 border-slate-700 text-slate-200' : 'bg-white border-slate-200 text-slate-700'
                }`}
              >
                <span>Karachi, PK</span>
                <IoChevronDownOutline className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Language Selector */}
            <button className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl border text-xs font-bold focus:outline-none ${isDarkThemePage ? 'bg-slate-800 border-slate-700 text-slate-300' : 'bg-slate-100 border-slate-200 text-slate-700'}`}>
              <span>EN</span>
              <IoChevronDownOutline className="w-3 h-3" />
            </button>

            {/* Notifications Alert */}
            <div className="relative">
              <button
                onClick={() => setNotificationPaneOpen(!notificationPaneOpen)}
                className={`p-2 rounded-xl border relative focus:outline-none ${
                  isDarkThemePage ? 'bg-slate-800 border-slate-700 hover:bg-slate-700 text-slate-200' : 'bg-white border-slate-200 hover:bg-slate-100 text-slate-600'
                }`}
              >
                <IoNotificationsOutline className="w-5 h-5" />
                <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white animate-bounce"></span>
              </button>

              {/* Quick Notification Dropdown overlay */}
              {notificationPaneOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white border border-slate-100 rounded-2xl shadow-xl p-4 text-slate-800 z-50 animate-in fade-in duration-200 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100">
                  <div className="flex items-center justify-between border-b pb-2 mb-2 dark:border-slate-700">
                    <span className="font-extrabold text-xs tracking-wider uppercase text-slate-500 dark:text-slate-400">Recent Alerts</span>
                    <button onClick={() => navigate(isAdmin ? '/admin/dashboard' : '/driver/notifications')} className="text-[10px] font-bold text-blue-600 hover:underline">View All</button>
                  </div>
                  <div className="flex flex-col gap-3">
                    <div className="flex gap-3 text-xs leading-tight">
                      <div className="w-2 h-2 rounded-full bg-red-500 mt-1.5 flex-shrink-0"></div>
                      <div>
                        <span className="font-bold block text-slate-800 dark:text-slate-200">Critical: Pothole detected</span>
                        <span className="text-[10px] text-slate-500 dark:text-slate-400">120 m ahead on Shahrah-e-Faisal</span>
                        <span className="block text-[9px] text-slate-400 mt-0.5">2 mins ago</span>
                      </div>
                    </div>
                    <div className="flex gap-3 text-xs leading-tight">
                      <div className="w-2 h-2 rounded-full bg-orange-500 mt-1.5 flex-shrink-0"></div>
                      <div>
                        <span className="font-bold block text-slate-800 dark:text-slate-200">Moderate: Road Construction</span>
                        <span className="text-[10px] text-slate-500 dark:text-slate-400">Ongoing repairs on Korangi Road</span>
                        <span className="block text-[9px] text-slate-400 mt-0.5">15 mins ago</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Profile Dropdown avatar */}
            <div className="relative">
              <button
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="w-9 h-9 rounded-full bg-blue-600 text-white font-extrabold flex items-center justify-center border-2 border-white shadow-md focus:outline-none select-none cursor-pointer"
              >
                {isAdmin ? 'AD' : mockDriverInfo.name.charAt(0)}
              </button>
              {profileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-slate-100 rounded-2xl shadow-xl py-2 z-50 text-slate-800 animate-in fade-in duration-200 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100">
                  <div className="px-4 py-2 border-b dark:border-slate-700">
                    <span className="font-bold text-xs block text-slate-800 dark:text-slate-200">{isAdmin ? 'Admin User' : mockDriverInfo.name}</span>
                    <span className="text-[9px] text-slate-400 block truncate">{isAdmin ? 'admin@safepath.gov' : mockDriverInfo.email}</span>
                  </div>
                  <button onClick={() => { setProfileDropdownOpen(false); navigate(isAdmin ? '/admin/dashboard' : '/driver/profile'); }} className="w-full text-left px-4 py-2 text-xs text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors focus:outline-none dark:text-slate-300 dark:hover:bg-slate-700 dark:hover:text-slate-100">
                    My Profile
                  </button>
                  <button onClick={() => { setProfileDropdownOpen(false); navigate(isAdmin ? '/admin/settings' : '/driver/settings'); }} className="w-full text-left px-4 py-2 text-xs text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors focus:outline-none dark:text-slate-300 dark:hover:bg-slate-700 dark:hover:text-slate-100">
                    Account Settings
                  </button>
                  <hr className="my-1 border-slate-100 dark:border-slate-700" />
                  <button onClick={() => { setProfileDropdownOpen(false); navigate('/login'); }} className="w-full text-left px-4 py-2 text-xs text-red-500 hover:bg-red-50 transition-colors focus:outline-none dark:hover:bg-red-950/20">
                    Logout
                  </button>
                </div>
              )}
            </div>

          </div>
        </header>

        {/* PAGE CONTENT */}
        <main className="flex-1 p-6 overflow-y-auto">
          {children}
        </main>
      </div>

    </div>
  );
}
