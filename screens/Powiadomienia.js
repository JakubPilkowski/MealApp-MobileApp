import React from 'react';
import {View, Text, StyleSheet, Button} from 'react-native';
import JadlodajnieWiecej from './JadlodajnieWiecej';
import { createStackNavigator } from '@react-navigation/stack';
import Colors from "../src/themes/colors";
import Strings from "../src/themes/strings";
import IconWithAction from "../components/IconWithAction";
import screenStyle from '../src/themes/screenStyle';
function PowiadomieniaScreen({navigation}){
    const HomeButtonHandler = () => {
        navigation.openDrawer();
    }
    navigation.setOptions({
        headerLeft: () => (
            <IconWithAction src={require('../src/images/burger_bialy_m.png')} onClick={HomeButtonHandler} />
        )
    });
    return (
        <View style={styles.container}>
            <Button onPress={() => navigation.navigate('JadlodajnieWiecej')} title="Więcej" />
        </View>
    );
}


const Powiadomienia = props => {
    const Stack = createStackNavigator();
    return (
        <Stack.Navigator initialRouteName="Powiadomienia" screenOptions={screenStyle}>
            <Stack.Screen name="Powiadomienia" component={PowiadomieniaScreen} options={{
                headerTitle: Strings.powiadomienia,
            }} />
            <Stack.Screen name="JadlodajnieWiecej" component={JadlodajnieWiecej} />
        </Stack.Navigator>
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