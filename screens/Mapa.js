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
import CustomPicker from "../components/CustomPicker";
import { Feather, AntDesign, FontAwesome } from 'react-native-vector-icons';
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

    async function fetchData() {
        if (isLoading) {
            setTimeout(async function () {
                const wojewodztwoValue = await AsyncStorage.getItem("wojewodztwo");
                const miastoValue = await AsyncStorage.getItem("miasto");
                const latitudeValue = await AsyncStorage.getItem('latitude');
                const longitudeValue = await AsyncStorage.getItem('longitude');
                const zoomValue = await AsyncStorage.getItem('zoom');
                getWojewodztwa();
                getMiastaForWojewodztwo(wojewodztwoValue);
                setWojewodztwo(wojewodztwoValue);
                setMiasto(miastoValue);
                setLatitude(Number(latitudeValue));
                setLongitude(Number(longitudeValue));
                setZoom(Number(zoomValue));
                getMapy(wojewodztwoValue, miastoValue);
                setIsLoading(false);
            }, 500);
        }
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
                setIsLoading(false);
                setIsPickerLoading(false);
                setWojewodztwoEnabled(true);
                setMiastoEnabled(true);
            })
            .catch(err => console.log(err + 'blad'));
    }
    //pobieranie punktów na mapie
    async function getMapy(wojewodztwo, miasto) {
        console.log("wojewodztwo " + wojewodztwo);
        console.log("miasto " + miasto);
        const mapsResponse = await Connection.getMapy(wojewodztwo, miasto);
        mapsResponse
            .json()
            .then(res => {
                // res.map((punkt) => {
                //     setDataSource(punkty => [...punkty, { id: punkt.id, name: punkt.name, slug: punkt.slug, addressList: punkt.addressList }]);
                // })
                setDataSource(res);
                setSearchResultsLoading(false);
                console.log(res);
            })
            .catch(err => console.log(err + 'blad'));
    }
    //widok wyboru nowej lokalizacji
    const toggleSearchView = () => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setExpanded(!expanded);
    }

    const onSearchClickedHandler = () => {
        setMapLoaded(false);
        toggleSearchView();
        setSearchResultsLoading(true);
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
        //setMapLoaded(false);
        setIsLoading(true);
    })

    //rerender ekranu
    useEffect(() => {
        if (searchResultsLoading) {
            getMapy(wojewodztwo, miasto);
        }
        else {
            fetchData();
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
    //renderowanie ekranu
    if (isLoading || searchResultsLoading) {
        return (
            <ImageBackground source={require('../src/images/lokalizacja.jpg')} style={{ flex: 1, backgroundColor: Colors.backgroundColor }} imageStyle={{ opacity: 0.3 }}>
                <CustomLoadingComponent />
            </ImageBackground>
        );
    }
    else {
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
                    <ActivityIndicator size="large" color={Colors.primary} animating={isPickerLoading} />
                    {searchButton}
                </View>
                <MapView provider={PROVIDER_GOOGLE} style={{ flex: 1 }} initialRegion={{
                    latitude: latitude,
                    longitude: longitude,
                    longitudeDelta: zoom,
                    latitudeDelta: zoom
                }}  >
                    {dataSource.map(jadlodajnia =>
                        jadlodajnia.addressList.map(punkt =>
                            renderMarker(punkt, navigation,jadlodajnia)
                            )
                    )}
                </MapView>
            </View>
        );
    }
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
                // navigation.navigate('JadlodajnieWiecej', { jadlodajniaSlug: jadlodajnia.slug, wojewodztwo: wojewodztwo, miasto: miasto });
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