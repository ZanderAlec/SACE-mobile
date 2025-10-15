import React from 'react'

import {Text, StyleSheet} from 'react-native'

function Subtitle({children}) {
  return (
    <Text style = {styles.subtitle}>{children}</Text>
  )
}

const styles = StyleSheet.create({
     subtitle: {
        fontSize: 16,
        color: '#333153',
        marginBlock: 8,
    },
});

export default Subtitle