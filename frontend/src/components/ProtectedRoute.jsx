/**
 * SafePath AI — Protected Route Wrapper
 * =======================================
 * Redirects unauthenticated users to /login.
 * Shows a loading spinner while auth state is being verified.
 * 
 * Usage:
 *   <ProtectedRoute role="admin">
 *     <AdminDashboard />
 *   </ProtectedRoute>
 *
 * Props:
 *   children  - Component to render if auth passes
 *   role      - 'admin' | 'driver' | undefined (undefined = any authenticated user)
 */

import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { IoCompassOutline } from 'react-icons/io5';

export default function ProtectedRoute({ children, role }) {
  const { user, token, loading } = useAuth();

  // Still verifying session — show loading spinner
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 gap-4">
        <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg animate-pulse">
          <IoCompassOutline className="w-9 h-9 text-white" />
        </div>
        <div className="flex flex-col items-center gap-2">
          <div className="flex gap-1.5">
            <span className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
            <span className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
            <span className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
          </div>
          <p className="text-xs text-slate-500 font-semibold">Verifying session…</p>
        </div>
      </div>
    );
  }

  // Not logged in — redirect to login
  if (!user || !token) {
    return <Navigate to="/login" replace />;
  }

  // Role check — admin trying to access driver routes or vice versa
  if (role === 'admin' && user.role !== 'admin') {
    return <Navigate to="/driver/dashboard" replace />;
  }

  if (role === 'driver' && user.role === 'admin') {
    return <Navigate to="/admin/dashboard" replace />;
  }

  return children;
}
