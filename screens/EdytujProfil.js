import React, { useState, useEffect, useRef, useCallback } from 'react';
import { View, Text, StyleSheet, ImageBackground, Platform, Picker, AsyncStorage, TextInput, Image, TouchableOpacity, Dimensions, KeyboardAvoidingView, SafeAreaView, ActivityIndicator } from 'react-native';
import { Divider } from 'react-native-elements';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import AndroidButton from '../components/AndroidButton';
import colors from "../src/themes/colors";
import { LinearGradient } from 'expo-linear-gradient';
import dimensions from '../src/themes/dimensions';
import { createStackNavigator } from '@react-navigation/stack';
import ScreenStyle from "../src/themes/screenStyle";
import { Ionicons } from "react-native-vector-icons";
import IosButton from '../components/IosButton';
import GradientDivider from '../components/GradientDivider';
const { width, height } = Dimensions.get("screen");
import { AntDesign } from 'react-native-vector-icons';
import * as ImagePicker from 'expo-image-picker';
import CustomLoadingComponent from '../components/CustomLoadingComponent';
import Validation from '../service/Validation';
import CustomPicker from '../components/CustomPicker';
import PickerItem from '../models/PickerItem';
function EdytujScreen({ navigation, route }) {
    const [isLoading, setIsLoading] = useState(true);
    const [selectedImage, setSelectedImage] = useState("");
    const [loginField, setLoginField] = useState("");
    const [emailField, setEmailField] = useState("");
    const [wojewodztwoField, setWojewodztwoField] = useState('default');
    const [isFieldLoading, setIsFieldLoading] = useState(false);
    const [miastoField, setMiastoField] = useState('default');
    const [wojewodztwoEnabled, setWojewodztwoEnabled] = useState(true);
    const [miastoEnabled, setMiastoEnabled] = useState(true);
    const [saveSettingsButtonEnabled, setSaveSettingsButtonEnabled] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");
    const scrollY = useRef(null);

    const wojewodztwa = [
        new PickerItem('Wybierz województwo...', 'default'),
        new PickerItem('Kujawsko-Pomorskie', 'kuj-pom'),
        new PickerItem('Dolnośląskie', 'dol'),
        new PickerItem('Warmińsko-Mazurskie', 'war-maz'),
        new PickerItem('Wielkopolskie', 'wiel')];
    const miasta = [
        new PickerItem('Wybierz miasto...', 'default'),
        new PickerItem('Olsztyn', 'olsztyn'),
        new PickerItem('Ełk', 'ełk'),
        new PickerItem('Braniewo', 'braniewo'),
        new PickerItem('Szczytno', 'szczytno'),
        new PickerItem('Barczewo', 'braniewo')];

    useEffect(() => {
        fetchStorage();
    }, [isLoading]);
    async function fetchStorage() {
        
        if (isLoading) {
            setTimeout(async function () {
                try {
                    const wojewodztwoValue = await AsyncStorage.getItem("wojewodztwo");
                    const miastoValue = await AsyncStorage.getItem("miasto");
                    const selectedImage = await AsyncStorage.getItem("avatar");
                    const loginValue = await AsyncStorage.getItem("login"); 
                    const emailValue = await AsyncStorage.getItem("email")
                    
                    setWojewodztwoField(wojewodztwoValue);
                    setMiastoField(miastoValue);
                    setSelectedImage(selectedImage);
                    setLoginField(loginValue);
                    setEmailField(emailValue);
                    setIsLoading(false);
                    setWojewodztwoEnabled(true);
                    setMiastoEnabled(true);
                    console.log(selectedImage);
                }
                catch (error) {
                    console.log(error);
                }
            }, 500);
        }

    }


    let image;

    let openImagePickerAsync = async () => {
        let permissionResult = await ImagePicker.requestCameraRollPermissionsAsync();

        if (permissionResult.granted === false) {
            alert("Permission to access camera roll is required!");
            return;
        }

        let pickerResult = await ImagePicker.launchImageLibraryAsync();
        if (pickerResult.cancelled === true) {
            return;
        }
        setSelectedImage(pickerResult.uri);
        setTimeout(() => {
            scrollY.current.scrollToEnd();
        }, 1000);
    }
   
    navigation.setOptions({
        headerLeft: () => (
            <View style={styles.backButtonContainer}>
                <TouchableOpacity
                    onPress={() => {
                        navigation.goBack();
                        navigation.openDrawer();
                    }}>
                    <Ionicons name="ios-arrow-round-back" size={36} color={colors.colorTextWhite}></Ionicons>
                </TouchableOpacity>
            </View>
        )
    });
    navigation.addListener("focus", ()=>{
        setIsLoading(true);   
    })
    const saveSettingHandler = () => {
        setSaveSettingsButtonEnabled(false);
        let message = "";
        setErrorMessage('');
        console.log(loginField);

        message = Validation.loginVerification(loginField) +
            Validation.emailVerification(emailField) +
            Validation.wojewodztwoVerification(wojewodztwoField) +
            Validation.miastoVerification(miastoField);
        if (message.length === 0) {
            setIsFieldLoading(true);
            verifyFields();
        }
        else {
            setErrorMessage(message);
            setSaveSettingsButtonEnabled(true);
        }
    }
    async function verifyFields() {
        setTimeout(async function () {
            setIsFieldLoading(false);
            navigation.goBack();
            navigation.openDrawer();
            setTimeout(function () {
                setSaveSettingsButtonEnabled(true);
            }, 100);
        }, 1000);
    }
    let addImageButton;
    let saveSettingsButton;
    if (Platform.OS === "android") {
        addImageButton = <AndroidButton text="Zmień avatar" 
            enabled={selectedImage === null ? false : true}
        buttonStyle={{ paddingVertical: 9, paddingHorizontal: 25 }}
            onClick={openImagePickerAsync}
        />
        saveSettingsButton = <AndroidButton
            enabled={saveSettingsButtonEnabled}
            text="Zapisz zmiany"
            containerStyle={{ width: "60%" }} buttonStyle={{ paddingVertical: 9 }}
            onClick={() => {
                saveSettingHandler();
            }}
        />
    }
    if (Platform.OS === 'ios') {
        addImageButton = <IosButton text="Zmień Avatar"
            
            containerStyle={{
                borderColor: colors.primary, borderWidth: dimensions.defaultBorderWidth,
                borderRadius: dimensions.defaultBorderRadius, backgroundColor: colors.colorTextWhite
            }} buttonStyle={{ paddingVertical: 9 }} onClick={openImagePickerAsync} />
        saveSettingsButton = <IosButton text="Zapisz zmiany"
            enabled={saveSettingsButtonEnabled}
            containerStyle={{
                width: "60%", borderColor: colors.primary, borderWidth: dimensions.defaultBorderWidth,
                borderRadius: dimensions.defaultBorderRadius, backgroundColor: colors.colorTextWhite
            }} buttonStyle={{ paddingVertical: 9 }} onClick={() => {
                saveSettingHandler();
            }} />
    }
    const onWojewodztwoChangedHandler = (wojewodztwo) => {
        setWojewodztwoField(wojewodztwo);
        if (wojewodztwo !== "default") {
            setIsFieldLoading(true);
            setWojewodztwoEnabled(false);
            setMiastoEnabled(false);
            setMiastoField("default")
            changeCities();
        }
        else {
            setMiastoField("default");
            setMiastoEnabled(false);
        }
    };
    const onMiastoChangedHandler = (miasto) => {
        setMiastoField(miasto);
    }

    async function changeCities() {
        setTimeout(async function () {
            setIsFieldLoading(false);
            setWojewodztwoEnabled(true);
            setMiastoEnabled(true);
        }, 500)
    }

    if (isLoading) {
        content = <CustomLoadingComponent />
    }
    else {
        content =
            <KeyboardAwareScrollView
                style={{ width: '100%' }}
                contentContainerStyle={{ alignItems: 'center' }}
                ref={scrollY}
            >
                <View style={{
                    alignItems: 'center',
                    marginVertical: dimensions.defaultHugeMargin
                }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                        <GradientDivider startColor={colors.accent} endColor={colors.primary}
                            from="left" locationEnd={1} />
                        <Image style={[styles.logo]} source={selectedImage === null ? require("../src/images/image_default.png") : { uri: selectedImage }} cover></Image>
                        <GradientDivider startColor={colors.accent} endColor={colors.primary}
                            from="right" locationEnd={1} />
                    </View>

                    <GradientDivider startColor={colors.primary} endColor={colors.accent}
                        from="up" dividerStyle={{ flex: 0, height: 50, width: 2 }} />
                    {addImageButton}
                </View>
                <Text style={{color:'red', textAlign:'center', fontSize:16, display: emailField === null ? "flex" : "none"}}>Musisz być zalogowany by edytować dane użytkownika</Text>
                <Text style={styles.title}>Login</Text>
                <TextInput style={[styles.input, {opacity: loginField === null ? 0.5 : 1}]}
                    returnKeyType="next"
                    editable={loginField === null ? false : true}
                    value={loginField}
                    onChangeText={(value) => setLoginField(value)}
                    onEndEditing={
                        () =>
                            scrollY.current.scrollToEnd()
                    }
                />
                <Text style={styles.title}>Email</Text>
                <TextInput style={[styles.input, {opacity: emailField=== null ? 0.5 : 1}]}
                    returnKeyType="next"
                    value={emailField}
                    editable={emailField === null ? false : true}
                    onChangeText={(value) => setEmailField(value)}
                    onEndEditing={() =>
                        scrollY.current.scrollToEnd()
                    }
                />
                <Text style={styles.title}>Województwo</Text>
                <CustomPicker
                    containerStyle={{ opacity: wojewodztwoEnabled ? 1 : 0.5 }}
                    enabled={wojewodztwoEnabled}
                    selectedValue={wojewodztwoField}
                    pickerItems={wojewodztwa}
                    onPickerChange={(wojewodztwo) => onWojewodztwoChangedHandler(wojewodztwo)}
                />

                <Text style={styles.title}>Miasto</Text>
                <CustomPicker containerStyle={{ opacity: miastoEnabled ? 1 : 0.5 }}
                    enabled={miastoEnabled}
                    pickerItems={miasta} selectedValue={miastoField}
                    onPickerChange={(miasto) => {
                        onMiastoChangedHandler(miasto);
                        scrollY.current.scrollToEnd();
                    }}
                />
                <Text style={{
                    color: 'red',
                    fontSize: 14,
                    width: "75%",
                    marginTop: 6,
                }} >{errorMessage}</Text>
                <ActivityIndicator size="large" color={colors.primary} animating={isFieldLoading} />
                <View style={{ flexDirection: "row", alignItems: 'center', marginTop: 50, marginBottom: 16 }}>
                    <GradientDivider startColor={colors.primary} endColor={colors.accent}
                        from="left" locationEnd={0.7} />
                    {saveSettingsButton}
                    <GradientDivider startColor={colors.primary} endColor={colors.accent}
                        from="right" locationEnd={0.7} />
                </View>
            </KeyboardAwareScrollView>
    }
    return (
        <SafeAreaView style={{ flex: 1 }}>
            <ImageBackground source={require('../src/images/sniadanko.jpg')} style={styles.imageBackground} imageStyle={styles.imageStyle}>
                {content}
            </ImageBackground>
        </SafeAreaView>
    )
}


const EdytujProfil = props => {

    const Stack = createStackNavigator();
    return (
        <Stack.Navigator initialRouteName="EdytujProfil" screenOptions={ScreenStyle}>
            <Stack.Screen name="EdytujProfil" component={EdytujScreen} options={
                {
                    title: "Edytuj profil"
                }
            }/>

        </Stack.Navigator>
    );
}
const styles = StyleSheet.create({

    container: {
        flex: 1,
    },
    backButtonContainer: {
        left: 0,
        top: 0,
        position: 'absolute',
        height: 56,
        width: 56,
        alignItems: "center",
        justifyContent: 'center',
        padding: 12,
        opacity: 1,
        zIndex: 9999
    },
    imageStyle: {
        opacity: 0.3
    },
    imageBackground: {
        flex: 1,
        color: colors.backgroundColor,
        alignItems: 'center',
        justifyContent: 'flex-end'
    },
    logo: {
        width: 200,
        height: 200,
        borderWidth: dimensions.defaultBorderWidth,
        borderColor: colors.accent,
        borderRadius: 100,
        resizeMode: "cover"
    },
    divider: {
        flex: 1,
        height: dimensions.defaultBorderWidth,
    },
    input: {
        backgroundColor: colors.colorTextWhite,
        width: "75%",
        borderBottomWidth: 2,
        borderBottomColor: colors.accent,
        padding: 6,
        fontSize: 16,
        marginTop: 3
    },
    title: {
        textAlign: 'center',
        color: colors.colorTextDark,
        fontSize: 17,
        fontWeight: 'bold',
        marginTop: 6
    }
});

export default EdytujProfil;
