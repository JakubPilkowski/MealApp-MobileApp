import React from 'react';
import { View, Text, StyleSheet, FlatList } from "react-native";


import JadlodajniaNoteWithIcon from './JadlodajniaNoteWithIcon';
import dimensions from '../src/themes/dimensions';
import Colors from '../src/themes/colors';

import { FontAwesome, Feather } from 'react-native-vector-icons';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';



const InformacjeOgolneJadlodajnia = props => {

    const informacje = props.informacje;
    console.log(informacje);
    return (
        <View style={{ flex: 1 }}>
            <View style={{ marginHorizontal: dimensions.defaultMargin }}>
                <Text style={styles.centerAlignText}>Adres</Text>
                <JadlodajniaNoteWithIcon icon={
                    <FontAwesome size={36} color={Colors.primary} name="map-marker"></FontAwesome>
                } content={
                    <View style={styles.textContainer}>
                        <Text style={styles.rightAlignText}>{informacje.adres}</Text>
                    </View>
                } />
                <Text style={styles.centerAlignText}>Kontakt</Text>
                <JadlodajniaNoteWithIcon
                    icon={
                        <FontAwesome size={36} color={Colors.primary} name="phone"></FontAwesome>
                    }
                    content=
                    {
                        <View style={styles.textContainer}>
                            {informacje.kontakt.map(kontakt => renderKontakty(kontakt))}
                        </View>
                    }
                />
                <Text style={styles.centerAlignText}>Godziny otwarcia</Text>
                <JadlodajniaNoteWithIcon
                    icon={
                        <Feather name="clock" size={36} color={Colors.primary}></Feather>
                    }
                    content={
                        <View style={styles.textContainer}>
                            {informacje.godzinyOtwarcia.map(godzina => renderGodzinyOtwarcia(godzina))}
                        </View>
                    }
                />
            </View>
            <Text style={styles.centerAlignText}>Mapa</Text>
            <View style={{ borderWidth: 2, borderColor: Colors.accent, margin: dimensions.defaultMargin, }}>
                <MapView provider={PROVIDER_GOOGLE} style={{ height: 200, borderColor: Colors.primary, borderWidth: dimensions.borderWidth }} initialRegion={{
                    latitude: 53.77020960646819,
                    longitude: 20.4703061185026,
                    longitudeDelta: 0.003,
                    latitudeDelta: 0.003
                }} minZoomLevel={10} >
                    <Marker coordinate={{
                        latitude: informacje.mapa.szerokoscGeo,
                        longitude: informacje.mapa.dlugoscGeo
                    }}>
                        {/* <View style={{ flexDirection: 'row' }}> */}
                        {/* <Text>{props.nazwa}</Text> */}
                        <FontAwesome size={36} color={Colors.primary} name="map-marker"></FontAwesome>
                        {/* </View> */}

                    </Marker>
                </MapView>
            </View>
        </View>
    );
}

function renderKontakty(kontakt) {
    return (
        <Text style={styles.rightAlignText}>{kontakt.numer}</Text>
    );
}

function renderGodzinyOtwarcia(godzina) {
    return (
        <Text style={styles.rightAlignText}>{godzina.godzina}</Text>
    );
}

const styles = StyleSheet.create({

    textContainer: {
        marginLeft: dimensions.defaultMargin,
        flexDirection: 'column',
        flex: 1
    },
    rightAlignText: {
        textAlign: 'left',
        fontSize: dimensions.defaultFontSize,
        marginRight: dimensions.defaultSmallMargin
    },
    centerAlignText: {
        textAlign: 'center',
        fontSize: dimensions.hugeFontSize,
    },

});


export default InformacjeOgolneJadlodajnia;