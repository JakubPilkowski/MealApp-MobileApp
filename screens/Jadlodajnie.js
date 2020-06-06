import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, ImageBackground, ActivityIndicator, AsyncStorage, Text, LayoutAnimation, Platform, TouchableOpacity, TouchableNativeFeedback, Keyboard, ScrollView } from "react-native";
import Colors from "../src/themes/colors";
import { createStackNavigator } from '@react-navigation/stack';
import JadlodajnieWiecej from './JadlodajnieWiecej';
import IconWithAction from "../components/IconWithAction";
import ScreenStyle from "../src/themes/screenStyle";
import Jadlodajnia from "../components/Jadlodajnia";
import Connection from '../service/Connection';
import CustomPicker from '../components/CustomPicker';
import {
    AntDesign,
    Feather, Ionicons,
    MaterialIcons
} from 'react-native-vector-icons';
import dimensions from '../src/themes/dimensions';
import AndroidButton from '../components/AndroidButton';
import IosButton from '../components/IosButton';
import { Dimensions } from 'react-native';
import CustomLoadingComponent from '../components/CustomLoadingComponent';
import PlaceHolder from '../components/PlaceHolder';
import { SearchBar } from 'react-native-elements';
import CustomMultiSelect from '../components/CustomMultiSelect';
const { width, height } = Dimensions.get("screen");
import PickerItem from '../models/PickerItem';
import { useNavigationState } from '@react-navigation/native';


function JadlodajnieScreen({ navigation, route }) {
    const [expanded, setExpanded] = useState(false);
    const [detailedSearchExpanded, setDetailedSearchExpanded] = useState(false);
    const [searchResultsLoading, setSearchResultsLoading] = useState(false);
    const [searchResults, setSearchResults] = useState([]);
    const [searchViewValue, setSearchViewValue] = useState('');
    const [names, setNames] = useState([]);
    const [tags, setTags] = useState([]);
    const [chosenItems, setChosenItems] = useState([]);
    const [wojewodztwa, setWojewodztwa] = useState([new PickerItem('Wybierz województwo...', 'default', 0, 0, 0)]);
    const [miasta, setMiasta] = useState([new PickerItem('Wybierz miasto...', 'default', 0, 0, 0)]);
    const [wojewodztwo, setWojewodztwo] = useState();
    const [miasto, setMiasto] = useState();
    const { drawerNavigation } = route.params;
    const [isLoading, setIsLoading] = useState(true);
    const [wojewodztwoEnabled, setWojewodztwoEnabled] = useState(true);
    const [miastoEnabled, setMiastoEnabled] = useState(false);
    const [isPickerLoading, setIsPickerLoading] = useState(false);
    const [jadlodajnie, setJadlodajnie] = useState([]);
    const [mode, setMode] = useState('default');
    const [defaultWojewodztwo, setDefaultWojewodztwo] = useState();
    const [defaultMiasto, setDefaultMiasto] = useState();
    const [error, setError] = useState("");
    const [errorType, setErrorType] = useState("default");
    const [localizationError, setLocalizationError] = useState("");
    async function fetchData() {
        if (isLoading) {
            setTimeout(async function () {
                const wojewodztwoValue = await AsyncStorage.getItem("wojewodztwo");
                const miastoValue = await AsyncStorage.getItem("miasto");
                setNames([]);
                setTags([]);
                setWojewodztwo(wojewodztwoValue);
                setMiasto(miastoValue);
                setDefaultWojewodztwo(wojewodztwoValue);
                setDefaultMiasto(miastoValue);
                await Promise.all([
                    Connection.getWojewodztwa(),
                    Connection.getMiastaForWojewodztwo(wojewodztwoValue),
                    Connection.getEatingHousesNames(),
                    Connection.getTags(),
                    Connection.getJadlodajnie(wojewodztwoValue, miastoValue),
                ]).then(res => {
                    getJadlodajnieInfos(res);
                }).catch(err => {
                    if (err === "Brak internetu")
                        setErrorType("network")
                    else
                        setErrorType("default")
                    setError(err);
                    setIsLoading(false);
                });
            }, 200)
        }
    }

    async function getJadlodajnieInfos(res) {
        if (wojewodztwa.length <= 1) {
            res[0].map((item) => {
                setWojewodztwa(wojewodztwa => [...wojewodztwa, new PickerItem(item.name, item.slug, 0, 0, 0)]);
            });
        }
        setMiasta([new PickerItem("Wybierz miasto...", "default", 0, 0, 0)]);
        res[1].map((item) => {
            setMiasta(miasta => [...miasta, new PickerItem(item.name, item.slug, item.latitude, item.longitude, item.zoom)]);
        });
        setNames(res[2]);
        setWojewodztwoEnabled(true);
        setMiastoEnabled(true);
        res[3].map((tag) => {
            setTags(tags => [...tags, { id: tag.id, name: tag.name, selected: false, color: 'black' }]);
        })
        setMode("restart");
        setJadlodajnie(res[4]);
        setIsLoading(false);
    }

    async function getJadlodajnie(wojewodztwo, miasto) {
        const res = Connection.getJadlodajnie(wojewodztwo, miasto);
        res
            .then(res => {
                if (searchResultsLoading) {
                    getSearchResults(res);
                }
                else {
                    setJadlodajnie(res);
                }
            })
            .catch(err => {
                if (err === "Brak internetu")
                    setErrorType("network")
                else
                    setErrorType("default")
                setError(err);
                setSearchResultsLoading(false);
                setIsLoading(false);
            });
    }
    //pobieranie miast dla województwa
    async function getMiastaForWojewodztwo(wojewodztwo) {
        const res = Connection.getMiastaForWojewodztwo(wojewodztwo);
        res
            .then(res => {
                setMiasta([new PickerItem("Wybierz miasto...", "default", 0, 0, 0)]);
                res.map((item) => {
                    setMiasta(miasta => [...miasta, new PickerItem(item.name, item.slug, item.latitude, item.longitude, item.zoom)]);
                });
                setIsPickerLoading(false);
                setWojewodztwoEnabled(true);
                setMiastoEnabled(true);
            })
            .catch(err => {
                if (err === "Brak internetu")
                    setErrorType("network")
                else
                    setErrorType("default")
                setError(err);
                setIsPickerLoading(false);
                toggleSearchView();
            });
    }

    const onWojewodztwoChangedHandler = (wojewodztwo) => {
        setWojewodztwo(wojewodztwo.value);
        if (wojewodztwo.value !== "default") {
            setIsPickerLoading(true);
            setWojewodztwoEnabled(false);
            setMiastoEnabled(false);
            setMiasto("default");
            getMiastaForWojewodztwo(wojewodztwo.value);
        }
        else {
            setMiasto("default");
            setMiastoEnabled(false);
        }
    }

    const onMiastoChangedHandler = (miasto) => {
        setMiasto(miasto.value);
    }

    navigation.addListener("focus", () => {
            setIsLoading(true);
    })
    useEffect(() => {
        if (isLoading || searchResultsLoading) {
            setError("");
            setErrorType("default");
            if (isLoading)
                fetchData();
            else if (searchResultsLoading)
                getJadlodajnie(wojewodztwo, miasto);
        }
    }, [isLoading, searchResultsLoading]);

    const HomeButtonHandler = () => {
        navigation.openDrawer();
    }
    const toggleSearchView = () => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setDetailedSearchExpanded(false);
        setExpanded(!expanded);
    }
    const toggleDetailedSearchView = () => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setDetailedSearchExpanded(!detailedSearchExpanded);
    }

    const onSearchClicked = () => {
        if(wojewodztwo !=="default" && miasto !=="default"){
            console.log(wojewodztwo);
            console.log(miasto);
            toggleSearchView();
            setSearchResultsLoading(true);
            setLocalizationError("");
        }else{
            setLocalizationError("Musisz wybrać województwo i miasto")
        }
    }

    const getSearchResults = (jadlodajnie) => {
        let searchResults = jadlodajnie;
        if (searchViewValue !== "") {
            searchResults = searchResults.filter((jadlodajnia) => jadlodajnia.name === searchViewValue);
        }
        if (chosenItems.length > 0) {
            let tmpJadlodajnieArray = [];
            let tags = chosenItems;
            tags.map(chosenTag => {
                searchResults.map(jadlodajnia => {
                    jadlodajnia.eatingHouseTagList.map((tag) => {
                        if (chosenTag.name === tag.name) {
                            let result = 1;
                            tmpJadlodajnieArray.map((tmpJadlodajnia) => {
                                if (jadlodajnia.name === tmpJadlodajnia.name)
                                    result = 0;
                            })
                            if (result == 1) {
                                tmpJadlodajnieArray.push(jadlodajnia);
                            }
                        }
                    })
                })
            })
            searchResults = tmpJadlodajnieArray;
        }
        setJadlodajnie(searchResults);
        setSearchResultsLoading(false);
    }

    let searchButton;
    if (Platform.OS === "android" && Platform.Version >= 21)
        searchButton = <AndroidButton text="Wyszukaj" containerStyle={{ width: '60%', alignSelf: 'center', marginTop: 12 }} onClick={() => { onSearchClicked() }} />
    if (Platform.OS === "ios" || (Platform.OS === "android" && Platform.Version < 21))
        searchButton = <IosButton text="Wyszukaj" onClick={() => { onSearchClicked() }} />


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
    if (isLoading || searchResultsLoading) {
        content = <CustomLoadingComponent />
    }
    else {
        if (error !== "") {
            if (errorType === "network") {
                content =
                    <PlaceHolder buttonDisplay={true} textContainer={{ borderColor: 'red' }} textStyle={{ color: 'red' }} text={error} src={require("../src/images/network_error.png")} onButtonClick={() => { setIsLoading(true) }} />
            }
            else {
                content =
                    <PlaceHolder buttonDisplay={true} textContainer={{ borderColor: 'red' }} textStyle={{ color: 'red' }} text={error} src={require("../src/images/error.png")} onButtonClick={() => { setIsLoading(true) }} />
            }
        }
        else {
            if (jadlodajnie.length > 0) {
                content =
                    <FlatList
                        scrollEnabled={expanded ? false : true}
                        data={jadlodajnie} renderItem={({ item, index }) =>
                            <Jadlodajnia containerStyle={{ marginBottom: index + 1 === jadlodajnie.length ? dimensions.defaultMarginBetweenItems : 0 }} onMoreClick={() => {
                                navigation.navigate('JadlodajnieWiecej', { jadlodajniaSlug: item.slug, wojewodztwo: wojewodztwo, miasto: miasto });
                            }}
                                jadlodajnia={item} ></Jadlodajnia>}
                        keyExtractor={item => item.id.toString()}
                    />
            }
            else {
                content = <PlaceHolder text={"Ups, nie ma \ntakich restauracji"} src={require('../src/images/plate_v2.png')} containerStyle={{ opacity: detailedSearchExpanded ? 0 : 1 }} />
            }
        }
    }
    function applyFilter(text) {
        setSearchViewValue(text);
        if (text !== "") {
            const filterResults = names.filter(item => {
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
        <View style={styles.container}>
            <View style={{
                height: expanded ? null : 0,
                display: expanded ? 'flex' : 'none',
                overflow: 'hidden',
                zIndex: 9999,
                backgroundColor: Colors.backgroundColor,
                borderWidth: expanded ? 2 : 0,
                paddingVertical: 12,
                alignItems: 'center',
                borderColor: Colors.primary,
                borderBottomLeftRadius: 16,
                borderBottomRightRadius: 16
            }}>
                <ScrollView style={{
                    width: '100%',
                }}
                    contentContainerStyle={{
                        alignItems: 'center'
                    }}
                    keyboardShouldPersistTaps='handled'
                >
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
                        <CustomPicker
                            containerStyle={{ opacity: wojewodztwoEnabled ? 1 : 0.5, marginTop: 12 }}
                            pickerItems={wojewodztwa} selectedValue={wojewodztwo}
                            enabled={wojewodztwoEnabled}
                            onPickerChange={(wojewodztwo) => onWojewodztwoChangedHandler(wojewodztwo)}
                        />
                        <CustomPicker containerStyle={{ opacity: miastoEnabled ? 1 : 0.5, marginVertical: 12 }}
                            enabled={miastoEnabled}
                            pickerItems={miasta} selectedValue={miasto}
                            onPickerChange={(miasto) => onMiastoChangedHandler(miasto)}
                        />
                        <View style={{ alignItems: 'center' }}>
                            <ActivityIndicator size="large" color={Colors.primary} animating={isPickerLoading} />
                            <View style={{ position: 'absolute', marginBottom: 24 }}>
                                <View style={{ display: error !== "" ? 'flex' : 'none', alignItems: 'center' }}>
                                    <View style={{ flexDirection: 'row', alignItems: 'center', }}>
                                        <MaterialIcons name="error" color={"red"} size={36} />
                                        <Text style={{ fontSize: 16, color: 'red', marginLeft: 6, maxWidth: 275 }}>{error}</Text>
                                    </View>
                                </View>
                            </View>
                        </View>
                        <Text style={styles.title}>Tagi</Text>
                        <CustomMultiSelect placeHolder="Wybierz tagi (max 3)" items={tags} chosenItems={chosenItems} mode={mode}
                            onAddItem={(item) => {
                                setMode("defualt");
                                setChosenItems(currentItems => [...currentItems, { id: item.id, name: item.name, selected: !item.selected, color: 'black' }]);
                            }} onRemoveItem={(item) => {
                                setChosenItems(currentItems => {
                                    return currentItems.filter((chosenItem) => chosenItem.id !== item.id);
                                });
                            }}
                        />
                    </View>
                    {searchButton}
                    <Text style={{textAlign:'center', fontSize:14, color:'red', opacity: localizationError !== "" ? 1:0}}>{localizationError}</Text>
                    <TouchableOpacity onPress={() => {
                        setSearchViewValue("");
                        setChosenItems([]);
                        tags.map((tag) => {
                            tag.selected = false;
                        })
                        setMode("restart");
                        setIsPickerLoading(true);
                        setWojewodztwoEnabled(false);
                        setMiastoEnabled(false);
                        getMiastaForWojewodztwo(defaultWojewodztwo);
                        setWojewodztwo(defaultWojewodztwo);
                        setMiasto(defaultMiasto);
                    }}>
                        <Text style={{ fontSize: 16, color: Colors.accent, marginTop: 6 }}>Przywróć domyślne</Text>
                    </TouchableOpacity>
                </ScrollView>
            </View>
            <ImageBackground source={require('../src/images/pancakes.jpg')} imageStyle={{ opacity: 0.3 }} style={{ flex: 1, backgroundColor: Colors.backgroundColor }}>
                {content}
            </ImageBackground>
        </View>
    );

}

const Jadlodajnie = props => {
    const forFade = ({ current, closing }) => ({
        cardStyle: {
            opacity: current.progress,
        },
    });

    const Stack = createStackNavigator();
    return (
        <Stack.Navigator initialRouteName="Jadlodajnie" screenOptions={ScreenStyle}>
            <Stack.Screen name="Jadlodajnie" component={JadlodajnieScreen} initialParams={{ drawerNavigation: props.navigation }} />
            <Stack.Screen name="JadlodajnieWiecej" component={JadlodajnieWiecej}
                options={{
                    headerStyle: {
                        opacity: 0, height: 0
                    },
                    cardStyleInterpolator: forFade
                }}
            />
        </Stack.Navigator>
    );
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
        fontSize: 16
    }
});


export default Jadlodajnie;



