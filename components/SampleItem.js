import React from 'react';
import {View, StyleSheet, Text} from "react-native";

import Strings from '../src/themes/strings';
import Colors from '../src/themes/colors';
import Dimensions from '../src/themes/dimensions';


const SampleItem = props =>{
    // if(props.slideEnabled){

    // }
    // else{
        return (
            <View style={styles.container}>
            </View>
        );
    // }
}

const styles=StyleSheet.create({
    container:{
        // backgroundColor:props.color,
        flex:1,
        alignItems:"center",
        justifyContent:"center",
        backgroundColor:Colors.colorTextWhite,
        borderColor: Colors.accent,
        borderWidth: Dimensions.defaultBorderWidth,
        padding:Dimensions.defaultPadding,
        marginVertical:Dimensions.defaultMarginBetweenItems
    }
});


export default SampleItem;