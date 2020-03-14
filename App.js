import React from 'react';
import { StyleSheet} from 'react-native';
import Dimensions from './src/themes/dimensions';
import {
  createDrawerNavigator,
} from '@react-navigation/drawer';
import Jadlodajnie from "./screens/Jadlodajnie";
import Ulubione from "./screens/Ulubione";
import Powiadomienia from './screens/Powiadomienia';
import Mapa from './screens/Mapa';
import CustomDrawer from './components/CustomDrawer';

import { NavigationContainer } from '@react-navigation/native';

import Colors from './src/themes/colors';
import { Ionicons, Foundation, MaterialCommunityIcons } from '@expo/vector-icons';



const Drawer = createDrawerNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Drawer.Navigator initialRouteName="Jadlodajnie" drawerContent={props => <CustomDrawer {...props} />}
        drawerContentOptions={{
          activeTintColor: Colors.accent,
          activeBackgroundColor: Colors.colorTextWhite,
          inactiveTintColor: Colors.colorTextWhite,
          inactiveBackgroundColor: 'transparent',
          labelStyle: { fontSize: 18, fontWeight: 'bold' },

        }} >
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
      </Drawer.Navigator>
    </NavigationContainer>

  );
}

const styles = StyleSheet.create({
  
});
