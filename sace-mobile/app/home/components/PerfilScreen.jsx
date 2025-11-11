import React from 'react'
import { View, Text, StyleSheet, Pressable } from 'react-native'
import { useAuth } from '@/contexts/AuthContext'
import { router } from 'expo-router'
import Ionicons from '@expo/vector-icons/Ionicons'

function PerfilScreen() {
  const { logout, userInfo } = useAuth();

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.profileSection}>
          <View style={styles.avatarContainer}>
            <Ionicons name="person-circle-outline" size={80} color="#3B67CE" />
          </View>
          {userInfo?.nome_completo && (
            <Text style={styles.userName}>{userInfo.nome_completo}</Text>
          )}
        </View>

        <View style={styles.logoutSection}>
          <Pressable 
            style={styles.debugButton} 
            onPress={() => router.push('/debug-offline')}
          >
            <Ionicons name="bug-outline" size={24} color="#007AFF" />
            <Text style={styles.debugText}>Debug Offline</Text>
          </Pressable>
          
          <Pressable style={styles.logoutButton} onPress={logout}>
            <Ionicons name="log-out-outline" size={24} color="white" />
            <Text style={styles.logoutText}>Sair</Text>
          </Pressable>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 10,
  },
  content: {
    padding: 20,
  },
  profileSection: {
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 40,
  },
  avatarContainer: {
    marginBottom: 16,
  },
  userName: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333153',
    textAlign: 'center',
  },
  logoutSection: {
    marginTop: 'auto',
    paddingBottom: 20,
    gap: 12,
  },
  debugButton: {
    backgroundColor: '#E3F2FD',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 10,
    gap: 10,
    borderWidth: 1,
    borderColor: '#2196F3',
  },
  debugText: {
    color: '#007AFF',
    fontSize: 18,
    fontWeight: '600',
  },
  logoutButton: {
    backgroundColor: '#ED1B24',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 10,
    gap: 10,
  },
  logoutText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
})

export default PerfilScreen


