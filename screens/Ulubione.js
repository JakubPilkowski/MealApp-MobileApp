import React, { useState, useEffect } from "react";
import {
    View, StyleSheet, Text, ImageBackground, ActivityIndicator, FlatList, Animated
    , TouchableHighlight
} from 'react-native';
import JadlodajnieWiecej from './JadlodajnieWiecej';
import { createStackNavigator } from '@react-navigation/stack';
import Colors from "../src/themes/colors";
import Strings from "../src/themes/strings";
import IconWithAction from "../components/IconWithAction";
import ScreenStyle from "../src/themes/screenStyle";
import Card from '../components/Card';
import Connection from "../api/Connection";
import LogoWithTexts from '../components/LogoWithTexts';
import colors from "../src/themes/colors";
import dimensions from "../src/themes/dimensions";
import {Feather} from 'react-native-vector-icons';

function UlubioneScreen({ navigation, route }) {
    const { ulubione } = route.params;
    const favourites = [];
    ulubione.map((ulubiona) => {
        favourites.push(ulubiona);
    })
    const [ulubioneJadlodajnie, setUlubioneJadlodajnie] = useState(favourites);

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
    return (
        <View style={styles.container}>
            <ImageBackground source={require('../src/images/jedzonko.jpg')} style={{ flex: 1, backgroundColor: Colors.backgroundColor }} imageStyle={{ opacity: 0.3 }}>
                <FlatList data={ulubioneJadlodajnie}
                    renderItem={itemData =>
                        <Card
                            pressEnabled={true}
                            onSwipeRight={(progress, dragX) => <RightActions progress={progress} dragX={dragX} onPress={() => { onUlubioneDeleteHandler(itemData.item.id) }}></RightActions>}
                            cardStyle={{ marginTop: dimensions.defaultHugeMargin }}
                            onCardPress={() => {
                                navigation.navigate('JadlodajnieWiecej', { jadlodajniaId: itemData.jadlodajnia_id });
                            }}
                            content={
                                <LogoWithTexts title={itemData.item.title} logo={{ uri: itemData.item.iconUrl }}
                                    subTitleContent={
                                        <Text>Ocena: {itemData.item.ocena}</Text>
                                    } />
                            } />
                    }
                    keyExtractor={item => item.id}
                />
            </ImageBackground>
        </View>
    );
}

const RightActions = ({ progress, dragX, onPress }) => {
    const scale = dragX.interpolate({
        inputRange: [-100, 0],
        outputRange: [1, 0],
        extrapolate: 'clamp'
    })
    return (
        <TouchableHighlight onPress={onPress} style={{height:"100%"}} >
            <View style={styles.rightActionContainer}>
                <Animated.Text style={[styles.rightActionText, { transform: [{ scale }] }]}>USUŃ</Animated.Text>
                {/* dodac kiedys zdjecie */}
                {/* <AnimatedIcon name="delete" size={36} color={Colors.colorTextWhite} containerStyle={{transform:[{scale}]}}></AnimatedIcon> */}

            </View>
        </TouchableHighlight>
    )
}
const Ulubione = props => {
    const [isLoading, setIsLoading] = useState(true);
    const [dataSource, setDataSource] = useState([]);
    async function fetchData() {
        if (isLoading) {
        const res = await Connection.getUlubione();
        res
            .json()
            .then(res => {
                setDataSource(res.ulubione);
                setIsLoading(false);
            })
            .catch(err => console.log(err + 'blad'));
        }
    }

    useEffect(() => {
        fetchData();
    }, isLoading);

        const Stack = createStackNavigator();

        if (isLoading) {
            return (
                <View style={{ flex: 1 }}>
                    <ActivityIndicator></ActivityIndicator>
                </View>
            )
        }
        return (
            <Stack.Navigator initialRouteName="Ulubione" screenOptions={ScreenStyle}>
                <Stack.Screen name="Ulubione" component={UlubioneScreen} options={{
                    headerTitle: Strings.ulubione,
                }} initialParams={{ ulubione: dataSource }} />
                <Stack.Screen name="JadlodajnieWiecej" component={JadlodajnieWiecej}
                    options={{
                        headerStyle: {
                            opacity: 0, height: 0
                        }
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
        flex:1,
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
