import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { IoMailOutline, IoArrowBackOutline, IoCheckmarkCircleOutline, IoCompassOutline } from 'react-icons/io5';

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    // Simulate a network call — Firebase password reset would go here
    await new Promise((r) => setTimeout(r, 1200));
    setLoading(false);
    setSubmitted(true);
  };

  return (
    <div className="min-h-[calc(100vh-73px)] flex flex-col lg:flex-row bg-slate-50 font-sans">

      {/* Left Branding Panel */}
      <div className="flex-1 relative overflow-hidden bg-slate-900 flex flex-col justify-between p-12 text-slate-200">
        <div className="absolute inset-0 bg-cover bg-center opacity-30 mix-blend-overlay" 
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1519160558534-579f5106e43f?w=800&auto=format&fit=crop&q=60')" }} 
        />

        <div className="relative z-10 flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg">
            <IoCompassOutline className="w-5 h-5" />
          </div>
          <div>
            <span className="font-extrabold text-base tracking-tight block">SafePath AI</span>
            <span className="block text-[9px] text-slate-400 font-bold uppercase tracking-wider">Smarter Roads, Safer Lives</span>
          </div>
        </div>

        <div className="relative z-10 space-y-4 max-w-md my-auto">
          <h2 className="text-4xl font-extrabold leading-tight">
            Reset Your <br />
            <span className="text-blue-500">Password</span>
          </h2>
          <p className="text-slate-300 text-sm leading-relaxed">
            Enter the email address linked to your SafePath AI account. We'll send you a secure link to reset your password.
          </p>
        </div>

        <div className="relative z-10 flex items-center gap-2 text-[11px] text-slate-400">
          <IoCheckmarkCircleOutline className="w-4 h-4 text-green-400" />
          <span>Password reset link is valid for 30 minutes</span>
        </div>
      </div>

      {/* Right Form Panel */}
      <div className="flex-1 flex flex-col justify-center items-center p-8 lg:p-16 bg-white">
        <div className="w-full max-w-md space-y-8">

          {/* Back Button */}
          <button
            onClick={() => navigate('/login')}
            className="flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors focus:outline-none group"
          >
            <IoArrowBackOutline className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            Back to Login
          </button>

          {/* Header */}
          <div className="text-center space-y-2">
            <div className="w-16 h-16 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center mx-auto text-blue-600 shadow-sm">
              <IoMailOutline className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-extrabold text-slate-800">Forgot Password?</h2>
            <p className="text-slate-500 text-xs font-semibold">
              No worries — enter your email and we'll send a reset link.
            </p>
          </div>

          {/* Success State */}
          {submitted ? (
            <div className="space-y-6">
              <div className="bg-green-50 border border-green-200 rounded-2xl p-6 text-center space-y-3">
                <IoCheckmarkCircleOutline className="w-12 h-12 text-green-500 mx-auto" />
                <h3 className="font-extrabold text-green-800">Email Sent!</h3>
                <p className="text-green-700 text-xs leading-relaxed">
                  A password reset link has been sent to <strong>{email}</strong>. 
                  Check your inbox (and spam folder).
                </p>
              </div>
              <button
                onClick={() => navigate('/login')}
                className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md hover:shadow-lg transition-all focus:outline-none"
              >
                Back to Login
              </button>
            </div>
          ) : (
            /* Form */
            <form onSubmit={handleSubmit} className="space-y-4">

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-xs font-semibold text-red-700">
                  {error}
                </div>
              )}

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
                    placeholder="your@email.com"
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none bg-slate-50/50"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white rounded-xl text-xs font-bold shadow-md hover:shadow-lg transition-all focus:outline-none flex items-center justify-center gap-2 cursor-pointer"
              >
                {loading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Sending…</span>
                  </>
                ) : (
                  <span>Send Reset Link →</span>
                )}
              </button>

              <div className="text-center text-xs font-semibold text-slate-500">
                <span>Remembered it? </span>
                <span onClick={() => navigate('/login')} className="text-blue-600 hover:underline cursor-pointer font-bold">
                  Sign In
                </span>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
