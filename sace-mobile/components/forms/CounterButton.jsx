import React from 'react'

import {View, StyleSheet, Text, Pressable} from 'react-native'
import { Controller } from 'react-hook-form';

function CounterButton({name, control}) {
  return (
    <Controller
      control = {control}
      name = {name}
      render =  {({field: {value, onChange}}) => {
        const decrement = () => {
          if (value > 0) 
              onChange(value - 1)
        }
        
        const increment = () => {
            onChange(value + 1);
        }

        const disabled = value == 0;

        return (
          <View style = {styles.flexRow}>
              <Pressable  disabled={disabled} onPress={decrement}>
                  <Text style = {[styles.bttm, disabled ? styles.disabledBttm : styles.blueBttm]}>-</Text>
              </Pressable>

              <Pressable>
                  <Text style = {[styles.bttm, styles.whiteBttm]}>{value}</Text>
              </Pressable>

              <Pressable onPress={increment}>
                  <Text style = {[styles.bttm, styles.blueBttm]} >+</Text>
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
    }
  }
);

export default CounterButton