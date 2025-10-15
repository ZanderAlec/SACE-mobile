import React, { useEffect } from 'react'

import {Button, View} from 'react-native'
import { visitSchema } from '@/schemas/visitForm/schema'
import { zodResolver } from "@hookform/resolvers/zod";
import FormPickerInput from '@/components/forms/FormPickerInput';
import { useForm } from "react-hook-form";
import Title from '@/components/text/Title';
import FormTitle from '@/components/text/FormTitle';
import CounterButton from '@/components/forms/CounterButton'
import Label from '@/components/forms/label'

function tratamentosForm({schema, control, baseName}) {

  return (
    <View>

        <FormPickerInput
            control={control}
            label= {`Selecione o tipo do ${baseName}:`}
            name={`${baseName}.tipo`}  
            schema={schema}
        />

        <FormPickerInput
            control={control}
            label= {`Selecione a forma do ${baseName}:`}
            subLabel="(pastilhas, pó, granulado, líquido)"
            name= {`${baseName}.forma`}  
            schema={schema}
        />

        <View style = {{marginBlock: 16}}>
            <Label>Selecione a quantidade utilizada:</Label>
        
            <View style = {{alignItems: 'center'}}>
                <CounterButton 
                    name = {`${baseName}.quantidade`}  
                    control = {control}
                />
            </View>
            
        </View>
        
    </View>
  )
}

export default tratamentosForm