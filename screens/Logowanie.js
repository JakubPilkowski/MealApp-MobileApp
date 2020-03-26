import React, { useState } from 'react';
import { View, Text, StyleSheet, ImageBackground, TextInput, Dimensions, ScrollView, Platform, TouchableNativeFeedback, TouchableOpacity, TouchableHighlight } from 'react-native';
import colors from '../src/themes/colors';
import { createStackNavigator } from '@react-navigation/stack';
import Rejestracja from "./Rejestracja";
import strings from "../src/themes/strings";
import ScreenStyle from "../src/themes/screenStyle";
import {
    FontAwesome,
    Ionicons
} from "react-native-vector-icons";
import dimensions from '../src/themes/dimensions';
import AndroidButton from '../components/AndroidButton';
import IosButton from '../components/IosButton';

const { width, height } = Dimensions.get("screen");
function LogowanieScreen({ navigation }) {
    let loginButton;
    let registerButton;

    navigation.setOptions({
        headerLeft: () => (
            <View style={styles.backButtonContainer}>
                <TouchableOpacity
                    onPress={() => {
                        navigation.goBack();
                    }}>
                    <Ionicons name="ios-arrow-round-back" size={36} color={colors.colorTextWhite}></Ionicons>
                </TouchableOpacity>
            </View>
        )
    });

    if (Platform.OS === "android") {
        loginButton =
            <AndroidButton text="Zaloguj się" containerStyle={{ width: "60%" }} buttonStyle={{ paddingVertical: 9 }} />
        registerButton =
            <AndroidButton text="Zarejestruj się" containerStyle={{ width: "60%" }} buttonStyle={{ paddingVertical: 9 }}
                onClick={() => navigation.navigate("Rejestracja")}
            />
    }
    if (Platform.OS === "ios") {
        loginButton =
            <IosButton text="Zaloguj się" />
        registerButton =
            <IosButton text="Zarejestruj się"
                onClick={() => navigation.navigate("Rejestracja")}
            />
    }
    return (
        <View style={styles.container}>
            <ImageBackground source={require('../src/images/cutlery.jpg')} style={styles.imageBackground} imageStyle={styles.imageStyle}>
                <Text style={[styles.title, { marginTop: dimensions.defaultHugeMargin }]}>Login</Text>
                <TextInput style={styles.input} />

                <Text style={styles.title}>Hasło</Text>
                <TextInput style={styles.input} />

                <Text style={{ textAlign: 'center', color: colors.colorTextDark, fontSize: 16, marginVertical: dimensions.defaultHugeMargin }}>Inne opcje logowania</Text>
                <View style={{ flexDirection: 'row', marginHorizontal: 20, marginBottom: 30 }}>
                    <View style={{ marginHorizontal: 20 }}>
                        <TouchableOpacity >
                            <FontAwesome name="facebook-official" size={50} color="blue" />
                        </TouchableOpacity>
                    </View>
                    <View style={{ marginHorizontal: 20 }}>
                        <TouchableOpacity onPress={() => console.log("kilkniecie")}>
                            <FontAwesome name='google-plus' size={50} color="red" />
                        </TouchableOpacity>
                    </View>
                </View>
                {loginButton}
                <Text style={{ color: colors.colorTextDark, fontSize: 16, marginVertical: dimensions.defaultSmallMargin }}>Nie masz konta? {'\n'} Zarejestruj się</Text>
                {registerButton}
                <View style={{ flexDirection: 'row', marginVertical: dimensions.defaultSmallMargin }}>
                    <Text style={{ textAlign: 'center', color: colors.colorTextDark, fontSize: 16 }}>Zapomniałeś hasła?</Text>
                    <TouchableOpacity>
                        <Text style={{ textAlign: 'center', color: colors.colorTextDark, fontSize: 16, textDecorationLine: 'underline' }}>Kliknij tutaj</Text>
                    </TouchableOpacity>
                </View>
            </ImageBackground>
        </View>
    );

}


const Logowanie = props => {
    const Stack = createStackNavigator();
    return (
        <Stack.Navigator initialRouteName="Logowanie" screenOptions={ScreenStyle}>
            <Stack.Screen name="Logowanie" component={LogowanieScreen}  />
            <Stack.Screen name="Rejestracja" component={Rejestracja}
            />
        </Stack.Navigator>
    );
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        minHeight: height
    },
    imageStyle: {
        opacity: 0.3
    },
    backButtonContainer: {
        left: 0,
        top: 0,
        position: 'absolute',
        height: 56,
        width: 56,
        alignItems: "center",
        justifyContent: 'center',
        opacity: 1,
        zIndex: 9999
    },
    imageBackground: {
        flex: 1,
        color: colors.backgroundColor,
        alignItems: 'center',
        minHeight: height
    },
    input: {
        backgroundColor: colors.colorTextWhite,
        width: "75%",
        borderBottomWidth: 2,
        borderBottomColor: colors.accent,
        padding: 6,
        marginBottom: 20
    },
    title: {
        textAlign: 'center',
        color: colors.colorTextDark,
        fontSize: 17,
        fontWeight: 'bold'
    }
});


export default Logowanie;