import FormTextInput from '@/components/forms/FormTextInput'
import React from 'react'
import { Button, Text, View } from 'react-native'
import { useForm} from "react-hook-form";


import { visitSchema } from '@/schemas/visitForm/schema'
import { zodResolver } from "@hookform/resolvers/zod";

import Title from '@/components/text/Title';

const obsSchema = visitSchema.pick({
  observacoes:true,
});

function Observacoes() {

    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(obsSchema),
        defaultValues: {
           observacoes: "",
        },
    });

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
        />
    </View>
  )
}

export default Observacoes