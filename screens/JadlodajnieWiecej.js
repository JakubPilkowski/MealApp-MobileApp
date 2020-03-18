import React, { useState } from 'react';
import { View, Text, StyleSheet, Animated, ScrollView, Image, TouchableNativeFeedback, TouchableOpacity, Dimensions } from 'react-native';
import Colors from "../src/themes/colors";
import dimensions from '../src/themes/dimensions';
import { Divider } from 'react-native-elements';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import Strings from "../src/themes/strings";
const HEADER_EXPANDED_HEIGHT = 225;
const HEADER_COLLAPSED_HEIGHT = 56;
let currentWidth = 0;
import { Ionicons, FontAwesome, Feather } from '@expo/vector-icons';
import Danie from '../components/Danie';

const { width, height } = Dimensions.get('window');

export default class JadlodajnieWiecej extends React.Component {

    // const {jadlodajnia_id} = props.route;

    constructor(props) {
        super(props);
        this.state = {
            scrollY: new Animated.Value(0)
        }
    }

    render() {

        const headerHeight = this.state.scrollY.interpolate(
            {
                inputRange: [0, HEADER_EXPANDED_HEIGHT - HEADER_COLLAPSED_HEIGHT],
                outputRange: [HEADER_EXPANDED_HEIGHT, HEADER_COLLAPSED_HEIGHT],
                extrapolate: 'clamp'
            })
        const headerTitleOpacity = this.state.scrollY.interpolate({
            inputRange: [0, HEADER_EXPANDED_HEIGHT - HEADER_COLLAPSED_HEIGHT],
            outputRange: [0, 1],
            extrapolate: 'clamp'
        });
        const heroTitleOpacity = this.state.scrollY.interpolate({
            inputRange: [0, HEADER_EXPANDED_HEIGHT - HEADER_COLLAPSED_HEIGHT],
            outputRange: [1, 0],
            extrapolate: 'clamp'
        });
        return (
            <View style={styles.container}>
                <Animated.View style={[styles.header, { height: headerHeight }]} >
                    <Animated.View style={styles.headerImageContainer}>
                        <Animated.Image source={{ uri: 'https://restaumatic.imgix.net/uploads/accounts/28994/media_library/15fdee8f-00c9-4a69-93c0-eb69c6de5727.jpg?auto=compress&crop=focalpoint&fit=crop&h=256&w=341' }}
                            style={[styles.headerImage, {
                                height: headerHeight,
                                opacity: heroTitleOpacity,
                            }]}
                        ></Animated.Image>
                        <Animated.Text style={[styles.headerExpanded, { opacity: 1 }]}>Pełny gar</Animated.Text>
                    </Animated.View>
                </Animated.View>
                <View style={styles.backButtonContainer}>
                    <TouchableOpacity
                        onPress={() => {
                            this.props.navigation.goBack();
                        }}>
                        <Ionicons name="ios-arrow-round-back" size={36} color={Colors.colorTextWhite}></Ionicons>
                    </TouchableOpacity>
                </View>
                <ScrollView
                    contentContainerStyle={styles.scrollContainer}
                    onScroll={Animated.event(
                        [{
                            nativeEvent: {
                                contentOffset: {
                                    y: this.state.scrollY
                                }
                            }
                        }])}
                    scrollEventThrottle={16}
                >
                    {/* <View style={{ flex: 1, flexDirection: 'row', margin: dimensions.defaultMargin }}>
                        <Image style={styles.image}></Image>
                        <View style={{ flexDirection: 'column', justifyContent: "center", flex: 1 }}>
                            <TouchableOpacity onPress={() => { }} >
                                <Text style={styles.avatarName}>Dodaj do ulubionych</Text>
                            </TouchableOpacity>
                            <Divider style={styles.divider}></Divider>
                            <View style={{ flexDirection: 'row' }}>
                                <Text style={styles.avatarName}>Ocena: </Text>
                            </View>
                        </View>
                    </View> */}
                    <Text style={{ fontSize: 20, textAlign: "center", marginBottom: dimensions.defaultHugeMargin }}>Zestawy</Text>
                    <View style={{ flex: 1, flexDirection: 'row', marginBottom: dimensions.defaultMarginBetweenItems }}>
                        <View style={{ flexDirection: 'column',alignItems:'center', justifyContent: 'flex-end', width: 50 }}>
                            <TouchableOpacity onPress={() => {
                                if (currentWidth === 0) {
                                    return;
                                }
                                else {
                                    currentWidth = currentWidth - (width - 100);
                                    this.refs.scroll.scrollTo({ x: currentWidth });
                                }
                            }}>
                                <Feather name="arrow-left-circle" color={Colors.primary} size={36}></Feather>
                            </TouchableOpacity>
                        </View>
                        <ScrollView horizontal={true}
                            scrollEnabled={false}
                            showsHorizontalScrollIndicator={false}
                            ref={'scroll'}
                        >
                            <View style={{ width: width - 100, flexDirection: 'column' }}>
                                <Text style={{ textAlign: "center", fontSize: dimensions.hugeFontSize }}>17.03.2020</Text>
                                <Divider style={[styles.divider, { marginBottom: dimensions.defaultSmallMargin, width: "40%", alignSelf: "center" }]}></Divider>
                                <Danie nazwa="zupka" cena="10"></Danie>
                                <Danie nazwa="kotlecik" cena="10"></Danie>
                            </View>
                            <View style={{ width: width - 100, flexDirection: 'column' }}>
                                <Text style={{ textAlign: "center", fontSize: dimensions.hugeFontSize }}>18.03.2020</Text>
                                <Divider style={[styles.divider, { marginBottom: dimensions.defaultSmallMargin, width: "40%", alignSelf: "center" }]}></Divider>
                                <Danie nazwa="zupka2" cena="10"></Danie>
                                <Danie nazwa="kotlecik2" cena="10"></Danie>
                            </View>
                        </ScrollView>
                        <View style={{ flexDirection: 'column', justifyContent: 'flex-end', alignItems: "center", width: 50 }}>
                            <TouchableOpacity onPress={() => {
                                currentWidth = currentWidth + width - 100;
                                this.refs.scroll.scrollTo({ x: currentWidth });
                            }}>
                                <Feather name="arrow-right-circle" color={Colors.primary} size={36}></Feather>

                            </TouchableOpacity>
                        </View>
                    </View>
                    <Text style={{ textAlign: "center", fontSize: 20, marginBottom: dimensions.defaultHugeMargin }}>Dostępne punkty</Text>
                    <View style={{ marginHorizontal: dimensions.defaultMargin }}>
                        <Text style={styles.centerAlignText}>Adres</Text>
                        <View style={{ flexDirection: "row", marginVertical: dimensions.defaultSmallMargin, justifyContent: 'space-between', alignItems: 'center' }}>
                            <View style={{ width: 50, alignItems: "center" }}>
                                <FontAwesome size={36} color={Colors.primary} name="map-marker"></FontAwesome>
                            </View>
                            <View style={{ marginLeft: dimensions.defaultMargin, flexDirection: 'column', flex: 1 }}>
                                <Text style={styles.rightAlignText}>Przykładowy adres</Text>
                            </View>
                        </View>
                        <Text style={styles.centerAlignText}>Kontakt</Text>
                        <View style={{ flexDirection: "row", marginVertical: dimensions.defaultSmallMargin, justifyContent: 'center', alignItems: "center" }}>
                            <View style={{ width: 50, alignItems: "center" }}>
                                <FontAwesome size={36} color={Colors.primary} name="phone"></FontAwesome>
                            </View>
                            <View style={{ marginLeft: dimensions.defaultMargin, flexDirection: 'column', flex: 1 }}>
                                <Text style={styles.rightAlignText}>Przykładowy kontakt 1</Text>
                                <Text style={styles.rightAlignText}>Przykładowe kontakt 2</Text>
                            </View>
                        </View>
                        <Text style={styles.centerAlignText}>Godziny otwarcia</Text>
                        <View style={{ flexDirection: "row", marginVertical: dimensions.defaultSmallMargin, justifyContent: "center", alignItems: "center" }}>
                            <View style={{ width: 50, alignItems: "center" }}>
                                <Feather name="clock" size={36} color={Colors.primary}></Feather>
                            </View>
                            <View style={{ marginLeft: dimensions.defaultMargin, flexDirection: 'column', flex: 1 }}>
                                <Text style={styles.rightAlignText}>Poniedziałek: 8:00-17:00</Text>
                                <Text style={styles.rightAlignText}>Przykładowe dane</Text>
                                <Text style={styles.rightAlignText}>Przykładowe dane</Text>
                                <Text style={styles.rightAlignText}>Przykładowe dane</Text>
                                <Text style={styles.rightAlignText}>Przykładowe dane</Text>
                                <Text style={styles.rightAlignText}>Przykładowe dane</Text>
                                <Text style={styles.rightAlignText}>Przykładowe dane</Text>
                            </View>
                        </View>
                    </View>
                    <Text style={styles.centerAlignText}>Mapa</Text>
                    <View style={{ borderWidth: 2, borderColor: Colors.accent, margin: dimensions.defaultMargin, }}>
                        <MapView provider={PROVIDER_GOOGLE} style={{ height: 200, borderColor: Colors.primary, borderWidth: dimensions.borderWidth }} initialRegion={{
                            latitude: 53.770168,
                            longitude: 20.470272,
                            longitudeDelta: 0.003,
                            latitudeDelta: 0.003
                        }} minZoomLevel={10} title="adsdasas">
                            <Marker coordinate={{ latitude: 53.76998768366101, longitude: 20.47289226769843 }} title="Pełny gar" description="ul Walentego Barczewskiego 1 " pinColor={Colors.primary} >
                                <FontAwesome size={36} color={Colors.primary} name="map-marker"></FontAwesome>
                            </Marker>
                        </MapView>
                    </View>
                </ScrollView>
            </View>
        )
    }
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
    },
    header: {
        backgroundColor: Colors.primary,
        position: 'absolute',
        width: "100%",
        top: 0,
        left: 0,
        zIndex: 9998
    },
    headerImageContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center'
    },
    backButtonContainer: {
        flex: 1,
        left: 0,
        top: 0,
        position: 'absolute',
        height: 56,
        width: 56,
        alignItems: "center",
        justifyContent: 'center',
        opacity: 1,
        zIndex: 9999
    },
    headerImage: {
        width: "100%"
    },
    headerCollapsed: {
        position: 'absolute', textAlign: "center", fontSize: 18, color: Colors.colorTextWhite, marginTop: 28,
    },
    headerExpanded: {
        textAlign: 'center', fontSize: dimensions.toolbarFontSize, color: Colors.colorTextWhite, position: 'absolute', bottom: dimensions.defaultMargin
    },
    scrollContainer: {
        paddingTop: HEADER_EXPANDED_HEIGHT
    },
    avatarName: {
        fontSize: dimensions.hugeFontSize,
        margin: dimensions.defaultSmallMargin,
        textAlign: "center"
    },
    image: {
        width: 90,
        height: 90,
        borderWidth: dimensions.defaultBorderWidth,
        borderColor: Colors.accent,
        borderRadius: dimensions.defaultHugeBorderRadius
    },
    divider: {
        backgroundColor: Colors.accent,
        height: dimensions.defaultBorderWidth,
        width: "100%"
    },
    centerAlignText: {
        textAlign: 'center',
        fontSize: dimensions.hugeFontSize,
    },
    rightAlignText: {
        textAlign: 'right',
        fontSize: dimensions.defaultFontSize,
        marginRight: dimensions.defaultSmallMargin
    }
})