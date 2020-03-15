import React from 'react';
import { View, Text, StyleSheet, StatusBar } from "react-native";
import Strings from "../src/themes/strings";
import Toolbar from "../components/Toolbar";


const Jadlodajnie = props => {

    const HomeButtonHandler = () =>{
                props.navigation.openDrawer();
    }
    return (
        <View style={styles.container}>
            <StatusBar />
            <Toolbar title={Strings.jadlodajnie}
                homeButton={require("../src/images/burger_bialy_m.png")}
                rightCornerButton={require('../src/images/wyszukaj_m.png')}
                onHomeClick={HomeButtonHandler}
            />
        </View>
    );
}
const styles = StyleSheet.create({
    container:{
        flex:1
    }
});



export default Jadlodajnie;
