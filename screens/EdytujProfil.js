import React from 'react';
import { View, Text, StyleSheet, ImageBackground, Platform, TextInput, Image, TouchableOpacity, Dimensions } from 'react-native';
import { Divider } from 'react-native-elements';
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
function EdytujScreen({ navigation }) {



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
        addImageButton = <AndroidButton text="Zmień avatar" buttonStyle={{paddingVertical: 9, paddingHorizontal: 25 }} />
        saveSettingsButton = <AndroidButton text="Zapisz zmiany"
            containerStyle={{ width: "60%" }} buttonStyle={{ paddingVertical: 9}} />
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
        <View style={styles.container}>
            <ImageBackground source={require('../src/images/sniadanko.jpg')} style={styles.imageBackground} imageStyle={styles.imageStyle}>
                <View style={{
                    flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginHorizontal: dimensions.defaultHugeMargin
                    , marginVertical: dimensions.defaultMarginBetweenItems
                }}>
                    <Image style={styles.logo}  ></Image>
                    <GradientDivider startColor={colors.primary} endColor={colors.accent}
                        from="left" />
                    {addImageButton}
                </View>
                <Text style={styles.title}>Login</Text>
                <TextInput style={styles.input}
                    returnKeyType="next" />
                <Text style={styles.title}>Email</Text>
                <TextInput style={styles.input}
                    returnKeyType="next" />
                <View style={{ flexDirection: "row", alignItems: 'center', marginTop: 100 }}>   
                    <GradientDivider startColor={colors.primary} endColor={colors.accent}
                        from="left" locationEnd={0.7}/>
                    {saveSettingsButton}
                    <GradientDivider startColor={colors.primary} endColor={colors.accent}
                        from="right" locationEnd={0.7}/>
                </View>

            </ImageBackground>
        </View>
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
        minHeight: height
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
    imageStyle: {
        opacity: 0.3
    },
    imageBackground: {
        flex: 1,
        color: colors.backgroundColor,
        alignItems: 'center',
    },
    logo: {
        width: 100,
        height: 100,
        borderWidth: dimensions.defaultBorderWidth,
        borderColor: colors.accent,
        borderRadius: dimensions.defaultHugeBorderRadius
    },
    divider: {
        flex: 1,
        // backgroundColor: colors.accent,
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
