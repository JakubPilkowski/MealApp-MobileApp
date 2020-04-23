import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ImageBackground, Text, TextInput, TouchableOpacity, Dimensions, Platform, KeyboardAvoidingView, ActivityIndicator } from 'react-native';
import colors from '../src/themes/colors';
import AndroidButton from '../components/AndroidButton';
import IosButton from '../components/IosButton';
import dimensions from '../src/themes/dimensions';
import Validation from '../service/Validation';
import Hashing from '../service/Hashing';
import { Ionicons } from 'react-native-vector-icons';


const { width, height } = Dimensions.get("screen");
const Rejestracja = props => {
    // const {drawerNavigation } = props.route.params;
    const [loginField, setLoginField] = useState('');
    const [emailField, setEmailField] = useState('');
    const [passwordField, setPasswordField] = useState('');
    const [loginError, setLoginError] = useState('');
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [firstInputFocus, setFirstInputFocus] = useState(true);
    const [secondInputFocus, setSecondInputFocus] = useState(false);
    const [thirdInputFocus, setThirdInputFocus] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [registerError, setRegisterError] = useState('');
    const onFirstInputFocus = () => {
        setSecondInputFocus(false);
        setThirdInputFocus(false);
    }
    const onSecondInputFocus = () => {
        setFirstInputFocus(false);
        setThirdInputFocus(false);
    }
    const onThirdInputFocus = () => {
        setSecondInputFocus(false);
        setThirdInputFocus(false);
    }
    const handleFirstInputSubmit = () => {
        setFirstInputFocus(false);
        setSecondInputFocus(true);
    }
    const handleSecondInputSubmit = () => {
        setSecondInputFocus(false);
        setThirdInputFocus(true);
    }


    const registerButtonHandler = () => {
        let loginErrorMessage = Validation.loginVerification(loginField);
        let emailErrorMessage = Validation.emailVerification(emailField);
        let passwordErrorMessage = Validation.passwordVerification(passwordField);
        if (loginErrorMessage.length === 0 && emailErrorMessage.length === 0 && passwordErrorMessage.length === 0) {
            setIsLoading(true);
            hashPassword();
        }
        setLoginError(loginErrorMessage);
        setEmailError(emailErrorMessage);
        setPasswordError(passwordErrorMessage);
    }
    async function hashPassword() {
        setTimeout(async function () {

            const res = await Hashing.hashPassword(passwordField);
            let errors = "";
            if (loginField === "PelnyGar") {
                errors = errors + "Taki login już istnieje \n";
            }
            if (emailField === "pelnygar@gmail.com") {
                errors = errors + "Na podany adres email założono już konto \n";
            }
            if (errors.length === 0) {
                setIsLoading(false);
                props.navigation.popToTop();
                props.navigation.navigate("Jadlodajnie");
            }
            setRegisterError(errors);
        }, 1000);
    }

    let registerButton;
    if (Platform.OS === "android") {
        registerButton =
            <AndroidButton text="Zarejestruj się" containerStyle={{ width: "60%" }}
                buttonStyle={{ paddingVertical: 9 }} onClick={() => registerButtonHandler()} />
    }
    if (Platform.OS === "ios") {
        registerButton =
            <IosButton text="Zarejestruj się"
                containerStyle={{ width: "60%", borderColor: colors.primary, borderWidth: 2, borderRadius: 6, backgroundColor: colors.colorTextWhite }}
                buttonStyle={{ fontSize: 24 }} onClick={() => registerButtonHandler()} />
    }

    // useEffect(() => {
    //     hashPassword(passwordField);
    // }, { isLoading });

    return (
        <KeyboardAvoidingView style={styles.container}
            behavior="height">
            <ImageBackground source={require('../src/images/cutlery.jpg')} style={styles.imageBackground} imageStyle={styles.imageStyle}>
                <View style={{ height: 56, backgroundColor: colors.primary, width: '100%',flexDirection:'row', alignItems:'center', justifyContent: 'center', }}>
                    <View style={[styles.backButtonContainer, { left: 0 }]}>
                        <TouchableOpacity
                            onPress={() => {
                                props.navigation.goBack();
                            }}>
                            <Ionicons name="ios-arrow-round-back" size={36} color={colors.colorTextWhite}></Ionicons>
                        </TouchableOpacity>
                    </View>
                    <Text style={{ color: colors.colorTextWhite, fontSize:20, fontWeight:'bold' }}>Rejestracja</Text>
                </View>


                <Text style={[styles.title, { marginTop: dimensions.defaultHugeMargin }]}>Login</Text>
                <TextInput style={styles.input}
                    returnKeyType="next"
                    autoFocus={firstInputFocus}
                    onFocus={onFirstInputFocus}
                    onChangeText={(text) => setLoginField(text)}
                    onSubmitEditing={handleFirstInputSubmit}
                    blurOnSubmit={false}
                />
                <Text style={{ fontSize: 14, color: 'red', width: "75%" }}>{loginError}</Text>
                <Text style={styles.title}>Email</Text>
                <TextInput style={styles.input}
                    returnKeyType="next"
                    onFocus={onSecondInputFocus}
                    onChangeText={(text) => setEmailField(text)}
                    keyboardType="email-address"
                    ref={(input) => {
                        if (input !== null) {
                            if (secondInputFocus) {
                                input.focus();
                            }
                        }
                    }}
                    onSubmitEditing={handleSecondInputSubmit}
                    blurOnSubmit={false}
                />
                <Text style={{ fontSize: 14, color: 'red', width: "75%" }}>{emailError}</Text>
                <Text style={styles.title}>Hasło</Text>
                <TextInput style={styles.input}
                    secureTextEntry={true}
                    returnKeyType="next"
                    onFocus={onThirdInputFocus}
                    onChangeText={(text) => setPasswordField(text)}
                    ref={(input) => {
                        if (input !== null) {
                            if (thirdInputFocus) {
                                input.focus();
                            }
                        }
                    }}
                />
                <Text style={{ fontSize: 14, marginBottom: 100, color: 'red', width: "75%" }}>{passwordError}</Text>
                {registerButton}
                <Text style={{ fontSize: 14, color: 'red', width: "75%" }}>{registerError}</Text>
                <ActivityIndicator size="large" color={colors.primary} animating={isLoading} />
                {/* <CustomSmallLoadingComponent text={"Sprawdzam dane"} visibility={isLoading} /> */}
            </ImageBackground>
        </KeyboardAvoidingView>
    );

}


const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    imageStyle: {
        opacity: 0.3
    },
    imageBackground: {
        flex: 1,
        color: colors.backgroundColor,
        alignItems: 'center'
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
    input: {
        backgroundColor: colors.colorTextWhite,
        width: "75%",
        borderBottomWidth: 2,
        borderBottomColor: colors.accent,
        padding: 6,
        fontSize: 16,
        marginBottom: 20
    },
    title: {
        textAlign: 'center',
        color: colors.colorTextDark,
        fontSize: 17,
        fontWeight: 'bold'
    }
});

export default Rejestracja;