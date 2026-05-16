import { useState, useEffect, useRef } from 'react';

export const useWebSocket = () => {
  const [dashboardData, setDashboardData] = useState({
    sensors: [],
    alarms: [],
    graph_nodes: [],
    graph_edges: []
  });
  const [isConnected, setIsConnected] = useState(false);
  const wsRef = useRef(null);
  const reconnectTimeoutRef = useRef(null);

  useEffect(() => {
    const connect = () => {
      try {
        const ws = new WebSocket('ws://localhost:8000/ws');

        ws.onopen = () => {
          setIsConnected(true);
          if (reconnectTimeoutRef.current) {
            clearTimeout(reconnectTimeoutRef.current);
            reconnectTimeoutRef.current = null;
          }
        };

        ws.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            setDashboardData(data);
          } catch (err) {
            console.error('Failed to parse WebSocket message:', err);
          }
        };

        ws.onerror = (error) => {
          console.error('WebSocket error:', error);
          setIsConnected(false);
        };

        ws.onclose = () => {
          setIsConnected(false);
          reconnectTimeoutRef.current = setTimeout(() => {
            connect();
          }, 3000);
        };

        wsRef.current = ws;
      } catch (err) {
        console.error('WebSocket connection error:', err);
        setIsConnected(false);
        reconnectTimeoutRef.current = setTimeout(() => {
          connect();
        }, 3000);
      }
    };

    connect();

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
    };
  }, []);

  return { dashboardData, isConnected };
};
