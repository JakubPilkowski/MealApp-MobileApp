import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ImageBackground, Platform, Picker, AsyncStorage, Image, TouchableNativeFeedback, TouchableOpacity, ActivityIndicator } from 'react-native';
import Colors from '../src/themes/colors';
import dimensions from '../src/themes/dimensions';
import AndroidButton from '../components/AndroidButton';
import IosButton from '../components/IosButton';
import Connection from '../service/Connection';
import { MaterialIcons } from "react-native-vector-icons";
import GradientDivider from '../components/GradientDivider';
import Validation from '../service/Validation';
import PickerItem from '../models/PickerItem';
import CustomPicker from '../components/CustomPicker';
import { CommonActions } from '@react-navigation/native';
import Axios from 'axios';
// import * as CacheManager from 'react-native-http-cache';


const WyborLokalizacji = props => {

    const [wojewodztwo, setWojewodztwo] = useState("default");
    const [miasto, setMiasto] = useState("default");
    const [wojewodztwoEnabled, setWojewodztwoEnabled] = useState(true);
    const [miastoEnabled, setMiastoEnabled] = useState(false);
    const [errorMessage, setErrorMessage] = useState("\n");
    const [isLoading, setIsLoading] = useState(true);
    const [wojewodztwa, setWojewodztwa] = useState([new PickerItem('Wybierz województwo...', 'default', 0, 0, 0)]);
    const [miasta, setMiasta] = useState([new PickerItem('Wybierz miasto...', 'default', 0, 0, 0)]);
    const [latitude, setLatitude] = useState();
    const [longitude, setLongitude] = useState();
    const [zoom, setZoom] = useState();
    const [apiError, setApiError] = useState("");
    const [apiErrorDisplay, setApiErrorDisplay] = useState(false);

    let confirmButton;
    if (Platform.OS === "android" && Platform.Version >= 21) {
        confirmButton =
            <AndroidButton text="Przejdź dalej" containerStyle={{ width: "60%" }} buttonStyle={{ paddingVertical: 9 }}
                onClick={() => confirmButtonHandler()} />
    }
    if (Platform.OS === "ios" || (Platform.OS === "android" && Platform.Version < 21)) {
        confirmButton = <IosButton text="Przejdź dalej" containerStyle={{
            width: "60%", borderColor: colors.primary,
            borderWidth: 2, borderRadius: 6, backgroundColor: colors.colorTextWhite
        }}
            buttonStyle={{ paddingVertical: 9 }}
            onClick={() => confirmButtonHandler()} />
    }
    const onWojewodztwoChangedHandler = (wojewodztwo) => {
        setWojewodztwo(wojewodztwo.value);
        if (wojewodztwo.value !== "default") {
            setIsLoading(true);
            setWojewodztwoEnabled(false);
            setMiastoEnabled(false);
            setMiasto("default");
            getMiastaForWojewodztwo(wojewodztwo.value);
        }
        else {
            setMiasto("default");
            setMiastoEnabled(false);
        }
    };
    const onMiastoChangedHandler = (miasto) => {
        setMiasto(miasto.value);
        setLatitude(miasto.latitude);
        setLongitude(miasto.longitude);
        setZoom(miasto.zoom);
    }

    const confirmButtonHandler = () => {
        let message = "";
        message = message + Validation.wojewodztwoVerification(wojewodztwo) +
            Validation.miastoVerification(miasto);
        if (message.length === 0) {
            saveFields();
        }
        else {
            setErrorMessage(message);
        }
    }

    async function saveFields() {
        try {
            await AsyncStorage.setItem('firstUse', 'false');
            await AsyncStorage.setItem('wojewodztwo', wojewodztwo);
            await AsyncStorage.setItem('miasto', miasto);
            await AsyncStorage.setItem('latitude', latitude.toString());
            await AsyncStorage.setItem('longitude', longitude.toString());
            await AsyncStorage.setItem('zoom', zoom.toString());
            props.navigation.dispatch({
                ...CommonActions.reset({
                    index: 1,
                    routes: [
                        { name: "Home" },
                    ]
                }),
            });
        }
        catch (error) {
            console.log(error);
        }
    }

    async function getWojewodztwa() {
        if (isLoading && wojewodztwa.length == 1) {
            const res = Connection.getWojewodztwa();
            res
                .then(res => {
                    res.map((item) => {
                        setWojewodztwa(wojewodztwa => [...wojewodztwa, new PickerItem(item.name, item.slug, 0, 0, 0)]);
                    });
                    setIsLoading(false);
                })
                .catch(err => {
                    setIsLoading(false);
                    setApiError(err);
                    setApiErrorDisplay(true);
                });
        }
    }

    async function getMiastaForWojewodztwo(wojewodztwo) {
        if (isLoading && wojewodztwa.length > 1) {
            const res = Connection.getMiastaForWojewodztwo(wojewodztwo);         
            res
                .then(res => {
                    setMiasta([new PickerItem("Wybierz miasto...", "default", 0, 0, 0)]);
                    res.map((item) => {
                        setMiasta(miasta => [...miasta, new PickerItem(item.name, item.slug, item.latitude, item.longitude, item.zoom)]);
                    });
                    setIsLoading(false);
                    setWojewodztwoEnabled(true);
                    setMiastoEnabled(true);
                })
                .catch(err => {
                    setMiasta([new PickerItem("Wybierz miasto...", "default", 0, 0, 0)]);
                    setWojewodztwoEnabled(true);
                    setMiastoEnabled(true);
                    setIsLoading(false);
                    setApiError(err);
                    setApiErrorDisplay(true);
                });
        }
    }
    useEffect(() => {
        if (isLoading) {
            setApiErrorDisplay(false);
            setApiError("");
            if (wojewodztwa.length <= 1) {
                getWojewodztwa();
            }
            if (wojewodztwa.length > 1) {
                getMiastaForWojewodztwo(wojewodztwo);
            }
        }
    }, [isLoading])
    return (
        <ImageBackground source={require('../src/images/lokalizacja.jpg')} imageStyle={{ opacity: 0.3 }} style={{ flex: 1, backgroundColor: Colors.backgroundColor, alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ textAlign: 'center', fontSize: 22, marginBottom: 15, color: Colors.primary }}>Zanim zaczniemy... {'\n'} wybierz lokalizacje domyślną</Text>
            <Image source={require("../src/images/place_v2.png")} style={{ width: 170, height: 170, marginBottom: 15 }} />
            <Text style={{ width: "70%", alignSelf: 'center', fontSize: 16, color: Colors.colorTextDark, marginTop: dimensions.defaultHugeMargin, marginBottom: 3 }}>Województwo</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <GradientDivider startColor={Colors.accent} endColor={Colors.primary}
                    from="left" locationEnd={1} />
                <CustomPicker
                    containerStyle={{ opacity: wojewodztwoEnabled ? 1 : 0.5 }}
                    pickerItems={wojewodztwa} selectedValue={wojewodztwo}
                    enabled={wojewodztwoEnabled}
                    onPickerChange={(wojewodztwo) => onWojewodztwoChangedHandler(wojewodztwo)}
                />
                <GradientDivider startColor={Colors.accent} endColor={Colors.primary}
                    from="right" locationEnd={1} />
            </View>
            <Text style={{ width: "70%", alignSelf: 'center', fontSize: 16, color: Colors.colorTextDark, marginTop: dimensions.defaultHugeMargin, marginBottom: 3 }}>Miasto</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <GradientDivider startColor={Colors.accent} endColor={Colors.primary}
                    from="left" locationEnd={1} />
                <CustomPicker containerStyle={{ opacity: miastoEnabled ? 1 : 0.5 }}
                    enabled={miastoEnabled}
                    pickerItems={miasta} selectedValue={miasto}
                    onPickerChange={(miasto) => onMiastoChangedHandler(miasto)}
                />
                <GradientDivider startColor={Colors.accent} endColor={Colors.primary}
                    from="right" locationEnd={1} />
            </View>
            <Text style={{ width: "70%", color: 'red', fontSize: 14, opacity: errorMessage.length > 0 ? 1 : 0 }}>{errorMessage}</Text>
            <View style={{ alignItems: 'center' }}>
                <ActivityIndicator size="large" color={Colors.primary} animating={isLoading} />
                <View style={{ position: 'absolute' }}>
                    <View style={{ display: apiErrorDisplay ? 'flex' : 'none', alignItems: 'center' }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', }}>
                            <MaterialIcons name="error" color={"red"} size={36} />
                            <Text style={{ fontSize: 16, color: 'red', marginLeft: 6, maxWidth: 275 }}>{apiError}</Text>
                        </View>
                        <IosButton text="Ponów" onClick={() => {
                            setIsLoading(true);
                        }} />
                    </View>
                </View>
            </View>
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

export default WyborLokalizacji;
