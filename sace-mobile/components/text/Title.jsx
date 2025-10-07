import React from 'react'

import {Text, StyleSheet} from 'react-native'

function Title({children}) {
  return (
    <Text style = {styles.title}>{children}</Text>
  )
}

const styles = StyleSheet.create({
    title: {
        color: "#333153",
        fontSize: 28,
        fontWeight: 600,
        marginBlock: 20,
    },
});

export default Title