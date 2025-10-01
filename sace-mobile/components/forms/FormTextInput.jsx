import React, { useState } from 'react'

import { TextInput,View, Text, StyleSheet } from "react-native";
import { Controller } from "react-hook-form";
import {z} from 'zod'

export default function FormTextInput({schema, label, name, control, placeholder = "",}) {

  const [focused, setFocused] = useState(false);
  const fieldSchema = schema.shape[name];
  const isRequired = !(fieldSchema instanceof z.ZodOptional);

  return (
    <View>
      <Text style= {styles.label}>
        {label}
        {isRequired && <Text style={styles.required}>*</Text>}
        
      </Text>
      <Controller
        control={control}
        name={name}
        placeholder = {placeholder}
        render={({field: {onChange, onBlur, value}}) => {
          return (
          <TextInput
            style = {[styles.textInput, , focused && styles.focusedInput]}
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
      label:{
        color: '#72777B',
        fontSize: '14',
        fontWeight: "700",
        marginBottom: 2,
      },

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

        required:{
          color: 'red',
          paddingLeft: 4,
        }

    }
);
