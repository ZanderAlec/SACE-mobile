import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import { denunciasApi } from '@/services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

const DenunciasContext = createContext();

export const useDenuncias = () => {
  const context = useContext(DenunciasContext);
  if (!context) {
    throw new Error('useDenuncias must be used within a DenunciasProvider');
  }
  return context;
};

export const DenunciasProvider = ({ children }) => {
  const [denuncias, setDenuncias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const lastDenunciasCountRef = useRef(0);
  const lastDenunciasIdsRef = useRef(new Set());

  const fetchDenuncias = useCallback(async (silent = false) => {
    try {
      if (!silent) {
        setLoading(true);
      }
      setError(null);
      
      // Verify token exists before making the request
      const token = await AsyncStorage.getItem('authToken');
      if (!token) {
        throw new Error('No authentication token found. Please login again.');
      }
      
      const data = await denunciasApi.getDenuncias();
      
      // Check if there are new denuncias
      const currentIds = new Set(data.map(d => d.id || d.denuncia_id));
      const hasNewDenuncias = data.length > lastDenunciasCountRef.current || 
        Array.from(currentIds).some(id => !lastDenunciasIdsRef.current.has(id));
      
      if (hasNewDenuncias || lastDenunciasCountRef.current === 0) {
        setDenuncias(data);
        lastDenunciasCountRef.current = data.length;
        lastDenunciasIdsRef.current = currentIds;
      }
    } catch (err) {
      setError(err);
      console.error('Error fetching denuncias:', err);
      if (err.response) {
        console.error('Response status:', err.response.status);
        console.error('Response data:', err.response.data);
      }
    } finally {
      if (!silent) {
        setLoading(false);
      }
    }
  }, []);

  // Initial fetch - only runs once
  useEffect(() => {
    fetchDenuncias();
  }, [fetchDenuncias]);

  const value = {
    denuncias,
    loading,
    error,
    refetch: useCallback(() => fetchDenuncias(false), [fetchDenuncias]),
    checkForNew: useCallback(() => fetchDenuncias(true), [fetchDenuncias]), // Silent check for new denuncias
  };

  return (
    <DenunciasContext.Provider value={value}>
      {children}
    </DenunciasContext.Provider>
  );
};

