import React from 'react'

import { View, Pressable, Text, StyleSheet } from 'react-native'

function UiButton({onPress, text, type = 'secondary', align = 'center', disabled = false}) {
  return (
    <View style={[styles.container, styles[align]]}>
        <Pressable
            onPress={onPress}
            disabled={disabled}
            style = {[styles.bttm, styles[type], disabled && styles.disabledButton]}
        >
            <Text style ={[styles.bttmText, disabled && styles.disabledText]}>{text}</Text>
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
    },
  
    disabledButton: {
      backgroundColor: '#938F96',
      opacity: 0.6,
    },
  
    disabledText: {
      opacity: 0.8,
    }
    
  });

export default UiButton