import React from 'react'
import { Pressable, Text, StyleSheet, View } from 'react-native'
import { router } from 'expo-router'
import Feather from '@expo/vector-icons/Feather'
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons'
import Fontisto from '@expo/vector-icons/Fontisto';

function Imovel({ imovel, area, onPress, index }) {
    const {
        imovel_numero: numero,
        imovel_lado: lado,
        imovel_tipo: tipo,
        imovel_status: status,
        imovel_complemento: complemento,
        registro_de_campo_id: id,
    } = imovel || {};

    const handleDeletePress = () => {}
    
    const handleEditPress = () => {
        router.push({
            pathname: '/form',
            params: {
                area: JSON.stringify(area),
                register: JSON.stringify(imovel),
                mode: 'edit'
            }
        });
    }

    return (
        
        <View style={styles.imovelItem}>
            <View style={styles.imovelContent}>
           
            <View style={styles.containerButtons}>
                <Pressable onPress={handleDeletePress}>
                 <MaterialCommunityIcons name="delete-outline" size={24} color="#ED1B24" />
                </Pressable>

                    <Pressable onPress={handleEditPress}>
                        <Feather name="edit-2" size={24} color="black" />
                    </Pressable>
                </View>

            <View style={styles.imovelHeader}>
                <Text style={styles.imovelTitle}>{numero ? `Imóvel ${numero}` : `Registro ${index !== undefined ? index + 1 : id || ''}`}</Text>
                <Text style={[styles.imovelSubtitle, styles.status, styles[status]]}>{status}</Text> 
            </View>
                
                <View style={styles.containerAreaItem}>
                    <Text style={styles.imovelSubtitle}>Lado: </Text>
                    <Text style={styles.infoText}>{lado}</Text>
                </View>
                
                    <View style={styles.containerAreaItem}>
                        <Text style={styles.imovelSubtitle}>Tipo: </Text>
                        <Text style={styles.infoText}>{tipo}</Text>
                    </View>
                
                
                {
                    complemento && (
                    <View style={styles.containerAreaItem}>
                        <Text style={styles.imovelSubtitle}>Complemento: </Text>
                        <Text style={styles.infoText}>{complemento}</Text>
                    </View>
                    )
                }
                
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    imovelItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: 'white',
        padding: 16,
        borderRadius: 10,
        marginBottom: 12,
    },

    imovelHeader:{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
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

    status: {
        fontWeight: '500',
        borderWidth: 1,
        padding: 4,
        borderRadius: 10,
    },

    inspecionado: {
        color: '#2AD947',
        borderColor: '#2AD947',
    },

    bloqueado: {
        color: 'grey',
        borderColor: 'grey',
    },

    containerButtons:{
        display: 'flex',
        flexDirection: 'row',
        gap: 10,
        justifyContent: 'flex-end',
        alignItems: 'flex-end',
        marginBottom: 10,
    },

    containerAreaItem:{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderTopWidth: 1,
        borderTopColor: '#DEE6F7',
        padding: 10,
    }

});

export default Imovel
