import React from 'react'
import {Picker, View, StyleSheet} from 'react-native'
import { Controller } from "react-hook-form";

import z from 'zod';


import Label from './label'

export default function FormPickerInput({label, control, name, schema}) {
    const fieldSchema = schema.shape[name];
    const options = fieldSchema.options;
    const isRequired = !(fieldSchema instanceof z.ZodOptional);

  return (
    <View>
        <Label isRequired = {isRequired}>{label}</Label>
        <Controller 
            control={control}
            name = {name}
            render = {({field: {onChange, value}}) => (
                <Picker 
                    selectedValue={value}
                    style={styles.picker}
                    onValueChange={(value) => onChange(value)}
                    mode = "dialog"
                >
                    <Picker.Item label="Selecione..." value="" />
                    {options.map((item, index) => (
                        <Picker.Item key={index} label={item} value={item} />
                    ))}
                    
                </Picker>
            )}
        />
    </View>
  )
}

const styles = StyleSheet.create({
    picker: {
        margin: 1,
        backgroundColor: '#DEE6F7',
        borderWidth: 1,
        borderColor: "#D7DEF7",
        borderRadius: 2,
        padding: 10,
        marginBottom: 4,
    }
});