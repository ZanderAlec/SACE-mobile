import React from 'react'
import {Text, StyleSheet} from 'react-native'

function Error({error}) {
  if (!error) return null;
  
    return (
        <Text style={styles.error}>{error.message}</Text>
    )
}

const styles = StyleSheet.create({
    error: {
        color: 'red',
        marginBottom: 4,
    }
});

export default Error