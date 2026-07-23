import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { useAuth } from './AuthContext';

const SocketContext = createContext(null);

export function SocketProvider({ children, currentCoords }) {
  const { token, user } = useAuth();
  const [alerts, setAlerts] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  const wsRef = useRef(null);
  const reconnectTimeoutRef = useRef(null);

  // Connect WebSocket when authenticated
  useEffect(() => {
    if (!token || !user) {
      if (wsRef.current) {
        wsRef.current.close();
      }
      return;
    }

    const connectWS = () => {
      console.log('Connecting to WebSocket alerts...');
      const wsUrl = `ws://localhost:8000/ws/alerts`;
      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      ws.onopen = () => {
        console.log('WebSocket alerts connected.');
        setIsConnected(true);
        // If we have coordinates, subscribe immediately
        if (currentCoords?.latitude && currentCoords?.longitude) {
          ws.send(
            JSON.stringify({
              action: 'subscribe',
              latitude: currentCoords.latitude,
              longitude: currentCoords.longitude,
            })
          );
        }
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          console.log('WebSocket alert received:', data);
          if (data.event === 'new_hazard') {
            setAlerts((prev) => [data, ...prev]);
            // Dispatch custom event for real-time updates in other screens
            const customEvent = new CustomEvent('safepath:new_hazard', { detail: data });
            window.dispatchEvent(customEvent);
          }
        } catch (err) {
          console.error('Error parsing WebSocket message:', err);
        }
      };

      ws.onclose = () => {
        console.log('WebSocket alerts closed. Scheduling reconnect...');
        setIsConnected(false);
        reconnectTimeoutRef.current = setTimeout(() => {
          connectWS();
        }, 5000); // Reconnect in 5 seconds
      };

      ws.onerror = (err) => {
        console.error('WebSocket error:', err);
        ws.close();
      };
    };

    connectWS();

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
    };
  }, [token, user]);

  // Update spatial location subscription when currentCoords changes
  useEffect(() => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN && currentCoords?.latitude && currentCoords?.longitude) {
      console.log('Updating WebSocket location subscription:', currentCoords);
      wsRef.current.send(
        JSON.stringify({
          action: 'subscribe',
          latitude: currentCoords.latitude,
          longitude: currentCoords.longitude,
        })
      );
    }
  }, [currentCoords]);

  return (
    <SocketContext.Provider value={{ alerts, isConnected }}>
      {children}
    </SocketContext.Provider>
  );
}

export function useSocket() {
  return useContext(SocketContext);
}
