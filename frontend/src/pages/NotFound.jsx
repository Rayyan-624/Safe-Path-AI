import React from 'react';
import { useNavigate } from 'react-router-dom';
import { IoWarningOutline, IoHomeOutline, IoArrowBackOutline, IoCompassOutline } from 'react-icons/io5';

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 font-sans px-6">

      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-100 rounded-full blur-3xl opacity-40" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-slate-200 rounded-full blur-3xl opacity-30" />
      </div>

      <div className="relative z-10 flex flex-col items-center text-center max-w-lg space-y-6">

        {/* Logo */}
        <div
          className="flex items-center gap-2 cursor-pointer mb-4"
          onClick={() => navigate('/')}
        >
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg">
            <IoCompassOutline className="w-6 h-6" />
          </div>
          <span className="font-extrabold text-xl text-slate-800 tracking-tight">SafePath AI</span>
        </div>

        {/* 404 graphic */}
        <div className="flex items-center gap-4">
          <span className="text-[7rem] font-black text-slate-200 leading-none select-none">4</span>
          <div className="w-24 h-24 bg-amber-50 border-4 border-amber-200 rounded-full flex items-center justify-center shadow-lg">
            <IoWarningOutline className="w-12 h-12 text-amber-500" />
          </div>
          <span className="text-[7rem] font-black text-slate-200 leading-none select-none">4</span>
        </div>

        {/* Heading */}
        <div className="space-y-2">
          <h1 className="text-2xl font-extrabold text-slate-800">Page Not Found</h1>
          <p className="text-slate-500 text-sm leading-relaxed max-w-sm">
            The page you're looking for doesn't exist or may have been moved.
            Let's get you back on track.
          </p>
        </div>

        {/* Road damage visual metaphor */}
        <div className="w-full max-w-xs bg-white border border-slate-100 rounded-2xl p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center">
              <span className="text-xl">🚧</span>
            </div>
            <div className="text-left">
              <p className="text-xs font-bold text-slate-700">Road Closed Ahead</p>
              <p className="text-[10px] text-slate-400 mt-0.5">This route doesn't lead anywhere useful</p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 w-full max-w-xs">
          <button
            onClick={() => navigate(-1)}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50 transition-all focus:outline-none"
          >
            <IoArrowBackOutline className="w-4 h-4" />
            Go Back
          </button>
          <button
            onClick={() => navigate('/')}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md hover:shadow-lg transition-all focus:outline-none"
          >
            <IoHomeOutline className="w-4 h-4" />
            Home
          </button>
        </div>

        <p className="text-[10px] text-slate-400 font-semibold">
          Error 404 — SafePath AI Navigation System
        </p>
      </div>
    </div>
  );
}
