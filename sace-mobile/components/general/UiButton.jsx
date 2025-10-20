import React from 'react'

import { View, Pressable, Text, StyleSheet } from 'react-native'

function UiButton({onPress, text, type = 'secondary', align = 'center'}) {
  return (
    <View style={[styles.container, styles[align]]}>
        <Pressable
            onPress={onPress}
            style = {[styles.bttm, styles[type]]}
        >
            <Text style ={styles.bttmText}>{text}</Text>
        </Pressable>
    </View>
  )
}

const styles = StyleSheet.create({
    
    container: {

    },

    center: {
        alignItems: 'center',
    },

    left: {
        alignItems: 'flex-start',
    },

    right: {
        alignItems: 'flex-end',
    },

    bttm: {
      paddingBlock: 16,
      paddingHorizontal: 24,
      flexGrow: 1,
      alignItems: 'center',
      borderRadius: 6,
    },
  
    primary: {
      backgroundColor: '#2AD947',
    },

    secondary: {
      backgroundColor: "#3B67CE",
    },
  
  
    disabled: {
      
    },
  
    bttmText: {
      color: 'white',
      fontSize: 16,
    }
  
    
  });

export default UiButton