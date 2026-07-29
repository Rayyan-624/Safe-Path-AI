import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { SocketProvider } from './context/SocketContext';
import { HazardProvider } from './context/HazardContext';
import Layout from './components/Layout';
import RoleSwitcher from './components/RoleSwitcher';
import ProtectedRoute from './components/ProtectedRoute';

// Guest Pages
import LandingPage from './pages/guest/LandingPage';
import LoginPage from './pages/guest/LoginPage';
import SignupStep1 from './pages/guest/SignupStep1';
import SignupStep2 from './pages/guest/SignupStep2';
import ForgotPassword from './pages/guest/ForgotPassword';

// Driver Pages
import DriverDashboard from './pages/driver/Dashboard';
import DriverLiveMap from './pages/driver/LiveMap';
import DriverNavigation from './pages/driver/Navigation';
import DriverHazardDetails from './pages/driver/HazardDetails';
import DriverReportHazard from './pages/driver/ReportHazard';
import DriverReportSuccess from './pages/driver/ReportSuccess';
import DriverAIDetectionStatus from './pages/driver/AIDetectionStatus';
import DriverDetectionHistory from './pages/driver/DetectionHistory';
import DriverCrowdsourcedValidation from './pages/driver/CrowdsourcedValidation';
import DriverPersonalAnalytics from './pages/driver/PersonalAnalytics';
import DriverNotifications from './pages/driver/Notifications';
import DriverProfile from './pages/driver/Profile';
import DriverSettings from './pages/driver/Settings';

// Admin Pages
import AdminDashboard from './pages/admin/Dashboard';
import AdminHazardManagement from './pages/admin/HazardManagement';
import AdminGISMap from './pages/admin/GISMap';
import AdminMaintenanceRequests from './pages/admin/MaintenanceRequests';
import AdminAnalyticsDashboard from './pages/admin/AnalyticsDashboard';
import AdminAIMonitoring from './pages/admin/AIMonitoring';
import AdminUserManagement from './pages/admin/UserManagement';
import AdminReportsExport from './pages/admin/ReportsExport';
import AdminSmartCity from './pages/admin/SmartCity';
import AdminRoadPrediction from './pages/admin/RoadPrediction';

// 404 Not Found
import NotFound from './pages/NotFound';

function AppContent() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          {/* ── Public / Guest Routes ─────────────────────────────────── */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupStep1 />} />
          <Route path="/permissions" element={<SignupStep2 />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />

          {/* ── Driver Routes (requires auth, any role) ───────────────── */}
          <Route path="/driver/dashboard" element={
            <ProtectedRoute role="driver"><DriverDashboard /></ProtectedRoute>
          } />
          <Route path="/driver/map" element={
            <ProtectedRoute role="driver"><DriverLiveMap /></ProtectedRoute>
          } />
          <Route path="/driver/navigation" element={
            <ProtectedRoute role="driver"><DriverNavigation /></ProtectedRoute>
          } />
          <Route path="/driver/hazard/:id" element={
            <ProtectedRoute role="driver"><DriverHazardDetails /></ProtectedRoute>
          } />
          <Route path="/driver/report" element={
            <ProtectedRoute role="driver"><DriverReportHazard /></ProtectedRoute>
          } />
          <Route path="/driver/report-success" element={
            <ProtectedRoute role="driver"><DriverReportSuccess /></ProtectedRoute>
          } />
          <Route path="/driver/ai-status" element={
            <ProtectedRoute role="driver"><DriverAIDetectionStatus /></ProtectedRoute>
          } />
          <Route path="/driver/history" element={
            <ProtectedRoute role="driver"><DriverDetectionHistory /></ProtectedRoute>
          } />
          <Route path="/driver/validation" element={
            <ProtectedRoute role="driver"><DriverCrowdsourcedValidation /></ProtectedRoute>
          } />
          <Route path="/driver/analytics" element={
            <ProtectedRoute role="driver"><DriverPersonalAnalytics /></ProtectedRoute>
          } />
          <Route path="/driver/notifications" element={
            <ProtectedRoute role="driver"><DriverNotifications /></ProtectedRoute>
          } />
          <Route path="/driver/profile" element={
            <ProtectedRoute role="driver"><DriverProfile /></ProtectedRoute>
          } />
          <Route path="/driver/settings" element={
            <ProtectedRoute role="driver"><DriverSettings /></ProtectedRoute>
          } />

          {/* ── Admin Routes (requires admin role) ───────────────────── */}
          <Route path="/admin/dashboard" element={
            <ProtectedRoute role="admin"><AdminDashboard /></ProtectedRoute>
          } />
          <Route path="/admin/hazards" element={
            <ProtectedRoute role="admin"><AdminHazardManagement /></ProtectedRoute>
          } />
          <Route path="/admin/gis-map" element={
            <ProtectedRoute role="admin"><AdminGISMap /></ProtectedRoute>
          } />
          <Route path="/admin/maintenance" element={
            <ProtectedRoute role="admin"><AdminMaintenanceRequests /></ProtectedRoute>
          } />
          <Route path="/admin/analytics" element={
            <ProtectedRoute role="admin"><AdminAnalyticsDashboard /></ProtectedRoute>
          } />
          <Route path="/admin/ai-monitoring" element={
            <ProtectedRoute role="admin"><AdminAIMonitoring /></ProtectedRoute>
          } />
          <Route path="/admin/users" element={
            <ProtectedRoute role="admin"><AdminUserManagement /></ProtectedRoute>
          } />
          <Route path="/admin/reports" element={
            <ProtectedRoute role="admin"><AdminReportsExport /></ProtectedRoute>
          } />
          <Route path="/admin/smart-city" element={
            <ProtectedRoute role="admin"><AdminSmartCity /></ProtectedRoute>
          } />
          <Route path="/admin/predictions" element={
            <ProtectedRoute role="admin"><AdminRoadPrediction /></ProtectedRoute>
          } />

          {/* ── 404 Not Found ──────────────────────────────────────────── */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Layout>

      {/* Floating Developer Role Switcher — for evaluators */}
      <RoleSwitcher />
    </BrowserRouter>
  );
}

function App() {
  const [coords, setCoords] = useState({ latitude: 24.8607, longitude: 67.0099 }); // Default to Karachi

  // Sync GPS Coordinates using HTML5 Geolocation API
  useEffect(() => {
    if ('geolocation' in navigator) {
      const watcher = navigator.geolocation.watchPosition(
        (position) => {
          setCoords({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => {
          console.warn('Geolocation access denied/unavailable, using default coordinates:', error);
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );

      return () => navigator.geolocation.clearWatch(watcher);
    }
  }, []);

  return (
    <AuthProvider>
      <SocketProvider currentCoords={coords}>
        <HazardProvider currentCoords={coords}>
          <AppContent />
        </HazardProvider>
      </SocketProvider>
    </AuthProvider>
  );
}

export default App;
