import React, { useState } from "react";
import { View, Text, StyleSheet, Animated, Easing, Modal } from 'react-native';
import Colors from "../src/themes/colors";
import dimensions from '../src/themes/dimensions';


const CustomSmallLoadingComponent = props => {
    const spinValue = new Animated.Value(0);
    const dotOneValue = new Animated.Value(0);
    const dotTwoValue = new Animated.Value(0);
    const dotThreeValue = new Animated.Value(0);

    function loaderImageAnim() {
        spinValue.setValue(0);

        Animated.timing(
            spinValue,
            {
                toValue: 1,
                duration: 1050,
                easing: Easing.linear
            }
        ).start(()=>loaderImageAnim());
    }

    function loadTextAnim() {
        dotOneValue.setValue(0);
        dotTwoValue.setValue(0);
        dotThreeValue.setValue(0);
        Animated.parallel(
            [
                Animated.timing(
                    dotOneValue, {
                    toValue: 1,
                    duration: 350,
                }
                ),
                Animated.timing(
                    dotTwoValue, {
                    toValue: 1,
                    duration: 350,
                    delay: 350
                }
                ),
                Animated.timing(
                    dotThreeValue, {
                    toValue: 1,
                    duration: 350,
                    delay: 700
                }
                )
            ]
        ).start(() => loadTextAnim())
    }

    loaderImageAnim();
    loadTextAnim();
    const spin = spinValue.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg']
    });
    const opacity1 = dotOneValue.interpolate(
        {
            inputRange: [0, 1],
            outputRange: [0, 1]
        }
    );
    const opacity2 = dotTwoValue.interpolate(
        {
            inputRange: [0, 1],
            outputRange: [0, 1]
        }
    );
    const opacity3 = dotThreeValue.interpolate(
        {
            inputRange: [0, 1],
            outputRange: [0, 1]
        }
    );
    return (
        <View style={{ flexDirection: 'row', alignItems: "center", justifyContent: 'center', borderColor: Colors.primary, display: props.visibility ? 'flex' : 'none' }}>
            <Text style={{ color: Colors.primary, fontSize: 24 }}>{props.text}</Text>
            <Animated.Text style={{ color: Colors.primary, marginLeft: 3, fontSize: 24, opacity: opacity1 }}>.</Animated.Text>
            <Animated.Text style={{ color: Colors.primary, marginLeft: 3, fontSize: 24, opacity: opacity2 }}>.</Animated.Text>
            <Animated.Text style={{ color: Colors.primary, marginLeft: 3, fontSize: 24, opacity: opacity3 }}>.</Animated.Text>
            {/* <Animated.Image
                style={{ transform: [{ rotate: spin }], width: 40, height: 40 }}
                source={require("../src/images/ikonka_v2.png")} */}
            {/* /> */}
        </View>
    );


}



export default CustomSmallLoadingComponent;