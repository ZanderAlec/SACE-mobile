import React from 'react'

import {View, Text, StyleSheet, Image} from 'react-native'
import { icons } from '../../constants/images'

import CounterButton from './CounterButton';

function Deposit({title, subtitle, iconType, control, name}) {    
  return (
    <View style={styles.container}>
        <Text style = {styles.title}>{title}</Text>

        <Image source = {icons[iconType]}/>
        <Text style = {styles.subtitle}>{subtitle}</Text>

        <CounterButton 
            name = {name}
            control = {control}
        />
    </View>
    
  )
}

const styles = StyleSheet.create({

    container: {
        alignItems: 'center',
        gap: 4,
        borderWidth: 2,
        borderColor: '#DEE6F7',
        borderRadius: 16,
        padding: 8,
        maxWidth: 132,
        justifyContent: 'space-between'
        
    },

    title: {
        color: '#333153',
        fontSize: 28,
        textAlign: 'center',
    },

    subtitle: {
        color: "#333153",
        fontSize: 12,
        lineHeight: 16,
        textAlign: 'center',
    },

    flexRow: {
        flexDirection: 'row',
        justifyContent: "space-between",
        gap: 4 ,
        alignItems: 'center'
    },

    bttm: {
        paddingBlock: 6,
        paddingInline: 14,
        borderRadius: 8,
        fontSize: 120,
    },

    blueBttm:{
        color: 'white',
        backgroundColor: '#3B67CE',
    },

    whiteBttm: {
        color: '333153',
        backgroundColor: 'white',
        borderWidth: 2,
        borderColor: '#DEE6F7'
    },

    disabledBttm: {
        color: '#938F96',
        backgroundColor: '#E6E0E9',
    }
}
    
);

export default Deposit