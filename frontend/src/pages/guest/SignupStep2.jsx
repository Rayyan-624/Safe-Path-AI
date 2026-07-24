import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { IoShieldCheckmarkOutline, IoMapOutline, IoCameraOutline, IoPulseOutline, IoCompassOutline, IoNotificationsOutline, IoLockClosedOutline } from 'react-icons/io5';
import { useAuth } from '../../context/AuthContext';

export default function SignupStep2() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [perms, setPerms] = useState({
    gps: true,
    camera: true,
    accel: true,
    gyro: true,
    notify: true
  });

  const toggle = (key) => {
    setPerms(p => ({ ...p, [key]: !p[key] }));
  };

  const handleContinue = () => {
    if (user?.role === 'admin') {
      navigate('/admin/dashboard');
    } else {
      navigate('/driver/dashboard');
    }
  };

  return (
    <div className="min-h-[calc(100vh-73px)] flex flex-col lg:flex-row bg-slate-50 font-sans">
      
      {/* Left Branding Panel */}
      <div className="flex-1 relative overflow-hidden bg-slate-900 flex flex-col justify-between p-12 text-slate-200">
        <div className="absolute inset-0 bg-cover bg-center opacity-40 mix-blend-overlay" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1542362567-b07eac790947?w=800&auto=format&fit=crop&q=60')" }} />
        
        {/* Top Header */}
        <div className="relative z-10 flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg">
            <IoShieldCheckmarkOutline className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="font-extrabold text-base tracking-tight block">SafePath AI</span>
            <span className="block text-[9px] text-slate-400 font-bold uppercase tracking-wider">Smarter Roads, Safer Lives</span>
          </div>
        </div>

        {/* Heading */}
        <div className="relative z-10 space-y-4 max-w-md my-auto">
          <h2 className="text-4xl font-extrabold leading-tight">
            Your Safety, <br />
            Our <span className="text-green-500">Priority</span>
          </h2>
          <p className="text-slate-300 text-sm leading-relaxed">
            SafePath AI needs access to a few permissions to monitor road conditions, detect hazards and keep you safe in real-time.
          </p>
        </div>

        {/* We respect privacy box */}
        <div className="relative z-10 bg-white/5 border border-white/10 rounded-2xl p-4 backdrop-blur-md flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600/20 flex items-center justify-center text-blue-400 border border-blue-500/20">
            <IoLockClosedOutline className="w-5 h-5" />
          </div>
          <div>
            <span className="block text-xs font-bold text-white">We respect your privacy.</span>
            <span className="block text-[9px] text-slate-400 font-semibold">Your data is secure and never shared without your consent.</span>
          </div>
        </div>
      </div>

      {/* Right Set Up Permissions Panel */}
      <div className="flex-1 flex flex-col justify-center items-center p-8 lg:p-16 bg-white overflow-y-auto">
        <div className="w-full max-w-md space-y-6">
          
          <div className="text-center space-y-2">
            <div className="w-16 h-16 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center mx-auto text-blue-600 shadow-sm">
              <IoLockClosedOutline className="w-8 h-8 animate-pulse" />
            </div>
            <h2 className="text-2xl font-extrabold text-slate-800">Set Up Permissions</h2>
            <p className="text-slate-500 text-xs font-semibold">Enable the permissions below for the best experience</p>
          </div>

          <div className="space-y-3">
            
            {/* Location (GPS) */}
            <div className="flex items-center justify-between p-4 bg-slate-50 border border-slate-100 rounded-2xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600">
                  <IoMapOutline className="w-5 h-5" />
                </div>
                <div className="text-left leading-tight">
                  <span className="text-xs font-bold text-slate-800 block">Location (GPS)</span>
                  <span className="text-[10px] text-slate-500">Used to track your location and map road hazards</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold text-green-600 uppercase tracking-wide">Required</span>
                <button
                  type="button"
                  onClick={() => toggle('gps')}
                  className={`w-11 h-6 rounded-full transition-colors relative focus:outline-none ${perms.gps ? 'bg-green-500' : 'bg-slate-200'}`}
                >
                  <span className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform ${perms.gps ? 'translate-x-5' : ''}`} />
                </button>
              </div>
            </div>

            {/* Camera */}
            <div className="flex items-center justify-between p-4 bg-slate-50 border border-slate-100 rounded-2xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center text-green-600">
                  <IoCameraOutline className="w-5 h-5" />
                </div>
                <div className="text-left leading-tight">
                  <span className="text-xs font-bold text-slate-800 block">Camera</span>
                  <span className="text-[10px] text-slate-500">Used to capture road conditions and detect hazards</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold text-green-600 uppercase tracking-wide">Required</span>
                <button
                  type="button"
                  onClick={() => toggle('camera')}
                  className={`w-11 h-6 rounded-full transition-colors relative focus:outline-none ${perms.camera ? 'bg-green-500' : 'bg-slate-200'}`}
                >
                  <span className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform ${perms.camera ? 'translate-x-5' : ''}`} />
                </button>
              </div>
            </div>

            {/* Accelerometer */}
            <div className="flex items-center justify-between p-4 bg-slate-50 border border-slate-100 rounded-2xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center text-amber-600">
                  <IoPulseOutline className="w-5 h-5" />
                </div>
                <div className="text-left leading-tight">
                  <span className="text-xs font-bold text-slate-800 block">Accelerometer</span>
                  <span className="text-[10px] text-slate-500">Detects vibrations and bumps on the road</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold text-green-600 uppercase tracking-wide">Required</span>
                <button
                  type="button"
                  onClick={() => toggle('accel')}
                  className={`w-11 h-6 rounded-full transition-colors relative focus:outline-none ${perms.accel ? 'bg-green-500' : 'bg-slate-200'}`}
                >
                  <span className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform ${perms.accel ? 'translate-x-5' : ''}`} />
                </button>
              </div>
            </div>

            {/* Gyroscope */}
            <div className="flex items-center justify-between p-4 bg-slate-50 border border-slate-100 rounded-2xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center text-purple-600">
                  <IoCompassOutline className="w-5 h-5" />
                </div>
                <div className="text-left leading-tight">
                  <span className="text-xs font-bold text-slate-800 block">Gyroscope</span>
                  <span className="text-[10px] text-slate-500">Helps analyze vehicle movement and orientation</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wide">Recommended</span>
                <button
                  type="button"
                  onClick={() => toggle('gyro')}
                  className={`w-11 h-6 rounded-full transition-colors relative focus:outline-none ${perms.gyro ? 'bg-blue-500' : 'bg-slate-200'}`}
                >
                  <span className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform ${perms.gyro ? 'translate-x-5' : ''}`} />
                </button>
              </div>
            </div>

            {/* Notifications */}
            <div className="flex items-center justify-between p-4 bg-slate-50 border border-slate-100 rounded-2xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-pink-100 flex items-center justify-center text-pink-600">
                  <IoNotificationsOutline className="w-5 h-5" />
                </div>
                <div className="text-left leading-tight">
                  <span className="text-xs font-bold text-slate-800 block">Notifications</span>
                  <span className="text-[10px] text-slate-500">Receive real-time alerts and important updates</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wide">Recommended</span>
                <button
                  type="button"
                  onClick={() => toggle('notify')}
                  className={`w-11 h-6 rounded-full transition-colors relative focus:outline-none ${perms.notify ? 'bg-blue-500' : 'bg-slate-200'}`}
                >
                  <span className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform ${perms.notify ? 'translate-x-5' : ''}`} />
                </button>
              </div>
            </div>

          </div>

          {/* Banner */}
          <div className="p-3 bg-blue-50/50 border border-blue-100/50 rounded-2xl flex items-center gap-2 text-left">
            <IoShieldCheckmarkOutline className="w-4 h-4 text-blue-600 flex-shrink-0" />
            <span className="text-[9px] text-blue-700 font-bold uppercase tracking-wider">
              You're in control. You can change these permissions anytime in settings.
            </span>
          </div>

          {/* Continue button */}
          <button
            onClick={handleContinue}
            className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white rounded-xl text-xs font-bold shadow-md hover:shadow-lg transition-all focus:outline-none flex items-center justify-center gap-1 cursor-pointer"
          >
            <span>Continue</span>
            <span>→</span>
          </button>

        </div>
      </div>

    </div>
  );
}
