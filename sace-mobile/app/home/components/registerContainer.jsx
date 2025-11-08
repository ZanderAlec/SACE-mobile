import React from 'react'
import { View, Text, StyleSheet, Pressable } from 'react-native'
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import Feather from '@expo/vector-icons/Feather';
import Fontisto from '@expo/vector-icons/Fontisto';
import { router } from 'expo-router';

function registerContainer({register}) {
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
    } = register;
    const handleDeletePress = (e) => {}
    const handleEditPress = (e) => {}

    const handleCheckboxPress = (e) => {
    }
    
    const handlePress = () => {
        router.push({
            pathname: '/form',
            params: {
                register: JSON.stringify(register)
            }
        });
    }


  return (
    <Pressable style={styles.container} onPress={handlePress}>
            <View style={styles.containerButtons}>
                <Pressable onPress={handleCheckboxPress}>
                    {status === 'inspecionado'
                    ? <Fontisto name="checkbox-active" size={16} color="black" /> 
                    : <Fontisto name="checkbox-passive" size={16} color="black" />
                    }
                </Pressable>
                <View style={styles.containerButtons}>
                    <Pressable onPress={handleDeletePress}>
                    <MaterialCommunityIcons name="delete-outline" size={24} color="#ED1B24" />
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
    </Pressable>
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