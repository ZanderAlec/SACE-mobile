import React, { useState } from 'react'
import { View, Text, StyleSheet, Pressable, Modal, Alert } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { router } from 'expo-router'
import Feather from '@expo/vector-icons/Feather'
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons'
import { denunciasApi } from '@/services/api'
import { useDenuncias } from '@/contexts/DenunciasContext'
import UiButton from '@/components/general/UiButton'

function Denuncia({ denuncia }) {

    const {
        hora_denuncia: hora,
        endereco_complemento: complemento,
        numero,
        observacoes,
        rua_avenida: rua,
        status: status,
        tipo_imovel: tipo,
        arquivos,
        id,
        denuncia_id,
    } = denuncia

    const [isDeleting, setIsDeleting] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleteError, setDeleteError] = useState(null);
    const { refetch } = useDenuncias();

    const statusType = status === 'Concluída' ? styles.StatusConcluido : status === 'Em Análise' ? styles.StatusAnalise : styles.StatusPendente;

    const handleDeletePress = () => {
        const denunciaId = id || denuncia_id;
        
        if (!denunciaId) {
            Alert.alert('Erro', 'ID da denúncia não encontrado');
            return;
        }
        
        setDeleteError(null);
        setShowDeleteModal(true);
    }

    const handleConfirmDelete = async () => {
        const denunciaId = id || denuncia_id;
        
        try {
            setIsDeleting(true);
            setDeleteError(null);
            
            await denunciasApi.deleteDenuncia(denunciaId);
            
            // Close modal and refetch denuncias
            setShowDeleteModal(false);
            refetch();
        } catch (error) {
            console.error('Error deleting denuncia:', error);
            const errorMessage = error.response?.data?.message || error.message || 'Erro ao excluir denúncia';
            setDeleteError(errorMessage);
        } finally {
            setIsDeleting(false);
        }
    }

    const handleCloseModal = () => {
        setShowDeleteModal(false);
        setDeleteError(null);
    }

    const handleEditPress = () => {
        router.push({
            pathname: '/form/DenunciaForm',
            params: {
                denuncia: JSON.stringify(denuncia)
            }
        });
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.containerButtons}>
                <Pressable onPress={handleDeletePress}>
                 <MaterialCommunityIcons name="delete-outline" size={24} color="#ED1B24" />
                </Pressable>

                <Pressable onPress={handleEditPress}>
                <Feather name="edit-2" size={24} color="#3B67CE" />
                </Pressable>
            </View>

            <View style={styles.containerItem}>
                <Text>Status: </Text>
                <Text style={[styles.status, statusType]}
                >{status}</Text>
            </View> 

            <View style={styles.containerItem}>
                <Text>Hora da denúncia: </Text>
                <Text style={[styles.infoText]}>{hora}</Text>
            </View>
            
            <View style={styles.containerItem}>
                <Text>Endereço: </Text>
                <Text style={[styles.infoText]}>{rua}</Text>
            </View>

            <View style={styles.containerItem}>
                <Text>tipo: </Text>
                <Text style={[styles.infoText]}>{tipo}</Text>
            </View>

            <View style={styles.containerItem}>
                <Text>Número: </Text>
                <Text style={[styles.infoText]}>{numero}</Text>
            </View>

            <View style={styles.containerItem}>
                <Text>Complemento: </Text>
                <Text style={[styles.infoText, styles.complemento]}>{complemento}</Text>
            </View>

            <View style={styles.containerItem}>
                <Text>Observacoes: </Text>
                <Text style={[styles.infoText, styles.complemento]}>{observacoes}</Text>
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
                        {deleteError ? (
                            <>
                                <Text style={styles.modalTitle}>Erro</Text>
                                <Text style={styles.modalMessage}>{deleteError}</Text>
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
                            <>
                                <Text style={styles.modalTitle}>Confirmar exclusão</Text>
                                <Text style={styles.modalMessage}>Tem certeza que deseja excluir essa denúncia?</Text>
                                <View style={styles.modalButtons}>
                                    <UiButton
                                        text="Cancelar"
                                        onPress={handleCloseModal}
                                        type="secondary"
                                        align="left"
                                        disabled={isDeleting}
                                    />
                                    <UiButton
                                        text={isDeleting ? "Excluindo..." : "Confirmar"}
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
        
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        marginTop: 24,
        backgroundColor: 'white',
        borderRadius: 10,
        paddingHorizontal: 16,
        paddingBlock: 8,
    },

    containerItemFirst:{
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 10,
    },
    
    containerItem: {
        padding: 10,
        borderTopWidth: 1,
        borderTopColor: '#DEE6F7',
        flexDirection: 'row',
        justifyContent: 'space-between',
    },

    anexosContainer:{
        borderTopWidth: 1,
        borderTopColor: '#DEE6F7',
        padding: 10,
    },

    infoText: {
        paddingLeft: 30,
        fontSize: 14,
        color: '#72777B',
    },

    complemento: {
        flexShrink: 1,
        textAlign: 'right',
    },

    status: {
        fontWeight: '500',
        borderWidth: 1,
        padding: 4,
        borderRadius: 10,
    },

    StatusConcluido: {
        color: '#2AD947',
        borderColor: '#2AD947',
    },

    StatusAnalise: {
        color: 'grey',
        borderColor: 'grey',
    },

    StatusPendente: {
        color: '#FF7F26',
        borderColor: '#FF7F26',
    },


    containerButtons:{
        flexDirection: 'row',
        gap: 10,
        justifyContent: 'flex-end',
        alignItems: 'flex-end',
        marginBottom: 10,
    },

    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },

    modalContent: {
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 24,
        width: '80%',
        maxWidth: 400,
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

    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 16,
    },

    modalButtonsSingle: {
        alignItems: 'center',
    },

})

export default Denuncia