import React from 'react'
import { StyleSheet, Text } from 'react-native'


export default function Label({isRequired = false, children}) {
  return (
    <Text style= {styles.label}>
        {children}
        {isRequired && <Text style={styles.required}>*</Text>}
    </Text>
  )
}

const styles = StyleSheet.create({
    label:{
    color: '#72777B',
    fontSize: '14',
    fontWeight: "700",
    marginBottom: 2,
    },

    required:{
        color: 'red',
        paddingLeft: 4,
    }
});

