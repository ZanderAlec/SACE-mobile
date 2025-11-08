import React from 'react'
import {View, Text, StyleSheet} from 'react-native'
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';

function StepIndicator({stepsNum, currStep, stepsTextList = []}) {

  const stepIndicatorRenderer = () => {
    const indicators = [];


    for (let i = 0; i <= stepsNum; i++ ){
      indicators.push(
        <View key={i} style={styles.indicatorContainer}>
            {
              i < currStep ?
                <FontAwesome5 name="check-circle" size={24} color="#3B67CE" /> 
                

                : i === currStep ?
                <View  style = {styles.iconContainer}>
                    <FontAwesome5 name="dot-circle"   style={styles.stepIcon} size={24} color="#3B67CE" />
                </View>

                : 

                <FontAwesome5 name="circle" size={24} color="#72777B" /> 
            }
            
            {
            i != stepsNum &&
             <View style={[styles.line, i < currStep ? styles.blue : styles.gray]}/>
            }

            
        </View>
      );
    }

    return <View style={styles.indicatorContainer}>{indicators}</View>
  }

  return (
    <View style={styles.container}>
      <Text style={styles.stepText}>{stepsTextList[currStep]}</Text>
      {stepIndicatorRenderer()}
    </View>
  )
}


const styles = StyleSheet.create({

  container:{
    marginBottom: 16,
    width: '100%',
    alignItems: 'center',
  },

    indicatorContainer:{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },

    activeStep:{
        color: 'blue',
    },

    line:{
    width: 20,
    height: 2,
    backgroundColor: 'black',
    margin: 3,
  },


  line: {
    width: 20,
    height: 2,
    margin: 3,
  },

  blue:{
    backgroundColor: '#3B67CE',
  },

  gray:{
    backgroundColor: '#72777B',
  },

  iconContainer:{
    width: 'auto'
  },

  stepIcon:{
    position: 'relative',
  },

  stepText:{
    color: "#333153",
    fontSize: 16,
    fontWeight: 500,
    marginBlock: 8,
  }
 
});

export default StepIndicator