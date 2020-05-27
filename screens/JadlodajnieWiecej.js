import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, AsyncStorage, Animated, ScrollView, SafeAreaView, FlatList, ActivityIndicator, TouchableOpacity, Dimensions, ImageBackground, ToastAndroid } from 'react-native';
import Colors from "../src/themes/colors";
import dimensions from '../src/themes/dimensions';
import Strings from "../src/themes/strings";
const HEADER_EXPANDED_HEIGHT = 225;
const HEADER_COLLAPSED_HEIGHT = 56;
import { Ionicons, FontAwesome, Feather } from '@expo/vector-icons';
import Connection from '../service/Connection';
import IconWithAction from '../components/IconWithAction';
import CustomLoadingComponent from '../components/CustomLoadingComponent';
import { setAutoFocusEnabled } from 'expo/build/AR';
import JadlodajnieLocalizationDetails from '../components/JadlodajnieLocalizationDetails';
import ZestawsView from '../components/ZestawsView';
const { width, height } = Dimensions.get('window');

const JadlodajnieWiecej = props => {

    const [isLoading, setIsLoading] = useState(true);
    const [dataSource, setDataSource] = useState([]);
    const {jadlodajniaSlug, wojewodztwo, miasto} = props.route.params;
    const [scrollY, setScrollY] = useState(new Animated.Value(0));
    const scrollRef = useRef(null);
    const [iconColor, setIconColor] = useState("white");
    const [isFavourite, setIsFavourite] = useState(false);
    const [scrollIndex, setScrollIndex] = useState(0);
    const [favouriteButtonEnabled, setFavouriteButtonEnabled] = useState(true);

    async function fetchData() {
        if (isLoading) {
            setTimeout(async function () {

                const res = await Connection.getSzczegolyJadlodajnia(jadlodajniaSlug, wojewodztwo, miasto);
                res
                    .json()
                    .then(res => {
                        setDataSource(res);
                        setIsLoading(false);
                    })
                    .catch(err => console.log(err + 'blad'));
            }, 500);
        }
    }

    useEffect(() => {
        fetchData();
    }, [isLoading]);
    let content;

    if (isLoading) {
        content = <CustomLoadingComponent />
    }
    else {
        let currentWidth = 0;
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
        console.log(dataSource.menuList.length);
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
                        <Animated.Image source={{ uri: "https://restaumatic.imgix.net/uploads/accounts/28994/media_library/15fdee8f-00c9-4a69-93c0-eb69c6de5727.jpg?auto=compress&crop=focalpoint&fit=crop&h=256&w=341" }}
                            style={[styles.headerImage, {
                                height: headerHeight,
                                opacity: heroTitleOpacity,
                            }]}
                        ></Animated.Image>
                        <Animated.Text style={[styles.headerExpanded, { opacity: 1 }]}>{dataSource.name}</Animated.Text>
                    </Animated.View>
                </Animated.View>
                <View style={[styles.backButtonContainer, { left: 0 }]}>
                    <TouchableOpacity
                        onPress={() => {
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
                    <Text style={{ fontSize: 20, textAlign: "center", marginVertical: dimensions.defaultHugeMargin }}>Aktualności</Text>
                    <View style={{ flex: 1, flexDirection: 'row', marginBottom: dimensions.defaultMarginBetweenItems }}>
                        <View style={{ flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: 50 }}>
                            <TouchableOpacity onPress={() => {
                                console.log(scrollIndex);
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
                                { length: width - 100, offset: (width - 100) * index, index }
                            )
                            }
                            initialScrollIndex={0}
                            showsHorizontalScrollIndicator={false}
                            ref={scrollRef}
                            renderItem={itemData =>
                                <View style={{ flexDirection: 'column', width: width - 100 }}>
                                    <ZestawsView date={itemData.item.date} contentList={itemData.item.contentList} />
                                </View>

                            }
                            keyExtractor={item => item.id.toString()}
                        />
                        <View style={{ flexDirection: 'column', justifyContent: 'center', alignItems: "center", width: 50 }}>
                            <TouchableOpacity onPress={() => {
                                if (scrollIndex < dataSource.menuList.length) {
                                    let index = scrollIndex + 1;
                                    setScrollIndex(index);
                                    scrollRef.current.scrollToIndex({ index: index });
                                }
                            }}>
                                <Feather name="arrow-right-circle" color={Colors.primary} size={36}></Feather>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <Text style={{ textAlign: 'center', fontSize: 20, marginVertical: dimensions.defaultHugeMargin }}>
                        Menu główne
                                            </Text>
                    <View style={{}}>
                        <Text>UWAGA! Do odwołania nasze lokale pracują w godzinach 11:00 - 16:30.{'\n'}Obowiązuje zakaz spożywania posiłków na miejscu!{'\n'}Nadal funkcjonuje sprzedaż posiłków na wynos oraz z dowozem!{'\n'}Uprzejmie prosimy o zastosowanie zasady podchodzenia do bufetu pojedynczo oraz wchodzenia do lokalu nie więcej niż trzech osób w jednym momencie.{'\n'}Dostawy w zależności od odległości realizujemy za dodatkową opłatą.{'\n'}W ofercie stałej:{'\n'}codziennie, od godziny 11{'\n'}1. pierogi{'\n'}- z kapustą i grzybami 8 szt. cena 10,99 zł{'\n'}- z mięsem 8 szt. cena 10,99 zł{'\n'}- ruskie 8 szt. cena 10,99 zł{'\n'}{'\n'}2. duża zupa \"Pełny Gar\" cena 6,99 zł{'\n'}zupa codzienna cena 5,50 zł{'\n'}3. kotlet schabowy + zupa dnia + surówka cena 14,99 zł{'\n'}{'\n'}4. kompot cena 1,50 zł</Text>
                    </View>
                    <Text style={{ textAlign: "center", fontSize: 20, marginBottom: dimensions.defaultHugeMargin }}>Dostępne punkty</Text>
                    <SafeAreaView>
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
        <JadlodajnieLocalizationDetails nazwa={informacje.nazwa} informacje={lokalizacja} />
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