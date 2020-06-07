import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, ScrollView, SafeAreaView, FlatList, TouchableOpacity, Dimensions, ImageBackground, ToastAndroid, BackHandler, NativeModules, Platform, AsyncStorage } from 'react-native';
import Colors from "../src/themes/colors";
import dimensions from '../src/themes/dimensions';
const { StatusBarManager } = NativeModules;
const HEADER_EXPANDED_HEIGHT = 225 + StatusBarManager.HEIGHT;
const HEADER_COLLAPSED_HEIGHT = 56 + StatusBarManager.HEIGHT;
import {FontAwesome, Feather, MaterialCommunityIcons, AntDesign } from '@expo/vector-icons';
import Connection from '../service/Connection';
import PlaceHolder from "../components/PlaceHolder";
import IconWithAction from '../components/IconWithAction';
import CustomLoadingComponent from '../components/CustomLoadingComponent';
import JadlodajnieLocalizationDetails from '../components/JadlodajnieLocalizationDetails';
import ZestawsView from '../components/ZestawsView';
const { width } = Dimensions.get('window');

const JadlodajnieWiecej = props => {

    const [isLoading, setIsLoading] = useState(true);
    const [dataSource, setDataSource] = useState([]);
    const { jadlodajniaSlug, wojewodztwo, miasto, } = props.route.params;
    const [scrollY, setScrollY] = useState(new Animated.Value(0));
    const scrollRef = useRef(null);
    const [iconColor, setIconColor] = useState("white");
    const [isFavourite, setIsFavourite] = useState(false);
    const [scrollIndex, setScrollIndex] = useState(0);
    const [favouriteButtonEnabled, setFavouriteButtonEnabled] = useState(true);
    const colors = ['crimson', 'darkgreen', 'darkmagenta', 'darkorange', 'darkturquoise', 'hotpink'];
    const [display, setDisplay] = useState(true);
    const [error, setError] = useState("");
    const [errorType, setErrorType] = useState("default");
    async function fetchData() {
        AsyncStorage.setItem("refresh", "false");
        const res = Connection.getSzczegolyJadlodajnia(jadlodajniaSlug, wojewodztwo, miasto);
        res
            .then(res => {
                setDataSource(res);
                const date = new Date().toJSON().slice(0, 10);
                res.menuList.map((data, dataIndex) => {
                    const splitedDate = data.date.split("T");
                    if (splitedDate[0] == date)
                        setScrollIndex(dataIndex);
                })
                setIsLoading(false);
            })
            .catch(err => {
                if (err === "Brak internetu")
                    setErrorType("network")
                else
                    setErrorType("default")
                setError(err);
                setIsLoading(false);
            });
           
    }
    props.navigation.dangerouslyGetParent().setOptions({
        gestureEnabled: false
    })

    useEffect(() => {
        if (isLoading) {
            setError("");
            setErrorType("default");
            fetchData();
        }
    }, [isLoading]);

    BackHandler.addEventListener('hardwareBackPress', () => {
        setDisplay(false);
    })
    let content;

    if (isLoading) {
        content = <CustomLoadingComponent />
    }
    else {

        if (error != "") {
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
            const headerHeight = scrollY.interpolate(
                {
                    inputRange: [0, HEADER_EXPANDED_HEIGHT - HEADER_COLLAPSED_HEIGHT],
                    outputRange: [HEADER_EXPANDED_HEIGHT, HEADER_COLLAPSED_HEIGHT],
                    extrapolate: 'clamp'
                })
            const heroTitleOpacity = scrollY.interpolate({
                inputRange: [0, HEADER_EXPANDED_HEIGHT - HEADER_COLLAPSED_HEIGHT],
                outputRange: [1, 0],
                extrapolate: 'clamp'
            });
            const titlePadding = scrollY.interpolate({
                inputRange: [0, (HEADER_EXPANDED_HEIGHT - HEADER_COLLAPSED_HEIGHT) / 2, HEADER_EXPANDED_HEIGHT - HEADER_COLLAPSED_HEIGHT],
                outputRange: [6, 0, 0]
            });
            const titleBackground = scrollY.interpolate({
                inputRange: [0, (HEADER_EXPANDED_HEIGHT - HEADER_COLLAPSED_HEIGHT) / 2, HEADER_EXPANDED_HEIGHT - HEADER_COLLAPSED_HEIGHT],
                outputRange: [Colors.primary, 'transparent', 'transparent']
            })
            let staticContent;
            let staticContentValue = "";
            let dailyContent;
            dataSource.menuList.map(menuLista => {
                menuLista.contentList.map(content => {
                    if (content.type === "STATIC") {
                        staticContentValue = content.content;
                    }
                })
            })

            if (staticContentValue === "") {
                staticContent =
                    <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                        <MaterialCommunityIcons name="food-off" color={Colors.primary} size={56} />
                        <Text style={{ fontSize: 16, textAlign: 'center' }}>Ta jadłodajnia nie udostępnia menu głównego na dzisiaj</Text>
                    </View>
            }
            else {
                staticContent =
                    <Text style={{ fontSize: 16, textAlign: 'justify' }}>{staticContentValue}</Text>
            }
            if (dataSource.menuList.length > 0) {
                dailyContent =
                    <View style={{ flex: 1, flexDirection: 'row' }}>
                        <View style={{ flexDirection: 'column', alignItems: 'center', justifyContent: 'center', paddingRight: 6 }}>
                            <TouchableOpacity onPress={() => {
                                if (scrollIndex !== 0) {
                                    let index = scrollIndex - 1;
                                    setScrollIndex(index);
                                    scrollRef.current.scrollToIndex({ animated: true, index: index });
                                }
                            }}>
                                <Feather name="arrow-left-circle" color={Colors.primary} size={36}></Feather>
                            </TouchableOpacity>
                        </View>
                        <FlatList data={dataSource.menuList}
                            horizontal={true}
                            scrollEnabled={false}
                            getItemLayout={(data, index) => (
                                { length: width - 120, offset: (width - 120) * index, index }
                            )
                            }
                            initialScrollIndex={scrollIndex}
                            showsHorizontalScrollIndicator={false}
                            ref={scrollRef}
                            renderItem={itemData =>
                                <View style={{ flexDirection: 'column', width: width - 120, }}>
                                    <ZestawsView date={itemData.item.date} contentList={itemData.item.contentList} />
                                </View>
                            }
                            keyExtractor={item => item.id.toString()}
                        />
                        <View style={{ flexDirection: 'column', justifyContent: 'center', alignItems: "center", paddingStart: 6 }}>
                            <TouchableOpacity onPress={() => {
                                if (scrollIndex < dataSource.menuList.length - 1) {
                                    let index = scrollIndex + 1;
                                    setScrollIndex(index);
                                    scrollRef.current.scrollToIndex({ index: index });
                                }
                            }}>
                                <Feather name="arrow-right-circle" color={Colors.primary} size={36}></Feather>
                            </TouchableOpacity>
                        </View>
                    </View>
            }
            else {
                dailyContent =
                    <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                        <MaterialCommunityIcons name="food-off" color={Colors.primary} size={56} />
                        <Text style={{ fontSize: 16, textAlign: 'center' }}>Ta jadłodajnia nie udostępnia aktualności na dzisiaj</Text>
                    </View>
            }

            content =
                <View>
                    <Animated.View style={[styles.header, { height: headerHeight }]} >
                        <Animated.View style={styles.headerImageContainer}>
                            <Animated.Image source={{ uri: dataSource.photoUrl }}
                                style={[styles.headerImage, {
                                    height: headerHeight,
                                    opacity: heroTitleOpacity,
                                }]}
                            ></Animated.Image>
                            <Animated.Text style={[styles.headerExpanded, { backgroundColor: titleBackground, padding: titlePadding }]}>{dataSource.name}</Animated.Text>
                        </Animated.View>
                    </Animated.View>
                    <Animated.View style={[styles.backButtonContainer, { left: 0 }]}>
                        <IconWithAction containerStyle={{ backgroundColor: titleBackground, width: 36, height: 36, borderRadius: 24 }}
                            content={<AntDesign name="arrowleft" size={28} color={Colors.colorTextWhite}></AntDesign>}
                            onClick={() => {
                                setDisplay(false);
                                // onGoBack();
                                props.navigation.goBack();
                            }}
                        />
                    </Animated.View>
                    <View style={[styles.backButtonContainer, { right: 0 }]}>
                        <IconWithAction containerStyle={{ backgroundColor: titleBackground, width: 36, height: 36, borderRadius: 24 }} content={<FontAwesome name="star" color={iconColor} size={24} />} onClick={() => {
                            if (favouriteButtonEnabled) {
                                if (isFavourite) {
                                    ToastAndroid.show("Usunięto z ulubionych !!!", ToastAndroid.SHORT);
                                    setFavouriteButtonEnabled(false);
                                    setIsFavourite(!isFavourite);
                                    setIconColor("white");
                                    setTimeout(function () {
                                        setFavouriteButtonEnabled(true);
                                    }, 2000);
                                }
                                else {
                                    ToastAndroid.show("Dodano do ulubionych !!!", ToastAndroid.SHORT);
                                    setFavouriteButtonEnabled(false);
                                    setIsFavourite(!isFavourite);
                                    setIconColor("gold");
                                    setTimeout(function () {
                                        setFavouriteButtonEnabled(true);
                                    }, 2000);
                                }
                            }
                        }} />
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
                        <View style={{
                            backgroundColor: Colors.colorTextWhite,
                            marginHorizontal: 12,
                            borderRadius: 12,
                            paddingVertical: 12,
                            padding: 6,
                            marginVertical: 24
                        }}>

                            <Text style={{ fontSize: 20, textAlign: "center", marginBottom: 6 }}>Aktualności</Text>
                            {dailyContent}

                        </View>
                        <View style={{ backgroundColor: Colors.colorTextWhite, marginHorizontal: 12, borderRadius: 12, padding: 14, marginBottom: 24 }}>
                            <Text style={{ textAlign: 'center', fontSize: 20, marginBottom: 6 }}>
                                Menu główne
                        </Text>
                            {staticContent}
                        </View>
                        <View style={{ backgroundColor: Colors.colorTextWhite, marginHorizontal: 12, borderRadius: 12, padding: 14, marginBottom: 24 }}>
                            <Text style={{ textAlign: 'center', fontSize: 20, marginBottom: 6 }}>
                                Tagi
                        </Text>
                            <View style={{ flexWrap: 'wrap', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                                {dataSource.eatingHouseTagList.map((tag, index) => {
                                    let colorIndex = Math.floor(Math.random() * (Math.floor(6) - Math.ceil(0))) + Math.ceil(0);
                                    return (
                                        <View style={{ height: 40, borderRadius: 20, paddingHorizontal: 18, justifyContent: 'center', paddingVertical: 3, marginBottom: 12, borderColor: colors[colorIndex], borderWidth: 2 }}>
                                            <Text style={{ textAlign: 'center', color: colors[colorIndex], fontSize: 16 }}>{tag.name}</Text>
                                        </View>)
                                })}
                            </View>
                        </View>
                        <View style={{ backgroundColor: Colors.colorTextWhite, marginHorizontal: 12, borderRadius: 12, padding: 14, marginBottom: 24 }}>
                            <Text style={{ textAlign: 'center', fontSize: 20, }}>
                                Dostępne Punkty
                        </Text>
                        </View>
                        <SafeAreaView style={{ display: display ? 'flex' : 'none' }}>
                            {dataSource.addressList.map(localizationInfo => renderLocalizationInfo(dataSource, localizationInfo))}
                        </SafeAreaView>
                    </ScrollView>
                </View>
        }
    }

    return (
        <View style={styles.container}>
            <ImageBackground source={require('../src/images/zupka.jpg')} imageStyle={{ opacity: 0.3 }} style={{ flex: 1, backgroundColor: Colors.backgroundColor }}>
                {content}
            </ImageBackground >
        </View >)
}


function renderLocalizationInfo(informacje, lokalizacja) {
    return (
        <JadlodajnieLocalizationDetails informacje={lokalizacja} />
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
        top: StatusBarManager.HEIGHT,
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
        textAlign: 'center', fontSize: dimensions.toolbarFontSize, borderRadius: 6, color: Colors.colorTextWhite, position: 'absolute', bottom: dimensions.defaultMargin
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