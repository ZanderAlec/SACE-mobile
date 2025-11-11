import React from 'react'
import { useEffect } from 'react';

import { visitSchema } from '@/schemas/visitForm/schema'
import { zodResolver } from "@hookform/resolvers/zod";
import {View, StyleSheet } from 'react-native'
import { useForm } from "react-hook-form";

import FormTextInput from '@/components/forms/FormTextInput';
import Title from '@/components/text/Title';
import UiButton from '@/components/general/UiButton';

const samplesSchema = visitSchema.pick({
    coletaAmostras: true,
});

function ColetaAmostras({formHandler, register, isEditing = false}) {

  const {
    numero_da_amostra,
    quantiade_tubitos,
  } = register || {};

  const disabled = !isEditing;

    const {
        control,
        handleSubmit,
        formState: { errors },
        setValue,
        reset,
        watch
    } = useForm({
        resolver: zodResolver(samplesSchema),
        defaultValues: {
            coletaAmostras: {
                numeroAmostras: '',
                quantTubitos: '',
            },
        },
    });

    const {nextStep, prevStep, formData, saveFormData} = formHandler;

    useEffect(() => {
      if (formData && formData['coletaAmostras']) {
        for(const field in formData['coletaAmostras']) {
          setValue(`coletaAmostras.${field}`, formData['coletaAmostras'][field]);
        }
      }
    }, [formData, setValue]);

    useEffect(() => {
      if (register) {
        const values = {
          coletaAmostras: {
            numeroAmostras: numero_da_amostra || '',
            quantTubitos: quantiade_tubitos ? String(quantiade_tubitos) : '',
          }
        };
        reset(values);
      }
    }, [register, numero_da_amostra, quantiade_tubitos, reset]);

    const onSubmit = (data) => {
        
        if (Object.keys(errors).length === 0) {
            saveFormData(data.coletaAmostras, 'coletaAmostras');
            nextStep();
        }
    };  


  return (
    <View style={{ flexDirection: 'column' }}>

        <Title>Coleta de amostras</Title>

        <FormTextInput 
            control = {control} 
            label = "Digite o número da amostra:"
            name = "coletaAmostras.numeroAmostras"
            schema={samplesSchema}
            subLabel={"Ex: AL-2025-032 \nAL  Sigla do estado;\n2025 → Ano da coleta;\n032 → Número sequencial da amostra dentro do ano."}
            errors = {errors}
            disabled={disabled}
        />

        <View>
            <FormTextInput 
                control = {control} 
                label = "Digite a quantidade de tubitos:"
                name = "coletaAmostras.quantTubitos"
                schema={samplesSchema}
                subLabel={"Quantidade de tubitos coletados com larvas/pupas."}
                errors = {errors}
                disabled={disabled}
            />
        </View>
        

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
      justifyContent: 'space-between',
      boxSizing: 'border-box',
      flexWrap: 'wrap',
      gap: 4,
      marginBlock: 8,
    },
});

export default ColetaAmostras