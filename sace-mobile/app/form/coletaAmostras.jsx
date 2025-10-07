import React from 'react'

import { visitSchema } from '@/schemas/visitForm/schema'
import { zodResolver } from "@hookform/resolvers/zod";
import {View } from 'react-native'
import { useForm } from "react-hook-form";

import FormTextInput from '@/components/forms/FormTextInput';
import Title from '@/components/text/Title';

const samplesSchema = visitSchema.pick({
    numeroAmostra: true,
    quantTubitos: true,
});

function ColetaAmostras() {

    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(samplesSchema),
        defaultValues: {
            numeroAmostra: '',
            quantTubitos: '',
        },
    });

  return (
    <View style={{ flexDirection: 'column' }}>

        <Title>Coleta de amostras</Title>

        <FormTextInput 
            control = {control} 
            label = "Digite o número da amostra:"
            name = "numeroAmostra"
            schema={samplesSchema}
            subLabel={"Ex: AL-2025-032 \nAM  Sigla do estado;\n2025 → Ano da coleta;\n032 → Número sequencial da amostra dentro do ano."}
        />

        <FormTextInput 
            control = {control} 
            label = "Digite a quantidade de tubitos:"
            name = "quantTubitos"
            schema={samplesSchema}
            subLabel={"Quantidade de tubitos coletados com larvas/pupas."}
        />
    </View>
  )
}

export default ColetaAmostras