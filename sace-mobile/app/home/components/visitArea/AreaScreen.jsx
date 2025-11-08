import React from 'react'
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, Pressable } from 'react-native'
import { useAreas } from '@/hooks/useAreas';
import AreaContainer from './areaContainer';

function AreaScreen() {
  const { areas, loading, error, refetch } = useAreas();
  console.log(areas);

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
        
        {!loading && !error && areas && Array.isArray(areas) && areas.length > 0 && (
          areas.map((area) => (
            <AreaContainer key={area.area_de_visita_id || area.id} area={area} />
          ))
        )}
        
        {!loading && !error && (!areas || (Array.isArray(areas) && areas.length === 0)) && (
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
  })

export default AreaScreen