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

  const [currStep, setCurrStep] = useState(0);

  const nextStep = () => {
    if (currStep + 1 < formPages.length)
      setCurrStep(currStep+1);
  }

  const prevStep = () => {
    if (currStep - 1 >= 0)
      setCurrStep(currStep-1);
  }

  const onSubmit = (data) => {
    console.log(data);
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
        {formPages[currStep]}
      </View>

      <Divider/>

      <View style = {[styles.flexRow, currStep !== 0 && {justifyContent: 'space-between'}]}>
        
        {
          currStep !== 0 &&
          <Pressable
            style = {[styles.bttm, styles.bttmPrev]}
            onPress={prevStep}
          >
            <Text style ={styles.bttmText}>Voltar</Text>
          </Pressable>
        }


        {
          currStep === formPages.length - 1 ?

          <Pressable
            onPress={onSubmit}
            style = {[styles.bttm, styles.bttmNext]}
          >
            <Text style ={styles.bttmText}>Finalizar Registro</Text>
          </Pressable>

        :

          <Pressable
            onPress={nextStep}
            style = {[styles.bttm, styles.bttmNext]}
          >
            <Text style ={styles.bttmText}>Continuar</Text>
          </Pressable>
        }
     
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
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    boxSizing: 'border-box',
    gap: 16,
  },

  bttm: {
    paddingBlock: 16,
    flexGrow: 1,
    maxWidth: 140,
    alignItems: 'center',
    borderRadius: 6,
  },

  bttmNext: {
    backgroundColor: '#2AD947',
  },

  bttmPrev: {
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