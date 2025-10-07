import React from 'react'

import {Pressable, Text, Linking, StyleSheet} from 'react-native'

function Link({url, children}) {
    
    const handlePress = () => {
        Linking.openURL(url);
    }
    
    return (
    <Pressable onPress={handlePress}>
        <Text style = {styles.link}>{children}</Text>
    </Pressable>
  )
}


const styles = StyleSheet.create({
    link: {
        color: '#3B67CE', 
        fontSize: 14,
        textDecorationLine: 'underline',
    },
});

export default Link