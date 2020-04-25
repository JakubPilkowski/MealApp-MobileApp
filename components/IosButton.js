import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import colors from '../src/themes/colors';
import dimensions from '../src/themes/dimensions';


const IosButton = props => {

    return (
        <View style={[{ opacity: props.enabled ? 1 : 0.5 }, props.containerStyle]}>
            <TouchableOpacity onPress={() => {
                if (props.enabled) {
                    props.onClick();
                }
            }}
                activeOpacity={!props.enabled ? 1 : 0.2}
            >
                <Text style={[styles.moreButtonText, props.buttonStyle]}>{props.text}</Text>
            </TouchableOpacity>
        </View>
    );
}

IosButton.defaultProps = {
    enabled: true
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