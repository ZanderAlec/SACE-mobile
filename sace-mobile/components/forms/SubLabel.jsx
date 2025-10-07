import React from 'react'

import {Text, StyleSheet} from 'react-native'

function SubLabel({children}) {
  return (
    <Text style = {styles.sublabel}>{children}</Text>
  )
}

const styles = StyleSheet.create(
    {
        sublabel: {
            fontSize: 14,
            color: '#72777B',
            marginBottom: 8,
        }
    }
);

export default SubLabel