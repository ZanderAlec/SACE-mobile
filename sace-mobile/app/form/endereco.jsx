import React from 'react'

import {View, Text, StyleSheet, Button} from 'react-native'
import FormTextInput from '../../components/forms/FormTextInput'
import { useForm } from "react-hook-form";


export default function Endereco() {

    const { control, handleSubmit} = useForm(); 

    const next = () => {
      console.log('next');
    }


  return (
    <View>
         <View style={styles.container}>
          <Text>Endereço do imóvel</Text>
        </View>
        
        <Text>Name</Text>
        <FormTextInput control = {control} rules ={{required: "Email is required"}} name = {"Name"} style={styles.textInput}/>

        <Button
          title="Press me"
          onPress={next}
        />
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

