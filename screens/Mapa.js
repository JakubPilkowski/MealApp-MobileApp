import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

const Mapa = props => {
    return(
        <View style={styles.container}>
            <Text>Mapa</Text>
        </View>
    );
}


const styles = StyleSheet.create({
    container:{
        flex:1,
        alignItems:"center",
        justifyContent: 'center',
    }
})



export default Mapa;