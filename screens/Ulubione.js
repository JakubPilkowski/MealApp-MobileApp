import React, { useState, useEffect } from "react";
import {
    View, StyleSheet, Text, ImageBackground, ActivityIndicator, FlatList, Animated
    , TouchableHighlight,
    AsyncStorage
} from 'react-native';
import JadlodajnieWiecej from './JadlodajnieWiecej';
import { createStackNavigator } from '@react-navigation/stack';
import Colors from "../src/themes/colors";
import Strings from "../src/themes/strings";
import { Rating } from 'react-native-elements';
import IconWithAction from "../components/IconWithAction";
import ScreenStyle from "../src/themes/screenStyle";
import Card from '../components/Card';
import Connection from "../service/Connection";
import LogoWithTexts from '../components/LogoWithTexts';
import colors from "../src/themes/colors";
import dimensions from "../src/themes/dimensions";
import { Feather } from 'react-native-vector-icons';
import CustomLoadingComponent from "../components/CustomLoadingComponent";
import PlaceHolder from "../components/PlaceHolder";

function UlubioneScreen({ navigation, route }) {
    const [isLoading, setIsLoading] = useState(true);
    const [ulubioneJadlodajnie, setUlubioneJadlodajnie] = useState([]);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    async function fetchData() {
        if (isLoading) {
            setTimeout(async function () {
                const res = await Connection.getUlubione();
                const authToken = await AsyncStorage.getItem("authToken");
                setIsLoggedIn(authToken !== null ? true : false)
                res
                    .json()
                    .then(res => {
                        setUlubioneJadlodajnie(res.ulubione);
                        setIsLoading(false);
                    })
                    .catch(err => {});
            }, 200);
        }
    }

    navigation.addListener("focus", ()=>{
        setIsLoading(true);      
    });

    useEffect(() => {
        fetchData();
    }, [isLoading, ulubioneJadlodajnie.length]);

    const onUlubioneDeleteHandler = item => {
        setUlubioneJadlodajnie(currentUlubione => {
            return currentUlubione.filter((ulubiona) => ulubiona.id !== item);
        }
        )
    }

    const HomeButtonHandler = () => {
        navigation.openDrawer();
    }
    navigation.setOptions({
        headerLeft: () => (
            <IconWithAction content={<Feather name="menu" size={26} color={Colors.colorTextWhite} />} onClick={HomeButtonHandler} />
        )
    });
    let content;
    if (isLoading) {
        content = <CustomLoadingComponent />
    }
    else {
        if (isLoggedIn) {
            if (ulubioneJadlodajnie.length > 0) {
                content =
                    <FlatList data={ulubioneJadlodajnie}
                        renderItem={({ item, index }) =>
                            <Card
                                pressEnabled={true}
                                onSwipeRight={(progress, dragX) => <RightActions progress={progress} length={ulubioneJadlodajnie.length} index={index} dragX={dragX} onPress={() => { onUlubioneDeleteHandler(item.id) }}></RightActions>}
                                containerStyle={{ marginBottom: index + 1 === ulubioneJadlodajnie.length ? dimensions.defaultMarginBetweenItems : 0 }}
                                cardStyle={{ marginTop: dimensions.defaultHugeMargin }}
                                onCardPress={() => {
                                    navigation.navigate('JadlodajnieWiecej', { jadlodajniaId: item.jadlodajnia_id });
                                }}
                                content={
                                    <LogoWithTexts title={item.title} logo={{ uri: item.iconUrl }}
                                        subTitleContent={
                                            <View style={{ flexDirection: 'row', marginLeft: 10, marginTop: 3 }}>
                                                <Text>Ocena: </Text>
                                                <Rating ratingCount={5} ratingColor={colors.primary}

                                                    type="custom" startingValue={item.ocena}
                                                    imageSize={20} />
                                            </View>
                                        } />
                                } />
                        }
                        keyExtractor={item => item.id.toString()}
                    />;
            }
            else {
                content = <PlaceHolder text={"Coś tu pusto dodaj \nulubioną jadłodajnie"} src={require("../src/images/heart_v2.png")} />
            }
        }
        else {
            content = <PlaceHolder text={"Musisz być zalogowany by dodać ulubioną jadłodajnie"} src={require("../src/images/user_m.png")} />
        }
    }

    return (
        <View style={styles.container}>
            <ImageBackground source={require('../src/images/jedzonko.jpg')} style={{ flex: 1, backgroundColor: Colors.backgroundColor }} imageStyle={{ opacity: 0.3 }}>
                {content}
            </ImageBackground>
        </View>
    );
}

const RightActions = ({ progress, dragX, index, length, onPress }) => {
    const scale = dragX.interpolate({
        inputRange: [-100, 0],
        outputRange: [1, 0],
        extrapolate: 'clamp'
    })
    return (
        <TouchableHighlight onPress={onPress} style={{ marginBottom: index + 1 === length ? dimensions.defaultMarginBetweenItems : 0 }} >
            <View style={styles.rightActionContainer}>
                <Animated.Text style={[styles.rightActionText, { transform: [{ scale }] }]}>USUŃ</Animated.Text>
                {/* dodac kiedys zdjecie */}
                {/* <AnimatedIcon name="delete" size={36} color={Colors.colorTextWhite} containerStyle={{transform:[{scale}]}}></AnimatedIcon> */}

            </View>
        </TouchableHighlight>
    )
}
const Ulubione = props => {
    const forFade = ({ current, closing }) => ({
        cardStyle: {
            opacity: current.progress,
        },
    });

    const Stack = createStackNavigator();
    return (
        <Stack.Navigator initialRouteName="Ulubione" screenOptions={ScreenStyle}>
            <Stack.Screen name="Ulubione" component={UlubioneScreen} options={{
                headerTitle: Strings.ulubione,
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
    },
    rightActionContainer: {
        flex: 1,
        backgroundColor: 'red',
        justifyContent: 'flex-end',
        alignItems: 'center',
        flexDirection: 'row',
        padding: 20,
    },
    rightActionText: {
        fontSize: 16,
        color: colors.colorTextWhite,
        fontWeight: 'bold',
        margin: dimensions.defaultSmallMargin
    }
});


export default Ulubione;
