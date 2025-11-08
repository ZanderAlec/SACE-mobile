import { useState, useEffect } from 'react';
import { registersApi } from '@/services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const useRegisters = () => {
  const [registers, setRegisters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchRegisters = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Verify token exists before making the request
      const token = await AsyncStorage.getItem('authToken');
      if (!token) {
        throw new Error('No authentication token found. Please login again.');
      }
      
      console.log('Fetching registers with token:', token ? 'Token present' : 'No token');
      const data = await registersApi.getRegisters();
      setRegisters(data);
    } catch (err) {
      setError(err);
      console.error('Error fetching registers:', err);
      if (err.response) {
        console.error('Response status:', err.response.status);
        console.error('Response data:', err.response.data);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRegisters();
  }, []);

  return {
    registers,
    loading,
    error,
    refetch: fetchRegisters,
  };
};






