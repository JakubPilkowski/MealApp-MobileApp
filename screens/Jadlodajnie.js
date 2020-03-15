import React from 'react';
import { View, Text, StyleSheet, StatusBar, Button, TouchableOpacity, Image } from "react-native";
import Strings from "../src/themes/strings";
import { createStackNavigator } from '@react-navigation/stack';
import JadlodajnieWiecej from './JadlodajnieWiecej';
import Colors from "../src/themes/colors";
import IconWithAction from "../components/IconWithAction";
import ScreenStyle from "../src/themes/screenStyle";

function JadlodajnieScreen({ navigation }) {
    const HomeButtonHandler = () => {
        navigation.openDrawer();
    }
    navigation.setOptions({
        headerRight: () => (
            <IconWithAction src={require('../src/images/wyszukaj_m.png')} />
            )
        , 
       headerLeft: () => (
            <IconWithAction src={require('../src/images/burger_bialy_m.png')} onClick={HomeButtonHandler}/>
        ) 
    });
    return (
        <View style={styles.container}>
            <Button onPress={() => navigation.navigate('JadlodajnieWiecej')} title="Więcej" />
        </View>
    );
}

const Jadlodajnie = props => {
    const Stack = createStackNavigator();
    return (
        <Stack.Navigator initialRouteName="Jadlodajnie" screenOptions={ScreenStyle}>
            <Stack.Screen name="Jadlodajnie" component={JadlodajnieScreen} options={{
                headerTitle: Strings.jadlodajnie,
            }} />
            <Stack.Screen name="JadlodajnieWiecej" component={JadlodajnieWiecej} />
        </Stack.Navigator>
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1
    },
});



export default Jadlodajnie;
