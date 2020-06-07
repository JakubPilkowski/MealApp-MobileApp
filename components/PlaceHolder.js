import React from "react";
import { View, Text, StyleSheet, Image } from 'react-native';
import IosButton from '../components/IosButton';
import dimensions from '../src/themes/dimensions';
import Colors from "../src/themes/colors";

const PlaceHolder = props => {
    return (
        <View style={[styles.container, props.containerStyle]}>
            <Image style={styles.imageStyle} source={props.src} />
            <View style={[styles.textContainer, props.textContainer]}>
                <Text style={[styles.textStyle, props.textStyle]}>{props.text}</Text>
                <IosButton enabled={true} containerStyle={{ display: props.buttonDisplay ? 'flex' : 'none' }} text="Spróbuj ponownie" onClick={() => { props.onButtonClick() }} />
            </View>
        </View>
    )
}

PlaceHolder.defaultProps = {
    buttonDisplay: false
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: dimensions.defaultMarginBetweenItems
    },
    imageStyle: {
        width: 170,
        height: 170
    },
    textContainer: {
        marginTop: dimensions.defaultMarginBetweenItems,
        backgroundColor: Colors.colorTextWhite,
        borderWidth: dimensions.defaultBorderWidth,
        padding: dimensions.defaultPadding,
        borderColor: Colors.accent,
        borderRadius: 12,
    },
    textStyle: {
        fontSize: 20,
        color: Colors.primary,
        textAlign: 'center'
    }
});

export default PlaceHolder;