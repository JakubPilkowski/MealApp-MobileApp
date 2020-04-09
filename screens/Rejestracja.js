import React, { useState } from 'react';
import { View, StyleSheet, ImageBackground, Text, TextInput, Dimensions, Platform, KeyboardAvoidingView } from 'react-native';
import colors from '../src/themes/colors';
import AndroidButton from '../components/AndroidButton';
import IosButton from '../components/IosButton';
import dimensions from '../src/themes/dimensions';


const { width, height } = Dimensions.get("screen");
const Rejestracja = props => {
    // const {drawerNavigation } = props.route.params;
    const [firstInputFocus, setFirstInputFocus] = useState(true);
    const [secondInputFocus, setSecondInputFocus] = useState(false);
    const [thirdInputFocus, setThirdInputFocus] = useState(false);
    const onFirstInputFocus = () =>{
        setSecondInputFocus(false);
        setThirdInputFocus(false);
    }
    const onSecondInputFocus = ()=>{
        setFirstInputFocus(false);
        setThirdInputFocus(false);
    }
    const onThirdInputFocus= () =>{
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
    // drawerNavigation.setOptions({
    //     gestureEnabled:false
    // });
    let registerButton;
    if (Platform.OS === "android") {
        registerButton =
            <AndroidButton text="Zarejestruj się" containerStyle={{ width: "60%" }}
                buttonStyle={{ paddingVertical: 9 }} onClick={() => {
                    props.navigation.popToTop();
                    props.navigation.navigate("Jadlodajnie");}} />
    }
    if (Platform.OS === "ios") {
        registerButton =
            <IosButton text="Zarejestruj się"
                containerStyle={{ width: "60%", borderColor: colors.primary, borderWidth: 2, borderRadius: 6, backgroundColor: colors.colorTextWhite }}
                buttonStyle={{ fontSize: 24 }} onClick={()=>{
                    props.navigation.popToTop();
                    props.navigation.navigate("Jadlodajnie");}}/>
    }
    return (
        <KeyboardAvoidingView style={styles.container}
            behavior="height">
            <ImageBackground source={require('../src/images/cutlery.jpg')} style={styles.imageBackground} imageStyle={styles.imageStyle}>
                <Text style={[styles.title, { marginTop: dimensions.defaultHugeMargin }]}>Login</Text>
                <TextInput style={styles.input}
                    returnKeyType="next"
                    autoFocus={firstInputFocus}
                    onFocus={onFirstInputFocus}
                    onSubmitEditing={handleFirstInputSubmit}
                    blurOnSubmit={false}
                />
                <Text style={{ marginBottom: dimensions.defaultHugeMargin, fontSize: 16 }}>Login musi zawierać więcej niż 8 znaków</Text>
                <Text style={styles.title}>Email</Text>
                <TextInput style={styles.input}
                    returnKeyType="next"
                    onFocus={onSecondInputFocus}
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
                <Text style={styles.title}>Hasło</Text>
                <TextInput style={styles.input} secureTextEntry={true} returnKeyType="next"
                onFocus={onThirdInputFocus}
                    ref={(input) => {
                        if (input !== null) {
                            if (thirdInputFocus) {
                                input.focus();
                            }
                        }
                    }}
                />
                <Text style={{ fontSize: 16 }}>Hasło musi zawierać więcej niż 8 znaków</Text>
                <Text style={{ fontSize: 16, marginBottom: 100 }}>Hasło musi zawierać małe i duże litery oraz cyfry</Text>
                {registerButton}
            </ImageBackground>
        </KeyboardAvoidingView>
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
    imageBackground: {
        flex: 1,
        color: colors.backgroundColor,
        alignItems: 'center'
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