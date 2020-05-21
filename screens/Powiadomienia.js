import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button, ImageBackground, Image, ToastAndroid, FlatList, Platform, TouchableOpacity, TouchableNativeFeedback, AsyncStorage, Dimensions } from 'react-native';
import JadlodajnieWiecej from './JadlodajnieWiecej';
import { createStackNavigator } from '@react-navigation/stack';
import Colors from "../src/themes/colors";
import Strings from "../src/themes/strings";
import IconWithAction from "../components/IconWithAction";
import screenStyle from '../src/themes/screenStyle';
import Card from '../components/Card';
import Switch from 'react-native-customisable-switch';
import dimensions from '../src/themes/dimensions';
import CustomAlert from '../components/CustomAlert';
import SimpleAlert from '../components/SimpleAlert';
import AndroidButton from '../components/AndroidButton';
import strings from '../src/themes/strings';
import { Feather } from 'react-native-vector-icons';
import PlaceHolder from '../components/PlaceHolder';
import CustomLoadingComponent from '../components/CustomLoadingComponent';


const { width, height } = Dimensions.get("screen");
let id = 0;

function PowiadomieniaScreen({ navigation }) {

    const [powiadomienia, setPowiadomienia] = useState([]);
    const [addAlertVisibility, setAddAlertVisibility] = useState(false);
    const [removeAlertVisibility, setRemoveAlertVisibility] = useState(false);
    const [currentItemId, setCurrentItemId] = useState(0);
    const [buttonOpacity, setButtonOpacity] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    async function fetchData() {
        if (isLoading) {
            setTimeout(async function () {
                const authToken = await AsyncStorage.getItem("authToken");
                setIsLoggedIn(authToken !== null ? true : false);
                setButtonOpacity(authToken !== null ? 1 : 0);
                setIsLoading(false);
         
            }, 500);
        }
    }

    let content;
    if (isLoading) {
        content = <CustomLoadingComponent />
    }
    else {
        if (isLoggedIn) {
            if (powiadomienia.length > 0) {
                content = <FlatList
                    containerStyle={{ flex: 1 }}
                    data={powiadomienia}

                    renderItem={({ item, index }) =>
                        <Card
                            pressEnabled={true}
                            onLongCardPress={() => {
                                setCurrentItemId(item.id);
                                setRemoveAlertVisibility(true);
                            }}
                            containerStyle={{ marginBottom: index + 1 === powiadomienia.length ? 72 : 0 }}
                            cardStyle={{ marginTop: dimensions.defaultMargin }}
                            content={
                                <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: "center" }}>
                                    <Text style={{ textAlign: 'left', flex: 1 }}>{item.nazwa}</Text>
                                    <Switcher />
                                </View>
                            }
                        />}
                    keyExtractor={item => item.id.toString()}
                />
            }
            else {
                content =
                    <PlaceHolder text={"Coś tu pusto \n dodaj powiadomienie"} src={require("../src/images/dzwonek_v4.png")} />
            }
        }
        else {
            content = <PlaceHolder text={"Musisz być zalogowany by dodać powiadomienie"} src={require("../src/images/user_m.png")} />
        }
    }

    navigation.addListener("focus", () => {
        setIsLoading(true);
    })

    useEffect(() => {
        fetchData();
    }, [powiadomienia.length, isLoading]);

    let addPowiadomienieButton;
    if (Platform.OS === "ios" || (Platform.OS === "android" && Platform.Version < 21)) {
        navigation.setOptions({
            headerRight: () => (
                <IconWithAction src={require('../src/images/dodaj_bialy_m.png')} onClick={() => {
                    setAddAlertVisibility(true);
                }} imageStyle={{ width: 24, height: 24 }} />
            )
        })
        addPowiadomienieButton = null;
    }
    if (Platform.OS === "android" && Platform.Version >= 21) {
        addPowiadomienieButton =
            <AndroidButton onClick={() => {
                if (powiadomienia.length < 10) {
                    setButtonOpacity(0);
                    setAddAlertVisibility(true);
                }
                else {
                    ToastAndroid.show("Nie można dodać większej ilości powiadomień!!!", ToastAndroid.SHORT);
                }
            }} text={strings.add_alert} enabled={isLoggedIn} buttonStyle={styles.buttonStyle} containerStyle={[styles.androidButtonView, { opacity: buttonOpacity }]} />
    }
    const AddPowiadomienieHandler = powiadomienie => {
        setButtonOpacity(1);
        id = id + 1;
        setPowiadomienia(currentPowiadomienia => [...currentPowiadomienia, { id: id, nazwa: powiadomienie }]);
        setAddAlertVisibility(false);
    }
    const RemovePowiadomieniaHandler = () => {
        setPowiadomienia(currentPowiadomienia => {
            return currentPowiadomienia.filter((powiadomienie) => powiadomienie.id !== currentItemId);
        });
        setRemoveAlertVisibility(false);
    }

    const CancelAlert = () => {
        setButtonOpacity(1);
        setAddAlertVisibility(false);
    }

    const HomeButtonHandler = () => {
        navigation.openDrawer();
    }
    navigation.setOptions({
        headerLeft: () => (
            <IconWithAction content={<Feather name="menu" size={26} color={Colors.colorTextWhite} />} onClick={HomeButtonHandler} />
        )
    });
    
    return (
        <View style={styles.container}>
            <ImageBackground source={require('../src/images/sosy.jpg')} style={{ flex: 1, backgroundColor: Colors.backgroundColor }} imageStyle={{ opacity: 0.3 }}>
                {content}
                <CustomAlert visibility={addAlertVisibility} errorMessage={"Pole nie może być puste!"} onPositiveClick={AddPowiadomienieHandler} onCancel={CancelAlert} />
                <SimpleAlert visibility={removeAlertVisibility} onPositiveClick={RemovePowiadomieniaHandler}
                    onNegativeClick={() => { setRemoveAlertVisibility(false); }}
                    title="Usuwanie" message="Czy na pewno chcesz usunąć powiadomienie?" />
                {addPowiadomienieButton}
            </ImageBackground>
        </View>
    );
}

function Switcher() {
    const [enabled, setEnabled] = useState(false);
    return (
        <Switch value={enabled}
            activeBackgroundColor={Colors.primary}
            inactiveBackgroundColor={Colors.colorTextWhite}
            activeButtonBackgroundColor={Colors.primary}
            inactiveButtonBackgroundColor={Colors.primary}
            switchWidth={60}
            switchHeight={30}
            switchBorderRadius={12}
            switchBorderWidth={1}
            switchBorderColor={Colors.primary}
            buttonWidth={24}
            buttonHeight={24}
            buttonBorderRadius={12}
            buttonBorderWidth={4}
            buttonBorderColor={Colors.accent}
            padding={true}
            animationTime={150}
            onChangeValue={() => {
                setEnabled(!enabled);
            }} />
    );
}

const Powiadomienia = props => {

    const Stack = createStackNavigator();
    return (
        <Stack.Navigator initialRouteName="Powiadomienia" screenOptions={screenStyle}>
            <Stack.Screen name="Powiadomienia" component={PowiadomieniaScreen} options={{
                headerTitle: Strings.powiadomienia,
            }} />
            <Stack.Screen name="JadlodajnieWiecej" component={JadlodajnieWiecej} />
        </Stack.Navigator>
    );
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    buttonStyle: {
        paddingVertical: 9,
        paddingHorizontal: 50,
    },
    androidButtonView: {
        bottom: 16,
        position: 'absolute',
        alignSelf: 'center',

    },
});


export default Powiadomienia;
