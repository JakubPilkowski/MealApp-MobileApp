import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { Divider } from 'react-native-elements';
import Colors from '../src/themes/colors';
import Dimensions from '../src/themes/dimensions';


const Danie = props => {
    return (
        <View key={props.id} style={styles.container}>
            <View style={styles.information}>
                <Text style={styles.danie}>{props.nazwa}</Text>
                <Text style={styles.cena}>{props.cena} zł</Text>
            </View>
            <Divider style={styles.divider}></Divider>
        </View>
    );
}


const styles = StyleSheet.create({
    container: {
        marginTop: Dimensions.defaultMargin
    },
    information: {
        flex: 1,
        flexDirection: "row",
        justifyContent: "space-between"
    },
    danie: {
        flex: 1,
        fontSize: Dimensions.defaultFontSize,
        textAlign: "left"
    },
    cena: {
        flex: 1,
        fontSize: Dimensions.defaultFontSize,
        textAlign: "right",
        textAlignVertical:'center'
    },
    divider: {
        backgroundColor: Colors.accent,
        height: Dimensions.defaultBorderWidth,
    }
});


export default Danie;