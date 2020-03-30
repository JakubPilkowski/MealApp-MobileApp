import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
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
import { ActivityIndicator } from 'react-native';


const Drawer = createDrawerNavigator();

export default function App() {

  const [isLoading, setIsLoading] = useState(true);
  const [dataSource, setDataSource] = useState();

  async function fetchData() {
    const res = await Connection.getUserOptions();
    res
      .json()
      .then(res => {
        setDataSource(res.uzytkownicy);
        setIsLoading(false);
      })
      .catch(err => console.log(err + 'blad'));
  }

  useEffect(() => {
    fetchData();
  });
  if (isLoading) {
    return (
      <View style={{ flex: 1 }}>
        <ActivityIndicator></ActivityIndicator>
      </View>
    )
  }
  else {
    return (


      <NavigationContainer>
        <Drawer.Navigator initialRouteName="Jadlodajnie" drawerContent={(dataSource, props) => <CustomDrawer {...props} />}
          drawerContentOptions={{
            activeTintColor: Colors.accent,
            activeBackgroundColor: Colors.colorTextWhite,
            inactiveTintColor: Colors.colorTextWhite,
            inactiveBackgroundColor: 'transparent',
            labelStyle: { fontSize: 18, fontWeight: 'bold' },
          }}
        >
          <Drawer.Screen name="Jadlodajnie" component={Jadlodajnie} options={
            {
              drawerIcon: ({ color }) => <MaterialCommunityIcons name="food-fork-drink" size={24} color={color} />
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
          <Drawer.Screen name="Logowanie" component={Logowanie} options={
            {
              title: "Logowanie"
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

const styles = StyleSheet.create({

});
