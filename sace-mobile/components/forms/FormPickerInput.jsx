import React from 'react'
import {View, StyleSheet} from 'react-native'
import {Picker} from '@react-native-picker/picker';
import { Controller } from "react-hook-form";

import z from 'zod';

import Label from './label'
import Error from './error'

export default function FormPickerInput({label, subLabel, control, name, schema, disabled = false, errors}) {

    const getNestedField = (schema, path) =>
        path.split('.').reduce((acc, key) => acc.shape[key], schema);

    const getNestedError = (errors, path) => {
        if (!errors || !path) return null;
        return path.split('.').reduce((acc, key) => acc?.[key], errors);
    };

    const fieldSchema = name.includes('.') ? getNestedField(schema, name) : schema.shape[name];
    const fieldError = getNestedError(errors, name);

    // Handle ZodOptional - extract the inner schema
    let enumSchema = fieldSchema;
    if (fieldSchema?._def?.typeName === 'ZodOptional' || fieldSchema instanceof z.ZodOptional) {
        enumSchema = fieldSchema._def?.innerType || fieldSchema._def?.schema || fieldSchema;
    }
    
    // Extract enum values from the schema
    const baseOptions = enumSchema?._def?.values || fieldSchema?._def?.values || [];
    const isRequired = !(fieldSchema instanceof z.ZodOptional) && fieldSchema?._def?.typeName !== 'ZodOptional';
    

    

  return (
    <View style = {styles.container}>
        <Label isRequired = {isRequired} subLabel={subLabel}>{label}</Label>
        <Controller
            control={control}
            name={name}
            defaultValue="" 
            render={({ field: { onChange, value } }) => {
                // Include current value in options if it's not already there (for loading existing data)
                const options = value && !baseOptions.includes(value) 
                    ? [...baseOptions, value]
                    : baseOptions;

                return (
                    <View style={[styles.pickerContainer, !disabled && fieldError && styles.errorBorder]}>
                        <Picker
                        selectedValue={value}
                        onValueChange={onChange}
                        style={[styles.picker, disabled ? styles.disabled : styles.active]}
                        enabled={!disabled}
                        >
                        <Picker.Item label="Selecione..." value="" />
                        {options && Array.isArray(options) && options.map((item, index) => (
                            <Picker.Item key={index} label={item} value={item} />
                        ))}
                        </Picker>
                    </View>
                );
            }}
            />
        <Error error={fieldError} />
    </View>
  )
}

const styles = StyleSheet.create({
    pickerContainer: {
         borderColor: "#D7DEF7",
    },

    picker: {
        margin: 1,
        padding: 4,
        // marginBottom: 4,
    },

    container: {
          marginBlock: 8,
          flex: 1,
        },

    active: {
        backgroundColor: '#DEE6F7',
    },

    disabled: {
        backgroundColor: "#E6E0E9",
        color: "#938F96",
        borderColor: "#938F96",
        borderWidth: 1,
    },

    errorBorder: {
        borderColor: '#ED1B24',
        borderWidth: 1,
    },


});