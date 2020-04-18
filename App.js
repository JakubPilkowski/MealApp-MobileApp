import React, { useState, useEffect } from 'react';
import { StyleSheet, AsyncStorage } from 'react-native';
import Dimensions from './src/themes/dimensions';
import {
  createDrawerNavigator, DrawerItem,
} from '@react-navigation/drawer';
import Jadlodajnie from "./screens/Jadlodajnie";
import Ulubione from "./screens/Ulubione";
import Powiadomienia from './screens/Powiadomienia';
import Mapa from './screens/Mapa';
import CustomDrawer from './components/CustomDrawer';
import Connection from './api/Connection';
import { NavigationContainer } from '@react-navigation/native';

import Colors from './src/themes/colors';
import { Ionicons, Foundation, MaterialCommunityIcons } from '@expo/vector-icons';
import Logowanie from './screens/Logowanie';
import EdytujProfil from './screens/EdytujProfil';
import CustomLoadingComponent from './components/CustromLoadingComponent';
import KeyValueStorage from "react-native-key-value-storage"
import WyborLokalizacji from './screens/WyborLokalizacji';

const Drawer = createDrawerNavigator();

export default function App() {

  const [isLoading, setIsLoading] = useState(true);
  const [isStorageLoading, setIsStorageLoading] = useState(true);
  const [dataSource, setDataSource] = useState([]);
  const [firstUse, setFirstUse] = useState();
  let uzytkownicy = [];
  let pobranyUzytkownik;
  useEffect(() => {
    fetchStorage();
  }, firstUse, isLoading, isStorageLoading);

  async function fetchStorage() {
      if (isStorageLoading) {
        try {
          setFirstUse(await AsyncStorage.getItem("firstUse"));
          console.log(firstUse);
          setIsStorageLoading(false);
        }
        catch (error) {

        }
      }
  }
  if (isStorageLoading) {
    return <CustomLoadingComponent />
  }
  else {
    if (firstUse !== "true") {
      return (
        <WyborLokalizacji onConfirm={(wojewodztwo, miasto) => {
          (async () => {
            try {
              await AsyncStorage.setItem('firstUse', 'true');
              await AsyncStorage.setItem('wojewodztwo', wojewodztwo);
              await AsyncStorage.setItem('miasto', miasto);
              setFirstUse("true");
            }
            catch (error) {
              console.log(error);
            }
          })();

        }} />
      );
    }
    else {
      async function fetchData() {
        if (isLoading) {
          await AsyncStorage.removeItem("firstUse");
          const res = await Connection.getUserOptions();
          res
            .json()
            .then(res => {
              res.uzytkownicy.map((uzytkownik) => {
                uzytkownicy.push(uzytkownik);
              });
              uzytkownicy.map((uzytkownik, index) => {
                if (index === 0) {
                  pobranyUzytkownik = uzytkownik;
                }
              });

              setDataSource(pobranyUzytkownik);
              setIsLoading(false);
            })
            .catch(err => console.log(err));
        }
      }
      console.log("halo z app.js");
      fetchData();
      if (isLoading) {
        return (
          <CustomLoadingComponent />
        )
      }
      else {
        return (
          <NavigationContainer>
            <Drawer.Navigator initialRouteName="Jadlodajnie" drawerContent={(props) => {
              return (
                <CustomDrawer {...props} dataSource={dataSource} />
              )
            }}
              drawerContentOptions={{
                activeTintColor: Colors.accent,
                activeBackgroundColor: Colors.colorTextWhite,
                inactiveTintColor: Colors.colorTextWhite,
                inactiveBackgroundColor: 'transparent',
                labelStyle: { fontSize: 18, fontWeight: 'bold' },
              }}
            >
              <Drawer.Screen name="Jadlodajnie" component={Jadlodajnie}
                initialParams={{ navigation: Drawer.navigation }}
                options={
                  {
                    drawerIcon: ({ color }) => <MaterialCommunityIcons name="food-fork-drink" size={24} color={color} />,

                  }
                } />
              <Drawer.Screen name="Ulubione" component={Ulubione} options={
                {
                  drawerIcon: ({ color }) => <Ionicons name="md-star" size={30} color={color} />,
                }
              } />
              <Drawer.Screen name="Powiadomienia" component={Powiadomienia} options={
                {
                  drawerIcon: ({ color }) => <Ionicons name="md-notifications" size={33} color={color} />,
                }
              } />
              <Drawer.Screen name="Mapa" component={Mapa} options={
                {
                  drawerIcon: ({ color }) => <Foundation name="map" size={27} color={color} />,
                }
              } />
              <Drawer.Screen name="Logowanie" component={Logowanie}
                // initialParams={{ navigation: Drawer.navigation }}
                options={
                  {
                    title: "Logowanie",
                    gestureEnabled: false
                  }
                } />
              <Drawer.Screen name="EdytujProfil" component={EdytujProfil} options={
                {
                  title: "EdytujProfil",
                  gestureEnabled: false
                }
              } />
            </Drawer.Navigator>
          </NavigationContainer>

        );
      }
    }
  }
}

const styles = StyleSheet.create({

});
