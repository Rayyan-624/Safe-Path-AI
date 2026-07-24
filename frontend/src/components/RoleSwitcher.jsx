import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { IoChevronUpOutline, IoChevronDownOutline, IoShieldCheckmarkOutline, IoSpeedometerOutline, IoBusinessOutline } from 'react-icons/io5';
import { useAuth } from '../context/AuthContext';

export default function RoleSwitcher() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const screens = [
    { name: "1. Landing Page", path: "/" },
    { name: "2. Login Page", path: "/login" },
    { name: "3. Signup Page", path: "/signup" },
    { name: "4. Permissions Setup", path: "/permissions" },
    { name: "5. Driver Dashboard", path: "/driver/dashboard" },
    { name: "6. Driver Live Map", path: "/driver/map" },
    { name: "7. Driver Navigation", path: "/driver/navigation" },
    { name: "8. Nav with Modal", path: "/driver/navigation?hazard=true" },
    { name: "9. Hazard Details", path: "/driver/hazard/HZ-2024-05-18-1023" },
    { name: "10. Report Hazard Form", path: "/driver/report" },
    { name: "11. Report Submitted", path: "/driver/report-success" },
    { name: "12. AI Detection Status", path: "/driver/ai-status" },
    { name: "13. Detection History", path: "/driver/history" },
    { name: "14. Crowdsourced Validation", path: "/driver/validation" },
    { name: "15. Personal Analytics", path: "/driver/analytics" },
    { name: "16. Notifications Inbox", path: "/driver/notifications" },
    { name: "17. User Profile & Vehicle", path: "/driver/profile" },
    { name: "18. Driver Settings", path: "/driver/settings" },
    { name: "19. Municipality Admin Dashboard", path: "/admin/dashboard" },
    { name: "20. Admin Hazard Management", path: "/admin/hazards" },
    { name: "21. Admin GIS Map Heatmap", path: "/admin/gis-map" },
    { name: "22. Maintenance Requests Board", path: "/admin/maintenance" },
    { name: "23. Municipality Analytics", path: "/admin/analytics" },
    { name: "24. AI Monitoring (Dark Theme)", path: "/admin/ai-monitoring" },
    { name: "25. User Management", path: "/admin/users" },
    { name: "26. Reports & Export Page", path: "/admin/reports" },
    { name: "27. Smart City Digital Twin", path: "/admin/smart-city" },
    { name: "28. Road Prediction Dashboard", path: "/admin/predictions" }
  ];

  return (
    <div className="fixed bottom-4 right-4 z-50 font-sans">
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full shadow-2xl hover:scale-105 active:scale-95 transition-all focus:outline-none"
      >
        <IoShieldCheckmarkOutline className="w-5 h-5 animate-pulse" />
        <span className="text-xs font-bold tracking-wider uppercase">SafePath Demo Switcher</span>
        {isOpen ? <IoChevronDownOutline className="w-4 h-4" /> : <IoChevronUpOutline className="w-4 h-4" />}
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute bottom-16 right-0 w-80 max-h-[70vh] overflow-y-auto bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl p-4 text-slate-200 animate-in fade-in slide-in-from-bottom-5 duration-200">
          <h3 className="text-xs font-bold text-slate-400 tracking-widest uppercase mb-3 border-b border-slate-700/80 pb-2">
            Jump to Screen (28 screens)
          </h3>

          <div className="flex flex-col gap-1">
            {screens.map((scr, idx) => {
              const isActive = location.pathname + location.search === scr.path;
              return (
                <button
                  key={idx}
                  onClick={async () => {
                    if (scr.path.startsWith('/admin')) {
                      try { await login('mock-admin-token'); } catch (e) {}
                    } else if (scr.path.startsWith('/driver')) {
                      try { await login('mock-driver-token'); } catch (e) {}
                    }
                    navigate(scr.path);
                    setIsOpen(false);
                  }}
                  className={`text-left text-xs px-3 py-2 rounded-lg transition-colors flex items-center justify-between ${
                    isActive
                      ? 'bg-blue-600 text-white font-semibold'
                      : 'hover:bg-slate-800 text-slate-300'
                  }`}
                >
                  <span>{scr.name}</span>
                  {scr.path.startsWith('/admin') ? (
                    <IoBusinessOutline className="w-3.5 h-3.5 text-slate-400" />
                  ) : scr.path.startsWith('/driver') ? (
                    <IoSpeedometerOutline className="w-3.5 h-3.5 text-slate-400" />
                  ) : null}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
