import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { useRegisters } from '@/hooks/useRegisters';
import RegisterContainer from './registerContainer';
import { ScrollView, ActivityIndicator, Pressable } from 'react-native';

function RegisterScreen() {
    const { registers, loading, error, refetch } = useRegisters();

  console.log(registers);
   return (<ScrollView style={styles.scrollView}>
        {loading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#3b67ce" />
            <Text style={styles.loadingText}>Carregando registros...</Text>
          </View>
        )}
        
        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>Erro ao carregar áreas</Text>
            <Pressable onPress={refetch} style={styles.retryButton}>
              <Text style={styles.retryButtonText}>Tentar novamente</Text>
            </Pressable>
          </View>
        )}
        
        {!loading && !error && registers && Array.isArray(registers) && registers.length > 0 && (
          registers.map((register) => (
            <RegisterContainer key={register.id} register={register} onDelete={refetch} />
          ))
        )}
        
        {!loading && !error && (!registers || (Array.isArray(registers) && registers.length === 0)) && (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Nenhuma área encontrada</Text>
          </View>
        )}
      </ScrollView>)
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#f2f6fe',
    },
    scrollView: {
      flex: 1,
      marginTop: 10,
    },
    containerButtons: {
      flexDirection: 'row',
      gap: 10,
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: 'white',
      borderRadius: 10,
    },
   
    containerContent: {
      flex: 1,
      padding: 10,
    },

    loadingContainer:{
      alignItems: 'center',
    }
  })

export default RegisterScreen