import { useState } from 'react';
import {View, StyleSheet, Button} from 'react-native'
import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import {visitSchema} from '../../schemas/visitForm/schema'

import FormTextInput from '../../components/forms/FormTextInput'
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

export default function Endereco({formHandler, register, area, isEditing = false}) {
  console.log('Register in Endereco:', register);
  console.log('Area in Endereco:', area);
  
  // Get area_de_visita from area prop or from register
  const [areaVisita, setAreaVisita] = useState(area || register?.area_de_visita || null);
  console.log('AreaVisita in Endereco:', areaVisita);
  console.log('Logradouro property:', areaVisita?.logradouro, 'Logadouro property:', areaVisita?.logadouro);

  // Update areaVisita when area or register changes
  useEffect(() => {
    if (area) {
      setAreaVisita(area);
    } else if (register?.area_de_visita) {
      setAreaVisita(register.area_de_visita);
    }
  }, [area, register]);

  const [specifics, setSpecifics] = useState({
    numero: "",
    lado: "",
    localidade: "",
    tipo: "",
    status: "",
    complemento: "",
  });

  useEffect(() => {
    if(register){
      const {
        imovel_numero: numero,
        imovel_lado: lado,
        imovel_categoria_da_localidade: localidade,
        imovel_tipo: tipo,
        imovel_status: status,
        imovel_complemento: complemento,
      } = register;
      
      setSpecifics({
        numero: numero || "",
        lado: lado || "",
        localidade: localidade || "",
        tipo: tipo || "",
        status: status || "",
        complemento: complemento || "",
      });
    }
  }, [register])


  const disabled = !isEditing;


  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    reset
  } = useForm({
    resolver: zodResolver(visitSchemaAdress),
    defaultValues: {
      idArea: '',
      estado: '', 
      municipio: '',
      bairro: '',
      logradouro: '',
      
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
    // Prepare values object
    const values = {
      idArea: '',
      estado: '',
      municipio: '',
      bairro: '',
      logradouro: '',
      numeroImovel: '',
      lado: '',
      categoriaLocalidade: '',
      tipoImovel: 'Residência',
      status: 'Pendente',
      complemento: '',
    };
    
    // Set values from area_de_visita if it exists (from area prop or register)
    if (areaVisita) {
      values.idArea = areaVisita.setor || '';
      values.estado = areaVisita.estado || '';
      values.municipio = areaVisita.municipio || '';
      values.bairro = areaVisita.bairro || '';
      // Check for both logadouro (API) and logradouro (form field name)
      values.logradouro = areaVisita.logradouro || areaVisita.logadouro || '';
    }

    // Set values from register specifics if register exists
    if (register) {
      if (specifics.numero) values.numeroImovel = String(specifics.numero);
    
      // Map lado - register has "Ímpar" but schema expects "ìmpar" (different character)
      if (specifics.lado) {
        values.lado = specifics.lado.toLowerCase().includes('par') 
          ? (specifics.lado.toLowerCase().includes('ímpar') || specifics.lado.toLowerCase().includes('impar') ? 'ìmpar' : 'par')
          : specifics.lado;
      }
      
      // Map categoriaLocalidade from imovel_categoria_da_localidade
      if (specifics.localidade) values.categoriaLocalidade = specifics.localidade;
      
      // Map tipoImovel from imovel_tipo
      if (specifics.tipo) values.tipoImovel = specifics.tipo;
      
      // Map status - register has "bloqueado" but schema expects "Inspecionado" or "Pendente"
      if (specifics.status) {
        values.status = specifics.status.toLowerCase() === 'inspecionado' || specifics.status.toLowerCase() === 'bloqueado' 
          ? 'Inspecionado' 
          : 'Pendente';
      }
      if (specifics.complemento) values.complemento = specifics.complemento;
    }
    
    // Reset form with all values at once (only if we have area or register data)
    if (areaVisita || register) {
      reset(values);
    }
  }, [register, areaVisita, specifics, reset]);


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
        errors = {errors}
      />
     
     <View style={styles.flexRow}>

        <FormPickerInput
          label = "Estado"
          name = "estado"
          control={control}
          schema={visitSchemaAdress}
          disabled = {true}
          errors = {errors}
        />

        <FormPickerInput
          label = "Município"
          name = "municipio"
          control={control}
          schema={visitSchemaAdress}
          disabled = {true}
          errors = {errors}
        />
     </View>

     <FormPickerInput 
        label = "Bairro" 
        name = "bairro"
        control = {control} 
        schema = {visitSchemaAdress}
        disabled = {true}
        errors = {errors}
      />

     <FormTextInput 
        control = {control} 
        name = "logradouro"  
        label = "Logradouro" 
        placeholder= "Enter your name here"
        schema = {visitSchemaAdress}
        disabled = {true}
        errors = {errors}
      />

      <Divider/>
      
      <Subtitle>Preencha as informações específicas do imóvel: </Subtitle>
      

      <View style={[styles.flexRow]}>
        <FormTextInput 
          control = {control} 
          label = "Número do imóvel"
          name = "numeroImovel"
          schema={visitSchemaAdress}
          disabled = {disabled}
          errors = {errors}
        />

        <FormPickerInput 
          label = "Lado" 
          name = "lado"
          control = {control} 
          schema = {visitSchemaAdress}
          errors = {errors}
          disabled = {disabled}
        />
     </View>

     <View style = {styles.flexRow}>

        <FormPickerInput 
          label = "Categoria da localidade" 
          name = "categoriaLocalidade"
          control = {control} 
          schema = {visitSchemaAdress}
          errors = {errors}
          disabled = {disabled}
        />

        <FormPickerInput 
          label = "Tipo do imóvel" 
          name = "tipoImovel"
          control = {control} 
          schema = {visitSchemaAdress}
          errors = {errors}
          disabled = {false}
        />

     </View>

      <FormPickerInput 
          label = "Status" 
          name = "status"
          control = {control} 
          schema = {visitSchemaAdress}
          errors = {errors}
          disabled = {false}
      />

      <FormTextInput 
        control = {control} 
        label = "Complemento"
        name = "complemento"
        style={{height: '120px'}}
        schema={visitSchemaAdress}
        scrollEnabled={true}
        multiline={true}     
        height = {120}
        errors = {errors}
        disabled = {disabled}
      /> 
       
      <View style={styles.buttonsContainer}>
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
          alignItems: 'center',
          flex:1,
          gap: 2,
        },

        borderRed: {
          borderColor: 'red',
          borderWidth: 1,
          flex: 1,
        },

        buttonsContainer:{
          flexDirection: 'row',
          justifyContent: "space-between",
          alignItems: 'center',
          flex:1,
          gap: 2,
          paddingBlock: 16, 
        }

    }


);

