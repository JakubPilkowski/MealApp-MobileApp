import React from "react";
import { View, StyleSheet, TouchableOpacity, Image, Animated } from 'react-native';
import Dimensions from "../src/themes/dimensions";


const IconWithAction = props => {

    return (
        <Animated.View style={[styles.buttonContainer, props.containerStyle]}>
            <TouchableOpacity onPress={props.onClick}>             
                    {props.content}  
            </TouchableOpacity>
        </Animated.View>
    );

}

const styles = StyleSheet.create({
    buttonContainer: {
        width: 48,
        height: 48,
        alignItems: "center",
        justifyContent: 'center',
    },
    button: {
        width: Dimensions.defaultIconSize,
        height: Dimensions.defaultIconSize,
    },
});

export default IconWithAction;