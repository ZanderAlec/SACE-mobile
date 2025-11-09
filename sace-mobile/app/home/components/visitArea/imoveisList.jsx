import React, { useState, useEffect } from 'react'
import { View, Text, StyleSheet, ScrollView, Pressable, ActivityIndicator } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useLocalSearchParams, router } from 'expo-router'
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons'
import Feather from '@expo/vector-icons/Feather'
import Fontisto from '@expo/vector-icons/Fontisto'
import AreaContainer from './areaContainer'
import Title from '@/components/text/Title'
import { areasApi } from '@/services/api'
import Imovel from './imovel'

function ImoveisList() {
    const params = useLocalSearchParams();
    const [area, setArea] = useState(null);
    const [imoveis, setImoveis] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    console.log("params",params);

    useEffect(() => {
        const fetchData = async () => {
            if (params.area) {
                try {
                    const parsedArea = JSON.parse(params.area);
                    setArea(parsedArea);
                    console.log("area", parsedArea);
                    
                    // Fetch imoveis (registros) from API using area_de_visita_id
                    if (parsedArea.area_de_visita_id) {
                        setLoading(true);
                        try {
                            const registros = await areasApi.getRegistrosByArea(parsedArea.area_de_visita_id);
                            setImoveis(registros || []);
                            setError(null);
                            console.log('registros', registros);
                        } catch (err) {
                            if(err.response.status === 404) {
                                setError({message: 'Nenhum imóvel registrado no ciclo atual'});
                            }else{
                                setError({message: 'Problemas ao carregar imóveis, tente novamente mais tarde'});
                            }
                            setImoveis([]);
                        }
                    } else {
                        setImoveis([]);
                    }
                } catch (error) {
                    console.error('Error parsing area parameter:', error);
                    setError(error);
                } finally {
                    setLoading(false);
                }
            }
        };

        fetchData();
    }, [params.area]);

    const handleImovelPress = (register) => {
        // Navigate to form with register data (for editing)
        router.push({
            pathname: '/form',
            params: {
                register: JSON.stringify(register),
                area: JSON.stringify(area)
            }
        });
    };

    const handleBack = () => {
        router.back();
    };

    const handleNewRegister = () => {
        router.push({
            pathname: '/form',
            params: {
                area: JSON.stringify(area),
                mode: 'edit'
            }
        });
    }

    if (loading) {
        return (
            <SafeAreaView style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#3b67ce" />
                <Text style={styles.loadingText}>Carregando...</Text>
            </SafeAreaView>
        );
    }

    if (!area) {
        return (
            <SafeAreaView style={styles.errorContainer}>
                <Text style={styles.errorText}>Área não encontrada</Text>
                <Pressable onPress={handleBack} style={styles.backButton}>
                    <Text style={styles.backButtonText}>Voltar</Text>
                </Pressable>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView style={styles.container}>
            {/* Back button */}
            <Pressable style={styles.backButtonContainer} onPress={handleBack}>
                <Feather name="arrow-left" size={24} color="#3B67CE" />
                <Text style={styles.backButtonText}>Voltar</Text>
            </Pressable>

            <View style = {styles.header}>

                <Text style={styles.headerTitle}>{area.setor}</Text>
                <Pressable 
                    style={styles.addButton}
                    onPress={() => router.push({
                        pathname: '/form',
                        params: {
                            area: JSON.stringify(area)
                        }
                    })}
                >
                    <Text style={styles.addButtonText}>Novo registro</Text>
                </Pressable>


            </View>

        
            {/* Imoveis list */}
            <View style={styles.imoveisContainer}>
                <Text style={styles.sectionTitle}>Imóveis ({imoveis.length})</Text>
                
                {error && !loading && (
                    <View style={styles.errorMessageContainer}>
                        <Text style={styles.text}>{error.message}</Text>
                        <Pressable 
                            onPress={handleNewRegister} 
                            style={styles.retryButton}
                        >
                            <Text style={styles.retryButtonText}>Cadastrar nova ocorrência</Text>
                        </Pressable>
                    </View>
                )}
                
                {!error && imoveis.length === 0 && !loading ? (
                    <View style={styles.emptyContainer}>
                        <Text style={styles.emptyText}>Nenhum imóvel encontrado</Text>
                        <Pressable 
                            style={styles.addButton}
                            onPress={() => router.push({
                                pathname: '/form',
                                params: {
                                    area: JSON.stringify(area)
                                }
                            })}
                        >
                            <Text style={styles.addButtonText}>Novo registro</Text>
                        </Pressable>
                    </View>
                ) : (
                    imoveis.map((register, index) => {
                        return (
                            <Imovel 
                                key={register.id || register.registro_de_campo_id || index}
                                imovel={register} 
                                area={area}
                                index={index}
                                onPress={() => handleImovelPress(register)} 
                            />
                        );
                    })
                )}
            </View>
        </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#f2f6fe',
    },
    container: {
        flex: 1,
        backgroundColor: '#f2f6fe',
        paddingHorizontal: 16,
        paddingBlock: 24,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f2f6fe',
    },
    loadingText: {
        marginTop: 16,
        fontSize: 16,
        color: '#72777B',
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f2f6fe',
        padding: 16,
    },
    errorMessageContainer: {
        backgroundColor: 'white',
        padding: 16,
        borderRadius: 10,
        alignItems: 'center',
        marginBottom: 12,
    },
    retryButton: {
        backgroundColor: '#3B67CE',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 8,
        marginTop: 8,
    },
    retryButtonText: {
        color: 'white',
        fontSize: 14,
        fontWeight: '500',
    },

    backButtonText: {
        fontSize: 16,
        color: '#3B67CE',
        marginLeft: 8,
        fontWeight: '500',
    },
    areaContainer: {
        marginBottom: 24,
    },
    imoveisContainer: {
        marginTop: 16,
        backgroundColor: '',
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333153',
        marginBottom: 16,
    },
    emptyContainer: {
        alignItems: 'center',
        padding: 32,
        backgroundColor: 'white',
        borderRadius: 10,
    },
    emptyText: {
        fontSize: 16,
        color: '#72777B',
        marginBottom: 16,
    },
    addButton: {
        backgroundColor: '#3B67CE',
        paddingHorizontal: 8,
        paddingVertical: 12,
        borderRadius: 8,
    },
    addButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '500',
    },
    imovelItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: 'white',
        padding: 16,
        borderRadius: 10,
        marginBottom: 12,
    },
    imovelContent: {
        flex: 1,
    },
    imovelTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333153',
        marginBottom: 4,
    },
    imovelSubtitle: {
        fontSize: 14,
        color: '#72777B',
        marginTop: 2,
    },
    statusInspected: {
        color: '#2AD947',
        fontWeight: '500',
    },

    header:{
        flexDirection: 'row',
        gap: 24,
        alignItems: 'center',
        alignContent: 'center',
    },  

    headerTitle: {
        fontSize: 20,
        marginTop: 16,
    },

    backButtonContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
});

export default ImoveisList