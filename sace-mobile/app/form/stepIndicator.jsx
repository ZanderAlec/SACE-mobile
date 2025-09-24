import React from 'react'
import {View, Text, StyleSheet} from 'react-native'
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';

function StepIndicator() {
  let steps = 3;
  let curStep = 1;


  const stepIndicatorRenderer = () => {
    const indicators = [];


    for (let i = 0; i <= steps; i++ ){
      indicators.push(
        <View style={styles.indicatorContainer}>
            {
              i < curStep ?
                <FontAwesome5 name="check-circle" size={24} color="blue" /> 
                

                : i === curStep ?
                <View  style = {styles.iconContainer}>
                    <FontAwesome5 name="dot-circle"   style={styles.stepIcon} size={24}color="blue" />
                </View>

                : 

                <FontAwesome5 name="circle" size={24} color="blue" /> 
            }
            
            {
            i != steps &&
             <view style={styles.activeLine}/>
            }

            
            {/* {i == curStep &&  <Text style={styles.curStepText}>Title  dfadf adf ad fad{i}</Text>} */}
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