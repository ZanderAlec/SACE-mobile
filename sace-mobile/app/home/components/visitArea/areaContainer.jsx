import React from 'react'
import { View, Text, StyleSheet, Pressable } from 'react-native'
import { router } from 'expo-router'
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

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
    <Pressable style={styles.containerAreas} disabled={disabled}>
      <View style={styles.infoContainer}>
        <View style={styles.containerAreaItemFirst}>
            <Text style={styles.labelText}>Setor</Text>
            <Text style={[styles.infoText, styles.setor]} numberOfLines={1} ellipsizeMode="tail">{setor}</Text>
        </View>

        <View style={styles.containerAreaItem}>
            <Text style={styles.labelText}>Logradouro</Text>
            <Text style={styles.infoText} numberOfLines={1} ellipsizeMode="tail">{logradouro}</Text>
        </View>

        <View style={styles.containerAreaItem}>
            <Text style={styles.labelText}>Município</Text>
            <Text style={styles.infoText} numberOfLines={1} ellipsizeMode="tail">{municipio}</Text>
        </View>

        <View style={styles.containerAreaItem}>
            <Text style={styles.labelText}>Bairro</Text>
            <Text style={styles.infoText} numberOfLines={1} ellipsizeMode="tail">{bairro}</Text>
        </View>

        <View style={styles.containerAreaItem}>
            <Text style={styles.labelText}>Agente responsável</Text>
            <Text style={styles.infoText} numberOfLines={1} ellipsizeMode="tail">{agentes[0].nome}</Text>
        </View>       
      </View> 


      <Pressable style={styles.openImoveisContainer} onPress={handlePress} >
        <Text style={styles.openImoveisText}>Abrir lista de imóveis</Text>
        <MaterialIcons name="arrow-forward-ios" size={24} color="white" />
      </Pressable>
     </Pressable>
  )
}

const styles = StyleSheet.create({
    
  containerButtons: {
    flexDirection: 'row',
    gap: 10,
    paddingTop: 5,
    paddingHorizontal: 10,
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 10,
  },

  infoContainer: {
    flex: 1,
    justifyContent: 'space-between',
    minWidth: 0,
  },

  openImoveisContainer:{
    flexDirection: 'row',
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: "#3B67CE",
    borderRadius: 10,
    gap: 8,
    marginTop: 8,
  },
  
  openImoveisText:{
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },

  


  containerAreas: {
    marginTop: 24,
    backgroundColor: 'white',
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingTop: 16,
    position: 'relative',
    overflow: 'hidden',
  },

  containerAreaItemFirst:{
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    minWidth: 0,
    paddingRight: 0,
  },

  containerAreaItem: {
    padding: 10,
    paddingRight: 0,
    borderTopWidth: 1,
    borderTopColor: '#DEE6F7',
    flexDirection: 'row',
    justifyContent: 'space-between',
    minWidth: 0,
  },

  labelText: {
    width: 130,
    flexShrink: 0,
  },

  infoText: {
    paddingLeft: 12,
    fontSize: 14,
    color: '#72777B',
    flex: 1,
    flexShrink: 1,
    textAlign: 'right',
    minWidth: 0,
    maxWidth: '100%',
},

  setor: {
    fontWeight: 'bold',
    color: '#3B67CE',
  },
});

export default AreaContainer