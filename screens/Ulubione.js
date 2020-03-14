import React from "react";
import {View, StyleSheet,Text} from 'react-native';

const Ulubione = props => {

return(
    <View style={styles.container}>
        <Text>Ulubione</Text>
    </View>
);

}


const styles=StyleSheet.create({
    container:{
        flex:1,
        alignItems:"center",
        justifyContent: 'center',
    }
})

export default Ulubione;