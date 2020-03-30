import React, { useState } from 'react';
import { View, Text, StyleSheet, ImageBackground, Platform, TextInput, Image, TouchableOpacity, Dimensions, KeyboardAvoidingView, SafeAreaView } from 'react-native';
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
import * as ImagePicker from 'expo-image-picker';
function EdytujScreen({ navigation }) {
    const [selectedImage, setSelectedImage] = useState(null);
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
    }
    if (selectedImage === null) {
        image = <Image style={[styles.logo, { backgroundColor: colors.backgroundColor, }]}></Image>
    }
    else {
        image = <Image style={[styles.logo]} source={{ uri: selectedImage }} cover></Image>
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



    let addImageButton;
    let saveSettingsButton;
    if (Platform.OS === "android") {
        addImageButton = <AndroidButton text="Zmień avatar" buttonStyle={{ paddingVertical: 9, paddingHorizontal: 25 }}
            onClick={openImagePickerAsync}
        />
        saveSettingsButton = <AndroidButton text="Zapisz zmiany"
            containerStyle={{ width: "60%" }} buttonStyle={{ paddingVertical: 9 }} />
    }
    if (Platform.OS === 'ios') {
        addImageButton = <IosButton text="Zmień Avatar"
            containerStyle={{
                borderColor: colors.primary, borderWidth: dimensions.defaultBorderWidth,
                borderRadius: dimensions.defaultBorderRadius, backgroundColor: colors.colorTextWhite
            }} buttonStyle={{ paddingVertical: 9 }} />
        saveSettingsButton = <IosButton text="Zapisz zmiany"
            containerStyle={{
                width: "60%", borderColor: colors.primary, borderWidth: dimensions.defaultBorderWidth,
                borderRadius: dimensions.defaultBorderRadius, backgroundColor: colors.colorTextWhite
            }} buttonStyle={{ paddingVertical: 9 }} />
    }
    return (
        <SafeAreaView style={{ flex: 1 }}>
            <ImageBackground source={require('../src/images/sniadanko.jpg')} style={styles.imageBackground} imageStyle={styles.imageStyle}>
                <KeyboardAwareScrollView
                style={{width:'100%'}}
                contentContainerStyle={{   alignItems:'center'}}
                >
                    <View style={{
                        alignItems: 'center',
                        marginVertical: dimensions.defaultHugeMargin
                    }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems:'center' }}>
                        <GradientDivider startColor={colors.accent} endColor={colors.primary}
                            from="left" locationEnd={1} />
                               {image}
                        <GradientDivider startColor={colors.accent} endColor={colors.primary}
                            from="right" locationEnd={1} />
                    </View> 
                        
                    <GradientDivider startColor={colors.primary} endColor={colors.accent}
                        from="up" dividerStyle={{ flex: 0, height: 50, width: 2 }} />
                    {addImageButton}
                    </View>
                    <Text style={styles.title}>Login</Text>
                    <TextInput style={styles.input}
                        returnKeyType="next" />
                    <Text style={styles.title}>Email</Text>
                    <TextInput style={styles.input}
                        returnKeyType="next" />
                    <View style={{ flexDirection: "row", alignItems: 'center', marginTop:50}}>
                        <GradientDivider startColor={colors.primary} endColor={colors.accent}
                            from="left" locationEnd={0.7} />
                        {saveSettingsButton}
                        <GradientDivider startColor={colors.primary} endColor={colors.accent}
                            from="right" locationEnd={0.7} />
                    </View>
                </KeyboardAwareScrollView>
            </ImageBackground>
        </SafeAreaView>
    );

}


const EdytujProfil = props => {




    const Stack = createStackNavigator();
    return (
        <Stack.Navigator initialRouteName="EdytujProfil" screenOptions={ScreenStyle}>
            <Stack.Screen name="EdytujProfil" component={EdytujScreen} options={
                {
                    title: "Edytuj profil"
                }
            } />

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
        marginBottom: 20
    },
    title: {
        textAlign: 'center',
        color: colors.colorTextDark,
        fontSize: 17,
        fontWeight: 'bold'
    }
});

export default EdytujProfil;
