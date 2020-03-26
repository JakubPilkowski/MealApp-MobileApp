import React from 'react';
import {View, StyleSheet, ImageBackground, Text} from 'react-native';
import colors from '../src/themes/colors';



export default class Rejestracja extends React.Component{

    render(){
        return( 
            <View style={styles.container}>
                <ImageBackground source={require('../src/images/cutlery.jpg')} style={styles.imageBackground} imageStyle={styles.imageStyle}>
                    <Text>Rejestracja</Text>
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