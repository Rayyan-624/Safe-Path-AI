import React from 'react';
import { useNavigate } from 'react-router-dom';
import { IoRocketOutline, IoPersonOutline, IoPlayCircleOutline, IoMapOutline, IoPhonePortraitOutline, IoPeopleOutline, IoShieldCheckmarkOutline, IoStatsChartOutline, IoBusinessOutline, IoLockClosedOutline, IoCloudOutline, IoFlashOutline, IoCheckmarkCircleOutline } from 'react-icons/io5';
import { AreaChart, Area, ResponsiveContainer } from 'recharts';

export default function LandingPage() {
  const navigate = useNavigate();

  // Mock tiny sparkline data
  const sparkData = [
    { value: 10 }, { value: 15 }, { value: 8 }, { value: 12 }, { value: 20 }, { value: 16 }, { value: 25 }
  ];

  return (
    <div className="bg-slate-50 font-sans min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 px-6 max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-12">
        {/* Left Content */}
        <div className="flex-1 space-y-6 text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-xs font-bold uppercase tracking-wider">
            <IoPulseOutline className="w-4 h-4 text-blue-600" />
            AI-Powered Road Safety Platform
          </div>
          <h1 className="text-5xl lg:text-6xl font-extrabold tracking-tight leading-none">
            Together for <span className="text-blue-600 block sm:inline">Safer Roads,</span> <br className="hidden sm:inline" />
            <span className="text-green-600">Smarter Cities</span>
          </h1>
          <p className="text-slate-600 text-base max-w-xl leading-relaxed">
            SafePath AI uses AI and real-time data from drivers like you to detect hazards, alert communities, and help municipalities build better, safer roads for everyone.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <button
              onClick={() => navigate('/signup')}
              className="px-6 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold rounded-2xl shadow-xl hover:shadow-blue-500/20 active:scale-95 transition-all text-left flex items-center gap-3 group"
            >
              <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center text-white">
                <IoRocketOutline className="w-5 h-5 group-hover:rotate-12 transition-transform" />
              </div>
              <div>
                <span className="block text-sm">Get Started</span>
                <span className="block text-[10px] opacity-80 font-normal">Join the movement</span>
              </div>
            </button>

            <button
              onClick={() => navigate('/login')}
              className="px-6 py-4 bg-white border border-slate-200 hover:bg-slate-50 text-slate-800 font-bold rounded-2xl shadow-sm active:scale-95 transition-all text-left flex items-center gap-3 group"
            >
              <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600 group-hover:bg-slate-200 transition-colors">
                <IoPersonOutline className="w-5 h-5" />
              </div>
              <div>
                <span className="block text-sm">Login</span>
                <span className="block text-[10px] text-slate-500 font-normal">Access your account</span>
              </div>
            </button>

            <button
              onClick={() => navigate('/login')}
              className="flex items-center gap-2 text-sm font-extrabold text-slate-600 hover:text-blue-600 transition-colors py-2 px-3 focus:outline-none"
            >
              <IoPlayCircleOutline className="w-7 h-7 text-slate-400 hover:text-blue-500" />
              <span>Learn More <span className="block text-[10px] text-slate-400 font-normal">See how it works</span></span>
            </button>
          </div>
        </div>

        {/* Right Graphic Panel ( Lahore City Mockup + Mini Map overlay ) */}
        <div className="flex-1 relative w-full max-w-xl aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl border border-slate-100 bg-slate-900 group">
          {/* Main Hero Background Illustration */}
          <div className="absolute inset-0 bg-gradient-to-tr from-slate-950 via-slate-900 to-blue-900/40 flex items-center justify-center">
            <img
              src="https://images.unsplash.com/photo-1542362567-b07eac790947?w=800&auto=format&fit=crop&q=60" // Premium modern car driving on a futuristic road
              alt="Road Infrastructure Monitoring"
              className="w-full h-full object-cover opacity-60 mix-blend-overlay"
            />
            {/* Overlay Drone Vector Indicator */}
            <div className="absolute top-10 left-10 w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 border border-blue-500/40 animate-bounce">
              <IoCloudOutline className="w-4 h-4" />
            </div>
            {/* Simulated Road Pins */}
            <div className="absolute top-1/2 left-1/3 w-6 h-6 rounded-full bg-green-500/80 border-2 border-white flex items-center justify-center text-white text-xs font-bold shadow">✓</div>
            <div className="absolute top-[40%] right-[30%] w-6 h-6 rounded-full bg-red-500/80 border-2 border-white flex items-center justify-center text-white text-xs font-bold shadow animate-ping">!</div>
            <div className="absolute top-[60%] right-[40%] w-6 h-6 rounded-full bg-orange-500/80 border-2 border-white flex items-center justify-center text-white text-xs font-bold shadow">!</div>
          </div>

          {/* AI Monitoring Active overlay */}
          <div className="absolute top-4 left-4 bg-white/95 backdrop-blur shadow-lg rounded-2xl p-3 border border-slate-100 flex items-center gap-3 z-10">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white">
              <IoPulseOutline className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <span className="block text-xs font-bold text-slate-800">AI Monitoring Active</span>
              <span className="flex items-center gap-1 text-[10px] text-slate-500 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-ping"></span>
                Scanning roads in real-time
              </span>
            </div>
          </div>

          {/* Live Road Map Widget overlay */}
          <div className="absolute right-4 bottom-4 w-52 bg-white/95 backdrop-blur shadow-2xl rounded-2xl p-3.5 border border-slate-100/80 flex flex-col gap-2.5 z-10">
            <div className="flex items-center justify-between border-b pb-1.5">
              <span className="text-xs font-extrabold text-slate-800">Live Road Map</span>
              <span onClick={() => navigate('/login')} className="text-[9px] font-bold text-blue-600 hover:underline cursor-pointer flex items-center gap-0.5">
                View Full Map <IoMapOutline className="w-3 h-3" />
              </span>
            </div>
            {/* Small map block */}
            <div className="w-full h-20 bg-blue-100 rounded-lg overflow-hidden relative border border-slate-200">
              <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1524661135-423995f22d0b?w=200&auto=format&fit=crop&q=60')" }} />
              <div className="absolute top-6 left-12 w-2 h-2 rounded-full bg-blue-600 animate-ping" />
              <div className="absolute top-10 right-16 w-2 h-2 rounded-full bg-red-600" />
            </div>
            {/* Map Legends */}
            <div className="flex flex-col gap-1 text-[9px] font-semibold text-slate-600">
              <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-green-500" /><span>Safe Road</span></div>
              <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-yellow-500" /><span>Minor Hazard</span></div>
              <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-orange-500" /><span>Moderate Hazard</span></div>
              <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" /><span>Critical Hazard</span></div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Row */}
      <section className="bg-white border-y border-slate-100 py-6 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-5 gap-6">
          {[
            { label: "Roads Monitored", val: "1,248 km", desc: "Across multiple cities", color: "#3b82f6" },
            { label: "Active Community", val: "986+", desc: "Drivers contributing", color: "#22c55e" },
            { label: "Hazards Detected", val: "245", desc: "Across all road types", color: "#f97316" },
            { label: "Alerts Delivered", val: "12,842", desc: "In real-time to drivers", color: "#a855f7" },
            { label: "Reports Verified", val: "932", desc: "By AI + Community", color: "#ec4899" }
          ].map((stat, i) => (
            <div key={i} className="flex flex-col gap-1.5">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{stat.label}</span>
              <div className="flex items-baseline gap-2">
                <span className="text-xl font-extrabold text-slate-800">{stat.val}</span>
                <span className="text-[9px] text-slate-400">{stat.desc}</span>
              </div>
              {/* Mini Sparkline graph */}
              <div className="w-full h-8 mt-1">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={sparkData}>
                    <Area type="monotone" dataKey="value" stroke={stat.color} fill={stat.color} fillOpacity={0.1} strokeWidth={1.5} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Why SafePath AI Section */}
      <section className="py-20 px-6 max-w-7xl mx-auto text-center space-y-12">
        <div className="space-y-3">
          <h2 className="text-3xl font-extrabold tracking-tight">Why SafePath AI?</h2>
          <p className="text-slate-500 text-sm max-w-md mx-auto">Providing advanced AI safety intelligence and analytics to build robust, accident-free cities.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          {[
            { title: "Real-time Detection", desc: "AI + sensors detect hazards instantly and accurately.", icon: IoPhonePortraitOutline, bg: "bg-blue-50 text-blue-600" },
            { title: "Crowdsourced Power", desc: "Stronger together. More drivers, safer roads.", icon: IoPeopleOutline, bg: "bg-green-50 text-green-600" },
            { title: "Smart Alerts", desc: "Timely warnings help you drive with confidence.", icon: IoShieldCheckmarkOutline, bg: "bg-amber-50 text-amber-500" },
            { title: "Data-Driven Insights", desc: "Helping municipalities make smarter decisions.", icon: IoStatsChartOutline, bg: "bg-purple-50 text-purple-600" },
            { title: "Better Cities", desc: "Better roads today, better tomorrow.", icon: IoBusinessOutline, bg: "bg-pink-50 text-pink-600" }
          ].map((item, i) => {
            const Icon = item.icon;
            return (
              <div key={i} className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm hover:shadow-md transition-shadow text-left space-y-4">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${item.bg}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="font-extrabold text-slate-800 text-sm">{item.title}</h3>
                <p className="text-slate-500 text-xs leading-relaxed">{item.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Trust bar */}
      <footer className="bg-slate-900 text-slate-400 py-6 border-t border-slate-800 text-center px-6">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-center items-center gap-8 md:gap-16 text-xs font-semibold">
          <div className="flex items-center gap-2"><IoShieldCheckmarkOutline className="w-5 h-5 text-blue-500" /><span>Trusted by Drivers</span></div>
          <div className="flex items-center gap-2"><IoLockClosedOutline className="w-5 h-5 text-green-500" /><span>Privacy Focused</span></div>
          <div className="flex items-center gap-2"><IoCloudOutline className="w-5 h-5 text-purple-500" /><span>Cloud Powered</span></div>
          <div className="flex items-center gap-2"><IoFlashOutline className="w-5 h-5 text-amber-500" /><span>Real-time Updates</span></div>
          <div className="flex items-center gap-2"><IoPeopleOutline className="w-5 h-5 text-pink-500" /><span>Community Driven</span></div>
        </div>
      </footer>
    </div>
  );
}

// Inline placeholder for missing loader
function IoPulseOutline(props) {
  return (
    <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
    </svg>
  );
}
