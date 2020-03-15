import React from 'react';
import {View, StyleSheet} from 'react-native';
import { Divider} from 'react-native-elements';
import Strings from '../src/themes/strings';
import Colors from '../src/themes/colors';
import Dimensions from '../src/themes/dimensions';


const Danie = props =>{
    return (
        <View>
            <View style={styles.information}>
            <Text style={styles.danie}>{props.danie}</Text>
            <Text style={styles.cena}>{props.cena}</Text>
            </View>
            <Divider style={styles.divider}></Divider>
        </View>
    );
}


const styles=StyleSheet.create({
    information:{
        flex:1,
        flexDirection:"row",
        justifyContent:"space-between"
    },
    danie:{
        flex:1,
        fontSize:Dimensions.smallFontSize,
        textAlign:"left"
    },  
    cena:{
        flex:1,
        fontSize:Dimensions.smallFontSize,
        textAlign:"right"
    },
    divider:{
        backgroundColor: Colors.accent,
        height: 1,
    }
});