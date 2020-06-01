import React from 'react';
import { View, Text, Dimensions, StyleSheet } from 'react-native';
import { Divider } from 'react-native-elements'
// import Danie from './Danie';
import dimensions from '../src/themes/dimensions';
import Colors from '../src/themes/colors';
import Zestaw from './Zestaw';

const {width, height} = Dimensions.get('window');



const ZestawsView = (props)=> {
    const date = props.date.split('T');


        return (
            <View style={{ width: width - 100, flexDirection: 'column' }}>
                <Text style={{ textAlign: "center", fontSize: dimensions.hugeFontSize }}>{date[0]}</Text>
                <Divider style={[styles.divider, { marginBottom: dimensions.defaultSmallMargin, width: "40%", alignSelf: "center" }]}></Divider>
                {props.contentList.map(zestaw => renderZestaw(zestaw))}
            </View>
        )

}

function renderZestaw(zestaw){
    if (zestaw.type === "DAILY"){
        return (
            <Zestaw id={zestaw.id} content={zestaw.content} />
        )
    }
}


const styles=StyleSheet.create({
    divider: {
        backgroundColor: Colors.accent,
        height: dimensions.defaultBorderWidth,
        width: "100%"
    },
});


export default ZestawsView;