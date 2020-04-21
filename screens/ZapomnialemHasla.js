import React, {useState} from 'react';
import { Text, View, StyleSheet, ImageBackground, TextInput, Platform, ActivityIndicator } from 'react-native';
import colors from '../src/themes/colors';
import dimensions from '../src/themes/dimensions';
import AndroidButton from '../components/AndroidButton';
import IosButton from '../components/IosButton';
import Validation from '../service/Validation';
import { Colors } from 'react-native/Libraries/NewAppScreen';
const ZapomnialemHasla = props => {

    const [emailField, setEmailField] = useState('');
    const [emailErrorMessage, setEmailErrorMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [forgetPasswordError, setForgetPasswordError] = useState('');
    let sendNewPasswordButton;

    if (Platform.OS === "android") {
        sendNewPasswordButton =
            <AndroidButton text="Przejdź dalej" onClick={() => sendNewPasswordHandler()}
                containerStyle={{ width: '60%' }}
                buttonStyle={{ paddingVertical: 9 }}
            />
    }
    if (Platform.OS === "ios") {
        sendNewPasswordButton =
            <IosButton tex="Przejdź dalej" onClick={
                () => sendNewPasswordHandler()}
                containerStyle={{
                    width: "60%", borderColor: colors.primary, borderWidth: 2,
                    borderRadius: 6, backgroundColor: colors.colorTextWhite
                }}
            />
    }

    const sendNewPasswordHandler = () =>{
        let errorMessage = Validation.emailVerification(emailField);

        if(errorMessage.length===0){
            setIsLoading(true);
            verifyEmail();
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
        },1000);
    }
    return (
        <View style={styles.container}>
            <ImageBackground source={require('../src/images/cutlery.jpg')} style={styles.imageBackground} imageStyle={styles.imageStyle}>
                <Text style={[styles.title, { marginTop: dimensions.defaultHugeMargin }]}>Email</Text>
                <TextInput style={styles.input}
                    returnKeyType="next"
                    keyboardType="email-address"
                    onChangeText={(text) => setEmailField(text)}
                />
                <Text style={{width:"75%", color:'red', fontSize:14}}>{emailErrorMessage}</Text>
                <Text style={{fontSize:16, marginBottom:50, textAlign:'center'}}>Podaj email na który wyślemy wygenerowane hasło</Text>
                {sendNewPasswordButton}
                <Text style={{width:"75%", color:'red', fontSize:14}}>{forgetPasswordError}</Text>
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