import React from 'react';
import { View, StyleSheet, Image, Text } from 'react-native';
import Dimensions from '../src/themes/dimensions';
import Colors from '../src/themes/colors';
import GradientDivider from './GradientDivider';
const LogoWithTexts = props => {
    return (
        <View style={styles.container}>
            <Image style={styles.logo} source={props.logo} ></Image>
            <View style={{ flexDirection: 'column', flex: 1, justifyContent: "center" }}>
                <Text style={styles.logoTitle}>{props.title}</Text>
                <GradientDivider startColor={Colors.primary} endColor={Colors.accent}
                    from="left" locationEnd={0.5} dividerStyle={{ flex: 0 }} />
                <View>
                    {props.subTitleContent}
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: Dimensions.defaultSmallMargin
    },
    logo: {
        width: 55,
        height: 55,
        borderWidth: Dimensions.defaultBorderWidth,
        borderColor: Colors.accent,
        borderRadius: Dimensions.defaultHugeBorderRadius
    },
    logoTitle: {
        fontSize: Dimensions.hugeFontSize,
        marginLeft: 10,
    },
    divider: {
        backgroundColor: Colors.accent,
        height: Dimensions.defaultBorderWidth,
    }
});



export default LogoWithTexts;