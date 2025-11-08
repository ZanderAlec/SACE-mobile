import React, { useState } from 'react'

import { TextInput,View, Text, StyleSheet } from "react-native";
import { Controller } from "react-hook-form";
import {z} from 'zod'

import Label from './label';
import Error from './error';
import { config } from 'zod/v4/core';

export default function FormTextInput({schema, label, subLabel, name, control, placeholder = "", style, disabled = false, errors, ...rest}) {

  const [focused, setFocused] = useState(false);
  const fieldSchema = schema.shape[name];
  const isRequired = !(fieldSchema instanceof z.ZodOptional);

  const getNestedError = (errors, path) => {
    if (!errors || !path) return null;
    return path.split('.').reduce((acc, key) => acc?.[key], errors);
  };

  const fieldError = getNestedError(errors, name);

  return (
    <View style= {styles.container}>
      <Label isRequired = {isRequired} subLabel = {subLabel}>{label}</Label>
      <Controller
        control={control}
        name={name}
        render={({field: {onChange, onBlur, value}}) => {
          return (
          <TextInput
            {...rest}
            style = {[styles.textInput, style, disabled ? styles.disabled : styles.active , focused && styles.focusedInput, fieldError && styles.errorBorder]}
            placeholderTextColor="#72777B"
            value={value}
            placeholder = {placeholder}
            onChangeText={onChange}
            onFocus={() => setFocused(true)}
            onBlur={() => {
              setFocused(false);
              onBlur();
            }}
            editable = {!disabled}
            secureTextEntry={rest.secureTextEntry}
          /> 
          )
        }}
      />
      <Error error={fieldError} />
    </View>
  )
}

const styles = StyleSheet.create(
    {
        textInput:{
          margin: 1,
          borderWidth: 1,
          borderRadius: 2,
          padding: 10,
          paddingBlock: 20,
          // marginBottom: 4,
         
        },

        focusedInput:{
          borderColor: '#3B67CE',
          borderWidth: 2,
        },

        container: {
          // marginBlock: 4,
          flex: 1,
        },

         active: {
          backgroundColor: '#DEE6F7',
          borderColor: "#D7DEF7",
        },

      disabled: {
          backgroundColor: "#E6E0E9",
          borderColor: "#E6E0E9",
          color: "#938F96",
      },

      errorBorder: {
        borderColor: '#ED1B24',
        borderWidth: 1,
      }

    }
);
