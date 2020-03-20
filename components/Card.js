import React from 'react';
import { View, StyleSheet } from "react-native";
import Dimensions from '../src/themes/dimensions';
import Colors from '../src/themes/colors';





const Card = props => {

    return (
        <View style={styles.container}>
            {props.content}
        </View>
    );
}


const styles = StyleSheet.create({
    container: {
        justifyContent: "center",
        backgroundColor: Colors.colorTextWhite,
        borderColor: Colors.accent,
        borderWidth: Dimensions.defaultBorderWidth,
        borderRadius: Dimensions.defaultSmallBorderRadius,
        padding: Dimensions.defaultPadding,
        marginTop: Dimensions.defaultMarginBetweenItems,
        marginHorizontal: Dimensions.defaultSmallMargin
    }
});

export default Card;