import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { IoPersonOutline, IoMailOutline, IoCallOutline, IoLockClosedOutline, IoEyeOutline, IoEyeOffOutline, IoArrowBackOutline } from 'react-icons/io5';
import { useAuth } from '../../context/AuthContext';

export default function SignupStep1() {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [vehicle, setVehicle] = useState('Car');
  const [agree, setAgree] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const mockToken = email.toLowerCase().includes('admin') ? 'mock-admin-token' : 'mock-driver-token';
      await register(mockToken, name);
      navigate('/permissions');
    } catch (err) {
      setError('Registration failed.');
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
            <IoMailOutline className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="font-extrabold text-base tracking-tight block">SafePath AI</span>
            <span className="block text-[9px] text-slate-400 font-bold uppercase tracking-wider">Smarter Roads, Safer Lives</span>
          </div>
        </div>

        {/* Heading */}
        <div className="relative z-10 space-y-4 max-w-md my-auto">
          <h2 className="text-4xl font-extrabold leading-tight">
            Join the movement <br />
            for <span className="text-blue-500">safer roads</span> and <br />
            <span className="text-green-500">smarter cities</span>
          </h2>
          <p className="text-slate-300 text-sm leading-relaxed">
            Create your account and help build a real-time road safety ecosystem powered by AI and community data.
          </p>
        </div>

        {/* Already have an account footer card */}
        <div className="relative z-10 bg-white/5 border border-white/10 rounded-2xl p-4 backdrop-blur-md flex items-center justify-between">
          <span className="text-xs font-bold text-slate-300">Already have an account?</span>
          <button
            onClick={() => navigate('/login')}
            className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold shadow-sm transition-all focus:outline-none"
          >
            Sign In →
          </button>
        </div>
      </div>

      {/* Right Stepper Signup Form Panel */}
      <div className="flex-1 flex flex-col justify-center items-center p-8 lg:p-16 bg-white overflow-y-auto">
        <div className="w-full max-w-md space-y-6">
          
          {/* Stepper Header & Back to Login link */}
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <button
              onClick={() => navigate('/login')}
              className="flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-700 focus:outline-none"
            >
              <IoArrowBackOutline className="w-4 h-4" />
              <span>Back to Sign In</span>
            </button>
            
            {/* Stepper bubbles */}
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px] font-bold">1</span>
              <span className="w-8 h-0.5 bg-slate-200"></span>
              <span className="w-6 h-6 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center text-[10px] font-bold">2</span>
              <span className="w-8 h-0.5 bg-slate-200"></span>
              <span className="w-6 h-6 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center text-[10px] font-bold">3</span>
            </div>
          </div>

          <div className="text-center space-y-1">
            <h2 className="text-2xl font-extrabold text-slate-800">Create Your Account</h2>
            <p className="text-slate-500 text-xs font-semibold">Fill in the details below to get started</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Full Name */}
            <div className="space-y-1 text-left">
              <label className="text-xs font-bold text-slate-500">Full Name</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
                  <IoPersonOutline className="w-4 h-4" />
                </span>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your full name"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none bg-slate-50/50"
                />
              </div>
            </div>

            {/* Email Address */}
            <div className="space-y-1 text-left">
              <label className="text-xs font-bold text-slate-500">Email Address</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
                  <IoMailOutline className="w-4 h-4" />
                </span>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none bg-slate-50/50"
                />
              </div>
            </div>

            {/* Phone Number */}
            <div className="space-y-1 text-left">
              <label className="text-xs font-bold text-slate-500">Phone Number</label>
              <div className="relative flex">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
                  <IoCallOutline className="w-4 h-4" />
                </span>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Enter your phone number"
                  className="w-full pl-10 pr-20 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none bg-slate-50/50"
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center border-l border-slate-200 pl-2 bg-slate-100 rounded-r-xl">
                  <span className="text-[10px] font-bold text-slate-500 mr-1">🇵🇰 +92</span>
                </div>
              </div>
            </div>

            {/* Vehicle Selector cards */}
            <div className="space-y-1 text-left">
              <label className="text-xs font-bold text-slate-500">Vehicle Type</label>
              <div className="grid grid-cols-5 gap-2">
                {[
                  { id: 'Car', label: 'Car', icon: '🚗' },
                  { id: 'Bike', label: 'Bike', icon: '🏍️' },
                  { id: 'Bus', label: 'Bus', icon: '🚌' },
                  { id: 'Truck', label: 'Truck', icon: '🚛' },
                  { id: 'Other', label: 'Other', icon: '•••' }
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setVehicle(item.id)}
                    className={`flex flex-col items-center justify-center p-2.5 rounded-xl border transition-all focus:outline-none select-none cursor-pointer ${
                      vehicle === item.id
                        ? 'border-blue-600 bg-blue-50/30 text-blue-600 font-bold ring-1 ring-blue-600'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-500'
                    }`}
                  >
                    <span className="text-lg mb-1">{item.icon}</span>
                    <span className="text-[9px] uppercase tracking-wider">{item.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Password strength */}
            <div className="space-y-1 text-left">
              <label className="text-xs font-bold text-slate-500">Password</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
                  <IoLockClosedOutline className="w-4 h-4" />
                </span>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Create a strong password"
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none bg-slate-50/50"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 focus:outline-none"
                >
                  {showPassword ? <IoEyeOffOutline className="w-4 h-4" /> : <IoEyeOutline className="w-4 h-4" />}
                </button>
              </div>
              
              {/* Strength bars */}
              {password.length > 0 && (
                <div className="space-y-1 pt-1.5">
                  <div className="flex gap-1 h-1">
                    <span className={`flex-1 rounded-full ${password.length >= 3 ? 'bg-red-500' : 'bg-slate-200'}`} />
                    <span className={`flex-1 rounded-full ${password.length >= 6 ? 'bg-amber-500' : 'bg-slate-200'}`} />
                    <span className={`flex-1 rounded-full ${password.length >= 9 ? 'bg-green-500' : 'bg-slate-200'}`} />
                  </div>
                  <span className={`text-[9px] font-bold ${password.length < 6 ? 'text-red-500' : password.length < 9 ? 'text-amber-500' : 'text-green-500'}`}>
                    Password strength: {password.length < 6 ? 'Weak' : password.length < 9 ? 'Medium' : 'Strong'}
                  </span>
                </div>
              )}
            </div>

            {/* Agreement Terms */}
            <label className="flex items-start gap-2.5 text-xs font-semibold text-slate-500 text-left select-none cursor-pointer leading-tight">
              <input
                type="checkbox"
                required
                checked={agree}
                onChange={(e) => setAgree(e.target.checked)}
                className="mt-0.5 rounded text-blue-600 focus:ring-blue-500 border-slate-300 w-4 h-4 flex-shrink-0"
              />
              <span>
                I agree to the <span className="text-blue-600 hover:underline">Terms of Service</span> and <span className="text-blue-600 hover:underline">Privacy Policy</span>
              </span>
            </label>

            {/* Submit */}
            <button
              type="submit"
              className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white rounded-xl text-xs font-bold shadow-md hover:shadow-lg transition-all focus:outline-none flex items-center justify-center gap-1 cursor-pointer"
            >
              <span>Create Account</span>
              <span>→</span>
            </button>
          </form>

        </div>
      </div>

    </div>
  );
}
