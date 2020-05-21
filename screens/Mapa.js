import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button, ActivityIndicator, FlatList, ImageBackground } from 'react-native';
import JadlodajnieWiecej from './JadlodajnieWiecej';
import { createStackNavigator } from '@react-navigation/stack';
import Colors from "../src/themes/colors";
import Strings from "../src/themes/strings";
import IconWithAction from "../components/IconWithAction";
import ScreenStyle from "../src/themes/screenStyle";
import Connection from "../service/Connection";
import dimensions from '../src/themes/dimensions';
import Card from "../components/Card";
import { Feather } from 'react-native-vector-icons';
import IosButton from "../components/IosButton";
import MapView, { PROVIDER_GOOGLE, Marker, Callout } from 'react-native-maps';
import colors from '../src/themes/colors';
import CustomLoadingComponent from '../components/CustomLoadingComponent';


function MapaScreen({ navigation, route }) {

    const [isLoading, setIsLoading] = useState(true);
    const [dataSource, setDataSource] = useState([]);
    async function fetchData() {
        if (isLoading) {
            setTimeout(async function () {
                const res = await Connection.getMapy();
                res
                    .json()
                    .then(res => {
                        setDataSource(res.punkty);
                        setIsLoading(false);
                    })
                    .catch(err => console.log(err + 'blad'));
            }, 500);
        }
    }

    navigation.addListener("focus", ()=>{
        setIsLoading(true);   
    })

    useEffect(() => {
        fetchData();
    },[isLoading]);

    const HomeButtonHandler = () => {
        navigation.openDrawer();
    }
    navigation.setOptions({
        headerLeft: () => (
            <IconWithAction content={<Feather name="menu" size={26} color={Colors.colorTextWhite} />} onClick={HomeButtonHandler} />
        )
    });
    if (isLoading) {
        return (
            <ImageBackground source={require('../src/images/lokalizacja.jpg')} style={{ flex: 1, backgroundColor: Colors.backgroundColor }} imageStyle={{ opacity: 0.3 }}>
                <CustomLoadingComponent />
            </ImageBackground>
        );
    }
    else {
        return (
            <View style={styles.container}>
                <MapView provider={PROVIDER_GOOGLE} style={{ flex: 1 }} initialRegion={{
                    latitude: 53.77020960646819,
                    longitude: 20.4703061185026,
                    longitudeDelta: 0.15,
                    latitudeDelta: 0.15
                }}  >
                    {dataSource.map(point => renderMarker(point, navigation))}
                </MapView>
            </View>
        );
    }
}
function renderMarker(point, navigation) {
    const contentText = "Kliknij by przejść" + '\n' + "do jadłodajni";
    return (
        <Marker coordinate={{
            latitude: point.szerokoscGeo,
            longitude: point.dlugoscGeo
        }}
            key={point.id}
            onCalloutPress={() => {
                navigation.navigate('JadlodajnieWiecej', { jadlodajniaId: point.jadlodajnia_id });
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
                    cardStyle={{ borderRadius: dimensions.defaultHugeBorderRadius, borderColor: colors.accent, borderWidth: dimensions.defaultBorderWidth, }}
                    content={
                        <View style={{ alignItems: 'center' }}>
                            <Text style={{ fontSize: 12 }}>{point.title}</Text>
                            <Text style={{ fontSize: 12 }}>{point.szczegóły}</Text>
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
            }} initialParams={{}} />
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