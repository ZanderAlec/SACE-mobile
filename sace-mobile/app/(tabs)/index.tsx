import React, { useState } from 'react'
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native'


import Ionicons from '@expo/vector-icons/Ionicons';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';

import Divider from '@/components/general/Divider'

import StepIndicator from '../form/stepIndicator'
import Endereco from '../form/endereco'
import SelecaoFormulario from '../form/selecaoFormulario'
import Levantamento from '../form/levantamento'
import ColetaAmostras from '../form/coletaAmostras'
import Tratamentos from '../form/tratamentos'
import Observacoes from '../form/Observacoes'
import Upload from '../form/Upload'



function Multi_Step_form() {

  const formPages = [
    <Endereco/>,
    <Levantamento/>,
    <ColetaAmostras/>,
    <Tratamentos/>,
    <Observacoes/>,
    <Upload />
  ]

  const [steps, setSteps] = useState(4);
  const [currStep, setCurrStep] = useState(0);


  const nextStep = () => {
    if (currStep + 1 < steps)
      setCurrStep(currStep+1);
  }

  const prevStep = () => {
    if (currStep - 1 >= 0)
      setCurrStep(currStep-1);
  }


  return (
    <ScrollView 
      contentContainerStyle={{ padding: 16, backgroundColor: 'white' }}
      keyboardShouldPersistTaps="handled"
    >
    <View >
      {/* <View style={styles.container}>
        <Text>
          Agentes {">"}  Novo registro de campo
        </Text>
      </View> */}
      
     
      <View style = {styles.indicatorContainer}>
        {/* <StepIndicator stepsNum={steps}  currStep={currStep}/> */}
      </View>

       <View style ={[styles.container, styles.bkgWhite]}>
        {formPages[0]}
      </View>

      <Divider/>

      <View style = {styles.flexRow}>
        <Pressable
          style = {[styles.bttm, styles.bttmActive]}
          onPress={prevStep}
        >
          <Text style ={styles.bttmText}>Prev</Text>
        </Pressable>


        <Pressable
          onPress={nextStep}
          style = {[styles.bttm, styles.bttmActive]}
        >
          <Text style ={styles.bttmText}>Next</Text>
        </Pressable>
     
      </View>
    </View>
    </ScrollView>
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
  
  flexRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    boxSizing: 'border-box',
    gap: 16,
  },

  bttm: {
    paddingBlock: 16,
    flexGrow: 1,
    alignItems: 'center',
    borderRadius: 6,
  },

  bttmActive: {
    backgroundColor: "#3B67CE",
  },

  bttmDisabled: {

  },

  bttmText: {
    color: 'white',
    fontSize: 16,
  }

  
});

export default Multi_Step_form