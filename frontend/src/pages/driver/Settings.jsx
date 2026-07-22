import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  IoColorPaletteOutline, IoNotificationsOutline, IoGlobeOutline,
  IoLockClosedOutline, IoPulseOutline, IoLogOutOutline, IoChevronForwardOutline,
  IoSunnyOutline, IoMoonOutline, IoDesktopOutline
} from 'react-icons/io5';

export default function DriverSettings() {
  const navigate = useNavigate();

  // Settings states
  const [theme, setTheme] = useState('Light');
  const [pushNotif, setPushNotif] = useState(true);
  const [emailNotif, setEmailNotif] = useState(false);
  const [language, setLanguage] = useState('English');

  const handleLogout = () => {
    // Navigate back to Login page
    navigate('/login');
  };

  return (
    <div className="space-y-6 text-left font-sans">
      
      {/* Top Header Title */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div>
          <h2 className="text-sm font-extrabold text-slate-800">Settings</h2>
          <p className="text-[10px] text-slate-500 font-semibold mt-0.5">Manage your preferences and app configuration</p>
        </div>
      </div>

      {/* Settings Options container */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 divide-y divide-slate-100">
        
        {/* 1. Theme Configuration */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-6 first:pt-0">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
              <IoColorPaletteOutline className="w-6 h-6" />
            </div>
            <div className="text-left leading-tight pt-1">
              <span className="text-sm font-extrabold text-slate-800">Theme</span>
              <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Choose your preferred app theme</p>
            </div>
          </div>

          {/* Theme card choices */}
          <div className="flex items-center gap-3 w-full sm:w-auto">
            {[
              { id: 'Light', label: 'Light', icon: IoSunnyOutline },
              { id: 'Dark', label: 'Dark', icon: IoMoonOutline },
              { id: 'System', label: 'System', icon: IoDesktopOutline }
            ].map((item) => {
              const ItemIcon = item.icon;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setTheme(item.id)}
                  className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border text-xs font-bold focus:outline-none transition-all flex-1 sm:flex-none cursor-pointer ${
                    theme === item.id
                      ? 'border-blue-600 bg-blue-50/20 text-blue-600 font-bold ring-1 ring-blue-600'
                      : 'border-slate-200 text-slate-500 hover:bg-slate-50'
                  }`}
                >
                  <ItemIcon className="w-4 h-4" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 2. Notifications settings */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-green-50 text-green-700 flex items-center justify-center shrink-0">
              <IoNotificationsOutline className="w-6 h-6" />
            </div>
            <div className="text-left leading-tight pt-1">
              <span className="text-sm font-extrabold text-slate-800">Notifications</span>
              <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Manage your notification preferences</p>
            </div>
          </div>

          {/* Toggles */}
          <div className="space-y-3.5 text-xs font-bold text-slate-600 w-full sm:w-80">
            <div className="flex items-center justify-between">
              <div className="text-left">
                <span className="block text-xs font-bold text-slate-800">Push Notifications</span>
                <span className="text-[10px] text-slate-400 font-semibold">Get real-time alerts and updates</span>
              </div>
              <button
                type="button"
                onClick={() => setPushNotif(!pushNotif)}
                className={`w-11 h-6 rounded-full transition-colors relative focus:outline-none ${pushNotif ? 'bg-blue-600' : 'bg-slate-200'}`}
              >
                <span className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform ${pushNotif ? 'translate-x-5' : ''}`} />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div className="text-left">
                <span className="block text-xs font-bold text-slate-800">Email Notifications</span>
                <span className="text-[10px] text-slate-400 font-semibold">Receive important updates via email</span>
              </div>
              <button
                type="button"
                onClick={() => setEmailNotif(!emailNotif)}
                className={`w-11 h-6 rounded-full transition-colors relative focus:outline-none ${emailNotif ? 'bg-blue-600' : 'bg-slate-200'}`}
              >
                <span className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform ${emailNotif ? 'translate-x-5' : ''}`} />
              </button>
            </div>
          </div>
        </div>

        {/* 3. Language Selector */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <IoGlobeOutline className="w-6 h-6" />
            </div>
            <div className="text-left leading-tight pt-1">
              <span className="text-sm font-extrabold text-slate-800">Language</span>
              <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Choose your preferred language</p>
            </div>
          </div>

          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="px-4 py-2 border border-slate-200 rounded-xl text-xs bg-white text-slate-600 font-semibold focus:outline-none w-full sm:w-48 cursor-pointer"
          >
            <option>English</option>
            <option>Urdu (اردو)</option>
          </select>
        </div>

        {/* 4. Privacy settings */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-6 cursor-pointer hover:bg-slate-50/30 px-2 rounded-xl group transition-colors">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <IoLockClosedOutline className="w-6 h-6" />
            </div>
            <div className="text-left leading-tight pt-1">
              <span className="text-sm font-extrabold text-slate-800 group-hover:text-blue-600 transition-colors">Privacy</span>
              <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Manage your privacy and data preferences</p>
            </div>
          </div>

          <IoChevronForwardOutline className="w-5 h-5 text-slate-300 group-hover:text-blue-600 transition-colors" />
        </div>

        {/* 5. Sensor settings */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-6 cursor-pointer hover:bg-slate-50/30 px-2 rounded-xl group transition-colors">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-orange-50 text-orange-500 flex items-center justify-center shrink-0">
              <IoPulseOutline className="w-6 h-6" />
            </div>
            <div className="text-left leading-tight pt-1">
              <span className="text-sm font-extrabold text-slate-800 group-hover:text-blue-600 transition-colors">Sensor Settings</span>
              <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Configure sensors and data collection</p>
            </div>
          </div>

          <div className="flex items-center gap-4 text-right">
            <div className="text-left sm:text-right">
              <span className="text-xs font-bold text-slate-800 block">Sensors Active</span>
              <span className="text-[10px] text-slate-400 font-semibold block mt-0.5">Accelerometer, Gyroscope, GPS, Camera</span>
            </div>
            <IoChevronForwardOutline className="w-5 h-5 text-slate-300 group-hover:text-blue-600 transition-colors" />
          </div>
        </div>

        {/* 6. Logout settings */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-6 last:pb-0">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-500 flex items-center justify-center shrink-0">
              <IoLogOutOutline className="w-6 h-6" />
            </div>
            <div className="text-left leading-tight pt-1">
              <span className="text-sm font-extrabold text-slate-800">Logout</span>
              <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Sign out of your SafePath AI account</p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="px-5 py-2.5 border border-red-200 hover:bg-red-50 text-red-500 font-bold rounded-xl text-xs focus:outline-none flex items-center gap-1.5 cursor-pointer w-full sm:w-auto justify-center"
          >
            <IoLogOutOutline className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>

      </div>

      {/* Footer copyright links info */}
      <div className="flex flex-col sm:flex-row items-center justify-between text-[11px] font-bold text-slate-400 pt-4 gap-2">
        <span>© 2024 SafePath AI. All rights reserved.</span>
        <div className="flex gap-4">
          <span className="hover:underline cursor-pointer">Privacy Policy</span>
          <span className="hover:underline cursor-pointer">Terms of Service</span>
          <span className="hover:underline cursor-pointer">Help & Support</span>
        </div>
      </div>

    </div>
  );
}
