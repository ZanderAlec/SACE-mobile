import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import Endereco from '../form/endereco'


function Multi_Step_form() {
  return (
    <View style={styles.bkgGray}>
      <View style={styles.container}>
        <Text>
          Agentes {">"}  Novo registro de campo
        </Text>
      </View>
      
      <View style ={[styles.container, styles.bkgWhite]}>
        <Endereco/>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container:{
    flex: 1,
    borderBlockColor: 'red',
    padding: 10,
  },

  bkgGray:{
    backgroundColor: 'lightgray',
  },

  bkgWhite:{
    backgroundColor: 'white'
  }

  
});

export default Multi_Step_form