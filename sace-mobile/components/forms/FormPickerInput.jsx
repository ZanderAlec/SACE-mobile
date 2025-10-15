import React from 'react'
import {Picker, View, StyleSheet} from 'react-native'
import { Controller } from "react-hook-form";

import z from 'zod';


import Label from './label'

export default function FormPickerInput({label, subLabel, control, name, schema, disabled = false}) {

    const getNestedField = (schema, path) => {
        return path.split('.').reduce((acc, key) => acc.shape[key], schema);
    };

    const fieldSchema = name.includes('.') ? getNestedField(schema, name) : schema.shape[name];

    const options = fieldSchema.options;
    const isRequired = !(fieldSchema instanceof z.ZodOptional);

  return (
    <View style = {styles.container}>
        <Label isRequired = {isRequired} subLabel={subLabel}>{label}</Label>
        <Controller 
            control={control}
            name = {name}
            render = {({field: {onChange, value}}) => (
                <Picker 
                    selectedValue={value}
                    style={[styles.picker, disabled ? styles.disabled : styles.active] }
                    onValueChange={(value) => onChange(value)}
                    enabled = {!disabled}
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
        borderWidth: 1,
        borderRadius: 2,
        padding: 10,
        marginBottom: 4,
    },


    container: {
          marginBlock: 8,
          flex: 1,
    },

    active: {
        backgroundColor: '#DEE6F7',
        borderColor: "#D7DEF7",
    },

    disabled: {
        backgroundColor: "#E6E0E9",
        borderColor: "#938F96",
        color: "#938F96",
    }
});