import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

const Powiadomienia = props => {
    return(
        <View style={styles.container}>
            <Text>Powiadomienia</Text>
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



export default Powiadomienia;