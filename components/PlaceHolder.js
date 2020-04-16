import React from "react";
import { View, Text, StyleSheet, Image } from 'react-native';
import dimensions from '../src/themes/dimensions';
import Colors from "../src/themes/colors";

const PlaceHolder = props => {
    return (
        <View style={styles.container}>
            <Image style={styles.imageStyle} source={props.src} />
            <Text style={styles.textStyle}>{props.text}</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    imageStyle: {
        width: 170,
        height: 170
    },
    textStyle: {
        marginTop: dimensions.defaultMarginBetweenItems,
        backgroundColor: Colors.colorTextWhite,
        borderWidth: dimensions.defaultBorderWidth,
        padding: dimensions.defaultPadding,
        borderColor: Colors.accent,
        borderRadius: 12,
        fontSize: dimensions.toolbarFontSize,
        color: Colors.primary,
        textAlign: 'center'
    }
});

export default PlaceHolder;