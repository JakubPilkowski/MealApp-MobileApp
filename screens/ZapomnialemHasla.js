import React, { useState } from 'react';
import { Text, View, StyleSheet, ImageBackground, TextInput, Platform, ActivityIndicator, TouchableOpacity } from 'react-native';
import colors from '../src/themes/colors';
import dimensions from '../src/themes/dimensions';
import AndroidButton from '../components/AndroidButton';
import IosButton from '../components/IosButton';
import Validation from '../service/Validation';
import { Ionicons } from 'react-native-vector-icons';

const ZapomnialemHasla = props => {

    const [emailField, setEmailField] = useState('');
    const [emailErrorMessage, setEmailErrorMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [forgetPasswordError, setForgetPasswordError] = useState('');
    const [buttonEnabled, setButtonEnabled] = useState(true);
    let sendNewPasswordButton;

    if (Platform.OS === "android" && Platform.Version >= 21) {
        sendNewPasswordButton =
            <AndroidButton text="Przejdź dalej" onClick={() => sendNewPasswordHandler()}
                enabled={buttonEnabled}    
            containerStyle={{ width: '60%' }}
                buttonStyle={{ paddingVertical: 9 }}
            />
    }
    if (Platform.OS === "ios" || (Platform.OS==="android" && Platform.Version < 21)) {
        sendNewPasswordButton =
            <IosButton tex="Przejdź dalej" onClick={
                () => sendNewPasswordHandler()}
                enabled={buttonEnabled}
                containerStyle={{
                    width: "60%", borderColor: colors.primary, borderWidth: 2,
                    borderRadius: 6, backgroundColor: colors.colorTextWhite
                }}
            />
    }

    const sendNewPasswordHandler = () => {
        setButtonEnabled(false);
        let errorMessage = Validation.emailVerification(emailField);
        if (errorMessage.length === 0) {
            setIsLoading(true);
            verifyEmail();
        }
        else{
            setButtonEnabled(true);
        }
        setEmailErrorMessage(errorMessage);
    }
    async function verifyEmail() {
        setTimeout(async function () {
            let errors = "";
            if (errors.length === 0) {
                setIsLoading(false);
                props.navigation.popToTop();
                props.navigation.navigate("Jadlodajnie");
            }
            setForgetPasswordError(errors);
        }, 1000);
    }
    return (
        <View style={styles.container}>
            <View style={{ height: 56, backgroundColor: colors.primary, width: '100%', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', }}>
                <View style={[styles.backButtonContainer, { left: 0 }]}>
                    <TouchableOpacity
                        onPress={() => {
                            props.navigation.goBack();
                        }}>
                        <Ionicons name="ios-arrow-round-back" size={36} color={colors.colorTextWhite}></Ionicons>
                    </TouchableOpacity>
                </View>
                <Text style={{ color: colors.colorTextWhite, fontSize: 20, fontWeight: 'bold' }}>Zapomniałem Hasła</Text>
            </View>
            <ImageBackground source={require('../src/images/cutlery.jpg')} style={styles.imageBackground} imageStyle={styles.imageStyle}>
                <Text style={[styles.title, { marginTop: dimensions.defaultHugeMargin }]}>Email</Text>
                <TextInput style={styles.input}
                    returnKeyType="next"
                    keyboardType="email-address"
                    onChangeText={(text) => setEmailField(text)}
                />
                <Text style={{ width: "75%", color: 'red', fontSize: 14 }}>{emailErrorMessage}</Text>
                <Text style={{ fontSize: 16, marginBottom: 50, textAlign: 'center' }}>Podaj email na który wyślemy wygenerowane hasło</Text>
                {sendNewPasswordButton}
                <Text style={{ width: "75%", color: 'red', fontSize: 14 }}>{forgetPasswordError}</Text>
                <ActivityIndicator size="large" color={colors.primary} animating={isLoading} />
            </ImageBackground>
        </View>
    );
}


const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    imageStyle: {
        opacity: 0.3
    },
    imageBackground: {
        flex: 1,
        color: colors.backgroundColor,
        alignItems: 'center',
        justifyContent: 'center'
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

export default ZapomnialemHasla;