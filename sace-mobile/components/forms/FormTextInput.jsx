import React, { useState } from 'react'

import { TextInput,View, Text, StyleSheet } from "react-native";
import { Controller } from "react-hook-form";
import {z} from 'zod'

import Label from './label';

export default function FormTextInput({schema, label, name, control, placeholder = "", style, disabled = false}) {

  const [focused, setFocused] = useState(false);
  const fieldSchema = schema.shape[name];
  const isRequired = !(fieldSchema instanceof z.ZodOptional);

  return (
    <View style= {styles.container}>
      <Label isRequired = {isRequired} >{label}</Label>
      <Controller
        control={control}
        name={name}
        placeholder = {placeholder}
        render={({field: {onChange, onBlur, value}}) => {
          return (
          <TextInput
            style = {[styles.textInput, , focused && styles.focusedInput, style]}
            value={value}
            onChangeText={onChange}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
          /> 
          )
        }}
      />
    </View>
  )
}

const styles = StyleSheet.create(
    {
        textInput:{
            margin: 1,
            backgroundColor: '#DEE6F7',
            borderWidth: 1,
            borderColor: "#D7DEF7",
            borderRadius: 2,
            padding: 10,
            marginBottom: 4,
        },

        focusedInput:{
          outline: 2,
          outlineColor: '#3B67CE'
        },

        container: {
          marginBlock: 8,
        },

    }
);
