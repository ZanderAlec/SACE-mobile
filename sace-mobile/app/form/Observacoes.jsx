import FormTextInput from '@/components/forms/FormTextInput'
import React, { useEffect } from 'react'
import { Button, Text, View, StyleSheet } from 'react-native'
import { useForm} from "react-hook-form";


import { visitSchema } from '@/schemas/visitForm/schema'
import { zodResolver } from "@hookform/resolvers/zod";

import Title from '@/components/text/Title';
import UiButton from '@/components/general/UiButton';

const obsSchema = visitSchema.pick({
  observacoes:true,
});

function Observacoes({formHandler, register, isEditing = false}) {
  console.log('Register in Observacoes:', register);

  const {
    observacao,
  } = register || {};

  const disabled = !isEditing;

  const {nextStep, prevStep, formData, saveFormData} = formHandler;

    const {
        control,
        handleSubmit,
        formState: { errors },
        setValue,
        reset
    } = useForm({
        resolver: zodResolver(obsSchema),
        defaultValues: {
           observacoes: "",
        },
    });

    useEffect(() => {
      if (formData && formData['observacoes']) {
        for(const field in formData['observacoes']) {
          setValue(field, formData['observacoes'][field]);
        }
      }
    }, [formData, setValue]);

    useEffect(() => {
      if (register && observacao) {
        reset({ observacoes: observacao });
      }
    }, [register, observacao, reset]);

    const onSubmit = (data) => {
        console.log("dados:", data);
        console.log("errors: ", errors);
        
        if (Object.keys(errors).length === 0) {
            // Save the validated data
            saveFormData(data, 'observacoes');
            nextStep();
        }
    };

  return (
    <View>
        <Title>Observações</Title>

        <FormTextInput 
            control={control}
            name='observacoes'
            placeholder='Campo livre para anotações do agente (recusa do morador, foco de difícil acesso, risco específico etc)...'
            schema = {obsSchema}
            multiline={true}
            maxLength={100}
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
    justifyContent: 'space-between',
    boxSizing: 'border-box',
    flexWrap: 'wrap',
    gap: 4,
    marginBlock: 8,
  }
});

export default Observacoes