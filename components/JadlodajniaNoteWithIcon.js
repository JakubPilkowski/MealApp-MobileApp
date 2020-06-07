import { View, StyleSheet } from "react-native";
import React from 'react';
import dimensions from '../src/themes/dimensions';

const JadlodajniaNoteWithIcon = props => {
    return (
        <View style={styles.container}>
            <View style={styles.iconStyle}>
                {props.icon}
            </View>
            {props.content}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: "row",
        marginVertical: dimensions.defaultSmallMargin,
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    iconStyle: {
        width: 50,
        alignItems: "center"
    },
});

export default JadlodajniaNoteWithIcon;