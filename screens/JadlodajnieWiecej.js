import React, { useState, useEffect, useRef} from 'react';
import { View, Text, StyleSheet, Animated, ScrollView, SafeAreaView, ActivityIndicator, TouchableOpacity, Dimensions, ImageBackground } from 'react-native';
import Colors from "../src/themes/colors";
import dimensions from '../src/themes/dimensions';
import Strings from "../src/themes/strings";
const HEADER_EXPANDED_HEIGHT = 225;
const HEADER_COLLAPSED_HEIGHT = 56;
import { Ionicons, FontAwesome, Feather } from '@expo/vector-icons';
import Connection from '../api/Connection';
import { FlatList } from 'react-native-gesture-handler';
import Zestaw from '../components/Zestaw';
import InformacjeOgolneJadlodajnia from '../components/InformacjeOgolneJadlodajnia';
const { width, height } = Dimensions.get('window');

const JadlodajnieWiecej = props => {


    const szczegoly = [];
    
    const [isLoading, setIsLoading] = useState(true);
    const [dataSource, setDataSource] = useState([]);
    const [scrollY, setScrollY] = useState(new Animated.Value(0));
    const scrollRef = useRef(null);

    async function fetchData() {
        if (isLoading) {
            const res = await Connection.getSzczegolyJadlodajnia();
            res
                .json()
                .then(res => {
                    setDataSource(res.szczegoly);
                    setIsLoading(false);
                })
                .catch(err => console.log(err + 'blad'));
        }
    }

    useEffect(() => {
        fetchData();
    }, isLoading);


        if (isLoading) {
            return <View style={{ flex: 1 }}>
                <ActivityIndicator></ActivityIndicator>
            </View>
        }
        else {
            let currentWidth = 0;
            const szczegoly = dataSource;
            const zestawRange = szczegoly.zestawy.length;
            const { jadlodajniaId } = props.route.params;
            const headerHeight = scrollY.interpolate(
                {
                    inputRange: [0, HEADER_EXPANDED_HEIGHT - HEADER_COLLAPSED_HEIGHT],
                    outputRange: [HEADER_EXPANDED_HEIGHT, HEADER_COLLAPSED_HEIGHT],
                    extrapolate: 'clamp'
                })
            const headerTitleOpacity = scrollY.interpolate({
                inputRange: [0, HEADER_EXPANDED_HEIGHT - HEADER_COLLAPSED_HEIGHT],
                outputRange: [0, 1],
                extrapolate: 'clamp'
            });
            const heroTitleOpacity = scrollY.interpolate({
                inputRange: [0, HEADER_EXPANDED_HEIGHT - HEADER_COLLAPSED_HEIGHT],
                outputRange: [1, 0],
                extrapolate: 'clamp'
            });
            return (
                <View style={styles.container}>
                    <ImageBackground source={require('../src/images/zupka.jpg')} imageStyle={{opacity:0.3}} style={{flex:1, backgroundColor:Colors.backgroundColor}}>
                        <Animated.View style={[styles.header, { height: headerHeight }]} >
                            <Animated.View style={styles.headerImageContainer}>
                                <Animated.Image source={{ uri: szczegoly.imageUrl }}
                                    style={[styles.headerImage, {
                                        height: headerHeight,
                                        opacity: heroTitleOpacity,
                                    }]}
                                ></Animated.Image>
                                <Animated.Text style={[styles.headerExpanded, { opacity: 1 }]}>{szczegoly.nazwa} </Animated.Text>
                            </Animated.View>
                        </Animated.View>
                        <View style={styles.backButtonContainer}>
                            <TouchableOpacity
                                onPress={() => {
                                    props.navigation.goBack();
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
                                            y: scrollY
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
                            <Text style={{ fontSize: 20, textAlign: "center", marginVertical: dimensions.defaultHugeMargin }}>Zestawy</Text>
                            <View style={{ flex: 1, flexDirection: 'row', marginBottom: dimensions.defaultMarginBetweenItems }}>
                                <View style={{ flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: 50 }}>
                                    <TouchableOpacity onPress={() => {
                                        if (currentWidth === 0) {
                                            return;
                                        }
                                        else {
                                            currentWidth = currentWidth - (width - 100);
                                            scrollRef.current.scrollTo({ x: currentWidth });
                                        }
                                    }}>
                                        <Feather name="arrow-left-circle" color={Colors.primary} size={36}></Feather>
                                    </TouchableOpacity>
                                </View>
                                <ScrollView
                                    horizontal={true}
                                    scrollEnabled={false}
                                    showsHorizontalScrollIndicator={false}
                                    ref={scrollRef}
                                    >
                                    <FlatList data={szczegoly.zestawy}
                                        horizontal={true}
                                        renderItem={itemData =>
                                            <Zestaw date={itemData.item.data} name={itemData.item.nazwa} price={itemData.item.cena}></Zestaw>}
                                        keyExtractor={itemData => itemData.zestaw_id}
                                    />
                                </ScrollView>
                                <View style={{ flexDirection: 'column', justifyContent: 'center', alignItems: "center", width: 50 }}>
                                    <TouchableOpacity onPress={() => {
                                        currentWidth = currentWidth + width - 100;
                                        scrollRef.current.scrollTo({ x: currentWidth });
                                    }}>
                                        <Feather name="arrow-right-circle" color={Colors.primary} size={36}></Feather>
                                    </TouchableOpacity>
                                </View>
                            </View>
                            <Text style={{ textAlign: "center", fontSize: 20, marginBottom: dimensions.defaultHugeMargin }}>Dostępne punkty</Text>
                            <SafeAreaView>
                                {szczegoly.lokalizacje.map(lokalizacja => renderInformacje(szczegoly, lokalizacja))}
                            </SafeAreaView>

                        </ScrollView>
                    </ImageBackground>
                </View>
            )
        }
    }


function renderInformacje(szczegoly, lokalizacja) {
    return (
        <InformacjeOgolneJadlodajnia nazwa={szczegoly.nazwa} informacje={lokalizacja} />
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: Colors.backgroundColor
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

    centerAlignText: {
        textAlign: 'center',
        fontSize: dimensions.hugeFontSize,
    },
    rightAlignText: {
        textAlign: 'right',
        fontSize: dimensions.defaultFontSize,
        marginRight: dimensions.defaultSmallMargin
    }
});


export default JadlodajnieWiecej;