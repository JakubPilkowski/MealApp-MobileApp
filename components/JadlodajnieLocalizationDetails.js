import React from 'react';
import { View, Text, StyleSheet } from "react-native";
import JadlodajniaNoteWithIcon from './JadlodajniaNoteWithIcon';
import dimensions from '../src/themes/dimensions';
import Colors from '../src/themes/colors';
import { FontAwesome, Feather } from 'react-native-vector-icons';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';

const JadlodajnieLocalizationDetails = props => {

    const informacje = props.informacje;

    let adres;
    let kontakt;
    let godzinyOtwarcia;

    if (informacje.address !== "") {
        adres = informacje.address;
    }
    else {
        adres = "Ta jadłodajnia nie udostępnia adresu";
    }


    if (informacje.phoneNumber !== "") {
        kontakt = informacje.phoneNumber;
    }
    else {
        kontakt = "Ta jadłodajnia nie udostępnia kontaktu";
    }



    if (informacje.openHoursList.length > 0) {
        godzinyOtwarcia = informacje.openHoursList.map((openHour) => renderGodzinyOtwarcia(openHour));
    }
    else {
        godzinyOtwarcia =
            <Text style={styles.rightAlignText}>Ta Jadłodajnia nie udostępnia godzin otwarcia</Text>
    }

    return (
        <View style={{ flex: 1 }}>
            <View style={styles.infoBackground}>
                <Text style={styles.centerAlignText}>Adres</Text>
                <JadlodajniaNoteWithIcon icon={
                    <FontAwesome size={36} color={Colors.primary} name="map-marker"></FontAwesome>
                } content={
                    <View style={styles.textContainer}>
                        <Text style={styles.rightAlignText}>{adres}</Text>
                    </View>
                } />
            </View>
            <View style={styles.infoBackground}>
                <Text style={styles.centerAlignText}>Kontakt</Text>
                <JadlodajniaNoteWithIcon
                    icon={
                        <FontAwesome size={36} color={Colors.primary} name="phone"></FontAwesome>
                    }
                    content=
                    {
                        <View style={styles.textContainer}>
                            <Text style={styles.rightAlignText}>{kontakt}</Text>
                        </View>
                    }
                />
            </View>
            <View style={styles.infoBackground}>

                <Text style={styles.centerAlignText}>Godziny otwarcia</Text>
                <JadlodajniaNoteWithIcon
                    icon={
                        <Feather name="clock" size={36} color={Colors.primary}></Feather>
                    }
                    content={
                        <View style={styles.textContainer}>
                            {godzinyOtwarcia}
                        </View>
                    }
                />
            </View>
            <View style={styles.infoBackground}>

                <Text style={[styles.centerAlignText, { marginBottom: 6 }]}>Mapa</Text>
                <View >
                    <MapView provider={PROVIDER_GOOGLE}
                        scrollEnabled={false}
                        rotateEnabled={false}
                        pitchEnabled={false}
                        zoomEnabled={false}
                        style={{ height: 200, borderColor: Colors.primary, borderWidth: dimensions.borderWidth }} initialRegion={{
                            latitude: informacje.latitude,
                            longitude: informacje.longitude,
                            longitudeDelta: 0.003,
                            latitudeDelta: 0.003
                        }} minZoomLevel={10} >
                        <Marker coordinate={{
                            latitude: informacje.latitude,
                            longitude: informacje.longitude
                        }}>
                            <FontAwesome size={36} color={Colors.primary} name="map-marker"></FontAwesome>
                        </Marker>
                    </MapView>
                </View>
            </View>
        </View>
    );
}

function renderGodzinyOtwarcia(openHour) {
    const result = openHour.day + ": " + openHour.fromHour + "-" + openHour.toHour;
    return (
        <Text style={styles.rightAlignText}>{result}</Text>
    );
}

const styles = StyleSheet.create({

    infoBackground: {
        backgroundColor: Colors.colorTextWhite,
        marginHorizontal: 12,
        borderRadius: 12,
        padding: 6,
        marginBottom: 24
    },
    textContainer: {
        marginLeft: dimensions.defaultMargin,
        flexDirection: 'column',
        flex: 1,
    },
    rightAlignText: {
        textAlign: 'left',
        fontSize: 16,
        marginRight: dimensions.defaultSmallMargin
    },
    centerAlignText: {
        textAlign: 'center',
        fontSize: 20,
    },

});


export default JadlodajnieLocalizationDetails;