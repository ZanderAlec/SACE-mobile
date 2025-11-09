import React, { useState } from 'react'
import { View, Text, StyleSheet, Pressable, Alert } from 'react-native'
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import Feather from '@expo/vector-icons/Feather';
import Fontisto from '@expo/vector-icons/Fontisto';
import { router } from 'expo-router';
import { registersApi } from '@/services/api';

function registerContainer({register, onDelete}) {
    const {
        imovel_complemento: complemento,
        imovel_lado: lado,
        imovel_numero: numero,
        imovel_status: status,
        imovel_tipo: tipo,
        formulario_tipo,
        area_de_visita = {
            setor,
        },
        ciclo,
        agente_nome: responsavel,
        registro_de_campo_id,
        id,
    } = register;
    
    const [isDeleting, setIsDeleting] = useState(false);
    
    const handleDeletePress = async () => {
        const registroId = registro_de_campo_id || id;
        
        if (!registroId) {
            Alert.alert('Erro', 'ID do registro não encontrado');
            return;
        }
        
        Alert.alert(
            'Confirmar exclusão',
            'Tem certeza que deseja excluir este registro? Esta ação não pode ser desfeita.',
            [
                {
                    text: 'Cancelar',
                    style: 'cancel'
                },
                {
                    text: 'Excluir',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            setIsDeleting(true);
                            await registersApi.deleteRegister(registroId);
                            Alert.alert('Sucesso', 'Registro excluído com sucesso!');
                            
                            // Call the onDelete callback if provided to refresh the list
                            if (onDelete) {
                                onDelete();
                            } else {
                                // Fallback: navigate back or reload
                                router.back();
                            }
                        } catch (error) {
                            console.error('Error deleting register:', error);
                            const errorMessage = error.response?.data?.message || error.message || 'Erro ao excluir registro';
                            Alert.alert('Erro', errorMessage);
                        } finally {
                            setIsDeleting(false);
                        }
                    }
                }
            ]
        );
    }

    const handleEditPress = () => {
        const registroId = registro_de_campo_id || id;
        router.push({
            pathname: '/form',
            params: {
                register: JSON.stringify(register),
                mode: 'edit'
            }
        });
    }

    const handleCheckboxPress = (e) => {
    }

  return (
    <View style={styles.container}>
            <View style={styles.containerButtons}>
                <Pressable onPress={handleCheckboxPress}>
                    {status === 'inspecionado'
                    ? <Fontisto name="checkbox-active" size={16} color="black" /> 
                    : <Fontisto name="checkbox-passive" size={16} color="black" />
                    }
                </Pressable>
                <View style={styles.containerButtons}>
                    <Pressable onPress={handleDeletePress} disabled={isDeleting}>
                    <MaterialCommunityIcons name="delete-outline" size={24} color={isDeleting ? "#999" : "#ED1B24"} />
                    </Pressable>

                    <Pressable onPress={handleEditPress}>
                        <Feather name="edit-2" size={24} color="black" />
                    </Pressable>
                </View>
            </View>

            <View style={styles.containerContent}>
                <Text>Identificador do setor </Text>
                <Text style={styles.infoText}> {area_de_visita.setor}</Text>
            </View>

            <View style={styles.containerContent}>
                <Text>Responsável </Text>
                <Text style={styles.infoText}> {responsavel}</Text>
            </View>

            <View style={styles.containerContent}>
                <Text>Tipo de formulário </Text>
                <Text> {formulario_tipo}</Text>
            </View>

            <View style={styles.containerContent}>
                <Text>Endereço: </Text>
            </View>

            <View>
                <View style={styles.containerContentList}>
                    <Text>Número </Text>
                    <Text> {numero}</Text>
                </View>
                <View style={styles.containerContentList}>
                    <Text>Lado </Text>
                    <Text> {lado}</Text>
                </View>
                <View style={styles.containerContentList}>
                    <Text>Complemento </Text>
                    <Text> {complemento}</Text>
                </View>
        
            </View>
    </View>
  )}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        marginTop: 24,
        borderRadius: 10,
        padding: 16,
    },

    containerButtons: {
        flexDirection: 'row',
        gap: 10,
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: 'white',
        borderRadius: 10,
        paddingBlock: 5,
    },

    containerContent: {
        borderTopWidth: 1,
        borderTopColor: '#DEE6F7',
        paddingBlock: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },

    containerContentList: {
        paddingBlock: 5,
        paddingHorizontal: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },

    infoText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#3B67CE',
    },
})

export default registerContainer