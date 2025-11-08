import React from 'react'

import {View, StyleSheet, Text, Pressable} from 'react-native'
import { Controller } from 'react-hook-form';

function CounterButton({name, control, disabled = false}) {
  return (
    <Controller
      control = {control}
      name = {name}
      render =  {({field: {value, onChange}}) => {
        const decrement = () => {
          if (value > 0 && !disabled) 
              onChange(value - 1)
        }
        
        const increment = () => {
            if (!disabled) {
              onChange(value + 1);
            }
        }

        const isMinValue = value == 0;

        return (
          <View style = {styles.flexRow}>
              <Pressable disabled={disabled || isMinValue} onPress={decrement}>
                  <Text style = {[styles.bttm, (disabled || isMinValue) ? styles.disabledBttm : styles.blueBttm]}>-</Text>
              </Pressable>

              <Pressable disabled={disabled}>
                  <Text style = {[styles.bttm, styles.whiteBttm, disabled && styles.disabledText]}>{value}</Text>
              </Pressable>

              <Pressable disabled={disabled} onPress={increment}>
                  <Text style = {[styles.bttm, disabled ? styles.disabledBttm : styles.blueBttm]} >+</Text>
              </Pressable>
          </View>
        )
      }}
    />

  );
}

const styles = StyleSheet.create(
  {
    flexRow: {
        flexDirection: 'row',
        // justifyContent: "space-between",
        gap: 4 ,
        alignItems: 'center'
    },

    bttm: {
        paddingBlock: 6,
        paddingInline: 14,
        borderRadius: 8,
        fontSize: 20,
    },

    blueBttm:{
        color: 'white',
        backgroundColor: '#3B67CE',
    },

    whiteBttm: {
        color: '333153',
        backgroundColor: 'white',
        borderWidth: 2,
        borderColor: '#DEE6F7'
    },

    disabledBttm: {
        color: '#938F96',
        backgroundColor: '#E6E0E9',
    },

    disabledText: {
        opacity: 0.6,
    }
  }
);

export default CounterButton