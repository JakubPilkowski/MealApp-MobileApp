import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { Divider } from 'react-native-elements';
import Colors from '../src/themes/colors';
import Dimensions from '../src/themes/dimensions';

const Zestaw = props => {
    return (
        <View key={props.id} style={styles.container}>
            <Text style={[styles.danie, props.danieStyle]}>{props.content}</Text>
            <Divider style={styles.divider}></Divider>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginBottom: Dimensions.defaultMargin
    },
    danie: {
        fontSize: 14,
        textAlign: "center"
    },
    divider: {
        marginTop: 2,
        backgroundColor: Colors.accent,
        height: Dimensions.defaultBorderWidth,
    }
});


export default Zestaw;