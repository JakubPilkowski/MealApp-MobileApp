import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button, ActivityIndicator, FlatList } from 'react-native';
import JadlodajnieWiecej from './JadlodajnieWiecej';
import { createStackNavigator } from '@react-navigation/stack';
import Colors from "../src/themes/colors";
import Strings from "../src/themes/strings";
import IconWithAction from "../components/IconWithAction";
import ScreenStyle from "../src/themes/screenStyle";
import Connection from "../api/Connection";
import dimensions from '../src/themes/dimensions';
import { FontAwesome, Feather } from 'react-native-vector-icons';
import IosButton from "../components/IosButton";
import MapView, { PROVIDER_GOOGLE, Marker, Callout } from 'react-native-maps';


function MapaScreen({ navigation, route }) {
    const { punkty } = route.params;
    const points = [];
    punkty.map((punkt) => {
        points.push(punkt);
    });
    console.log(points);
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
            <MapView provider={PROVIDER_GOOGLE} style={{ flex: 1 }} initialRegion={{
                latitude: 53.77020960646819,
                longitude: 20.4703061185026,
                longitudeDelta: 0.3,
                latitudeDelta: 0.3
            }}  >
                {points.map(point => renderMarker(point, navigation))}
            </MapView>
        </View>
    );
}
function renderMarker(point, navigation) {
    const contentText = "Kliknij by przejsc" + '\n' + "do jadłodajni";
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
            <Callout>
                <View style={{ alignItems: 'center' }}>
                    <Text>{point.title}</Text>
                    <Text>{point.szczegóły}</Text>
                    <IosButton text={contentText} />
                </View>
            </Callout>
        </Marker>
    )
}
const Mapa = props => {

    const [isLoading, setIsLoading] = useState(true);
    const [dataSource, setDataSource] = useState([]);

    async function fetchData() {
        const res = await fetch("http://www.mocky.io/v2/5e7a4d4730000078009309fa");
        res
            .json()
            .then(res => {
                setDataSource(res.punkty);
                setIsLoading(false);
            })
            .catch(err => console.log(err + 'blad'));
    }

    useEffect(() => {
        fetchData();
    });

    // useEffect(() => {
    //     Connection.getMapy().
    //         then((response) => response.json()).
    //         then((responseJson) => {
    //             setIsLoading(false);
    //             setDataSource(responseJson.punkty);
    //         })
    //         .catch((error) => {
    //             console.log('blad ' + error);
    //         });
    // }, isLoading);

    const Stack = createStackNavigator();
    if (isLoading) {
        return (
            <View style={{ flex: 1 }}>
                <ActivityIndicator></ActivityIndicator>
            </View>
        );
    }
    return (
        <Stack.Navigator initialRouteName="Mapa" screenOptions={ScreenStyle}>
            <Stack.Screen name="Mapa" component={MapaScreen} options={{
                headerTitle: Strings.mapa,
            }} initialParams={{ punkty: dataSource }} />
            <Stack.Screen name="JadlodajnieWiecej" component={JadlodajnieWiecej}
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