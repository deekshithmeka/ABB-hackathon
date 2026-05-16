import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://localhost:8001',
  timeout: 10000,
});

export const fetchAlarms = async () => {
  try {
    const response = await apiClient.get('/alarms');
    return response.data || [];
  } catch (error) {
    console.error('Error fetching alarms:', error);
    return [];
  }
};

export const fetchSensors = async () => {
  try {
    const response = await apiClient.get('/sensors');
    return response.data || [];
  } catch (error) {
    console.error('Error fetching sensors:', error);
    return [];
  }
};

export const fetchGraph = async () => {
  try {
    const response = await apiClient.get('/graph');
    return response.data || { nodes: [], edges: [] };
  } catch (error) {
    console.error('Error fetching graph:', error);
    return { nodes: [], edges: [] };
  }
};
