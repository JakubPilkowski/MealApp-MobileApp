import React, { useState, useEffect } from 'react';
import { View, StyleSheet, SafeAreaView, FlatList, ActivityIndicator, ImageBackground, Text, Easing, LayoutAnimation, TextInput, Platform, Picker, Modal, Animated, Image } from "react-native";
import Strings from "../src/themes/strings";
import Colors from "../src/themes/colors";
import { createStackNavigator, HeaderTitle } from '@react-navigation/stack';
import JadlodajnieWiecej from './JadlodajnieWiecej';
import IconWithAction from "../components/IconWithAction";
import ScreenStyle from "../src/themes/screenStyle";
import Jadlodajnia from "../components/Jadlodajnia";
import Connection from '../service/Connection';
import Switch from 'react-native-customisable-switch';
import MultiSlider from '@ptomasroos/react-native-multi-slider';
import {
    AntDesign,
    Feather, Ionicons
} from 'react-native-vector-icons';
import dimensions from '../src/themes/dimensions';
import AndroidButton from '../components/AndroidButton';
import IosButton from '../components/IosButton';
import { Dimensions } from 'react-native';
import CustomLoadingComponent from '../components/CustomLoadingComponent';
import PlaceHolder from '../components/PlaceHolder';
import { Slider } from 'react-native-elements';
import MultiSelect from 'react-native-multiple-select';
const { width, height } = Dimensions.get("screen");


function JadlodajnieScreen({ navigation, route }) {

    const [selectedValue, setSelectedValue] = useState("default");
    const [expanded, setExpanded] = useState(false);
    const [sliderValue, setSliderValue] = useState(25);
    const [indicatorValue, setIndicatorValue] = useState(12.5 + ((sliderValue-1) * 75 / 54) + '%');
    const [enabled, setEnabled] = useState(false);
    
    const { jadlodajnie, drawerNavigation } = route.params;
    const HomeButtonHandler = () => {
        navigation.openDrawer();
    }
    const toggleView = () => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setExpanded(!expanded);
    }

    items = [{
        id: '92iijs7yta',
        name: 'Ondo',
      }, {
        id: 'a0s0a8ssbsd',
        name: 'Ogun',
      }, {
        id: '16hbajsabsd',
        name: 'Calabar',
      }, {
        id: 'nahs75a5sg',
        name: 'Lagos',
      }, {
        id: '667atsas',
        name: 'Maiduguri',
      }, {
        id: 'hsyasajs',
        name: 'Anambra',
      }, {
        id: 'djsjudksjd',
        name: 'Benue',
      }, {
        id: 'sdhyaysdj',
        name: 'Kaduna',
      }, {
        id: 'suudydjsjd',
        name: 'Abuja',
      }];

    let searchButton;
    if (Platform.OS === "android")
        searchButton = <AndroidButton text="Wyszukaj" containerStyle={{ width: '60%', alignSelf: 'center', marginTop: 12 }} onClick={toggleView} />
    if (Platform.OS === "ios")
        searchButton = <IosButton text="Wyszukaj" onClick={toggleView} />


    navigation.setOptions({
        headerRight: () => {
            return expanded ?
                <IconWithAction
                    content={<AntDesign name="close" size={26} color={Colors.colorTextWhite} />}
                    onClick={toggleView} /> :
                <IconWithAction
                    content={<Ionicons name="md-search" size={26} color={Colors.colorTextWhite} />}
                    onClick={toggleView} />;
        },
        headerLeft: () => {
            return expanded ?
                null :
                <IconWithAction content={<Feather name="menu" size={26} color={Colors.colorTextWhite} />} onClick={HomeButtonHandler} />
        },
        headerTitle: expanded ? "Wyszukiwanie" : "Jadłodajnie",
    });
    drawerNavigation.setOptions({
        gestureEnabled: expanded ? false : true
    });

    let content;
    if (jadlodajnie.length > 0) {
        content =
            <FlatList
                scrollEnabled={expanded ? false : true}
                data={jadlodajnie} renderItem={({ item, index }) =>
                    <Jadlodajnia title={item.title} containerStyle={{ marginBottom: index + 1 === jadlodajnie.length ? dimensions.defaultMarginBetweenItems : 0 }} navigation={navigation} jadlodajnia={item} ></Jadlodajnia>}
                keyExtractor={itemData => itemData.id}
            />
    }
    else {
        content = <PlaceHolder text={"Ups, nie ma \ntakich restauracji"} src={require('../src/images/plate_v2.png')} />
    }

    useEffect(() => {

    }, jadlodajnie);
    return (
        <View style={styles.container} >
            <View style={{
                height: expanded ? null : 0,
                display: expanded ? 'flex' : 'none', overflow: 'hidden', backgroundColor: Colors.backgroundColor, borderWidth: 2,
                paddingVertical: 12,
                alignItems: 'center',
                borderColor: Colors.primary, borderBottomLeftRadius: 16, borderBottomRightRadius: 16
            }}>
                <Text style={{ textAlign: 'center', marginTop: dimensions.defaultMargin, marginBottom: Dimensions.defaultSmallMargin }}>Odległość od lokalizacji</Text>
                <View style={{ flexDirection: 'column', justifyContent: 'center', }}>
                    <View style={{ width: "100%", flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                        <Text style={{ textAlign: 'center', flex: 1 }}>1km</Text>
                        <Slider style={{ width: "75%", height: 40 }}
                            animateTransitions={false}
                            minimumValue={1}
                            maximumValue={50}
                            value={25}
                            onValueChange={(value) => {
                                setSliderValue(value)
                                setIndicatorValue(12.5 + ((value - 1) * 75 / 54) + '%')
                            }}
                            step={1}
                            minimumTrackTintColor={Colors.primary}
                            trackStyle={{ height: 6 }}
                            thumbStyle={{
                                height: 24, width: 24, borderColor: Colors.primary, backgroundColor: Colors.accent, borderWidth: 6, borderRadius: 12
                            }}
                        />
                        <Text style={{ textAlign: 'center', flex: 1 }}>50km</Text>
                    </View>
                    <View style={{ width: 24,justifyContent: 'center',borderRadius:6,borderWidth:1,borderColor:Colors.accent, backgroundColor: Colors.colorTextWhite, height: 24, left: indicatorValue }}>
                        <Text style={{textAlign:'center'}}>{sliderValue}</Text>
                    </View>
                </View>
                <Text style={styles.title}>Tagi</Text>
                <TextInput style={styles.input} />
                {searchButton}
            </View>
            <ImageBackground source={require('../src/images/pancakes.jpg')} imageStyle={{ opacity: 0.3 }} style={{ flex: 1, backgroundColor: Colors.backgroundColor }}>
                {content}
            </ImageBackground>
        </View>
    );

}

const Jadlodajnie = props => {

    const [isLoading, setIsLoading] = useState(true);
    const [dataSource, setDataSource] = useState([]);
    async function fetchData() {
        if (isLoading) {
            setTimeout(async function () {
                const res = await Connection.getJadlodajnie();
                res
                    .json()
                    .then(res => {
                        setDataSource(res.jadlodajnie);
                        setIsLoading(false);
                    })
                    .catch(err => console.log(err + 'blad'));
            }, 3000);
        }
    }
    useEffect(() => {
        fetchData();
    }, isLoading);
    const Stack = createStackNavigator();
    if (isLoading) {
        return <CustomLoadingComponent />
    }
    else {
        return (
            <Stack.Navigator initialRouteName="Jadlodajnie" screenOptions={ScreenStyle}>
                <Stack.Screen name="Jadlodajnie" component={JadlodajnieScreen} initialParams={{ jadlodajnie: dataSource, drawerNavigation: props.navigation }} />
                <Stack.Screen name="JadlodajnieWiecej" component={JadlodajnieWiecej}
                    options={{
                        headerStyle: {
                            opacity: 0, height: 0
                        }
                    }}
                />
            </Stack.Navigator>
        );
    }

}
const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    input: {
        backgroundColor: Colors.colorTextWhite,
        width: "75%",
        borderBottomWidth: dimensions.defaultBorderWidth,
        borderBottomColor: Colors.accent,
        padding: dimensions.defaultSmallPadding,
        marginTop: dimensions.defaultSmallMargin,
        marginBottom: dimensions.defaultMargin
    },
    title: {
        textAlign: 'center',
        marginTop: dimensions.defaultMargin,
        color: Colors.colorTextDark,
    }
});


export default Jadlodajnie;



