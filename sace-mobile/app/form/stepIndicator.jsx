import React from 'react'
import {View, Text, StyleSheet} from 'react-native'
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';

function StepIndicator({stepsNum, currStep, CurrStepText = ""}) {

  const stepIndicatorRenderer = () => {
    const indicators = [];


    for (let i = 0; i <= stepsNum; i++ ){
      indicators.push(
        <View style={styles.indicatorContainer}>
            {
              i < currStep ?
                <FontAwesome5 name="check-circle" size={24} color="blue" /> 
                

                : i === currStep ?
                <View  style = {styles.iconContainer}>
                    <FontAwesome5 name="dot-circle"   style={styles.stepIcon} size={24}color="blue" />
                </View>

                : 

                <FontAwesome5 name="circle" size={24} color="blue" /> 
            }
            
            {
            i != stepsNum &&
             <view style={styles.activeLine}/>
            }

            
            {/* {i == currStep &&  <Text style={styles.curStepText}>{CurrStepText}</Text>} */}
        </View>
      );
    }

    return <View style={styles.indicatorContainer}>{indicators} </View>
  }

  return (
    <div>{stepIndicatorRenderer()}</div>
  )
}


const styles = StyleSheet.create({
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

  activeLine:{
    width: 20,
    height: 2,
    backgroundColor: 'blue',
    margin: 3,
  },

  iconContainer:{
    width: 'auto'
  },

  stepIcon:{
    position: 'relative',
  },

  curStepText:{
    position: 'absolute',
    top: '120%',
    textAlign: "center",
    display: 'inline',
    paddingHorizontal: 6, // deixa respirar
    paddingVertical: 2,
    borderRadius: 4,

  }
 
});

export default StepIndicator