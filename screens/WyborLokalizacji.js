import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ImageBackground, Platform, Picker, Image, TouchableNativeFeedback, TouchableOpacity, ActivityIndicator } from 'react-native';
import Colors from '../src/themes/colors';
import dimensions from '../src/themes/dimensions';
import AndroidButton from '../components/AndroidButton';
import IosButton from '../components/IosButton';
import { AntDesign } from 'react-native-vector-icons';
import GradientDivider from '../components/GradientDivider';
import Validation from '../service/Validation';



const WyborLokalizacji = props => {

    const [wojewodztwo, setWojewodztwo] = useState("default");
    const [miasto, setMiasto] = useState("default");
    const [miastoEnabled, setMiastoEnabled] = useState(false);
    const [errorMessage, setErrorMessage] = useState("\n");
    const [isLoading, setIsLoading] = useState(false);
    let confirmButton;
    if (Platform.OS === "android") {
        confirmButton =
            <AndroidButton text="Przejdź dalej" containerStyle={{ width: "70%" }} buttonStyle={{ paddingVertical: 9 }}
                onClick={() => confirmButtonHandler()} />
    }
    if (Platform.OS === "ios") {
        confirmButton = <IosButton text="Przejdź dalej" containerStyle={{
            width: "70%", borderColor: colors.primary,
            borderWidth: 2, borderRadius: 6, backgroundColor: colors.colorTextWhite
        }}
            buttonStyle={{ paddingVertical: 9 }}
            onClick={() => confirmButtonHandler()} />
    }
    const onWojewodztwoChangedHandler = (wojewodztwo) => {
        setWojewodztwo(wojewodztwo);
        if (wojewodztwo !== "default"){
            setIsLoading(true);
            setMiastoEnabled(false);
            changeCities();
        }
        else {
            setMiasto("default");
            setMiastoEnabled(false);
        }
    };
    const onMiastoChangedHandler = (miasto) => {
        setMiasto(miasto);
    }
    async function changeCities(){
        setTimeout(async function(){
            setIsLoading(false);
            setMiastoEnabled(true);
        },500)
    }
    const confirmButtonHandler = () => {
        let message ="";
        message = message + Validation.wojewodztwoVerification(wojewodztwo) +
        Validation.miastoVerification(miasto);
        if(message.length===0){
            props.onConfirm(wojewodztwo, miasto);
        }
        else{
            setErrorMessage(message);
        }
    }

    return (
        <ImageBackground source={require('../src/images/lokalizacja.jpg')} imageStyle={{ opacity: 0.3 }} style={{ flex: 1, backgroundColor: Colors.backgroundColor, alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ textAlign: 'center', fontSize: 22, marginBottom: 15, color: Colors.primary }}>Zanim zaczniemy... {'\n'} wybierz lokalizacje domyślną</Text>
            <Image source={require("../src/images/place_v2.png")} style={{ width: 170, height: 170, marginBottom: 15 }} />
            <Text style={{ width: "70%", alignSelf: 'center', fontSize: 16, color: Colors.colorTextDark, marginTop: dimensions.defaultHugeMargin, marginBottom: 3 }}>Województwo</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <GradientDivider startColor={Colors.accent} endColor={Colors.primary}
                    from="left" locationEnd={1} />
                <View style={{ width: "70%", borderWidth: 2, backgroundColor: Colors.colorTextWhite, borderColor: Colors.accent, alignItems: 'center', justifyContent: 'center', borderRadius: 6 }}>
                    <Picker
                        mode="dialog"
                        selectedValue={wojewodztwo}
                        style={{ height: 45, width:"100%", backgroundColor: 'transparent' }}
                        onValueChange={(itemValue, itemIndex) => onWojewodztwoChangedHandler(itemValue)}>
                        <Picker.Item label="Wybierz województwo..." value="default" color={wojewodztwo === "default" ? Colors.primary : Colors.colorTextDark} />
                        <Picker.Item label="Mazowieckie" value="mazowieckie" color={wojewodztwo === "mazowieckie" ? Colors.primary : Colors.colorTextDark} />
                        <Picker.Item label="Kujawsko-Pomorskie" value="kujawsko-pomorskie" color={wojewodztwo === "kujawsko-pomorskie" ? Colors.primary : Colors.colorTextDark} />
                        <Picker.Item label="Warmińsko-Mazurskie" value="warmińsko-mazurskie" color={wojewodztwo === "warmińsko-mazurskie" ? Colors.primary : Colors.colorTextDark} />
                    </Picker>
                    <View style={{ position: 'absolute', alignSelf: 'flex-end', right: 10 }}>
                        <AntDesign name="downcircle" color={Colors.accent} size={24} />
                    </View>
                </View>
                <GradientDivider startColor={Colors.accent} endColor={Colors.primary}
                    from="right" locationEnd={1} />
            </View>
            <Text style={{ width: "70%", alignSelf: 'center', fontSize: 16, color: Colors.colorTextDark, marginTop: dimensions.defaultHugeMargin, marginBottom: 3 }}>Miasto</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <GradientDivider startColor={Colors.accent} endColor={Colors.primary}
                    from="left" locationEnd={1} />
                <View style={{ width: "70%", borderWidth: 2, opacity: miastoEnabled ? 1 : 0.5, backgroundColor: Colors.colorTextWhite, borderColor: Colors.accent, alignItems: 'center', justifyContent: 'center', borderRadius: 6 }}>
                    <Picker
                        enabled={miastoEnabled}
                        selectedValue={miasto}
                        style={{ height: 45, width:"100%", backgroundColor:'transparent'}}
                        onValueChange={(itemValue, itemIndex) => onMiastoChangedHandler(itemValue)}>
                        <Picker.Item label="Wybierz miasto..." value="default" color={miasto === "default" ? Colors.primary : Colors.colorTextDark} />
                        <Picker.Item label="Olsztyn" value="Olsztyn" color={miasto === "Olsztyn" ? Colors.primary : Colors.colorTextDark} />
                        <Picker.Item label="Ełk" value="Elk" color={miasto === "Elk" ? Colors.primary : Colors.colorTextDark} />
                        <Picker.Item label="Braniewo" value="Braniewo" color={miasto === "Braniewo" ? Colors.primary : Colors.colorTextDark} />
                        <Picker.Item label="Szczytno" value="Szczytno" color={miasto === "Szczytno" ? Colors.primary : Colors.colorTextDark} />
                    </Picker>
                    <View style={{ position: 'absolute', alignSelf: 'flex-end', right: 10 }}>
                        <AntDesign name="downcircle" color={Colors.accent} size={24} />
                    </View>
                </View>
                <GradientDivider startColor={Colors.accent} endColor={Colors.primary}
                    from="right" locationEnd={1} />
            </View>
            <Text style={{ width: "70%", color: 'red', fontSize: 14, opacity: errorMessage.length > 0 ? 1 : 0 }}>{errorMessage}</Text>
            <ActivityIndicator size="large" color={Colors.primary} animating={isLoading} />
            <View style={{ flexDirection: 'row', marginTop: 50, alignItems: 'center' }}>
                <GradientDivider startColor={Colors.primary} endColor={Colors.accent}
                    from="left" locationEnd={1} />
                {confirmButton}
                <GradientDivider startColor={Colors.primary} endColor={Colors.accent}
                    from="right" locationEnd={1} />
            </View>
        </ImageBackground>
    );

}

const styles = StyleSheet.create({

    container: {
        flex: 1
    }
});



export default WyborLokalizacji;
