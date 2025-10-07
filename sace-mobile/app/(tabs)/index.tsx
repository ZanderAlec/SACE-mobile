import React, { useState } from 'react'
import { View, Text, StyleSheet, Button, ScrollView } from 'react-native'


import Ionicons from '@expo/vector-icons/Ionicons';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';


import StepIndicator from '../form/stepIndicator'
import Endereco from '../form/endereco'
import SelecaoFormulario from '../form/selecaoFormulario'
import Levantamento from '../form/levantamento'
import ColetaAmostras from '../form/coletaAmostras'


function Multi_Step_form() {

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
      contentContainerStyle={{ padding: 16 }}
      keyboardShouldPersistTaps="handled"
    >
    <View style={styles.bkgGray}>
      {/* <View style={styles.container}>
        <Text>
          Agentes {">"}  Novo registro de campo
        </Text>
      </View> */}
      
     
      <View style = {styles.indicatorContainer}>
        <StepIndicator stepsNum={steps}  currStep={currStep}/>
      </View>

       <View style ={[styles.container, styles.bkgWhite]}>
        {
          // currStep === 0 ? 
          // <Endereco/>

          // : currStep === 1 &&
          // <Levantamento/>
          <ColetaAmostras/>
        }
        
      </View>

      <View>
        <Button
          title="Prev"
          onPress={prevStep}
        />


        <Button
          title="next"
          onPress={nextStep}
        />
     
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
 

  
});

export default Multi_Step_form