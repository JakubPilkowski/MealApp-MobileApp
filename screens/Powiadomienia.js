import React, { useState } from 'react';
import { View, Text, StyleSheet, Button, ImageBackground, FlatList, Platform, TouchableOpacity, TouchableNativeFeedback } from 'react-native';
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
let id = 0;

function PowiadomieniaScreen({ navigation }) {

    const [powiadomienia, setPowiadomienia] = useState([]);
    const [addAlertVisibility, setAddAlertVisibility] = useState(false);
    const [removeAlertVisibility, setRemoveAlertVisibility] = useState(false);
    const [currentItemId, setCurrentItemId] = useState(0);



    let addPowiadomienieButton;
    if (Platform.OS === 'ios') {
        navigation.setOptions({
            headerRight: () => (
                <IconWithAction src={require('../src/images/dodaj_bialy_m.png')} onClick={() => {
                    setAddAlertVisibility(true);
                }} imageStyle={{ width: 24, height: 24 }} />
            )
        })
        addPowiadomienieButton = null;
    }
    if (Platform.OS === "android") {
        addPowiadomienieButton =
            <AndroidButton onClick={() => { setAddAlertVisibility(true); }} text={strings.add_alert} buttonStyle={styles.buttonStyle} containerStyle={styles.androidButtonView} />
    }
    const AddPowiadomienieHandler = powiadomienie => {
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
        setAddAlertVisibility(false);
    }

    const HomeButtonHandler = () => {
        navigation.openDrawer();
    }
    navigation.setOptions({
        headerLeft: () => (
            <IconWithAction src={require('../src/images/burger_bialy_m.png')} onClick={HomeButtonHandler} />
        )
    });
    return (
        <View style={styles.container}>
            <ImageBackground source={require('../src/images/sosy.jpg')} style={{ flex: 1, backgroundColor: Colors.backgroundColor }} imageStyle={{ opacity: 0.3 }}>
                <FlatList
                    data={powiadomienia}
                    renderItem={itemData =>
                        <Card
                            pressEnabled={true}
                            onLongCardPress={() => {
                                setCurrentItemId(itemData.item.id);
                                setRemoveAlertVisibility(true);
                            }}
                            cardStyle={{ marginTop: dimensions.defaultMargin }}
                            content={
                                <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: "center" }}>
                                    <Text style={{ textAlign: 'left', flex: 1 }}>{itemData.item.nazwa}</Text>
                                    <Switcher />
                                </View>
                            }
                        />} />
                <CustomAlert visibility={addAlertVisibility} onPositiveClick={AddPowiadomienieHandler} onCancel={CancelAlert} />
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
        position: "absolute",
        bottom: 16,
        alignSelf: 'center',
    },
});


export default Powiadomienia;
