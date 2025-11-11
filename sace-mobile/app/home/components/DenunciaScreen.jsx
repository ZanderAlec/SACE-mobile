import React, { useMemo, useState } from 'react'
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, Pressable, TextInput } from 'react-native'
import { useDenuncias } from '@/contexts/DenunciasContext';
import Denuncia from './Denuncia';
import FontAwesome from '@expo/vector-icons/FontAwesome';

function DenunciaScreen() {
  const { denuncias, loading, error, refetch } = useDenuncias();
  const [searchText, setSearchText] = useState('');
  
  // Filter denuncias based on search text
  const filteredDenuncias = useMemo(() => {
    if (!denuncias || !Array.isArray(denuncias)) {
      return [];
    }
    
    let filtered = denuncias;
    const searchLower = searchText.toLowerCase();
    
    // Apply search text
    if (searchText) {
      filtered = filtered.filter(denuncia => {
        const searchableText = [
          denuncia.rua_avenida,
          denuncia.numero,
          denuncia.endereco_complemento,
          denuncia.tipo_imovel,
          denuncia.status,
          denuncia.observacoes,
          denuncia.hora_denuncia
        ].filter(Boolean).join(' ').toLowerCase();
        
        return searchableText.includes(searchLower);
      });
    }
    
    return filtered;
  }, [denuncias, searchText]);
  
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
        <Text style={styles.sectionTitle}>Denúncias ({filteredDenuncias.length})</Text>

        {loading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#3b67ce" />
            <Text style={styles.loadingText}>Carregando denúncias...</Text>
          </View>
        )}
        
        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>Erro ao carregar denúncias</Text>
            <Pressable onPress={refetch} style={styles.retryButton}>
              <Text style={styles.retryButtonText}>Tentar novamente</Text>
            </Pressable>
          </View>
        )}
        
        {!loading && !error && filteredDenuncias && Array.isArray(filteredDenuncias) && filteredDenuncias.length > 0 && (
          filteredDenuncias.map((denuncia, index) => (
            <Denuncia key={index} denuncia={denuncia} />
          ))
        )}
        
        {!loading && !error && (!filteredDenuncias || (Array.isArray(filteredDenuncias) && filteredDenuncias.length === 0)) && (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Nenhuma denúncia encontrada</Text>
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
  denunciaContainer: {
    backgroundColor: 'white',
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 10,
  },
  denunciaText: {
    fontSize: 14,
    color: '#333',
  },

  sectionTitle:{
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333153',
    marginTop: 16,
    marginBottom: 8,
  }

  
})

export default DenunciaScreen

