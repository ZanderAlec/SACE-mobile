import React from 'react'

import {Text, StyleSheet} from 'react-native'

function FormTitle({children}) {
  return (
    <Text style = {styles.formTitle}>{children}</Text>
  )
}

const styles = StyleSheet.create({
    formTitle: {
        color: "#3B67CE",
        fontSize: 28,
        textAlign: 'center',
        fontWeight: '500',
    }
});

export default FormTitle