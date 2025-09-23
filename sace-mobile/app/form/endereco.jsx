import React from 'react'

import {View, Text, StyleSheet} from 'react-native'
import FormTextInput from '../../components/forms/FormTextInput'
import { useForm } from "react-hook-form";


export default function Endereco() {

    const { control, handleSubmit } = useForm(); // <-- here


  return (
    <View>
         <View style={styles.container}>
          <Text>Endereço do imóvel</Text>
        </View>
        
        <Text>Name</Text>
        <FormTextInput control = {control} rules ={{required: "Email is required"}} name = {"Name"} style={styles.textInput}/>
    </View>
  )
}


const styles = StyleSheet.create(
    {
        textInput:{
            margin: 1,
            backgroundColor: 'lightgray',
            padding: 4
        }
    }


);

