import React, { useMemo, useState } from 'react'
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, Pressable, TextInput } from 'react-native'
import { useAreas } from '@/hooks/useAreas';
import { useAuth } from '@/contexts/AuthContext';
import AreaContainer from './areaContainer';
import FontAwesome from '@expo/vector-icons/FontAwesome';

function AreaScreen() {
  const { areas, loading, error, refetch } = useAreas();
  const { userInfo } = useAuth();
  const [searchText, setSearchText] = useState('');
  
  // Filter areas based on matching nome_completo with agent nome and search text
  const filteredAreas = useMemo(() => {
    if (!areas || !Array.isArray(areas) || !userInfo?.nome_completo) {
      return areas || [];
    }
    
    const userNome = userInfo.nome_completo.trim();
    const searchLower = searchText.toLowerCase();
    
    return areas.filter((area) => {
      // Check if area has agentes array and if any agent nome matches user nome_completo
      if (area.agentes && Array.isArray(area.agentes)) {
        const hasMatchingAgent = area.agentes.some((agente) => {
          const agentNome = agente.nome?.trim();
          return agentNome && agentNome === userNome;
        });
        
        if (!hasMatchingAgent) return false;
      } else {
        return false;
      }
      
      // Apply search text
      if (searchText) {
        const searchableText = [
          area.setor,
          area.logadouro,
          area.municipio,
          area.bairro,
          area.agentes?.map(a => a.nome).join(' ')
        ].filter(Boolean).join(' ').toLowerCase();
        
        if (!searchableText.includes(searchLower)) return false;
      }
      
      return true;
    });
  }, [areas, userInfo?.nome_completo, searchText]);
  


  return (
    <View style={styles.container}>

      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <FontAwesome name="search" size={18} color="#72777B" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Pesquisar..."
            value={searchText}
            onChangeText={setSearchText}
            placeholderTextColor="#72777B"
          />
        </View>
      </View>
      
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}
      >
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
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#f2f6fe',
    },
    searchContainer: {
      paddingHorizontal: 16,
      // paddingTop: 10,
      // paddingBottom: 8,
    },
    searchInputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: 'white',
      borderRadius: 8,
      borderWidth: 1,
      borderColor: '#D7DEF7',
      paddingHorizontal: 12,
    },
    searchIcon: {
      marginRight: 8,
    },
    searchInput: {
      flex: 1,
      paddingVertical: 12,
      fontSize: 16,
    },
    scrollView: {
      flex: 1,
      backgroundColor: '#f2f6fe',
    },
    scrollViewContent: {
      flexGrow: 1,
      paddingHorizontal: 16,
      paddingTop: 8,
      paddingBottom: 20,
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
      minHeight: '100%',
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
      minHeight: '100%',
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
      minHeight: '100%',
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