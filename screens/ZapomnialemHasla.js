import React from 'react';
import { Text, View, StyleSheet, ImageBackground, TextInput, Platform } from 'react-native';
import colors from '../src/themes/colors';
import dimensions from '../src/themes/dimensions';
import AndroidButton from '../components/AndroidButton';
import IosButton from '../components/IosButton';
const ZapomnialemHasla = props => {

    let sendNewPasswordButton;

    if (Platform.OS === "android") {
        sendNewPasswordButton =
            <AndroidButton text="Przejdź dalej" onClick={() => {
                props.navigation.popToTop();
                props.navigation.navigate("Jadlodajnie");
            }}
                containerStyle={{ width: '60%' }}
                buttonStyle={{ paddingVertical: 9 }}
            />
    }
    if (Platform.OS === "ios") {
        sendNewPasswordButton =
            <IosButton tex="Przejdź dalej" onClick={
                () => {
                    props.navigation.popToTop();
                    props.navigation.navigate("Jadlodajnie");
                }}
                containerStyle={{
                    width: "60%", borderColor: colors.primary, borderWidth: 2,
                    borderRadius: 6, backgroundColor: colors.colorTextWhite
                }}
            />
    }
    return (
        <View style={styles.container}>
            <ImageBackground source={require('../src/images/cutlery.jpg')} style={styles.imageBackground} imageStyle={styles.imageStyle}>
                <Text style={[styles.title, { marginTop: dimensions.defaultHugeMargin }]}>Email</Text>
                <TextInput style={styles.input}
                    returnKeyType="next"
                />
                <Text style={{fontSize:16, marginBottom:50, textAlign:'center'}}>Podaj email na który wyślemy wygenerowane hasło</Text>
                {sendNewPasswordButton}
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