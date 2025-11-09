import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    // Check for stored token on app start
    checkStoredToken();
  }, []);

  const checkStoredToken = async () => {
    try {
      const storedToken = await AsyncStorage.getItem('authToken');
      const storedUserInfo = await AsyncStorage.getItem('userInfo');
      console.log('checkStoredToken - storedToken:', storedToken ? 'exists' : 'null');
      console.log('checkStoredToken - storedUserInfo:', storedUserInfo);
      
      if (storedToken) {
        setToken(storedToken);
        setIsAuthenticated(true);
        if (storedUserInfo) {
          try {
            const parsedUserInfo = JSON.parse(storedUserInfo);
            console.log('Parsed userInfo from storage:', parsedUserInfo);
            setUserInfo(parsedUserInfo);
          } catch (e) {
            console.error('Error parsing stored user info:', e);
          }
        } else {
          console.warn('No stored userInfo found');
        }
      }
    } catch (error) {
      console.error('Error checking stored token:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (authToken, userData = null) => {
    try {
      await AsyncStorage.setItem('authToken', authToken);
      setToken(authToken);
      setIsAuthenticated(true);
      
      // Store user info if provided
      console.log('AuthContext login - userData received:', userData);
      if (userData) {
        const userInfoString = JSON.stringify(userData);
        console.log('Storing userInfo to AsyncStorage:', userInfoString);
        await AsyncStorage.setItem('userInfo', userInfoString);
        setUserInfo(userData);
        console.log('UserInfo set in state:', userData);
      } else {
        console.warn('No userData provided to login function');
      }
    } catch (error) {
      console.error('Error storing token:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem('authToken');
      await AsyncStorage.removeItem('userInfo');
      setToken(null);
      setIsAuthenticated(false);
      setUserInfo(null);
    } catch (error) {
      console.error('Error removing token:', error);
    }
  };

  const value = {
    token,
    isAuthenticated,
    isLoading,
    userInfo,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
