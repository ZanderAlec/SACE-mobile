import React, { useEffect } from 'react'

import {Button, View} from 'react-native'
import { visitSchema } from '@/schemas/visitForm/schema'
import { zodResolver } from "@hookform/resolvers/zod";
import FormTextInput from '@/components/forms/FormTextInput';
import { useForm } from "react-hook-form";
import Title from '@/components/text/Title';
import FormTitle from '@/components/text/FormTitle';
import CounterButton from '@/components/forms/CounterButton'
import Label from '@/components/forms/label'

function tratamentosForm({schema, control, baseName, errors, disabled = false}) {

  return (
    <View>

        <FormTextInput
            control={control}
            label= {`Tipo do ${baseName}:`}
            name={`${baseName}.tipo`}  
            schema={schema}
            errors={errors}
            disabled={disabled}
            placeholder={`Digite o tipo do ${baseName}`}
        />

        <FormTextInput
            control={control}
            label= {`Forma do ${baseName}:`}
            subLabel="(pastilhas, pó, granulado, líquido)"
            name= {`${baseName}.forma`}  
            schema={schema}
            errors={errors}
            disabled={disabled}
            placeholder={`Digite a forma do ${baseName}`}
        />

        <View style = {{marginBlock: 16}}>
            <Label>Selecione a quantidade utilizada:</Label>
        
            <View style = {{alignItems: 'center'}}>
                <CounterButton 
                    name = {`${baseName}.quantidade`}  
                    control = {control}
                    disabled={disabled}
                />
            </View>
            
        </View>
        
    </View>
  )
}

export default tratamentosForm