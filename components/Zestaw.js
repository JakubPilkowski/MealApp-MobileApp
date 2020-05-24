import React from 'react';
import { View, Text, Dimensions, StyleSheet } from 'react-native';
import { Divider } from 'react-native-elements'
// import Danie from './Danie';
import dimensions from '../src/themes/dimensions';
import Colors from '../src/themes/colors';

const {width, height} = Dimensions.get('window');



const Zestaw = (props)=> {
        return (
            <View style={{ width: width - 100, flexDirection: 'column' }}>
                <Text style={{ textAlign: "center", fontSize: dimensions.hugeFontSize }}>{props.date}</Text>
                <Divider style={[styles.divider, { marginBottom: dimensions.defaultSmallMargin, width: "40%", alignSelf: "center" }]}></Divider>
                {/* <Danie nazwa={props.name} cena={props.price}></Danie>
                <Danie nazwa={props.name} cena={props.price}></Danie> */}
            </View>
        )

}

const styles=StyleSheet.create({
    divider: {
        backgroundColor: Colors.accent,
        height: dimensions.defaultBorderWidth,
        width: "100%"
    },
});


export default Zestaw;