import React from 'react';
import { View, Text, StyleSheet, TouchableNativeFeedback } from 'react-native';
import colors from '../src/themes/colors';
import dimensions from '../src/themes/dimensions';



const AndroidButton = props => {
    return (
        <View style={[styles.androidButtonView, props.containerStyle]}>
            <TouchableNativeFeedback background={TouchableNativeFeedback.Ripple(colors.accent, true)}
                onPress={props.onClick}
                useForeground={false}>
                <View style={{ flexDirection: 'column', width: "100%" }}>
                    <Text style={[styles.moreButtonText, props.buttonStyle]}>{props.text}</Text>
                </View>
            </TouchableNativeFeedback>
        </View>

    );
}


const styles = StyleSheet.create({
    androidButtonView: {
        backgroundColor: colors.colorTextWhite,
        borderRadius: dimensions.defaultBorderRadius
    },
    moreButtonText: {
        paddingVertical: dimensions.defaultSmallPadding,
        paddingHorizontal: dimensions.defaultPadding,
        textAlign: "center",
        color: colors.primary,
        fontSize: dimensions.hugeFontSize,
        fontWeight: "bold",
        borderColor: colors.primary,
        borderRadius: dimensions.defaultBorderRadius,
        borderWidth: dimensions.defaultBorderWidth
    },
});


export default AndroidButton;