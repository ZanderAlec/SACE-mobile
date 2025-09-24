import React, { useState } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import Endereco from '../form/endereco'

import Ionicons from '@expo/vector-icons/Ionicons';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';


import StepIndicator from '../form/stepIndicator'



function Multi_Step_form() {

  return (
    <View style={styles.bkgGray}>
      {/* <View style={styles.container}>
        <Text>
          Agentes {">"}  Novo registro de campo
        </Text>
      </View>
      
      <View style ={[styles.container, styles.bkgWhite]}>
        <Endereco/>
      </View> */}
      <View style = {styles.indicatorContainer}>
        {/* <View>1</View>
        <View>2</View>
        <View>3</View> */}



        {/* <FontAwesome5 name="circle" size={24} color="blue" />
        <view style={styles.activeLine}/>
        <FontAwesome5 name="dot-circle" size={24} color="blue" />
        <view style={styles.line}/>
        <FontAwesome5 name="check-circle" size={24} color="blue" /> */}

        <StepIndicator/>
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
  },

  indicatorContainer:{
    flexDirection: 'row',
    alignItems: 'center',
  }, 

  line:{
    width: 20,
    height: 2,
    backgroundColor: 'black',
    margin: 3,
  },

  activeLine:{
    width: 20,
    height: 2,
    backgroundColor: 'blue',
    margin: 3,
  },
 

  
});

export default Multi_Step_form