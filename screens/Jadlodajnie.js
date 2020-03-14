import React from 'react';
import { View, Text, StyleSheet, StatusBar, Button, TouchableOpacity, Image } from "react-native";
import Strings from "../src/themes/strings";
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Toolbar from "../components/Toolbar";
import JadlodajnieWiecej from './JadlodajnieWiecej';
import Colors from "../src/themes/colors";
import Dimensions from  "../src/themes/dimensions";


function JadlodajnieScreen({navigation}){
    const HomeButtonHandler = () => {
        props.navigation.openDrawer();
    }
    navigation.setOptions({
        headerRight: () =>(
        <TouchableOpacity onPress={()=>{}}>
        <Image style={styles.button} source={require('../src/images/wyszukaj_m.png')}></Image>
    </TouchableOpacity>
    )
    });
    return (
        <View style={styles.container}>
            <Text >Jadłodajnie</Text>
            <Button onPress={() =>navigation.navigate('JadlodajnieWiecej')} title="Więcej"/>
            {/* <StatusBar />
            <Toolbar title={Strings.jadlodajnie}
                homeButton={require("../src/images/burger_bialy_m.png")}
                rightCornerButton={require('../src/images/wyszukaj_m.png')}
                onHomeClick={HomeButtonHandler} */}
            
        </View>
    );
}

const Jadlodajnie = props => {
    const Stack = createStackNavigator();
    return (
        <Stack.Navigator initialRouteName="Jadlodajnie" screenOptions={{
            headerStyle: {
              backgroundColor: Colors.primary,
            },
            headerTintColor: Colors.colorTextWhite,
            headerTitleStyle: {
              fontWeight: 'bold',
            },
            headerTitleAlign:"center"
        }}>
            <Stack.Screen name="Jadlodajnie" component={JadlodajnieScreen} options={{
            headerTitle: Strings.jadlodajnie,
         }}/>
            <Stack.Screen name="JadlodajnieWiecej" component={JadlodajnieWiecej} />
        </Stack.Navigator>
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1
    },    
    buttonContainer: {
        width: 48,
        height: 48,
        alignItems:"center",
        justifyContent: 'center',
    },
    button: {
        width: Dimensions.defaultIconSize,
        height: Dimensions.defaultIconSize,
    },
});



export default Jadlodajnie;
