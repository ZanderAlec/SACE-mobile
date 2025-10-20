
import {View, StyleSheet, Button} from 'react-native'
import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import {visitSchema} from '../../schemas/visitForm/schema'

import FormTextInput from '../../components/forms/FormTextInput'
import Error from '../../components/forms/error'
import FormPickerInput from '../../components/forms/FormPickerInput'
import Title from '../../components/text/Title'
import Subtitle from '../../components/text/Subtitle'

import Divider from '@/components/general/Divider'
import UiButton from '@/components/general/UiButton'

import { useEffect } from 'react';


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

export default function Endereco({formHandler}) {

  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
    setValue
  } = useForm({
    resolver: zodResolver(visitSchemaAdress),
    defaultValues: {
      name: "João Silva",
      idArea: 'Microregião A',
      estado: 'AL', 
      municipio: 'Maceió',
      bairro: 'Ponta verde',
      logradouro: 'Rua das Flores',
      
      //específicos
      numeroImovel: "",
      lado: "",
      categoriaLocalidade: "",
      tipoImovel: "",
      status: "",
      complemento: "",
    },
  });

  const {nextStep, prevStep, formData, saveFormData} = formHandler;
  
  useEffect(() => {
    if (formData && formData['endereco']) {
      for(const field in formData['endereco']) {
        setValue(field, formData['endereco'][field]);
      }
    }
  }, [formData, setValue]);



  useEffect(() => {
    setValue("idArea", 'Microregião A');
    setValue("estado", 'AL');
    setValue("municipio", 'Maceió');
    setValue("bairro", 'Ponta verde');
    setValue("logradouro", 'Rua das Flores');
  }, [setValue]);

  const onSubmit = (data) => {
    if (Object.keys(errors).length === 0) {
      saveFormData(data, 'endereco');
      nextStep();
    }
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

      <Divider/>
      
      <Subtitle>Preencha as informações específicas do imóvel: </Subtitle>
      

      <View style={styles.flexRow}>
        <View>
          <FormTextInput 
            control = {control} 
            label = "Número do imóvel"
            name = "numeroImovel"
            schema={visitSchemaAdress}
          />

          <Error error = {errors.numeroImovel}/> 

        </View>

        <View>
          <FormPickerInput 
            label = "Lado" 
            name = "lado"
            control = {control} 
            schema = {visitSchemaAdress}
          />

          <Error error = {errors.lado}/> 
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

          <Error error = {errors.categoriaLocalidade}/> 
        </View>

        <View>
          <FormPickerInput 
            label = "Tipo do imóvel" 
            name = "tipoImovel"
            control = {control} 
            schema = {visitSchemaAdress}
          />

          <Error error = {errors.tipoImovel}/> 
        </View>

     </View>

      <FormPickerInput 
          label = "Status" 
          name = "status"
          control = {control} 
          schema = {visitSchemaAdress}
      />

      <Error error = {errors.status}/> 

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

      <Error error = {errors.complemento}/> 
       
      <View style={styles.flexRow}>
        <UiButton
          text="Voltar" 
          onPress={handleSubmit(prevStep)} 
          type="secondary" 
          align="left"
        />

        <UiButton
          text="Prosseguir" 
          onPress={handleSubmit(onSubmit)} 
          type="primary" 
          align="right"
        />
      </View>

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

