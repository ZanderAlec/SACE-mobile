import React, { useState } from 'react'

import {View, Text, StyleSheet, Button, ScrollView} from 'react-native'
import { Controller, useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import {visitSchema} from '../../schemas/visitForm/schema'

import FormTextInput from '../../components/forms/FormTextInput'
import Error from '../../components/forms/error'
import FormPickerInput from '../../components/forms/FormPickerInput'
import Title from '../../components/text/Title'
import Subtitle from '../../components/text/Subtitle'

const visitSchemaAdress = visitSchema.pick({
    name: true,
    idArea: true,
    estado: true, 
    municipio: true,
    bairro: true,
    logradouro: true,
    
    //específicos
    numeroImovel: true,
    lado: true,
    categoriaLocalidade: true,
    tipoImovel: true,
    status: true,
    complemento: true,
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
      estado: "", 
      municipio: "",
      bairro: "",
      logradouro: "",
      
      //específicos
      numeroImovel: "",
      lado: "",
      categoriaLocalidade: "",
      tipoImovel: "",
      status: "",
      complemento: "",
    },
  });

  const onSubmit = (data) => {
    console.log("dados:", data);
    console.log("errors: ", errors.name);
  };

  return (
  <View>
    <View>

      <Title>Endereço do imóvel</Title>

      <FormPickerInput 
        label = "Identificador de área" 
        name = "idArea"
        control = {control} 
        schema = {visitSchemaAdress}
        disabled = {true}
      />
     
     <View style={styles.flexRow}>

        <FormPickerInput
          label = "Estado"
          name = "estado"
          control={control}
          schema={visitSchemaAdress}
          disabled = {true}
        />

        <FormPickerInput
          label = "Município"
          name = "municipio"
          control={control}
          schema={visitSchemaAdress}
          disabled = {true}
        />
     </View>

     <FormPickerInput 
        label = "Bairro" 
        name = "bairro"
        control = {control} 
        schema = {visitSchemaAdress}
        disabled = {true}
      />

     <FormTextInput 
        control = {control} 
        name = "logradouro"  
        label = "Logradouro" 
        placeholder= "Enter your name here"
        schema = {visitSchemaAdress}
        disabled = {true}
      />

      <Subtitle>Preencha as informações específicas do imóvel: </Subtitle>

      <View style={styles.flexRow}>
        <View>
          <FormTextInput 
            control = {control} 
            label = "Número do imóvel"
            name = "numeroImovel"
            schema={visitSchemaAdress}
          />

          <Error error = {errors.name}/> 

        </View>

        <View>
          <FormPickerInput 
            label = "Lado" 
            name = "lado"
            control = {control} 
            schema = {visitSchemaAdress}
          />

          <Error error = {errors.name}/> 
        </View>
     </View>

     <View style = {styles.flexRow}>

        <View>
          <FormPickerInput 
            label = "Categoria da localidade" 
            name = "categoriaLocalidade"
            control = {control} 
            schema = {visitSchemaAdress}
          />

          <Error error = {errors.name}/> 
        </View>

        <View>
          <FormPickerInput 
            label = "Tipo do imóvel" 
            name = "tipoImovel"
            control = {control} 
            schema = {visitSchemaAdress}
          />

          <Error error = {errors.name}/> 
        </View>

     </View>

      <FormPickerInput 
          label = "Status" 
          name = "status"
          control = {control} 
          schema = {visitSchemaAdress}
      />

      <Error error = {errors.name}/> 

      <FormTextInput 
        control = {control} 
        label = "Complemento"
        name = "complemento"
        style={{height: '120px'}}
        schema={visitSchemaAdress}
        scrollEnabled={true}
        multiline={true}     
        height = {120}
      />

      <Error error = {errors.name}/> 
      

      
     
      <Button title="Submit" onPress={handleSubmit(onSubmit)} />
    </View>
    </View>
  )
}


const styles = StyleSheet.create(
    {
        flexRow: {
          flexDirection: 'row',
          justifyContent: "space-between",
          gap: 2,
        }

    }


);

