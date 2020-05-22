import React, { useState, useEffect } from "react";
import { AsyncStorage } from 'react-native';
import Jadlodajnie from "../screens/Jadlodajnie";
import Ulubione from "../screens/Ulubione";
import Powiadomienia from '../screens/Powiadomienia';
import Mapa from '../screens/Mapa';
import { createDrawerNavigator } from '@react-navigation/drawer';
import CustomDrawer from '../components/CustomDrawer';
import Connection from '../service/Connection';
import Colors from '../src/themes/colors';
import { Ionicons, Foundation, MaterialCommunityIcons } from '@expo/vector-icons';
import Logowanie from '../screens/Logowanie';
import EdytujProfil from '../screens/EdytujProfil';
import CustomLoadingComponent from '../components/CustomLoadingComponent';
const Drawer = createDrawerNavigator();

const Home = props => {
    const [isLoading, setIsLoading] = useState(true);
    const [dataSource, setDataSource] = useState([]);
    const forFade = ({ current, closing }) => ({
        cardStyle: {
            opacity: current.progress,
        },
    });
    let uzytkownicy = [];
    let pobranyUzytkownik;

    async function fetchData() {
        if (isLoading) {
            setTimeout(async function () {
                await AsyncStorage.removeItem("firstUse");
                const token = await AsyncStorage.getItem("authToken");
                if (token !== null) {
                    const login = await AsyncStorage.getItem("login");
                    const email = await AsyncStorage.getItem("email");
                    const avatar = await AsyncStorage.getItem("avatar");
                    setDataSource({ login: login, email: email, avatar: avatar, loginStatus: true });
                    setIsLoading(false);
                }
                else {
                    setDataSource({ login: "", email: "", avatar: "", loginStatus: false });
                    setIsLoading(false);
                    // const res = await Connection.getUserOptions();
                    // res
                    //     .json()
                    //     .then(res => {
                    //         res.uzytkownicy.map((uzytkownik) => {
                    //             uzytkownicy.push(uzytkownik);
                    //         });
                    //         uzytkownicy.map((uzytkownik, index) => {
                    //             if (index === 0) {
                    //                 pobranyUzytkownik = uzytkownik;
                    //             }
                    //         });

                    //         setDataSource(pobranyUzytkownik);
                    //         setIsLoading(false);
                    //     })
                    //     .catch(err => console.log(err));
                }
            }, 1000);
        }
    }
    useEffect(() => {
        fetchData();
    }, [isLoading]);
    if (isLoading) {
        return (
            <CustomLoadingComponent />
        )
    }
    else {
        return (
            <Drawer.Navigator initialRouteName="Jadlodajnie" drawerContent={(props) => {
                return (
                    <CustomDrawer {...props} dataSource={dataSource} />
                )
            }}
                drawerStyle={{ width: '80%' }}
                drawerContentOptions={{
                    activeTintColor: Colors.accent,
                    activeBackgroundColor: Colors.colorTextWhite,
                    inactiveTintColor: Colors.colorTextWhite,
                    inactiveBackgroundColor: 'transparent',
                    labelStyle: { fontSize: 18, fontWeight: 'bold' },
                }}>
                <Drawer.Screen name="Jadlodajnie" component={Jadlodajnie}
                    initialParams={{ navigation: Drawer.navigation }}
                    options={
                        {
                            drawerIcon: ({ color }) => <MaterialCommunityIcons name="food-fork-drink" size={24} color={color} />,
                            cardStyleInterpolator: forFade
                        }

                    }
                />
                <Drawer.Screen name="Ulubione" component={Ulubione} options={
                    {
                        drawerIcon: ({ color }) => <Ionicons name="md-star" size={30} color={color} />,
                        cardStyleInterpolator: forFade

                    }
                }
                />
                <Drawer.Screen name="Powiadomienia" component={Powiadomienia} options={
                    {
                        drawerIcon: ({ color }) => <Ionicons name="md-notifications" size={33} color={color} />,
                        cardStyleInterpolator: forFade
                    }
                } />
                <Drawer.Screen name="Mapa" component={Mapa}
                    initialParams={{ navigation: Drawer.navigation }}
                    options={
                        {
                            drawerIcon: ({ color }) => <Foundation name="map" size={27} color={color} />,
                            cardStyleInterpolator: forFade
                        }
                    } />
                <Drawer.Screen name="Logowanie" component={Logowanie}
                    options={
                        {
                            title: "Logowanie",
                            gestureEnabled: false,
                            cardStyleInterpolator: forFade
                        }
                    } />
                <Drawer.Screen name="EdytujProfil" component={EdytujProfil} options={
                    {
                        title: "EdytujProfil",
                        gestureEnabled: false,
                        cardStyleInterpolator: forFade
                    }
                } />
            </Drawer.Navigator>
        );
    }

}
export default Home;

