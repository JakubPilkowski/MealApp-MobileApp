import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button, ActivityIndicator, Platform, LayoutAnimation, AsyncStorage, FlatList, ImageBackground } from 'react-native';
import JadlodajnieWiecej from './JadlodajnieWiecej';
import { createStackNavigator } from '@react-navigation/stack';
import Colors from "../src/themes/colors";
import Strings from "../src/themes/strings";
import IconWithAction from "../components/IconWithAction";
import AndroidButton from "../components/AndroidButton";
import ScreenStyle from "../src/themes/screenStyle";
import Connection from "../service/Connection";
import dimensions from '../src/themes/dimensions';
import Card from "../components/Card";
import PlaceHolder from "../components/PlaceHolder";
import CustomPicker from "../components/CustomPicker";
import { Feather, AntDesign, FontAwesome, MaterialIcons } from 'react-native-vector-icons';
import IosButton from "../components/IosButton";
import MapView, { PROVIDER_GOOGLE, Marker, Callout } from 'react-native-maps';
import CustomLoadingComponent from '../components/CustomLoadingComponent';
import PickerItem from '../models/PickerItem';


function MapaScreen({ navigation, route }) {

    const [isLoading, setIsLoading] = useState(true);
    const [isPickerLoading, setIsPickerLoading] = useState(false);
    const [searchResultsLoading, setSearchResultsLoading] = useState(false);
    const [dataSource, setDataSource] = useState([]);
    const [wojewodztwa, setWojewodztwa] = useState([new PickerItem('Wybierz województwo...', 'default', 0, 0, 0)]);
    const [miasta, setMiasta] = useState([new PickerItem('Wybierz miasto...', 'default', 0, 0, 0)]);
    const [wojewodztwo, setWojewodztwo] = useState('default');
    const [wojewodztwoEnabled, setWojewodztwoEnabled] = useState(true);
    const [miastoEnabled, setMiastoEnabled] = useState(false);
    const [miasto, setMiasto] = useState('default');
    const [latitude, setLatitude] = useState(0);
    const { drawerNavigation } = route.params;
    const [longitude, setLongitude] = useState(0);
    const [zoom, setZoom] = useState(0);
    const [mapLoaded, setMapLoaded] = useState(false);
    const [expanded, setExpanded] = useState(false);
    const [error, setError] = useState("");
    const [errorType, setErrorType] = useState("default");
    const [searchError, setSearchError] = useState("");
    async function fetchData() {
        if (isLoading) {
            setTimeout(async function () {
                const wojewodztwoValue = await AsyncStorage.getItem("wojewodztwo");
                const miastoValue = await AsyncStorage.getItem("miasto");
                const latitudeValue = await AsyncStorage.getItem('latitude');
                const longitudeValue = await AsyncStorage.getItem('longitude');
                const zoomValue = await AsyncStorage.getItem('zoom');
                setWojewodztwo(wojewodztwoValue);
                setMiasto(miastoValue);
                setLatitude(Number(latitudeValue));
                setLongitude(Number(longitudeValue));
                setZoom(Number(zoomValue));
                await Promise.all([
                    Connection.getWojewodztwa(),
                    Connection.getMiastaForWojewodztwo(wojewodztwoValue),
                    Connection.getMapy(wojewodztwoValue, miastoValue)
                ]).then(res => {
                    getMapyInfos(res);
                }).catch(err => {
                    if (err === "Brak internetu")
                        setErrorType("network")
                    else
                        setErrorType("default")
                    setError(err);
                    setIsLoading(false);
                })
            }, 200);
        }
    }
    async function getMapyInfos(res) {
        if (wojewodztwa.length <= 1) {
            res[0].map((item) => {
                setWojewodztwa(wojewodztwa => [...wojewodztwa, new PickerItem(item.name, item.slug, 0, 0, 0)]);
            });
        }
        setMiasta([new PickerItem("Wybierz miasto...", "default", 0, 0, 0)]);
        res[1].map((item) => {
            setMiasta(miasta => [...miasta, new PickerItem(item.name, item.slug, item.latitude, item.longitude, item.zoom)]);
        });
        setWojewodztwoEnabled(true);
        setMiastoEnabled(true);
        setDataSource(res[2]);
        setIsLoading(false);
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
    //pobieranie punktów na mapie
    async function getMapy(wojewodztwo, miasto) {
        const mapsResponse = Connection.getMapy(wojewodztwo, miasto);
        mapsResponse
            .then(res => {
                setDataSource(res);
                setSearchResultsLoading(false);
            })
            .catch(err => {
                console.log("halo");
                if (err === "Brak internetu")
                    setErrorType("network")
                else
                    setErrorType("default")
                setError(err);
                setSearchResultsLoading(false);
            });
    }
    //widok wyboru nowej lokalizacji
    const toggleSearchView = () => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setExpanded(!expanded);
    }

    const onSearchClickedHandler = () => {
        if (miasto !== "default" && wojewodztwo !== "default") {
            setSearchError("");
            setMapLoaded(false);
            toggleSearchView();
            setSearchResultsLoading(true);
        }else{
            setSearchError("Musisz wybrać województwo i miasto");
        }
    }

    //przycisk wyszukiwania nowej lokalizacji
    let searchButton;
    if (Platform.OS === "android" && Platform.Version >= 21)
        searchButton = <AndroidButton text="Wyszukaj" containerStyle={{ width: '60%', alignSelf: 'center', marginTop: 12 }} onClick={onSearchClickedHandler} />
    if (Platform.OS === "ios" || (Platform.OS === "android" && Platform.Version < 21))
        searchButton = <IosButton text="Wyszukaj" onClick={onSearchClickedHandler} />

    //event po zmianie województwa
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

    //event po zmianie miasta
    const onMiastoChangedHandler = (miasto) => {
        setMiasto(miasto.value);
        setLatitude(miasto.latitude);
        setLongitude(miasto.longitude);
        setZoom(miasto.zoom);
    }

    //reload aplikacji po wejściu do zakładki mapy
    navigation.addListener("focus", () => {
        setIsLoading(true);
    })

    //rerender ekranu
    useEffect(() => {
        if (isLoading || searchResultsLoading) {
            setError("");
            setErrorType("default");
            if (searchResultsLoading) {
                getMapy(wojewodztwo, miasto);
            }
            else {
                fetchData();
            }
        }
    }, [isLoading, searchResultsLoading]);

    //event po wciśnięciu "burgera"
    const HomeButtonHandler = () => {
        navigation.openDrawer();
    }

    //opcje drawer navigatora
    navigation.setOptions({
        headerLeft: () => {
            return expanded ?
                null :
                <IconWithAction content={<Feather name="menu" size={26} color={Colors.colorTextWhite} />} onClick={HomeButtonHandler} />
        },
        headerRight: () => {
            return expanded ?
                <IconWithAction
                    content={<AntDesign name="close" size={26} color={Colors.colorTextWhite} />}
                    onClick={toggleSearchView} /> :
                <IconWithAction
                    content={<FontAwesome name="map-marker" size={26} color={Colors.colorTextWhite} />}
                    onClick={toggleSearchView} />;
        },
        headerTitle: expanded ? "Zmiana lokalizacji" : "Mapa",
    });
    drawerNavigation.setOptions({
        gestureEnabled: expanded ? false : true
    });
    let content;
    //renderowanie ekranu
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
            content = <MapView provider={PROVIDER_GOOGLE} style={{ flex: 1 }} initialRegion={{
                latitude: latitude,
                longitude: longitude,
                longitudeDelta: zoom,
                latitudeDelta: zoom
            }}  >
                {dataSource.map(jadlodajnia =>
                    jadlodajnia.addressList.map(punkt =>
                        renderMarker(punkt, navigation, jadlodajnia, wojewodztwo, miasto)
                    )
                )}
            </MapView>
        }
    }
    setTimeout(async function () {
        setMapLoaded(true);
    }, 35);
    return (
        <View style={[styles.container, { opacity: mapLoaded ? 1 : 0 }]}>
            <View style={{
                height: expanded ? null : 0,
                display: expanded ? 'flex' : 'none', overflow: 'hidden', backgroundColor: Colors.backgroundColor, borderWidth: 2,
                paddingVertical: 12,
                alignItems: 'center',
                borderColor: Colors.primary, borderBottomLeftRadius: 16, borderBottomRightRadius: 16
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
                {searchButton}
                <Text style={{textAlign:'center', fontSize:14, color:'red', opacity: searchError !== "" ? 1:0}}>{searchError}</Text>
            </View>
            <ImageBackground source={require('../src/images/lokalizacja.jpg')} style={{ flex: 1, backgroundColor: Colors.backgroundColor }} imageStyle={{ opacity: 0.3 }}>
                {content}
            </ImageBackground>
        </View>
    );

}

function renderMarker(point, navigation, jadlodajnia, wojewodztwo, miasto) {

    const contentText = "Kliknij by przejść" + '\n' + "do jadłodajni";
    return (

        <Marker coordinate={{
            latitude: point.latitude,
            longitude: point.longitude
        }}
            key={point.id}
            onCalloutPress={() => {
                navigation.navigate('JadlodajnieWiecej', { jadlodajniaSlug: jadlodajnia.slug, wojewodztwo: wojewodztwo, miasto: miasto });
            }}
        >
            <Callout tooltip={true} >
                <Card
                    pressEnabled={false}
                    containerStyle={{
                        borderRadius: 0,
                        borderColor: Colors.accent,
                        borderWidth: 0,
                    }}
                    cardStyle={{ borderRadius: dimensions.defaultHugeBorderRadius, borderColor: Colors.accent, borderWidth: dimensions.defaultBorderWidth, }}
                    content={
                        <View style={{ alignItems: 'center' }}>
                            <Text style={{ fontSize: 12 }}>{jadlodajnia.name}</Text>
                            <Text style={{ fontSize: 12 }}>{point.address}</Text>
                            <IosButton text={contentText} buttonStyle={{ fontSize: 14 }} />
                        </View>
                    }
                />
            </Callout>
        </Marker>
    )
}
const Mapa = props => {

    const forFade = ({ current, closing }) => ({
        cardStyle: {
            opacity: current.progress,
        },
    });

    const Stack = createStackNavigator();

    return (
        <Stack.Navigator initialRouteName="Mapa" screenOptions={ScreenStyle}>
            <Stack.Screen name="Mapa" component={MapaScreen} options={{
                headerTitle: Strings.mapa,
            }} initialParams={{ drawerNavigation: props.navigation }} />
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
        flex: 1,
    }
})



export default Mapa;