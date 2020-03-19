import React from "react";
import { View, StyleSheet, Button, ImageBackground } from 'react-native';
import JadlodajnieWiecej from './JadlodajnieWiecej';
import { createStackNavigator } from '@react-navigation/stack';
import Colors from "../src/themes/colors";
import Strings from "../src/themes/strings";
import IconWithAction from "../components/IconWithAction";
import ScreenStyle from "../src/themes/screenStyle";

function UlubioneScreen({ navigation }) {
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
            <ImageBackground source={require('../src/images/jedzonko.jpg')} style={{flex:1}} imageStyle={{opacity:0.3}}>
                {/* <Button onPress={() => navigation.navigate('JadlodajnieWiecej')} title="Więcej" /> */}
            </ImageBackground>
        </View>
    );
}

export default class Ulubione extends React.Component {

    render() {
        const Stack = createStackNavigator();

        return (
            <Stack.Navigator initialRouteName="Ulubione" screenOptions={ScreenStyle}>
                <Stack.Screen name="Ulubione" component={UlubioneScreen} options={{
                    headerTitle: Strings.ulubione,
                }} />
                <Stack.Screen name="JadlodajnieWiecej" component={JadlodajnieWiecej} />
            </Stack.Navigator>
        );
    }
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        // alignItems: "center",
        // justifyContent: 'center',
    }
})
