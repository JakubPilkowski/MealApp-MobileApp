import React, { useState, useEffect } from 'react';
import { View, StyleSheet, SafeAreaView, FlatList, ActivityIndicator, ImageBackground, Text, LayoutAnimation, TextInput, Platform, Picker } from "react-native";
import Strings from "../src/themes/strings";
import Colors from "../src/themes/colors";
import { createStackNavigator, HeaderTitle } from '@react-navigation/stack';
import JadlodajnieWiecej from './JadlodajnieWiecej';
import IconWithAction from "../components/IconWithAction";
import ScreenStyle from "../src/themes/screenStyle";
import Jadlodajnia from "../components/Jadlodajnia";
import Connection from '../api/Connection';
import Switch from 'react-native-customisable-switch';
import MultiSlider from '@ptomasroos/react-native-multi-slider';
import {
    AntDesign,
    Feather, Ionicons
} from 'react-native-vector-icons';
import dimensions from '../src/themes/dimensions';
import AndroidButton from '../components/AndroidButton';
import IosButton from '../components/IosButton';
import { Dimensions } from 'react-native';

const { width, height } = Dimensions.get("screen");


function JadlodajnieScreen({ navigation, route }) {

    const [selectedValue, setSelectedValue] = useState("wszystko");
    const [expanded, setExpanded] = useState(false);
    const [firstThumbValue, setFirstThumbValue] = useState(5);
    const [secondThumbValue, setSecondThumbValue] = useState(30);
    const [enabled, setEnabled] = useState(false);
    const { jadlodajnie, drawerNavigation } = route.params;
    const HomeButtonHandler = () => {
        navigation.openDrawer();
    }
    const toggleView = () => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setExpanded(!expanded);
    }

    let searchButton;
    if (Platform.OS === "android")
        searchButton = <AndroidButton text="Wyszukaj" containerStyle={{ width: '60%', alignSelf: 'center', marginTop: 12 }} onClick={toggleView}/>
    if (Platform.OS === "ios")
        searchButton = <IosButton text="Wyszukaj" onClick={toggleView}/>


    navigation.setOptions({
        headerRight: () => {
            return expanded ?
                <IconWithAction
                    content={<AntDesign name="close" size={26} color={Colors.colorTextWhite} />}
                    onClick={toggleView} /> :
                <IconWithAction
                    content={<Ionicons name="md-search" size={26} color={Colors.colorTextWhite} />}
                    onClick={toggleView} />;
        },
        headerLeft: () => {
            return expanded ? 
                null : 
            <IconWithAction content={<Feather name="menu" size={26} color={Colors.colorTextWhite} />} onClick={HomeButtonHandler} />
        },
        headerTitle: expanded ? "Wyszukiwanie" : "Jadłodajnie",
    });
    drawerNavigation.setOptions({
        gestureEnabled: expanded ? false: true
    });

    return (
        <View style={styles.container} >
            <View style={{
                height: expanded ? null : 0,
                display: expanded ? 'flex' : 'none', overflow: 'hidden', backgroundColor: Colors.backgroundColor, borderWidth: 2,
                paddingVertical: 12,
                alignItems: 'center',
                borderColor: Colors.primary, borderBottomLeftRadius: 16, borderBottomRightRadius: 16
            }}>
                <Text style={{textAlign:'center'}}>Rodzaj potrawy</Text>
                <View style={{
                    backgroundColor: Colors.colorTextWhite, 
                    borderRadius: 6, 
                    borderColor: Colors.accent, 
                    borderWidth: 2 ,
                    marginTop: dimensions.defaultSmallMargin
                }}>
                    <Picker
                        selectedValue={selectedValue}
                        style={{ height: 40, width: 250 }}
                        onValueChange={(itemValue, itemIndex) => setSelectedValue(itemValue)}
                    >
                        <Picker.Item label="Wszystko" value ="wszystko" />
                        <Picker.Item label="Desery" value="deser" />
                        <Picker.Item label="Fast-foody" value="fast-food" />
                        <Picker.Item label="Potrawy mięsne" value ="miesne" />
                        <Picker.Item label="Potrawy warzywne" value ="warzywne" />
                        <Picker.Item label="Potrawy rybne" value ="ryby" />
                        <Picker.Item label="Chińskie" value ="chinskie" />
                        <Picker.Item label="Włoskie" value ="wloskie" />
                        <Picker.Item label="Śniadanie" value ="sniadanie" />
                    </Picker>
                </View>


                <Text style={{ textAlign: 'center', marginTop:dimensions.defaultMargin, marginBottom:-dimensions.defaultSmallMargin }}>Przedział cenowy</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Text style={{ width:35, textAlign:'center'}}>5zł</Text>
                    <View style={{ flex: 1, alignItems: 'center',  }}>
                        <MultiSlider
                            trackStyle={{
                                height: 5,
                            }}
                            selectedStyle={{
                                backgroundColor: Colors.accent,
                            }}
                            unselectedStyle={{
                                backgroundColor: 'silver',
                            }}
                            sliderLength={width-(2*35)-30}
                            values={[firstThumbValue, secondThumbValue]}
                            min={5}
                            max={30}
                            step={1}
                            enabledOne={true}
                            enabledTwo={true}
                            onValuesChange={(values) => {
                                setFirstThumbValue(values[0]);
                                setSecondThumbValue(values[1]);
                            }}
                            allowOverlap={false}
                            customMarker={() => {
                                return (
                                    <View style={{
                                        backgroundColor: Colors.primary, borderWidth: 4, borderColor: Colors.accent
                                        , width: 24, height: 24, borderRadius: 12
                                    }} />
                                )
                            }}
                            valuePrefix={"prefix"}
                            valueSuffix={"suffix"}
                            minMarkerOverlapDistance={40}
                        />
                    </View>
                    <Text style={{  width:35, textAlign:'center'}}>30zł</Text>
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between',alignItems:'center' }}>
                    <Text style={{flex:1, marginHorizontal: dimensions.defaultSmallMargin, textAlign:'left' }}>Min wartość: {firstThumbValue}zł</Text>
                    <Text style={{flex:1, marginHorizontal: dimensions.defaultSmallMargin, textAlign:'right' }}>Max wartość: {secondThumbValue}zł</Text>
                </View>
                <Text style={styles.title}>Fraza</Text>
                <TextInput style={styles.input} />
                {searchButton}
            </View>
            <ImageBackground source={require('../src/images/pancakes.jpg')} imageStyle={{ opacity: 0.3 }} style={{ flex: 1, backgroundColor: Colors.backgroundColor }}>
                <SafeAreaView>
                    <FlatList
                    
                    scrollEnabled={expanded ? false : true}
                        data={jadlodajnie} renderItem={({item,index}) =>
                            <Jadlodajnia title={item.title} containerStyle={{marginBottom: index+1===jadlodajnie.length ? dimensions.defaultMarginBetweenItems:0}} navigation={navigation} jadlodajnia={item} ></Jadlodajnia>}
                        keyExtractor={itemData => itemData.id}
                    />
                </SafeAreaView>
            </ImageBackground>
        </View>
    );

}

const Jadlodajnie = props => {

    const [isLoading, setIsLoading] = useState(true);
    const [dataSource, setDataSource] = useState([]);
    async function fetchData() {
        if (isLoading) {
            const res = await Connection.getJadlodajnie();
            res
                .json()
                .then(res => {
                    setDataSource(res.jadlodajnie);
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
        return <View style={{ flex: 1 }}>
            <ActivityIndicator></ActivityIndicator>
        </View>
    }

    return (
        <Stack.Navigator initialRouteName="Jadlodajnie" screenOptions={ScreenStyle}>
            <Stack.Screen name="Jadlodajnie" component={JadlodajnieScreen} initialParams={{ jadlodajnie: dataSource, drawerNavigation: props.navigation }} />
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
        flex: 1
    },
    input: {
        backgroundColor: Colors.colorTextWhite,
        width: "75%",
        borderBottomWidth: dimensions.defaultBorderWidth,
        borderBottomColor: Colors.accent,
        padding: dimensions.defaultSmallPadding,
        marginTop:dimensions.defaultSmallMargin,
        marginBottom: dimensions.defaultMargin
    },
    title: {
        textAlign: 'center',
        marginTop:dimensions.defaultMargin,
        color: Colors.colorTextDark,      
    }
});


export default Jadlodajnie;



