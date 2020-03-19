import { View, Image, Text, StyleSheet } from "react-native";
import React from 'react';
import dimensions from '../src/themes/dimensions';
import Colors from '../src/themes/colors';
import { FontAwesome } from 'react-native-vector-icons';
import { FlatList } from "react-native-gesture-handler";


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
}

);

export default JadlodajniaNoteWithIcon;