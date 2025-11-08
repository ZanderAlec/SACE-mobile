import React from 'react'
import { View, Text, StyleSheet, Pressable } from 'react-native'
import { router } from 'expo-router'
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons'
import Feather from '@expo/vector-icons/Feather';
import Fontisto from '@expo/vector-icons/Fontisto';

function AreaContainer({area, onPress, disabled = false}) {
   const {
    setor, 
    agentes, 
    area_de_visita_id: id, 
    bairro, municipio, 
    logadouro: logradouro, 
    estado,
    status
    } = area; 

  const handlePress = () => {
    if (disabled) return;
    if (onPress) {
      onPress();
      return;
    }
    console.log('Navigating to imoveisList with area:', area);
    // Use router to navigate to imoveisList route
    router.push({
      pathname: '/imoveisList',
      params: { 
        area: JSON.stringify(area)
      }
    });
  };

  const handleCheckboxPress = (e) => {
    e.stopPropagation();
    // Handle checkbox logic here
  };

  const handleDeletePress = (e) => {
    e.stopPropagation();
    // Handle delete logic here
  };

  const handleEditPress = (e) => {
    e.stopPropagation();
    // Handle edit logic here
  };

  return (
    <Pressable style={styles.containerAreas} onPress={handlePress} disabled={disabled}>
        <View style={styles.containerButtons}>
            <Pressable onPress={handleCheckboxPress}>
                {status === 'Visitado'
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

        <View style={styles.containerAreaItem}>
            <Text>Identificador do setor</Text>
            <Text style={[styles.infoText, styles.setor]}>{setor}</Text>
        </View>

        <View style={styles.containerAreaItem}>
            <Text>Logradouro</Text>
            <Text style={styles.infoText}>{logradouro}</Text>
        </View>

        <View style={styles.containerAreaItem}>
            <Text>Município</Text>
            <Text style={styles.infoText}>{municipio}</Text>
        </View>

        <View style={styles.containerAreaItem}>
            <Text>Bairro</Text>
            <Text style={styles.infoText}>{bairro}</Text>
        </View>

        <View style={styles.containerAreaItem}>
            <Text>Agente responsável</Text>
            <Text style={styles.infoText}>{agentes[0].nome}</Text>
        </View>        
     </Pressable>
  )
}

const styles = StyleSheet.create({
    
    containerButtons: {
        flexDirection: 'row',
        gap: 10,
        paddingBlock: 5,
        paddingHorizontal: 10,
        paddingInline: 10,
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: 'white',
        borderRadius: 10,
      },

  containerAreas: {
    marginTop: 24,
    backgroundColor: 'white',
    borderRadius: 10,
  },

  containerAreaItem: {
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: '#DEE6F7',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  infoText: {
    paddingLeft: 30,
    
  },

  setor: {
    fontWeight: 'bold',
    color: '#3B67CE',
  },
});

export default AreaContainer