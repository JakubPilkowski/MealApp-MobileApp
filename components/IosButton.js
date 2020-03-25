import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import colors from '../src/themes/colors';
import dimensions from '../src/themes/dimensions';


const IosButton = props => {

    return (
        <View style={props.containerStyle}>
            <TouchableOpacity onPress={props.onClick}>
                <Text style={[styles.moreButtonText, props.buttonStyle]}>{props.text}</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({

    moreButtonText: {
        paddingVertical: dimensions.defaultSmallPadding,
        paddingHorizontal: dimensions.defaultPadding,
        textAlign: "center",
        color: colors.primary,
        fontSize: dimensions.hugeFontSize,
        fontWeight: "bold",
    },
});


export default IosButton;