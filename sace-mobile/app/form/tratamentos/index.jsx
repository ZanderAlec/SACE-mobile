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


function Tratamentos({formHandler}) {
  const {nextStep, prevStep, formData, saveFormData} = formHandler;


    const [larvFormVisible, setLarvFormVisible] = useState(false);
    const [adultFormVisible, setAdultFormVisible] = useState(false);

    const {
        control,
        handleSubmit,
        formState: { errors },
        setValue
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
       console.log(errors)
    }, [errors]);

    useEffect(() => {
      if (formData && formData['tratamentos']) {
        for(const field in formData['tratamentos']) {
          setValue(field, formData['tratamentos'][field]);
        }
      }
    }, [formData, setValue]);

    const onSubmit = (data) => {
        console.log("dados:", data);
        console.log("errors: ", errors);
        
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
            <Button 
                title={larvFormVisible ? '- Remover' : '+ Adicionar' }
                onPress={() => {setLarvFormVisible(prev => !prev)} }/>
        </View>

        {
            larvFormVisible && 

            <TratamentosForm 
                control = {control}
                schema = {treatmentsSchema}
                baseName={`larvicida`}
            />
        }
        

        <View style = {styles.flexRow}>
            <FormTitle>Adulticida</FormTitle>
            <Button 
                title={adultFormVisible ? '- Remover' : '+ Adicionar' }
                onPress={() => {setAdultFormVisible(prev => !prev)} }/>
        </View>

        {
            adultFormVisible &&

            <TratamentosForm 
            control = {control}
            schema = {treatmentsSchema}
            baseName={`adulticida`}
            />
        }
      

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