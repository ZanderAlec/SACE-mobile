import React, { useMemo } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { useRegisters } from '@/hooks/useRegisters';
import { useAuth } from '@/contexts/AuthContext';
import RegisterContainer from './registerContainer';
import { ScrollView, ActivityIndicator, Pressable } from 'react-native';

function RegisterScreen() {
    const { registers, loading, error, refetch } = useRegisters();
    const { userInfo } = useAuth();
    
    // Filter registers based on matching nome_completo with agente_nome
    const filteredRegisters = useMemo(() => {
        console.log('registers', registers);
        console.log('userInfo', userInfo);
        
        if (!registers || !Array.isArray(registers) || !userInfo?.nome_completo) {
            return registers || [];
        }
        
        const userNome = userInfo.nome_completo.trim();
        console.log('Filtering registers for user:', userNome);
        
        return registers.filter((register) => {
            // Check if register has agente_nome and if it matches user nome_completo
            const agenteNome = register.agente_nome?.trim();
            
            if (agenteNome && agenteNome === userNome) {
                console.log('Register matched:', register.registro_de_campo_id || register.id);
                return true;
            }
            
            return false;
        });
    }, [registers, userInfo?.nome_completo]);
    
    console.log('Total registers:', registers?.length || 0);
    console.log('Filtered registers:', filteredRegisters.length);
    
   return (<ScrollView style={styles.scrollView}>
        {loading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#3b67ce" />
            <Text style={styles.loadingText}>Carregando registros...</Text>
          </View>
        )}
        
        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>Erro ao carregar registros</Text>
            <Pressable onPress={refetch} style={styles.retryButton}>
              <Text style={styles.retryButtonText}>Tentar novamente</Text>
            </Pressable>
          </View>
        )}
        
        {!loading && !error && filteredRegisters && Array.isArray(filteredRegisters) && filteredRegisters.length > 0 && (
          filteredRegisters.map((register) => (
            <RegisterContainer key={register.id || register.registro_de_campo_id} register={register} onDelete={refetch} />
          ))
        )}
        
        {!loading && !error && (!filteredRegisters || (Array.isArray(filteredRegisters) && filteredRegisters.length === 0)) && (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Nenhum registro encontrado</Text>
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
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 20,
    },
    loadingText: {
      marginTop: 10,
      fontSize: 16,
      color: '#666',
    },
    errorContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 20,
    },
    errorText: {
      fontSize: 16,
      color: '#ED1B24',
      marginBottom: 16,
      textAlign: 'center',
    },
    retryButton: {
      backgroundColor: '#3B67CE',
      paddingHorizontal: 20,
      paddingVertical: 10,
      borderRadius: 6,
    },
    retryButtonText: {
      color: 'white',
      fontSize: 16,
      fontWeight: 'bold',
    },
    emptyContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 20,
    },
    emptyText: {
      fontSize: 16,
      color: '#666',
      textAlign: 'center',
    },
  })

export default RegisterScreen