import React from 'react'

import { TextInput } from "react-native";
import { Controller } from "react-hook-form";


export default function FormTextInput({name, control, rules, style}) {
  return (
    <Controller
      name={name}
      control = {control}
      rules ={rules}
      render={({ field: { onChange, value } }) => (
          <TextInput
            style={style}
            placeholder="Enter your name"
            value={value}
            onChangeText={onChange}
          />
      )}
    />
  )
}
