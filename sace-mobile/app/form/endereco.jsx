import React from 'react'

import {View, Text, StyleSheet, Button} from 'react-native'
import FormTextInput from '../../components/forms/FormTextInput'
import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import {visitSchema} from '../../schemas/visitForm/schema'

const visitSchemaAdress = visitSchema.pick({
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

   const form = useForm({
    resolver: zodResolver(visitSchema),
    defaultValues: {
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
    }

   });

    const onSubmit = (data) => {
      console.log(data);
    }


  return (
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
            margin: 1,
            backgroundColor: 'lightgray',
            padding: 4
        }
    }


);

