import React from 'react';
import { View, Text, StyleSheet, Animated, ScrollView, Image, TouchableNativeFeedback, TouchableOpacity } from 'react-native';
import Colors from "../src/themes/colors";
import dimensions from '../src/themes/dimensions';
import { Divider } from 'react-native-elements';
// import Strings from "../src/themes/strings";
const HEADER_EXPANDED_HEIGHT = 225;
const HEADER_COLLAPSED_HEIGHT = 56;

import { Ionicons, FontAwesome, Feather } from '@expo/vector-icons';

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
                    <View style={{ flex: 1, flexDirection: 'row', margin: dimensions.defaultMargin }}>
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
                    </View>
                    <View style={{ flex: 1, flexDirection: 'row' }}>
                        <View style={{ flexDirection: 'column', justifyContent: "center", alignItems: "center", width: 50 }}>
                            <Text>cos</Text>
                        </View>
                        <View style={{ flex: 1, flexDirection: 'column' }}>
                            <Text>18.03.2020</Text>
                            <Divider style={styles.divider}></Divider>
                            <View style={{ flexDirection: 'row' }}>
                                <Text>
                                    Nazwa
                                </Text>
                                <Text>
                                    Cena
                                </Text>
                            </View>
                            <Divider style={styles.divider}></Divider>
                        </View>
                        <View style={{ flexDirection: 'column', justifyContent: "center", alignItems: "center", width: 50 }}>
                            <Text>cos</Text>
                        </View>
                    </View>
                    <View style={{ marginHorizontal: dimensions.defaultMargin }}>
                        <Text style={{textAlign:"center"}}>Adresy</Text>
                        <View style={{ flexDirection: "row", marginVertical: dimensions.defaultSmallMargin, justifyContent:'space-between', alignItems:'center' }}>
                            <FontAwesome size={36} color={Colors.primary} name="map-marker"></FontAwesome>
                            <View style={{marginLeft:dimensions.defaultMargin, flexDirection: 'column', flex:1}}>
                                <Text>ul. kościuszki 19/2</Text>
                                <Text>ul. Jagiellończyka 34/12</Text>
                                <Text>ul. Jagiellończyka 34/12</Text>
                                <Text>ul. Jagiellończyka 34/12</Text>
                            </View>
                        </View>
                        <Text style={{textAlign:"center"}}>Kontakt</Text>
                        <View style={{ flexDirection: "row", marginVertical: dimensions.defaultSmallMargin, justifyContent: 'center', alignItems:"center" }}>
                            <FontAwesome size={36} color={Colors.primary} name="phone"></FontAwesome>
                            <View style={{marginLeft:dimensions.defaultMargin, flexDirection: 'column', flex:1}}>
                                <Text>ul. kościuszki 19/2</Text>
                                <Text>ul. Jagiellończyka 34/12</Text>
                                <Text>ul. Jagiellończyka 34/12</Text>
                                <Text>ul. Jagiellończyka 34/12</Text>
                            </View>
                        </View>
                        <Text style={{textAlign:"center"}}>Godziny otwarcia</Text>
                        <View style={{ flexDirection: "row", marginVertical: dimensions.defaultSmallMargin, justifyContent:"center", alignItems:"center" }}>
                            <Feather name="clock" size={36} color={Colors.primary}></Feather>
                            <View style={{marginLeft:dimensions.defaultMargin, flexDirection: 'column', flex:1}}>
                                <Text>ul. kościuszki 19/2</Text>
                                <Text>ul. Jagiellończyka 34/12</Text>
                                <Text>ul. Jagiellończyka 34/12</Text>
                                <Text>ul. Jagiellończyka 34/12</Text>
                            </View>
                        </View>
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
})