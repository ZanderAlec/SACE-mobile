import React, { useMemo } from 'react'
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, Pressable } from 'react-native'
import { useAreas } from '@/hooks/useAreas';
import { useAuth } from '@/contexts/AuthContext';
import AreaContainer from './areaContainer';

function AreaScreen() {
  const { areas, loading, error, refetch } = useAreas();
  const { userInfo } = useAuth();
  
  // Filter areas based on matching nome_completo with agent nome
  const filteredAreas = useMemo(() => {

 
    if (!areas || !Array.isArray(areas) || !userInfo?.nome_completo) {
      return areas || [];
    }
    
    const userNome = userInfo.nome_completo.trim();
    
    return areas.filter((area) => {
      // Check if area has agentes array and if any agent nome matches user nome_completo
      if (area.agentes && Array.isArray(area.agentes)) {
        const hasMatchingAgent = area.agentes.some((agente) => {
          const agentNome = agente.nome?.trim();
          return agentNome && agentNome === userNome;
        });
        

        
        return hasMatchingAgent;
      }
      
      // If no agentes array, exclude the area
      return false;
    });
  }, [areas, userInfo?.nome_completo]);
  


  return (<ScrollView style={styles.scrollView}>
        {loading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#3b67ce" />
            <Text style={styles.loadingText}>Carregando áreas...</Text>
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
        
        {!loading && !error && filteredAreas && Array.isArray(filteredAreas) && filteredAreas.length > 0 && (
          filteredAreas.map((area) => (
            <AreaContainer key={area.area_de_visita_id || area.id} area={area} />
          ))
        )}
        
        {!loading && !error && (!filteredAreas || (Array.isArray(filteredAreas) && filteredAreas.length === 0)) && (
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

export default AreaScreen