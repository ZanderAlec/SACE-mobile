import React from 'react'
import { StyleSheet, Text,View } from 'react-native'
import SubLabel from './SubLabel'


export default function Label({isRequired = false, subLabel, children}) {
  return (
    <View>
      <Text style= {styles.label}>
        {children}
        {isRequired && <Text style={styles.required}>*</Text>}
      </Text>

      <SubLabel>
        {subLabel}
      </SubLabel>
    </View>
    
  )
}

const styles = StyleSheet.create({
    label:{
    color: '#333153',
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 2,
    },

    required:{
        color: 'red',
        paddingLeft: 4,
    }
});

