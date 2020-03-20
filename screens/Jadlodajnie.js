import React from 'react';
import { View, StyleSheet, SafeAreaView, FlatList, ActivityIndicator, ImageBackground } from "react-native";
import Strings from "../src/themes/strings";
import Colors from "../src/themes/colors";
import { createStackNavigator } from '@react-navigation/stack';
import JadlodajnieWiecej from './JadlodajnieWiecej';
import IconWithAction from "../components/IconWithAction";
import ScreenStyle from "../src/themes/screenStyle";
import Jadlodajnia from "../components/Jadlodajnia";
import Connection from '../api/Connection';

function JadlodajnieScreen({ navigation, route }) {
    const { jadlodajnie } = route.params;
    const HomeButtonHandler = () => {
        navigation.openDrawer();
    }
    navigation.setOptions({
        headerRight: () => (
            <IconWithAction src={require('../src/images/wyszukaj_m.png')} />
        )
        ,
        headerLeft: () => (
            <IconWithAction src={require('../src/images/burger_bialy_m.png')} onClick={HomeButtonHandler} />
        )
    });

    return (
        <View style={styles.container}>
            <ImageBackground source={require('../src/images/pancakes.jpg')} imageStyle={{opacity:0.3}} style={{flex:1, backgroundColor: Colors.backgroundColor}}>
                <SafeAreaView>
                    <FlatList
                        data={jadlodajnie} renderItem={itemData =>
                            <Jadlodajnia title={itemData.title} navigation={navigation} jadlodajnia={itemData.item} ></Jadlodajnia>}
                        keyExtractor={itemData => itemData.id}
                    />
                </SafeAreaView>
            </ImageBackground>
        </View>
    );

}

export default class Jadlodajnie extends React.Component {
    constructor(props) {
        super(props);
        this.state = { isLoading: true }
    }

    componentDidMount() {
        return Connection.getJadlodajnie()
            .then((response) => response.json()).
            then((responseJson) => {
                this.setState({
                    isLoading: false,
                    dataSource: responseJson.jadlodajnie
                })
            })
            .catch((error) => {
                console.log('blad ' + error);
            });
    }


    render() {
        const Stack = createStackNavigator();
        if (this.state.isLoading) {
            return <View style={{ flex: 1 }}>
                <ActivityIndicator></ActivityIndicator>
            </View>
        }

        return (
            <Stack.Navigator initialRouteName="Jadlodajnie" screenOptions={ScreenStyle}>
                <Stack.Screen name="Jadlodajnie" component={JadlodajnieScreen} initialParams={{ jadlodajnie: this.state.dataSource }} options={{
                    headerTitle: Strings.jadlodajnie,
                }} />
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
}
const styles = StyleSheet.create({
    container: {
        flex: 1
    },
});



