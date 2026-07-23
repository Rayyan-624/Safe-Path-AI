import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { SocketProvider } from './context/SocketContext';
import { HazardProvider } from './context/HazardContext';
import Layout from './components/Layout';
import RoleSwitcher from './components/RoleSwitcher';

// Guest Pages
import LandingPage from './pages/guest/LandingPage';
import LoginPage from './pages/guest/LoginPage';
import SignupStep1 from './pages/guest/SignupStep1';
import SignupStep2 from './pages/guest/SignupStep2';

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

function AppContent() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          {/* Guest Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupStep1 />} />
          <Route path="/permissions" element={<SignupStep2 />} />

          {/* Driver Routes */}
          <Route path="/driver/dashboard" element={<DriverDashboard />} />
          <Route path="/driver/map" element={<DriverLiveMap />} />
          <Route path="/driver/navigation" element={<DriverNavigation />} />
          <Route path="/driver/hazard/:id" element={<DriverHazardDetails />} />
          <Route path="/driver/report" element={<DriverReportHazard />} />
          <Route path="/driver/report-success" element={<DriverReportSuccess />} />
          <Route path="/driver/ai-status" element={<DriverAIDetectionStatus />} />
          <Route path="/driver/history" element={<DriverDetectionHistory />} />
          <Route path="/driver/validation" element={<DriverCrowdsourcedValidation />} />
          <Route path="/driver/analytics" element={<DriverPersonalAnalytics />} />
          <Route path="/driver/notifications" element={<DriverNotifications />} />
          <Route path="/driver/profile" element={<DriverProfile />} />
          <Route path="/driver/settings" element={<DriverSettings />} />

          {/* Municipality Admin Routes */}
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/hazards" element={<AdminHazardManagement />} />
          <Route path="/admin/gis-map" element={<AdminGISMap />} />
          <Route path="/admin/maintenance" element={<AdminMaintenanceRequests />} />
          <Route path="/admin/analytics" element={<AdminAnalyticsDashboard />} />
          <Route path="/admin/ai-monitoring" element={<AdminAIMonitoring />} />
          <Route path="/admin/users" element={<AdminUserManagement />} />
          <Route path="/admin/reports" element={<AdminReportsExport />} />
          <Route path="/admin/smart-city" element={<AdminSmartCity />} />
          <Route path="/admin/predictions" element={<AdminRoadPrediction />} />

          {/* Wildcard Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
      
      {/* Floating Developer Switcher for the Evaluator */}
      <RoleSwitcher />
    </BrowserRouter>
  );
}

function App() {
  const [coords, setCoords] = useState({ latitude: 24.8607, longitude: 67.0099 }); // Default to Karachi coordinates

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
