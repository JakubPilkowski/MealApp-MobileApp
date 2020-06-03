import React, { useState, useEffect} from 'react';
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
    async function fetchData() {
        if (isLoading) {
                const wojewodztwoValue = await AsyncStorage.getItem("wojewodztwo");
                const miastoValue = await AsyncStorage.getItem("miasto");
                getWojewodztwa();
                getMiastaForWojewodztwo(wojewodztwoValue);
                setWojewodztwo(wojewodztwoValue);
                setMiasto(miastoValue);
                setDefaultWojewodztwo(wojewodztwoValue);
                setDefaultMiasto(miastoValue);
                getEatingHousesNames();
                getTagi();
                getJadlodajnie(wojewodztwoValue, miastoValue);    
        }
    }
    async function getJadlodajnie(wojewodztwo, miasto) {
        const res = await Connection.getJadlodajnie(wojewodztwo, miasto);
        res
            .json()
            .then(res => {
                if (searchResultsLoading) {
                    getSearchResults(res);
                }
                else {
                    setJadlodajnie(res);
                }
                setIsLoading(false);
            })
            .catch(err => console.log(err + 'blad'));
    }
    async function getEatingHousesNames() {
        setNames([]);
        const res = await Connection.getEatingHousesNames();
        res
            .json()
            .then(res => {
                setNames(res);
            })
            .catch(err => console.log(err + 'blad'));
    }
    async function getTagi() {
        setTags([]);
        const res = await Connection.getTags();
        res
            .json()
            .then(res => {
                res.map((tag) => {
                    setTags(tags => [...tags, { id: tag.id, name: tag.name, selected: false, color: 'black' }]);
                })
            })
            .catch(err => console.log(err + 'blad'));
        setMode('restart');
    }

    //pobieranie województw
    async function getWojewodztwa() {
        if (wojewodztwa.length <= 1) {
            const wojewodztwaResponse = await Connection.getWojewodztwa();
            wojewodztwaResponse
                .json()
                .then(res => {
                    res.map((item) => {
                        setWojewodztwa(wojewodztwa => [...wojewodztwa, new PickerItem(item.name, item.slug, 0, 0, 0)]);
                    });
                })
                .catch(err => console.log(err + 'blad'));
        }
    }
    //pobieranie miast dla województwa
    async function getMiastaForWojewodztwo(wojewodztwo) {
        const res = await Connection.getMiastaForWojewodztwo(wojewodztwo);
        res
            .json()
            .then(res => {
                setMiasta([new PickerItem("Wybierz miasto...", "default", 0, 0, 0)]);
                res.map((item) => {
                    setMiasta(miasta => [...miasta, new PickerItem(item.name, item.slug, item.latitude, item.longitude, item.zoom)]);
                });
                setIsPickerLoading(false);
                setWojewodztwoEnabled(true);
                setMiastoEnabled(true);
            })
            .catch(err => console.log(err + 'blad'));
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
        if (isLoading)
            fetchData();
        else if (searchResultsLoading)
            getJadlodajnie(wojewodztwo, miasto);
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
        toggleSearchView();
        setSearchResultsLoading(true);
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
                        if(chosenTag.name === tag.name){
                            let result = 1;
                            tmpJadlodajnieArray.map((tmpJadlodajnia)=>{
                                if(jadlodajnia.name === tmpJadlodajnia.name)
                                    result = 0;
                            })
                            if(result==1){
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
                        <ActivityIndicator size="large" color={Colors.primary} animating={isPickerLoading} style={{}} />
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



