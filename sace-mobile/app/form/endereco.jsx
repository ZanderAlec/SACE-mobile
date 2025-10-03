import React, { useState } from 'react'

import {View, Text, StyleSheet, Button, TextInput} from 'react-native'
import { Controller, useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import {visitSchema} from '../../schemas/visitForm/schema'

import FormTextInput from '../../components/forms/FormTextInput'
import Error from '../../components/forms/error'
import FormPickerInput from '../../components/forms/FormPickerInput'


const visitSchemaAdress = visitSchema.pick({
    name: true,
    idArea: true,
    // estado: true, 
    // municipio: true,
    // bairro: true,
    // logradouro: true,
    
    // //específicos
    // numeroImovel: true,
    // lado: true,
    // categoriaLocalidade: true,
    // tipoImovel: true,
    // status: true,
    // complemento: true,
});

export default function Endereco() {

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(visitSchemaAdress),
    defaultValues: {
      name: "",
      idArea: "",
      // estado: "", 
      // municipio: "",
      // bairro: "",
      // logradouro: "",
      
      // //específicos
      // numeroImovel: "",
      // lado: "",
      // categoriaLocalidade: "",
      // tipoImovel: "",
      // status: "",
      // complemento: "",
    },
  });

  const onSubmit = (data) => {
    console.log("dados:", data);
    console.log("errors: ", errors.name);
  };

  return (
    <View>
      <FormTextInput 
        control = {control} 
        name = "name"  
        label = "name" 
        placeholder= "Enter your name here"
        schema = {visitSchemaAdress}
      />
      <Error error = {errors.name}/>

      <FormPickerInput 
        label = "Identificador de área" 
        name = "idArea"
        control = {control} 
        schema = {visitSchemaAdress}
      />
     

      

      <Button title="Submit" onPress={handleSubmit(onSubmit)} />
    </View>

    // <View>
    //      <View style={styles.container}>
    //       <Text>Endereço do imóvel</Text>
    //     </View>
        
    //     <Text>Name</Text>
    //     <FormTextInput control = {control} rules ={{required: "Email is required"}} name = {"Name"} style={styles.textInput}/>
    // </View>
  )
}


const styles = StyleSheet.create(
    {
        textInput:{
            height: '50rem',
        },

    }


);

