import React, { useEffect, useState } from 'react'

import { visitSchema } from '@/schemas/visitForm/schema'
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray } from "react-hook-form";


import TratamentosForm from './tratamentosForm'
import { View, Button, StyleSheet } from 'react-native';

import Title from '@/components/text/Title'
import FormTitle from '@/components/text/FormTitle';
import UiButton from '@/components/general/UiButton';

const treatmentsSchema = visitSchema.pick({
        larvicida: true,
        adulticida: true,
    });


function Tratamentos({formHandler, register, isEditing = false}) {

  const {
    larvicidas,
    adulticidas,
  } = register || {};

  const disabled = !isEditing;

  const {nextStep, prevStep, formData, saveFormData} = formHandler;


    const [larvFormVisible, setLarvFormVisible] = useState(false);
    const [adultFormVisible, setAdultFormVisible] = useState(false);

    const {
        control,
        handleSubmit,
        formState: { errors },
        setValue,
        reset
    } = useForm({
        resolver: zodResolver(treatmentsSchema),
        defaultValues: {
            larvicida: {
                tipo: "", 
                forma: "", 
                quantidade: 0
            },

            adulticida: {
                tipo: "", 
                forma: "", 
                quantidade: 0
            }
        },
    });



    useEffect(() => {
      if (formData && formData['tratamentos']) {
        for(const field in formData['tratamentos']) {
          setValue(field, formData['tratamentos'][field]);
        }
      }
    }, [formData, setValue]);

    useEffect(() => {
      if (register) {
        const values = {
          larvicida: {
            tipo: '',
            forma: '',
            quantidade: 0
          },
          adulticida: {
            tipo: '',
            forma: '',
            quantidade: 0
          }
        };
        
        // Set larvicida from first item in larvicidas array
        if (larvicidas && larvicidas.length > 0) {
          const larvicida = larvicidas[0];
          setLarvFormVisible(true);
          if (larvicida.tipo) values.larvicida.tipo = larvicida.tipo;
          if (larvicida.forma) values.larvicida.forma = larvicida.forma;
          if (typeof larvicida.quantidade === 'number') values.larvicida.quantidade = larvicida.quantidade;
        }

        // Set adulticida from first item in adulticidas array
        if (adulticidas && adulticidas.length > 0) {
          const adulticida = adulticidas[0];
          setAdultFormVisible(true);
          if (adulticida.tipo) values.adulticida.tipo = adulticida.tipo;
          if (adulticida.forma) values.adulticida.forma = adulticida.forma;
          if (typeof adulticida.quantidade === 'number') values.adulticida.quantidade = adulticida.quantidade;
        }
        
        reset(values);
      }
    }, [register, larvicidas, adulticidas, reset]);

    const onSubmit = (data) => {
    
        if (Object.keys(errors).length === 0) {
            // Save the validated data
            saveFormData(data, 'tratamentos');
            nextStep();
        }
    };
 
    
  return (
    <View>
        <Title>Tratamentos aplicados</Title>
        <View style = {styles.flexRow}>
            <FormTitle>Larvicida</FormTitle>
        </View>

        <TratamentosForm 
            control = {control}
            schema = {treatmentsSchema}
            baseName={`larvicida`}
            errors = {errors}
            disabled={disabled}
        />
        
        <View style = {styles.flexRow}>
            <FormTitle>Adulticida</FormTitle>
        </View>

        <TratamentosForm 
        control = {control}
        schema = {treatmentsSchema}
        baseName={`adulticida`}
        errors = {errors}
        disabled={disabled}
        />
  

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
  )
}

const styles = StyleSheet.create({
    flexRow: {
        flexDirection: 'row',
        justifyContent: "space-between",
        gap: 2,
        marginBlock: 8,
    }
});

export default Tratamentos