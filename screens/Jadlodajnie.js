import React from 'react';
import { View, StyleSheet, StatusBar, Button, SafeAreaView, FlatList} from "react-native";
import Strings from "../src/themes/strings";
import { createStackNavigator } from '@react-navigation/stack';
import JadlodajnieWiecej from './JadlodajnieWiecej';
import Colors from "../src/themes/colors";
import IconWithAction from "../components/IconWithAction";
import ScreenStyle from "../src/themes/screenStyle";
import Jadlodajnia from "../components/Jadlodajnia";


const jadlodajnie = [
    {
        id: 1,
        title: "Pełny Gar",
        iconUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcQTxJ_tgrb0UyGblnFNJubsfpaLuoMk30FA-EZobz8T_lwQAyV3",
        dania: [
            {
                danie_id: 1,
                nazwa: "Zupa ogórkowa",
                cena: 5
            },
            {
                danie_id: 1,
                nazwa: "Kotlet schabowy",
                cena: 10
            }
        ]

    },
    {
        id: 2,
        title: "Pełny Garek",
        iconUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcTIM1PLDtksZCtTupjqdaIWDKOOq1D3zChJUWU3Wf3xz8V8j2Ev",
        dania: [
            {
                danie_id: 1,
                nazwa: "Zupa pomidorowa",
                cena: 5
            },
            {
                danie_id: 1,
                nazwa: "Kotlet mielony",
                cena: 10
            }
        ]

    },
    {
        id: 3,
        title: "Super Pełny Gar",
        iconUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcQTxJ_tgrb0UyGblnFNJubsfpaLuoMk30FA-EZobz8T_lwQAyV3",
        dania: [
            {
                danie_id: 1,
                nazwa: "Zupa jarzynowa",
                cena: 5
            },
            {
                danie_id: 1,
                nazwa: "Pierś z kurczaka",
                cena: 10
            }
        ]

    },
    {
        id: 4,
        title: "Super pełny garek, bardzo długi tytuł",
        iconUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcQTxJ_tgrb0UyGblnFNJubsfpaLuoMk30FA-EZobz8T_lwQAyV3",
        dania: [
            {
                danie_id: 1,
                nazwa: "Bardzo długie danieeeeeeeeeeeeeeeee",
                cena: 5
            },
            {
                danie_id: 1,
                nazwa: "Bardzo długie drugie danieeeeeeeeeeeeeeeeeee",
                cena: 10
            }
        ]

    },


];
function JadlodajnieScreen({ navigation }) {

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
    const MoreButtonHandler = () =>{
        navigation.navigate('JadlodajnieWiecej');
    }
    return (
        <View style={styles.container}>
            <SafeAreaView>
                <FlatList
                    data={jadlodajnie} renderItem={itemData =>
                        <Jadlodajnia title={itemData.item.title} jadlodajnia={itemData.item} onMoreClick={MoreButtonHandler}></Jadlodajnia>}
                    keyExtractor={itemData => itemData.id}
                />
            </SafeAreaView>
        </View>
    );
}

const Jadlodajnie = props => {
    const Stack = createStackNavigator();
    return (
        <Stack.Navigator initialRouteName="Jadlodajnie" screenOptions={ScreenStyle}>
            <Stack.Screen name="Jadlodajnie" component={JadlodajnieScreen} options={{
                headerTitle: Strings.jadlodajnie,
            }} />
            <Stack.Screen name="JadlodajnieWiecej" component={JadlodajnieWiecej} />
        </Stack.Navigator>
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1
    },
});



export default Jadlodajnie;
