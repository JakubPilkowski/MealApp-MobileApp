import React from 'react';
import { View, Text, Button, StyleSheet, Image, Platform } from 'react-native';
import { Divider, Avatar } from 'react-native-elements';
import Strings from '../src/themes/strings';
import Colors from '../src/themes/colors';
import Dimensions from '../src/themes/dimensions';
import { FlatList, TouchableOpacity, TouchableNativeFeedback } from 'react-native-gesture-handler';
import Danie from './Danie';

const Jadlodajnia = props => {
    const jadlodajnia = props.jadlodajnia;
    const dania = jadlodajnia.dania;
    let moreButton;
    if (Platform.OS === 'ios') {
    moreButton =
        <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.iosButtonView} onPress={props.onMoreClick}>
                <Text style={styles.moreButtonText}>{Strings.more}</Text>
            </TouchableOpacity>
        </View>
    }
    if (Platform.OS === 'android') {
        moreButton = 
        <View style={styles.buttonContainer} >
            <View style={styles.androidButtonView}>
                <TouchableNativeFeedback background={TouchableNativeFeedback.Ripple(Colors.accent, true)}
                    onPress={props.onMoreClick}
                    useForeground={false} >
                    <Text style={styles.moreButtonText}>{Strings.more}</Text>
                </TouchableNativeFeedback>
            </View>
        </View>;
    }
    return (
        <View style={styles.container}>
            <View style={styles.avatarContainer}>
                <Image style={styles.image} source={{uri:jadlodajnia.iconUrl}} ></Image>
                <View style={{ flexDirection: 'column', flex: 1, justifyContent: "center" }}>
                    <Text style={styles.avatarName}>{jadlodajnia.title}</Text>
                    <Divider style={styles.divider}></Divider>
                    <Text style={styles.avatarName}></Text>
                </View>
            </View>
            <View style={{ marginBottom: 20 }}>
                <Text style={styles.menu}>{Strings.todays_set}</Text>
                <Divider style={styles.divider}></Divider>
                {dania.map(danie => renderDania(danie))}       
            </View>
            {moreButton}
        </View>
    );
}

function renderDania(danie){
    return (
        <Danie id={danie.id} nazwa={danie.nazwa} cena={danie.cena}></Danie>
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        backgroundColor: Colors.colorTextWhite,
        borderColor: Colors.accent,
        borderWidth: Dimensions.defaultBorderWidth,
        borderRadius: Dimensions.defaultSmallBorderRadius,
        padding: Dimensions.defaultPadding,
        marginTop: Dimensions.defaultMarginBetweenItems,
        marginHorizontal: Dimensions.defaultSmallMargin
    },
    avatarContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: Dimensions.defaultSmallMargin
    },
    avatarName: {
        fontSize: Dimensions.toolbarFontSize,
        marginLeft: 10
    },
    menu: {
        fontSize: Dimensions.hugeFontSize,
        textAlign: "center"
    },
    image: {
        width: 90,
        height: 90,
        borderWidth: Dimensions.defaultBorderWidth,
        borderColor: Colors.accent,
        borderRadius: Dimensions.defaultHugeBorderRadius
    },
    divider: {
        backgroundColor: Colors.accent,
        height: Dimensions.defaultBorderWidth,
    },
    iosButtonView: {
        backgroundColor: Colors.colorTextWhite,
        fontSize: Dimensions.hugeFontSize,
        borderColor: Colors.primary,
    },
    moreButtonText: {
        paddingVertical: 9,
        paddingHorizontal: 50,
        textAlign: "center",
        color: Colors.primary,
        fontSize: Dimensions.hugeFontSize,
        fontWeight: "bold",
        borderRadius: Dimensions.defaultBorderRadius,
        borderColor: Colors.primary,
        borderWidth: Dimensions.defaultBorderWidth,
    },
    buttonContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: "center"
    },
    androidButtonView: {
        backgroundColor: Colors.colorTextWhite,
        borderRadius: Dimensions.defaultBorderRadius
    },
});

export default Jadlodajnia;