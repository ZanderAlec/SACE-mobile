import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { View,Button, Dimensions, Text, ActivityIndicator } from 'react-native'
import Login from '@/app/Login'
import { useAuth } from '@/contexts/AuthContext'
import { useFormContext } from '@/contexts/FormContext'
import Home from '@/app/home'
import FieldRegisterForm from '@/app/form'
const {width, height} = Dimensions.get('window');

function index() {
  const { isAuthenticated, isLoading } = useAuth();
  const { logout } = useAuth();
  const { showForm } = useFormContext();
  // Show loading while checking authentication
  if (isLoading) {
    return (
      <SafeAreaView style={{ width: width, height: height, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={{ marginTop: 16, fontSize: 16, color: '#666' }}>Carregando...</Text>
      </SafeAreaView>
    );
  }

  // Show login if not authenticated
  if (!isAuthenticated) {
    return (
      <SafeAreaView style={{ width: width, height: height }}>
        <Login/>
      </SafeAreaView>
    );
  }

  // Show form if authenticated
  return (
    <SafeAreaView style={{ width: width, height: height, boxSizing: 'border-box' }}>
      <Button title="logout" onPress={logout}/>
      {showForm ? <FieldRegisterForm/> : <Home/>}
    </SafeAreaView>
  );
}

export default index