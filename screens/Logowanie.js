import React from 'react';
import {View, StyleSheet, ImageBackground} from 'react-native';
import colors from '../src/themes/colors';



const Logowanie = props => {
        return( 
            <View style={styles.container}>
                <ImageBackground source={require('../src/images/cutlery.jpg')} style={styles.imageBackground} imageStyle={styles.imageStyle}>
                    </ImageBackground>  
            </View>
        );
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
});


export default Logowanie;