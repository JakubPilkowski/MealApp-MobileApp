import React from 'react';
import { StyleSheet, Text, View, StatusBar } from 'react-native';
import Toolbar from "./components/Toolbar";
import { Ionicons } from '@expo/vector-icons';

export default function App() {
  return (
    <View style={styles.container}>
      <StatusBar/>
      <Toolbar title="Jadłodajnie" 
      homeButton={require("./src/images/burger_bialy_m.png")} 
      rightCornerButton={require('./src/images/wyszukaj_m.png')}
      />
    </View>
  );
}

const styles = StyleSheet.create({

});
