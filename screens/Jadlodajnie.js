import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, SafeAreaView, FlatList, ActivityIndicator, ImageBackground, Text, Easing, LayoutAnimation, TextInput, Platform, Picker, Modal, Animated, Image, ScrollView, TouchableOpacity, TouchableNativeFeedback, Keyboard } from "react-native";
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
import { Slider, SearchBar } from 'react-native-elements';
import MultiSelect from 'react-native-multiple-select';
import SectionedMultiSelect from 'react-native-sectioned-multi-select';
import CustomMultiSelect from '../components/CustomMultiSelect';
const { width, height } = Dimensions.get("screen");


function JadlodajnieScreen({ navigation, route }) {

    const [selectedValue, setSelectedValue] = useState("default");
    const [expanded, setExpanded] = useState(false);
    const [detailedSearchExpanded, setDetailedSearchExpanded] = useState(false);
    const [sliderValue, setSliderValue] = useState(25);
    const [searchResults, setSearchResults] = useState([]);
    const [sliderOpacity, setSliderOpacity] = useState(0);
    const [searchViewValue, setSearchViewValue] = useState('');
    const [selectedItems, setSelectedItems] = useState([]);
    const [indicatorValue, setIndicatorValue] = useState(12.5 + ((sliderValue - 1) * 75 / 54) + '%');
    const [enabled, setEnabled] = useState(false);
    const multiSelect = useRef(null);

    const { jadlodajnie, drawerNavigation } = route.params;
    const HomeButtonHandler = () => {
        navigation.openDrawer();
    }
    const toggleSearchView = () => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeIn);
        setDetailedSearchExpanded(false);
        setSliderOpacity(0);
        setExpanded(!expanded);
    }
    const toggleDetailedSearchView = () => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeIn);
        setDetailedSearchExpanded(!detailedSearchExpanded);
    }
    const toggleSlider = () => {
        if (sliderOpacity === 0) {
            setTimeout(function () {
                setSliderOpacity(1);
            }, 150);
        }
        else {
            setSliderOpacity(0);
        }
    }

    items = [{
        id: '92iijs7yta',
        name: 'Pełny gar',
    }, {
        id: 'a0s0a8ssbsd',
        name: 'Stołówka warmińska',
    }, {
        id: '16hbajsabsd',
        name: 'Bistro-Kociołek',
    }, {
        id: 'nahs75a5sg',
        name: 'Bar Kąsek',
    }, {
        id: '667atsas',
        name: 'Bar u Sióstr',
    }, {
        id: 'hsyasajs',
        name: 'Bistro Kopernika',
    }, {
        id: 'djsjudksjd',
        name: 'Kuźnia smaków',
    }, {
        id: 'sdhyaysdj',
        name: 'Kwadrans',
    }, {
        id: 'suudydjsjd',
        name: 'Feta',
    }];

    multiSelectItems = [{
        id: '92iij',
        name: 'Pierogi',
        selected: false
    }, {
        id: 'a0s0a8ssbsds',
        name: 'Kapustka',
        selected: false
    }, {
        id: '16hbajsabsds',
        name: 'Kotlet',
        selected: false
    }, {
        id: 'nahs75a5sgs',
        name: 'Brokuły',
        selected: false
    }, {
        id: '667atsas',
        name: 'Ciasto',
        selected: false
    }, {
        id: 'hsyasajss',
        name: 'Kurczak',
        selected: false
    }, {
        id: 'djsjudksjds',
        name: 'Pierwsze danie',
        selected: false
    }, {
        id: 'sdhyaysdjs',
        name: 'Śniadanie',
        selected: false
    }, {
        id: 'suudydjsjds',
        name: 'Obiad',
        selected: false
    }, {
        id: 'suudydjsjdss',
        name: 'Kolacja',
        selected: false
    }

    ];

    let searchButton;
    if (Platform.OS === "android")
        searchButton = <AndroidButton text="Wyszukaj" containerStyle={{ width: '60%', alignSelf: 'center', marginTop: 12 }} onClick={toggleSearchView} />
    if (Platform.OS === "ios")
        searchButton = <IosButton text="Wyszukaj" onClick={toggleSearchView} />


    navigation.setOptions({
        headerRight: () => {
            return expanded ?
                <IconWithAction
                    content={<AntDesign name="close" size={26} color={Colors.colorTextWhite} />}
                    onClick={toggleSearchView} /> :
                <IconWithAction
                    content={<Ionicons name="md-search" size={26} color={Colors.colorTextWhite} />}
                    onClick={toggleSearchView} />;
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
    const onSelectedItemsChange = selectedItems => {
        setSelectedItems(selectedItems);
    };
    function applyFilter(text) {
        setSearchViewValue(text);
        if (text !== "") {
            const filterResults = items.filter(item => {
                const itemData = item.name.toLowerCase();
                const searchResult = text.toLowerCase();
                return itemData.indexOf(searchResult) > -1;
            });
            setSearchResults(filterResults);
        }
        else {
            setSearchResults([]);
        }
    }


    return (
        <View style={styles.container} >
            <View style={{
                height: expanded ? null : 0,
                display: expanded ? 'flex' : 'none', overflow: 'hidden', backgroundColor: Colors.backgroundColor, borderWidth: 2,
                paddingVertical: 12,
                alignItems: 'center',
                borderColor: Colors.primary, borderBottomLeftRadius: 16, borderBottomRightRadius: 16
            }}>

                <Text style={{ fontSize: 16, marginTop: 6, marginBottom: 6 }}>Nazwa Jadłodajnii</Text>
                <View style={{ width: '85%', alignItems: 'center' }}>
                    <SearchBar
                        onCancel={() => { setSearchResults([]); }}
                        placeholder="Wyszukaj jadłodajnie..."
                        platform="android"
                        inputStyle={{ fontSize: 16 }}
                        onFocus={() => { applyFilter(searchViewValue) }}
                        onSubmitEditing={() => { setSearchResults([]) }}
                        containerStyle={{ borderRadius: dimensions.defaultBorderRadius }}
                        onChangeText={(text) => applyFilter(text)}
                        value={searchViewValue}
                    />
                    <FlatList
                        keyboardShouldPersistTaps='handled'
                        style={{
                            height: searchResults.length * 40 <= 160 ? searchResults.length * 40 : 160,
                        }}
                        data={searchResults} renderItem={({ item, index }) => {
                            return (
                                <TouchableNativeFeedback onPress={() => {
                                    setSearchViewValue(item.name)
                                    setSearchResults([]);
                                    Keyboard.dismiss();
                                }}
                                >
                                    <View style={{ height: 40, width: 85 * width / 100, alignItems: 'center', justifyContent: 'center', }}>
                                        <Text style={{ fontSize: 16 }}>{item.name}</Text>
                                    </View>
                                </TouchableNativeFeedback>
                            )
                        }}
                    />
                    <TouchableOpacity onPress={() => {
                        setSearchResults([]);
                        Keyboard.dismiss();
                        toggleDetailedSearchView();
                        toggleSlider();
                    }}>
                        <Text style={{ fontSize: 16, color: Colors.accent, marginTop: 12 }}>{!detailedSearchExpanded ? "Zaawansowane" : "Schowaj zaawansowane"}</Text>
                    </TouchableOpacity>
                </View>
                <View style={{
                    height: detailedSearchExpanded ? null : 0,
                    display: detailedSearchExpanded ? 'flex' : 'none', overflow: 'hidden',
                    paddingVertical: 12,
                    width: '100%',
                    alignItems: 'center',
                }}>
                    <Text style={{ fontSize: 16, marginTop: dimensions.defaultMargin, marginBottom: Dimensions.defaultSmallMargin }}>Odległość od lokalizacji</Text>
                    <View style={{ justifyContent: 'center', }}>
                        <View style={{ width: "100%", flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                            <Text style={{ textAlign: 'center', flex: 1 }}>1km</Text>
                            <Slider
                                style={{ width: "75%", height: 40, opacity: sliderOpacity }}
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
                        <View style={{ width: 24, justifyContent: 'center', borderRadius: 6, borderWidth: 1, borderColor: Colors.accent, backgroundColor: Colors.colorTextWhite, height: 24, left: indicatorValue }}>
                            <Text style={{ textAlign: 'center' }}>{sliderValue}</Text>
                        </View>
                    </View>
                    <Text style={styles.title}>Tagi</Text>
                    <CustomMultiSelect placeHolder="Wybierz tagi (max 3)" items={multiSelectItems}/>
                </View>
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



