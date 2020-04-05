import React from "react";
import { View, StyleSheet, TouchableOpacity, Image } from 'react-native';
import Dimensions from "../src/themes/dimensions";


const IconWithAction = props => {

    return (
        <View style={styles.buttonContainer}>
            <TouchableOpacity onPress={props.onClick}>
               
                    {props.content}
                        {/* <Image style={[styles.button, props.imageStyle]} source={props.src}></Image> */}
             
            </TouchableOpacity>
        </View>
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