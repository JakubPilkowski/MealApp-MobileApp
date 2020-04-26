import React, { useState } from 'react';
import { View, Text, StyleSheet,AsyncStorage, ImageBackground, TextInput, Dimensions, ScrollView, Platform, TouchableNativeFeedback, TouchableOpacity, TouchableHighlight, ActivityIndicator, SafeAreaView } from 'react-native';
import colors from '../src/themes/colors';
import { createStackNavigator } from '@react-navigation/stack';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Rejestracja from "./Rejestracja";
import strings from "../src/themes/strings";
import ScreenStyle from "../src/themes/screenStyle";
import {
    FontAwesome,
    Ionicons
} from "react-native-vector-icons";
import {
    CommonActions,
  } from '@react-navigation/native';
import dimensions from '../src/themes/dimensions';
import AndroidButton from '../components/AndroidButton';
import IosButton from '../components/IosButton';
import ZapomnialemHasla from './ZapomnialemHasla';
import Validation from '../service/Validation';
import * as Google from "expo-google-app-auth";


const { width, height } = Dimensions.get("screen");
function LogowanieScreen({ navigation }) {


    const [loginField, setLoginField] = useState('');
    const [passwordField, setPasswordField] = useState('');
    const [loginError, setLoginError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [verifyLoginError, setVerifyLoginError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [firstInputFocus, setFirstInputFocus] = useState(false);
    const [buttonEnabled, setButtonEnabled] = useState(true);
    const [secondInputFocus, setSecondInputFocus] = useState(false);
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

    if (Platform.OS === "android" && Platform.Version >= 21) {
        loginButton =
            <AndroidButton text="Zaloguj się" containerStyle={{ width: "60%" }} buttonStyle={{ paddingVertical: 9 }}
                enabled={buttonEnabled}
                onClick={() => loginButtonHandler()} />
        registerButton =
            <AndroidButton text="Zarejestruj się" containerStyle={{ width: "60%" }} buttonStyle={{ paddingVertical: 9 }}
                onClick={() => navigation.navigate("Rejestracja")}
            />
    }
    if (Platform.OS === "ios" || (Platform.OS === "android" && Platform.Version < 21)) {
        loginButton =
            <IosButton text="Zaloguj się" containerStyle={{
                width: "60%", borderColor: colors.primary,
                borderWidth: 2, borderRadius: 6, backgroundColor: colors.colorTextWhite
            }}
                enabled={buttonEnabled}
                buttonStyle={{ paddingVertical: 9 }}
                onClick={() => loginButtonHandler()}
            />
        registerButton =
            <IosButton text="Zarejestruj się"
                containerStyle={{
                    width: "60%", borderColor: colors.primary, borderWidth: 2,
                    borderRadius: 6, backgroundColor: colors.colorTextWhite
                }}
                buttonStyle={{ paddingVertical: 9 }}
                onClick={() => navigation.navigate("Rejestracja")}
            />
    }
    const onFirstInputFocus = () => {
        setSecondInputFocus(false);
    }
    const onSecondInputFocus = () => {
        setFirstInputFocus(false);
    }
    const handleFirstInputSubmit = () => {
        setFirstInputFocus(false);
        setSecondInputFocus(true);
    }
    const handleSecondInputSubmit = () => {
        setSecondInputFocus(false);
    }
    const loginButtonHandler = () => {
        let loginErrorMessage = Validation.loginVerification(loginField);
        let passwordErrorMessage = Validation.passwordVerification(passwordField);
        setButtonEnabled(false);
        if (loginErrorMessage.length === 0 && passwordErrorMessage.length === 0) {
            setIsLoading(true);
            verifyLogin();
        }
        else {
            setButtonEnabled(true);
        }
        setLoginError(loginErrorMessage);
        setPasswordError(passwordErrorMessage);
    }

    async function verifyLogin() {
        setTimeout(async function () {
            {
                let errors = "";
                if (loginField === "PelnyGar") {
                    errors = errors + "Taki login już istnieje \n";
                }
                if (errors.length === 0) {
                    setIsLoading(false);
                    // navigation.navigate("Jadlodajnie");
                    // navigator.reset();  
                    setTimeout(function () {
                        setButtonEnabled(true);
                    }, 100);
                }
                setVerifyLoginError(errors);
            }
        }, 1000);
    }
    async function googleLogin() {
        try {
            const result = await Google.logInAsync({
                androidClientId: "428437687512-gvdpebuorj5jhiuba1jhtk0uube7eus8.apps.googleusercontent.com",
                scopes: ["profile", "email"]
            })
            if (result.type === "success") {
                await AsyncStorage.setItem('authToken', result.accessToken);
                await AsyncStorage.setItem('login', result.user.name);
                await AsyncStorage.setItem('email', result.user.email);
                await AsyncStorage.setItem('avatar', result.user.photoUrl);
                navigation.dispatch({
                    ...CommonActions.reset({
                        index:1,
                        routes : [
                           {name: "Home"}, 
                        ]
                    }),
                  });
                // console.log(result);
            } else {
                console.log("cancelled")
            }
        } catch (e) {
            console.log("error", e)
        }
    }
    return (
        <SafeAreaView style={{ flex: 1 }}>
            <ImageBackground source={require('../src/images/cutlery.jpg')} style={styles.imageBackground} imageStyle={styles.imageStyle}>
                <KeyboardAwareScrollView
                    style={{ width: '100%', flex: 1 }}
                    contentContainerStyle={{ alignItems: 'center' }}
                >
                    <Text style={[styles.title, { marginTop: dimensions.defaultHugeMargin }]}>Login</Text>
                    <TextInput style={styles.input}
                        onChangeText={(text) => setLoginField(text)}
                        returnKeyType="next"
                        onFocus={onFirstInputFocus}
                        onSubmitEditing={handleFirstInputSubmit}
                        blurOnSubmit={false}
                    />
                    <Text style={{ fontSize: 14, color: 'red', width: "75%" }}>{loginError}</Text>
                    <Text style={styles.title}>Hasło</Text>
                    <TextInput style={styles.input}
                        onChangeText={(text) => setPasswordField(text)}
                        returnKeyType="next"
                        secureTextEntry={true}
                        onFocus={onSecondInputFocus}
                        ref={(input) => {
                            if (input !== null) {
                                if (secondInputFocus) {
                                    input.focus();
                                }
                            }
                        }}
                        onSubmitEditing={handleSecondInputSubmit}
                    />
                    <Text style={{ fontSize: 14, color: 'red', width: "75%" }}>{passwordError}</Text>
                    <Text style={{ textAlign: 'center', color: colors.colorTextDark, fontSize: 16, marginVertical: dimensions.defaultHugeMargin }}>Inne opcje logowania</Text>
                    <View style={{ flexDirection: 'row', marginHorizontal: 20, marginBottom: 30 }}>
                        <View style={{ marginHorizontal: 20 }}>
                            <TouchableOpacity >
                                <FontAwesome name="facebook-official" size={50} color="blue" />
                            </TouchableOpacity>
                        </View>
                        <View style={{ marginHorizontal: 20 }}>
                            <TouchableOpacity onPress={() => { googleLogin() }}>
                                <FontAwesome name='google-plus' size={50} color="red" />
                            </TouchableOpacity>
                        </View>
                    </View>
                    {loginButton}
                    <Text style={{ fontSize: 14, color: 'red', width: "75%" }}>{verifyLoginError}</Text>
                    <Text style={{ color: colors.colorTextDark, fontSize: 16, marginVertical: dimensions.defaultSmallMargin }}>Nie masz konta? {'\n'} Zarejestruj się</Text>
                    {registerButton}
                    <View style={{ flexDirection: 'row', marginVertical: dimensions.defaultSmallMargin }}>
                        <Text style={{ textAlign: 'center', color: colors.colorTextDark, fontSize: 16 }}>Zapomniałeś hasła?</Text>
                        <TouchableOpacity onPress={() => { navigation.navigate("ZapomnialemHasla") }}>
                            <Text style={{ textAlign: 'center', color: colors.colorTextDark, fontSize: 16, textDecorationLine: 'underline' }}>Kliknij tutaj</Text>
                        </TouchableOpacity>
                    </View>
                    <ActivityIndicator size="large" color={colors.primary} animating={isLoading} />
                </KeyboardAwareScrollView>
            </ImageBackground>
        </SafeAreaView>
    );

}


const Logowanie = props => {
    const forFade = ({ current, closing }) => ({
        cardStyle: {
            opacity: current.progress,
        },
    });
    const Stack = createStackNavigator();
    return (
        <Stack.Navigator initialRouteName="Logowanie" screenOptions={ScreenStyle}>
            <Stack.Screen name="Logowanie" component={LogowanieScreen} />
            <Stack.Screen name="Rejestracja" component={Rejestracja}
                options={{
                    headerStyle: {
                        opacity: 0, height: 0
                    },
                    cardStyleInterpolator: forFade
                }}
            />
            <Stack.Screen name="ZapomnialemHasla" component={ZapomnialemHasla}
                options={{
                    headerStyle: {
                        opacity: 0, height: 0
                    },
                    cardStyleInterpolator: forFade
                }}

            />
        </Stack.Navigator>
    );
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
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