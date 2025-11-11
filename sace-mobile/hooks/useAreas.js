import { useState, useEffect } from 'react';
import { areasApi } from '@/services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const useAreas = () => {
  const [areas, setAreas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAreas = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Verify token exists before making the request
      const token = await AsyncStorage.getItem('authToken');
      if (!token) {
        throw new Error('No authentication token found. Please login again.');
      }
      
      const data = await areasApi.getAreas();
      setAreas(data);
    } catch (err) {
      setError(err);
      console.error('Error fetching areas:', err);
      if (err.response) {
        console.error('Response status:', err.response.status);
        console.error('Response data:', err.response.data);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAreas();
  }, []);

  return {
    areas,
    loading,
    error,
    refetch: fetchAreas,
  };
};

