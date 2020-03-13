import React from 'react';
import { StyleSheet, Text, View, StatusBar } from 'react-native';
import Toolbar from "./components/Toolbar";
import { Ionicons } from '@expo/vector-icons';
import { createDrawerNavigator } from "@react-navigation/drawer";
import Jadlodajnie from "./screens/Jadlodajnie";
import { NavigationContainer } from '@react-navigation/native';
import {CustomDrawer} from './components/CustomDrawer';


const Drawer = createDrawerNavigator();

function JadlodajnieView ({navigation}){
  return (
    <Jadlodajnie nav={navigation}/>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Drawer.Navigator initialRouteName="Jadlodajnie">
        <Drawer.Screen name="Jadlodajnie" component={Jadlodajnie} />
      </Drawer.Navigator>
    </NavigationContainer>

  );
}

const styles = StyleSheet.create({

});
