/**
 * SafePath AI — API Service Layer
 * =================================
 * Central Axios instance + named service functions for every backend endpoint.
 * Import the named functions rather than the raw `api` instance where possible.
 */

import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

// ---------------------------------------------------------------------------
// Request interceptor — attach Bearer token from localStorage
// ---------------------------------------------------------------------------
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('safepath_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ---------------------------------------------------------------------------
// Response interceptor — handle 401 token expiry
// ---------------------------------------------------------------------------
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('safepath_token');
      const publicPaths = ['/', '/login', '/signup', '/forgot-password'];
      if (!publicPaths.includes(window.location.pathname)) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;

// ===========================================================================
// Auth services
// ===========================================================================

export const authService = {
  /** Verify session / get current user */
  getMe: () => api.get('/auth/me'),

  /** Login with a Firebase token (or mock token in dev) */
  login: (firebaseToken) =>
    api.post('/auth/login', { firebase_token: firebaseToken }),

  /** Register a new user */
  register: (firebaseToken, displayName) =>
    api.post('/auth/register', { firebase_token: firebaseToken, display_name: displayName }),
};

// ===========================================================================
// Hazard services
// ===========================================================================

export const hazardService = {
  /** Get all hazards as GeoJSON (for map rendering) */
  getGeoJSON: (params = {}) => api.get('/hazards/geojson', { params }),

  /** Get hazards near a coordinate */
  getNearby: (lat, lng, radius = 1000, severity = undefined) =>
    api.get('/hazards/nearby', { params: { lat, lng, radius, severity } }),

  /** Admin: get all hazards (paginated, filterable) */
  getAll: (params = {}) => api.get('/hazards/all', { params }),

  /** Get a single hazard by ID */
  getById: (id) => api.get(`/hazards/${id}`),

  /** Submit a new hazard report (sensor data payload) */
  report: (sensorData) => api.post('/hazards/report', sensorData),

  /** Admin: update hazard repair status */
  updateStatus: (id, status) => api.put(`/hazards/${id}/status`, { status }),

  /** Admin: delete a hazard */
  delete: (id) => api.delete(`/hazards/${id}`),

  /** Admin: export reports bundle */
  exportReports: (params = {}) => api.get('/hazards/reports/export', { params }),
};

// ===========================================================================
// GPS services
// ===========================================================================

export const gpsService = {
  /** Store a GPS location ping */
  ping: (data) => api.post('/gps', data),

  /** Get location history (default last 24 hours) */
  getHistory: (hours = 24, limit = 500) =>
    api.get('/gps/history', { params: { hours, limit } }),
};

// ===========================================================================
// Notification services
// ===========================================================================

export const notificationService = {
  /** Get current user's notifications */
  getAll: (params = {}) => api.get('/notifications', { params }),

  /** Mark a single notification as read */
  markRead: (id) => api.patch(`/notifications/${id}/read`),

  /** Mark all notifications as read */
  markAllRead: () => api.post('/notifications/read-all'),

  /** Admin: broadcast notification to all users */
  broadcast: (title, message, type = 'system') =>
    api.post('/notifications', { title, message, type }),
};

// ===========================================================================
// User management services (admin)
// ===========================================================================

export const userService = {
  /** Admin: list all users */
  getAll: (params = {}) => api.get('/users', { params }),

  /** Get own profile (alias for /auth/me) */
  getMe: () => api.get('/users/me'),

  /** Admin: get a single user by ID */
  getById: (id) => api.get(`/users/${id}`),

  /** Admin: update a user's role / status */
  update: (id, data) => api.patch(`/users/${id}`, data),
};

// ===========================================================================
// Dashboard services
// ===========================================================================

export const dashboardService = {
  /** User dashboard summary */
  getUserDashboard: (lat, lng) =>
    api.get('/dashboard', { params: { lat, lng } }),

  /** Admin dashboard summary */
  getAdminDashboard: () => api.get('/dashboard/admin'),
};

// ===========================================================================
// Analytics services
// ===========================================================================

export const analyticsService = {
  /** Admin: full analytics summary with hotspots */
  getSummary: () => api.get('/analytics/summary'),
};
