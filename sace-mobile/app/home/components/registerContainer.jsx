import React, { useState } from 'react'
import { View, Text, StyleSheet, Pressable, Modal } from 'react-native'
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import Feather from '@expo/vector-icons/Feather';
import Fontisto from '@expo/vector-icons/Fontisto';
import { router } from 'expo-router';
import { registersApi } from '@/services/api';
import UiButton from '@/components/general/UiButton';

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
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleteSuccess, setDeleteSuccess] = useState(false);
    const [deleteError, setDeleteError] = useState(null);
    
    const handleDeletePress = () => {
        const registroId = registro_de_campo_id || id;
        
        if (!registroId) {
            setDeleteError('ID do registro não encontrado');
            setShowDeleteModal(true);
            return;
        }
        
        setDeleteError(null);
        setDeleteSuccess(false);
        setShowDeleteModal(true);
    }
    
    const handleConfirmDelete = async () => {
        const registroId = registro_de_campo_id || id;
        
        try {
            setIsDeleting(true);
            setDeleteError(null);
            
            await registersApi.deleteRegister(registroId);
            
            // If no error was thrown, the delete was successful (200 status)
            setDeleteSuccess(true);
        } catch (error) {
            console.error('Error deleting register:', error);
            const errorMessage = error.response?.data?.message || error.message || 'Erro ao excluir registro';
            setDeleteError(errorMessage);
        } finally {
            setIsDeleting(false);
        }
    }
    
    const handleCloseModal = () => {
        const wasSuccessful = deleteSuccess;
        setShowDeleteModal(false);
        setDeleteSuccess(false);
        setDeleteError(null);
        
        // If delete was successful, refresh the list or navigate back
        if (wasSuccessful) {
            if (onDelete) {
                onDelete();
            } else {
                router.back();
            }
        }
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
            
            {/* Delete Confirmation Modal */}
            <Modal
                visible={showDeleteModal}
                transparent={true}
                animationType="fade"
                onRequestClose={handleCloseModal}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        {deleteSuccess ? (
                            // Success state
                            <>
                                <Text style={styles.modalTitle}>Sucesso</Text>
                                <Text style={styles.modalMessage}>Registro deletado com sucesso!</Text>
                                <View style={styles.modalButtonsSingle}>
                                    <UiButton
                                        text="Fechar"
                                        onPress={handleCloseModal}
                                        type="primary"
                                        align="center"
                                    />
                                </View>
                            </>
                        ) : (
                            // Confirmation state
                            <>
                                <Text style={styles.modalTitle}>Confirmar exclusão</Text>
                                <Text style={styles.modalMessage}>Tem certeza que deseja deletar?</Text>
                                {deleteError && (
                                    <Text style={styles.errorText}>{deleteError}</Text>
                                )}
                                <View style={styles.modalButtons}>
                                    <UiButton
                                        text="Cancelar"
                                        onPress={handleCloseModal}
                                        type="secondary"
                                        align="left"
                                        disabled={isDeleting}
                                    />
                                    <UiButton
                                        text={isDeleting ? "Deletando..." : "Confirmar"}
                                        onPress={handleConfirmDelete}
                                        type="primary"
                                        align="right"
                                        disabled={isDeleting}
                                    />
                                </View>
                            </>
                        )}
                    </View>
                </View>
            </Modal>
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
    
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    
    modalContent: {
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 24,
        width: '100%',
        maxWidth: 400,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333153',
        marginBottom: 16,
        textAlign: 'center',
    },
    
    modalMessage: {
        fontSize: 16,
        color: '#72777B',
        marginBottom: 24,
        textAlign: 'center',
    },
    
    errorText: {
        fontSize: 14,
        color: '#ED1B24',
        marginBottom: 16,
        textAlign: 'center',
    },
    
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 12,
        marginTop: 8,
    },
    
    modalButtonsSingle: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 8,
    },
})

export default registerContainer