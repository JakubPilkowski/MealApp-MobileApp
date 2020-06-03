import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, ScrollView, SafeAreaView, FlatList, TouchableOpacity, Dimensions, ImageBackground, ToastAndroid, BackHandler } from 'react-native';
import Colors from "../src/themes/colors";
import dimensions from '../src/themes/dimensions';
const HEADER_EXPANDED_HEIGHT = 225;
const HEADER_COLLAPSED_HEIGHT = 56;
import { Ionicons, FontAwesome, Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import Connection from '../service/Connection';
import IconWithAction from '../components/IconWithAction';
import CustomLoadingComponent from '../components/CustomLoadingComponent';
import JadlodajnieLocalizationDetails from '../components/JadlodajnieLocalizationDetails';
import ZestawsView from '../components/ZestawsView';
const { width, height } = Dimensions.get('window');

const JadlodajnieWiecej = props => {

    const [isLoading, setIsLoading] = useState(true);
    const [dataSource, setDataSource] = useState([]);
    const { jadlodajniaSlug, wojewodztwo, miasto } = props.route.params;
    const [scrollY, setScrollY] = useState(new Animated.Value(0));
    const scrollRef = useRef(null);
    const [iconColor, setIconColor] = useState("white");
    const [isFavourite, setIsFavourite] = useState(false);
    const [scrollIndex, setScrollIndex] = useState();
    const [favouriteButtonEnabled, setFavouriteButtonEnabled] = useState(true);
    const [display, setDisplay] = useState(true);
    async function fetchData() {
        if (isLoading) {
            setTimeout(async function () {
                const res = await Connection.getSzczegolyJadlodajnia(jadlodajniaSlug, wojewodztwo, miasto);
                res
                    .json()
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
                    .catch(err => console.log(err + 'blad'));
            }, 200);
        }
    }

    useEffect(() => {
        fetchData();
    }, [isLoading]);
    
    BackHandler.addEventListener('hardwareBackPress', () =>{
        setDisplay(false);
        props.navigation.goBack();
    })
    let content;

    if (isLoading) {
        content = <CustomLoadingComponent />
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
            inputRange: [0, HEADER_EXPANDED_HEIGHT - HEADER_COLLAPSED_HEIGHT],
            outputRange: [6, 0]
        });
        const titleBackground = scrollY.interpolate({
            inputRange: [0, HEADER_EXPANDED_HEIGHT - HEADER_COLLAPSED_HEIGHT],
            outputRange: [Colors.primary, 'transparent']
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
                    <Text style={{ fontSize: 16, textAlign: 'center' }}>Ta jadłodajnia nie udostępnia menu głównego</Text>
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
                    <Text style={{ fontSize: 16, textAlign: 'center' }}>Ta jadłodajnia nie udostępnia aktualności</Text>
                </View>
        }
        // if(isFavourite){
        //     setIconColor("gold");
        // }
        // else{
        //     setIconColor("white");
        // }

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
                <View style={[styles.backButtonContainer, { left: 0 }]}>
                    <TouchableOpacity
                        onPress={() => {
                            setDisplay(false);
                            props.navigation.goBack();
                        }}>
                        <Ionicons name="ios-arrow-round-back" size={36} color={Colors.colorTextWhite}></Ionicons>
                    </TouchableOpacity>
                </View>
                <View style={[styles.backButtonContainer, { right: 0 }]}>
                    <IconWithAction content={<FontAwesome name="star" color={iconColor} size={24} />} onClick={() => {
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
                        <Text style={{ textAlign: 'center', fontSize: 20,}}>
                            Dostępne Punkty
                        </Text>
                    </View>
                    <SafeAreaView style={{display: display ? 'flex': 'none'}}>
                        {dataSource.addressList.map(localizationInfo => renderLocalizationInfo(dataSource, localizationInfo))}
                    </SafeAreaView>
                </ScrollView>
            </View>
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