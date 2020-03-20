import React from "react";
import { View, StyleSheet, Button, Text, ImageBackground, ActivityIndicator, FlatList } from 'react-native';
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
import {MaterialIcons} from "react-native-vector-icons";
import dimensions from "../src/themes/dimensions";
import Animated from "react-native-reanimated";

function UlubioneScreen({ navigation, route }) {
    const { ulubione } = route.params;
    const HomeButtonHandler = () => {
        navigation.openDrawer();
    }
    navigation.setOptions({
        headerLeft: () => (
            <IconWithAction src={require('../src/images/burger_bialy_m.png')} onClick={HomeButtonHandler} />
        )
    });
    return (
        <View style={styles.container}>
            <ImageBackground source={require('../src/images/jedzonko.jpg')} style={{ flex: 1, backgroundColor: Colors.backgroundColor }} imageStyle={{ opacity: 0.3 }}>
                <FlatList data={ulubione}
                    renderItem={itemData => renderUlubione(itemData.item)}
                    keyExtractor={item => item.id}
                />
            </ImageBackground>
        </View>
    );
}

const RightActions = (progress, dragX) =>{
    const scale = dragX.interpolate({
        inputRange: [0,100],
        outputRange: [0,1],
        extrapolate: 'clamp'
    })
    return (
        <View style={styles.rightActionContainer}>
            <Animated.Text style={[styles.rightActionText, {transform: [{scale}]}]}>USUŃ</Animated.Text>
            {/* <MaterialIcons name="delete" size={36} color={colors.colorTextWhite}></MaterialIcons> */}
        </View>
    )
}
function renderUlubione(item) {
    return (
            <Card 
            onSwipeRight={RightActions}
            cardStyle={{marginTop:dimensions.defaultHugeMargin}}
            content={
                <LogoWithTexts title={item.title} logo={{ uri: item.iconUrl }}
                    subTitleContent={
                        <Text>Ocena: {item.ocena}</Text>
                    } />
            } />
    );
}
export default class Ulubione extends React.Component {
    constructor(props) {
        super(props);
        this.state = { isLoading: true }
    }
    componentDidMount() {
        return Connection.getUlubione().
            then((response) => response.json()).
            then((responseJson) => {
                this.setState({
                    isLoading: false,
                    dataSource: responseJson.ulubione
                })
            })
            .catch((error) => {
                console.log('blad ' + error);
            });
    }
    render() {
        const Stack = createStackNavigator();

        if (this.state.isLoading) {
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
                }} initialParams={{ ulubione: this.state.dataSource }} />
                <Stack.Screen name="JadlodajnieWiecej" component={JadlodajnieWiecej} />
            </Stack.Navigator>
        );
    }
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    rightActionContainer:{
        flex:1,
        backgroundColor:'red',
        justifyContent: 'flex-end',
        alignItems:'center',
        flexDirection:'row',
        padding: 20,
    },
    rightActionText:{
        fontSize:16,
        color:colors.colorTextWhite,
        fontWeight:'bold',
        margin:dimensions.defaultSmallMargin
    }   
})
