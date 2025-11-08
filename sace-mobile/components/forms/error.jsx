import React from 'react'
import {Text, StyleSheet} from 'react-native'

function Error({error, style}) {
  if (!error) return null;
  
  console.log(error);
    return (
        <Text style={[styles.error, style]}>{error.message}</Text>
    )
}

const styles = StyleSheet.create({
    error: {
        color: '#ED1B24',
        marginBottom: 8,
    }
});

export default Error