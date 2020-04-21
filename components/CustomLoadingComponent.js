import React, { useState } from "react";
import { View, Text, StyleSheet, Animated, Easing, Modal } from 'react-native';
import Colors from "../src/themes/colors";
import dimensions from '../src/themes/dimensions';


const CustomLoadingComponent = props => {
    const spinValue = new Animated.Value(0);
    const bounceValue = new Animated.Value(0);
    const dotOneValue = new Animated.Value(0);
    const dotTwoValue = new Animated.Value(0);
    const dotThreeValue = new Animated.Value(0);

    function loaderImageAnim() {
        spinValue.setValue(0);
        bounceValue.setValue(0);
        Animated.parallel(
            [
                Animated.timing(
                    spinValue,
                    {
                        toValue: 1,
                        duration: 2100,
                        easing: Easing.linear
                    }
                ),
                Animated.timing(
                    bounceValue,
                    {
                        toValue: 1,
                        duration: 2100,
                        easing: Easing.linear
                    }
                ),
            ]
        ).start(() => loaderImageAnim());
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
        inputRange: [0, 0.5, 1],
        outputRange: ['0deg', '360deg', '720deg']
    });
    const bounce = bounceValue.interpolate(
        {
            inputRange: [0, 0.25, 0.5, 0.75, 1],
            outputRange: [0, 110, 0, 110, 0]
        }
    );
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
        <Modal transparent={true}
            visible={true}
        >
            <View style={{ flex: 1, alignItems: "center", justifyContent: 'center', borderColor: Colors.primary }}>
                <View style={{ width: "100%", alignItems: 'center' }}>
                    <Animated.Image
                        style={{ transform: [{ rotate: spin }], width: 70, height: 70, bottom: bounce }}
                        source={require("../src/images/ikonka_v3.png")}
                    />
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginTop:40}}>
                        <Text style={{ color: Colors.primary, fontSize: 28 }}>Ładowanie</Text>
                        <Animated.Text style={{ color: Colors.primary, marginLeft: 3, fontSize: 28, opacity: opacity1 }}>.</Animated.Text>
                        <Animated.Text style={{ color: Colors.primary, marginLeft: 3, fontSize: 28, opacity: opacity2 }}>.</Animated.Text>
                        <Animated.Text style={{ color: Colors.primary, marginLeft: 3, fontSize: 28, opacity: opacity3 }}>.</Animated.Text>
                    </View>
                </View>
            </View>
        </Modal>);


}



export default CustomLoadingComponent;