import React from "react";
import { Text, View, Image, StyleSheet, TouchableOpacity } from 'react-native';
import Colors from "../src/themes/colors";
import Dimensions from "../src/themes/dimensions";
const Toolbar = props => {

    let homeButton = <TouchableOpacity onPress={props.onHomeClick}>
        <Image style={styles.button} source={props.homeButton}></Image>
    </TouchableOpacity>;
    let rightCornerButton = <TouchableOpacity onPress={props.onRightCornerClick}>
        <Image style={styles.button} source={props.rightCornerButton}></Image>
    </TouchableOpacity>;
    if (props.homeButton == null) {
        homeButton = null;
    }
    if (props.rightCornerButton == null) {
        rightCornerButton = null;
    }
    return (
        <View style={styles.container}>
            <View style={styles.buttonContainer}>
                {homeButton}
            </View>
            <Text style={styles.title}>{props.title}</Text>
            <View style={styles.buttonContainer}>
                {rightCornerButton}
            </View>
        </View>
    );
}



const styles = StyleSheet.create({
    container: {
        width: "100%",
        height: 56,
        backgroundColor: Colors.primary,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: "center"
    },
    title: {
        flex: 1,
        fontSize: Dimensions.toolbarFontSize,
        color: Colors.colorTextWhite,
        textAlign: "center",
    },
    buttonContainer: {
        width: 48,
        height: 48,
        alignItems:"center",
        justifyContent: 'center',
    },
    button: {
        width: Dimensions.defaultIconSize,
        height: Dimensions.defaultIconSize,
    },
});


export default Toolbar;