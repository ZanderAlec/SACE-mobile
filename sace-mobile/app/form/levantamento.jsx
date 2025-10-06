import React from 'react'

import {View, Text, StyleSheet} from 'react-native'

import FormTitle from '../../components/text/FormTitle'
import Title from '../../components/text/Title'

function Levantamento() {
  return (
   <View>
        <FormTitle>Registro do controle do Aedes Aegypti</FormTitle>

        <Title>Levantamento de informações</Title>

        
   </View>
  )
}

const styles = StyleSheet.create({
    formTitle: {
        color: "#3B67CE",
        fontSize: 28,
        textAlign: 'center',
        fontWeight: '500',
    }
});

export default Levantamento