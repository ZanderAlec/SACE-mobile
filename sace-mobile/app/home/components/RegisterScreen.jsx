import React, { useMemo, useState } from 'react'
import { View, Text, StyleSheet, TextInput } from 'react-native'
import { useRegisters } from '@/hooks/useRegisters';
import { useAuth } from '@/contexts/AuthContext';
import RegisterContainer from './registerContainer';
import { ScrollView, ActivityIndicator, Pressable } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';

function RegisterScreen({ selectedYear, selectedCycle }) {
    const { registers, loading, error, refetch } = useRegisters();
    const { userInfo } = useAuth();
    const [searchText, setSearchText] = useState('');
    
    // Filter registers based on matching nome_completo with agente_nome and cycle/year
    const filteredRegisters = useMemo(() => {
        if (!registers || !Array.isArray(registers)) {
            return [];
        }
        
        let filtered = registers;
        const searchLower = searchText.toLowerCase();
        
        // Filter by user nome_completo if available
        if (userInfo?.nome_completo) {
            const userNome = userInfo.nome_completo.trim();
            filtered = filtered.filter((register) => {
                const agenteNome = register.agente_nome?.trim();
                return agenteNome && agenteNome === userNome;
            });
        }
        
        // Filter by selected year and cycle if both are provided
        if (selectedYear && selectedCycle) {
            filtered = filtered.filter((register) => {
                if (!register.ciclo) {
                    return false;
                }
                
                // Get year and cycle from ciclo object
                const registerYear = register.ciclo.ano;
                const registerCycle = register.ciclo.ciclo;
                
                // Check if both exist
                if (registerYear === undefined || registerYear === null || registerCycle === undefined || registerCycle === null) {
                    return false;
                }
                
                // Compare year and cycle (convert both to string for comparison)
                const registerYearStr = String(registerYear);
                const registerCycleStr = String(registerCycle);
                const selectedYearStr = String(selectedYear);
                const selectedCycleStr = String(selectedCycle);
                
                return registerYearStr === selectedYearStr && registerCycleStr === selectedCycleStr;
            });
        }
        
        // Apply search text
        if (searchText) {
            filtered = filtered.filter(register => {
                const searchableText = [
                    register.area_de_visita?.setor,
                    register.agente_nome,
                    register.formulario_tipo,
                    register.imovel_numero,
                    register.imovel_lado,
                    register.imovel_complemento,
                    register.observacao
                ].filter(Boolean).join(' ').toLowerCase();
                
                return searchableText.includes(searchLower);
            });
        }
        
        return filtered;
    }, [registers, userInfo?.nome_completo, selectedYear, selectedCycle, searchText]);
    
 
    
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
      paddingTop: 10,
      paddingBottom: 8,
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