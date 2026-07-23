import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from './AuthContext';

const HazardContext = createContext(null);

export function HazardProvider({ children, currentCoords }) {
  const { token, user, isAdmin } = useAuth();
  const [hazards, setHazards] = useState([]);
  const [nearbyHazards, setNearbyHazards] = useState([]);
  const [geojson, setGeojson] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fetch geojson and nearby hazards
  const fetchMapData = async () => {
    if (!token) return;
    try {
      setLoading(true);
      const geoResponse = await api.get('/hazards/geojson');
      setGeojson(geoResponse.data);

      if (currentCoords?.latitude && currentCoords?.longitude) {
        const nearbyResponse = await api.get('/hazards/nearby', {
          params: {
            lat: currentCoords.latitude,
            lng: currentCoords.longitude,
            radius: 1000,
          },
        });
        setNearbyHazards(nearbyResponse.data);
      }
    } catch (err) {
      console.error('Failed to fetch hazard map data:', err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch admin table hazards
  const fetchAdminHazards = async () => {
    if (!token || !isAdmin) return;
    try {
      setLoading(true);
      const response = await api.get('/hazards/all', {
        params: { limit: 100 },
      });
      setHazards(response.data);
    } catch (err) {
      console.error('Failed to fetch admin hazard list:', err);
    } finally {
      setLoading(false);
    }
  };

  // Submit a new hazard report with sensor values
  const reportHazard = async (sensorData) => {
    try {
      setLoading(true);
      const response = await api.post('/hazards/report', sensorData);
      // Re-trigger fetch to sync local lists
      fetchMapData();
      if (isAdmin) fetchAdminHazards();
      return response.data;
    } catch (err) {
      console.error('Failed to report hazard:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Update repair status of a hazard
  const updateHazardStatus = async (hazardId, status) => {
    try {
      setLoading(true);
      const response = await api.put(`/hazards/${hazardId}/status`, { status });
      // Sync local lists after status update
      fetchMapData();
      if (isAdmin) fetchAdminHazards();
      return response.data;
    } catch (err) {
      console.error('Failed to update hazard status:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Refresh maps and data when current coords update
  useEffect(() => {
    if (token) {
      fetchMapData();
    }
  }, [currentCoords, token]);

  // Load admin list when role changes
  useEffect(() => {
    if (token && isAdmin) {
      fetchAdminHazards();
    }
  }, [token, isAdmin]);

  // Register WebSocket live trigger listener
  useEffect(() => {
    const handleNewHazard = (e) => {
      console.log('WS event triggering hazard cache refresh:', e.detail);
      fetchMapData();
      if (isAdmin) fetchAdminHazards();
    };

    window.addEventListener('safepath:new_hazard', handleNewHazard);
    return () => {
      window.removeEventListener('safepath:new_hazard', handleNewHazard);
    };
  }, [isAdmin, currentCoords]);

  return (
    <HazardContext.Provider
      value={{
        hazards,
        nearbyHazards,
        geojson,
        loading,
        reportHazard,
        updateHazardStatus,
        refreshData: () => {
          fetchMapData();
          if (isAdmin) fetchAdminHazards();
        },
      }}
    >
      {children}
    </HazardContext.Provider>
  );
}

export function useHazards() {
  const context = useContext(HazardContext);
  if (!context) {
    throw new Error('useHazards must be used within a HazardProvider');
  }
  return context;
}
