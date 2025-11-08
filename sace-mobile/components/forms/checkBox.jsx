import React, { useState } from 'react'

import {View, Text, StyleSheet} from 'react-native'
import Checkbox from "expo-checkbox";
import { Controller } from 'react-hook-form';

 
function CheckBox({control, name, label, disabled = false}) {


  return (
    <View >
      <Controller
        control = {control}
        name = {name}
        render = {({field: {value, onChange}}) => {
          const isChecked = value;
          
          return (
            <View style = {styles.container}> 
              <Checkbox
                value = {value} 
                onValueChange={onChange}
                color={isChecked ? "#007bff" : undefined}
                disabled={disabled}
              />

              <Text style = {[styles.text, isChecked && styles.checkedText, disabled && styles.disabledText] }>{label}</Text>
            </View>
          )
        }}

      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },

  text: {
    color: "#333153",
    fontSize: 16,
    lineHeight: 24,
  },  

  checkedText: {
    fontWeight: 700,
  },

  disabledText: {
    opacity: 0.6,
  },  
});

export default CheckBox;