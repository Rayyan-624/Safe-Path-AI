import React from 'react';
import { useNavigate } from 'react-router-dom';
import { IoCheckmarkCircleOutline, IoStarOutline, IoHomeOutline } from 'react-icons/io5';

export default function DriverReportSuccess() {
  const navigate = useNavigate();

  return (
    <div className="bg-white border border-slate-100 rounded-3xl p-8 shadow-sm flex flex-col items-center justify-center text-center max-w-3xl mx-auto py-16 space-y-8 font-sans">
      
      {/* City Road Background Illustration Container */}
      <div className="relative w-full max-w-lg h-56 flex items-center justify-center">
        {/* SVG illustration of road, trees, and buildings */}
        <svg className="absolute inset-0 w-full h-full text-slate-100" viewBox="0 0 500 200" fill="currentColor">
          {/* Background hills */}
          <path d="M 0,150 Q 150,80 300,160 T 500,120 L 500,200 L 0,200 Z" opacity="0.3" className="text-slate-200" />
          {/* City skyline silhouettes */}
          <rect x="50" y="80" width="30" height="70" opacity="0.2" className="text-slate-300" />
          <rect x="90" y="50" width="40" height="100" opacity="0.2" className="text-slate-300" />
          <rect x="380" y="60" width="35" height="90" opacity="0.2" className="text-slate-300" />
          <rect x="425" y="90" width="25" height="60" opacity="0.2" className="text-slate-300" />
          {/* Road curve */}
          <path d="M 100,200 Q 250,110 400,200" fill="none" stroke="#e2e8f0" strokeWidth="48" strokeLinecap="round" />
          <path d="M 100,200 Q 250,110 400,200" fill="none" stroke="#cbd5e1" strokeWidth="6" strokeLinecap="round" strokeDasharray="10,10" />
          {/* Trees */}
          <circle cx="60" cy="140" r="15" className="text-green-200" />
          <line x1="60" y1="140" x2="60" y2="160" stroke="#94a3b8" strokeWidth="3" />
          <circle cx="430" cy="145" r="12" className="text-green-200" />
          <line x1="430" y1="145" x2="430" y2="165" stroke="#94a3b8" strokeWidth="3" />
          {/* Red warning triangle sign */}
          <polygon points="180,110 195,140 165,140" fill="none" stroke="#ef4444" strokeWidth="3" />
          <circle cx="180" cy="135" r="1.5" fill="#ef4444" />
          <rect x="179.5" y="123" width="1" height="8" fill="#ef4444" />
          <line x1="180" y1="140" x2="180" y2="160" stroke="#94a3b8" strokeWidth="2.5" />
          {/* Sign board: Safer Roads, Stronger Communities */}
          <rect x="300" y="100" width="70" height="36" rx="4" fill="#2563eb" />
          <text x="335" y="115" fill="#ffffff" fontSize="6" fontWeight="bold" textAnchor="middle">SAFER ROADS</text>
          <text x="335" y="127" fill="#ffffff" fontSize="6" fontWeight="bold" textAnchor="middle">STRONGER</text>
          <line x1="335" y1="136" x2="335" y2="155" stroke="#94a3b8" strokeWidth="2.5" />
        </svg>

        {/* Large overlay checkmark circle */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-28 h-28 rounded-full bg-green-500 text-white border-8 border-white shadow-2xl flex items-center justify-center animate-in zoom-in-95 duration-200">
          <IoCheckmarkCircleOutline className="w-16 h-16" />
        </div>
      </div>

      {/* Thank you message */}
      <div className="space-y-2">
        <h2 className="text-3xl font-extrabold text-slate-800">Thank You!</h2>
        <span className="text-green-600 font-extrabold text-sm block">Your report has been submitted successfully.</span>
        <p className="text-slate-500 text-xs font-semibold max-w-sm mx-auto leading-relaxed">
          Your report helps improve road safety. Together, we build safer roads for everyone.
        </p>
      </div>

      {/* Points Earned Card */}
      <div className="bg-green-50/50 border border-green-100 rounded-3xl p-5 w-full max-w-md mx-auto flex items-center gap-4 text-left">
        <div className="w-14 h-14 rounded-full bg-green-500 flex items-center justify-center text-white border-4 border-green-100 shadow">
          <IoStarOutline className="w-7 h-7" />
        </div>
        <div className="leading-tight flex-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Points Earned</span>
          <span className="block text-2xl font-extrabold text-green-600">+25 Points</span>
          <span className="text-[9px] font-bold text-slate-500">Great job! Keep reporting and earn more points.</span>
        </div>
      </div>

      {/* Buttons */}
      <div className="space-y-4 pt-4">
        <button
          onClick={() => navigate('/driver/dashboard')}
          className="px-8 py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md hover:shadow-lg transition-all focus:outline-none flex items-center justify-center gap-2 mx-auto cursor-pointer w-full max-w-xs"
        >
          <IoHomeOutline className="w-4 h-4" />
          <span>Return Home</span>
        </button>
        
        <button
          onClick={() => navigate('/driver/history')}
          className="text-xs font-bold text-blue-600 hover:underline block mx-auto focus:outline-none"
        >
          View My Reports
        </button>
      </div>

    </div>
  );
}
