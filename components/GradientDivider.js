import React from 'react';
import { View, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import dimensions from '../src/themes/dimensions';


const GradientDivider = props => {
    let locationEnd;
    if(props.locationEnd===null)
        locationEnd=1;
    else
        locationEnd=props.locationEnd;
    if (props.from === "left") {
        return (
                <LinearGradient style={[styles.divider, props.dividerStyle]}
                    colors={[props.startColor, props.endColor]}
                    start={[1, 0]} end={[0, 1]}
                    locations={[0, locationEnd]}>
                </LinearGradient>
        )
    }
    if (props.from === "right") {
        return (
            <LinearGradient style={[styles.divider, props.dividerStyle]}
                colors={[props.endColor, props.startColor]}
                start={[1, 0]} end={[0, 1]}
                locations={[1-locationEnd, 1]}>
            </LinearGradient>
        )
    }

}
const styles = StyleSheet.create({

    divider: {
        flex: 1,
        height: dimensions.defaultBorderWidth,
    },
})


export default GradientDivider