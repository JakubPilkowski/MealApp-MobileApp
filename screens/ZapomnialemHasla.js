import React from 'react';
import {View, StyleSheet, ImageBackground} from 'react-native';
import colors from '../src/themes/colors';



export default class ZapomnialemHasla extends React.Component{

    render(){
        return( 
            <View style={container}>
                <ImageBackground source={require(cutlery.jpg)} style={imageBackground} imageStyle={imageStyle}>
                    </ImageBackground>  
            </View>
        );
    }

}


const styles=StyleSheet.create({
    container:{
        flex:1
    },
    imageStyle:{
        opacity:0.3
    },
    imageBackground:{
        flex:1,
        color: colors.backgroundColor
    }
})