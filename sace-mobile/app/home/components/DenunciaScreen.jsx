import React from 'react'
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, Pressable } from 'react-native'
import { useDenuncias } from '@/contexts/DenunciasContext';
import Denuncia from './Denuncia';

function DenunciaScreen() {
  const { denuncias, loading, error, refetch } = useDenuncias();
  
  return (
    <ScrollView style={styles.scrollView}>
    <Text style={styles.sectionTitle}>Denúncias ({denuncias.length})</Text>


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
      
      {!loading && !error && denuncias && Array.isArray(denuncias) && denuncias.length > 0 && (
        denuncias.map((denuncia, index) => (
          <Denuncia key={index} denuncia={denuncia} />
        ))
      )}
      
      {!loading && !error && (!denuncias || (Array.isArray(denuncias) && denuncias.length === 0)) && (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Nenhuma denúncia encontrada</Text>
        </View>
      )}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    marginTop: 10,
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
    paddingHorizontal: 16,
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333153',
    marginTop: 16,
  }

  
})

export default DenunciaScreen

