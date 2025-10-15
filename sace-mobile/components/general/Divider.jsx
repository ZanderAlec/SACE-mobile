import React from 'react'

import {View, StyleSheet} from 'react-native'

function Divider() {
  return (
    <View style = {styles.divider}></View>
  )
}

const styles = StyleSheet.create({
    divider: {
        borderWidth: 1,
        borderColor: '#DEE6F7',
        marginBlock: 42,
    },
});

export default Divider