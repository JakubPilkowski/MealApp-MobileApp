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
let id = 0;

function PowiadomieniaScreen({ navigation }) {

    const [powiadomienia, setPowiadomienia] = useState([]);
    const [addAlertVisibility, setAddAlertVisibility] = useState(false);

    let addPowiadomienieButton;
    if (Platform.OS === 'ios') {
        addPowiadomienieButton =
            <View style={styles.buttonContainer} >
                <View style={styles.androidButtonView}>
                    <TouchableOpacity
                        onPress={() => {
                            setAddAlertVisibility(true);
                        }}
                    >
                        <Text style={styles.moreButtonText}>DodajAlert</Text>
                    </TouchableOpacity>
                </View>
            </View>;
    }
    if (Platform.OS === "android") {
        addPowiadomienieButton =
            <View style={styles.buttonContainer} >
                <View style={styles.androidButtonView}>
                    <TouchableNativeFeedback background={TouchableNativeFeedback.Ripple(Colors.accent, true)}
                        onPress={() => {
                            setAddAlertVisibility(true);
                        }}
                        useForeground={false}>
                        <View style={{ backgroundColor: Colors.backgroundColor, flexDirection: 'column', width: "100%" }}>
                            <Text style={styles.moreButtonText}>Dodaj alert</Text>
                        </View>
                    </TouchableNativeFeedback>
                </View>
            </View>;
    }
    const AddPowiadomienieHandler = powiadomienie => {
        id = id + 1;
        console.log(id);
        setPowiadomienia(currentPowiadomienia => [...currentPowiadomienia, { id: id, nazwa: powiadomienie }]);
        setAddAlertVisibility(false);
    }
    const RemovePowiadomieniaHandler = item => {
        setPowiadomienia(currentPowiadomienia => {
            return currentPowiadomienia.filter((powiadomienie) => { powiadomienie.id !== item });
        })
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
                        <Powiadomienie item={itemData.item} />
                    }
                />
                <CustomAlert visibility={addAlertVisibility} onPositiveClick={AddPowiadomienieHandler} onCancel={CancelAlert} />
                 {addPowiadomienieButton}
            </ImageBackground>
        </View>
    );
}

function Powiadomienie({ item }) {
    const [enabled, setEnabled] = useState(false);
    const [removeAlertVisibility, setRemoveAlertVisibility] = useState(false);
    const [currentItemId, setCurrentItemId] = useState();
    return (
        <Card
            pressEnabled={true}
            onLongCardPress={() => {
                setCurrentItemId(item.id);
                setRemoveAlertVisibility(true);
            }
            }
            cardStyle={{ marginTop: dimensions.defaultMargin }}
            content={
                <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: "center" }}>
                    <Text style={{ textAlign: 'left', flex: 1 }}>{item.nazwa}</Text>
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
                        <SimpleAlert visibility={removeAlertVisibility} onPositiveClick={()=>{RemovePowiadomieniaHandler(currentItemId);}} 
                    onNegativeClick={()=>{setRemoveAlertVisibility(false);}} title="Usuwanie" message="Czy na pewno chcesz usunąć powiadomienie?"/>
               
                </View>
                
            }
        />);
}

export default class Powiadomienia extends React.Component {

    render() {
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
}


const styles = StyleSheet.create({
    container: {
        flex: 1,

    },
    moreButtonText: {
        paddingVertical: 9,
        paddingHorizontal: 50,
        textAlign: "center",
        color: Colors.primary,
        fontSize: dimensions.hugeFontSize,
        fontWeight: "bold",
        borderRadius: dimensions.defaultBorderRadius,
        borderColor: Colors.primary,
        borderWidth: dimensions.defaultBorderWidth,
    },
    buttonContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: "center"
    },
    androidButtonView: {
        position: "absolute",
        bottom: 16,
        backgroundColor: Colors.colorTextWhite,
        borderRadius: dimensions.defaultBorderRadius
    },
})
