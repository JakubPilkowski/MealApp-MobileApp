import React from 'react';
import { View, Text, Button, StyleSheet, Image, Platform } from 'react-native';
import { Divider, Avatar } from 'react-native-elements';
import Strings from '../src/themes/strings';
import Colors from '../src/themes/colors';
import Dimensions from '../src/themes/dimensions';
import { FlatList, TouchableOpacity, TouchableNativeFeedback } from 'react-native-gesture-handler';
import Danie from './Danie';
import IosButton from './IosButton';
import AndroidButton from './AndroidButton';
import GradientDivider from './GradientDivider';

const Jadlodajnia = props => {
    const jadlodajnia = props.jadlodajnia;
    const dania = jadlodajnia.dania;
    let moreButton;
    if (Platform.OS === 'ios') {
        moreButton =
            <IosButton onClick={() => {
                props.onMoreClick(jadlodajnia.id);
            }} text={Strings.more} />
    }
    if (Platform.OS === 'android') {
        moreButton =
            <AndroidButton onClick={() => {
                props.onMoreClick(jadlodajnia.id)
                // props.navigation.navigate('JadlodajnieWiecej', { jadlodajniaId: jadlodajnia.id });
            }} text={Strings.more} containerStyle={styles.androidButtonView} buttonStyle={styles.buttonStyle} />
    }
    return (
        <View key={jadlodajnia.id} style={[styles.container, props.containerStyle]}>
            <View style={styles.avatarContainer}>
                <Image style={styles.image} source={{ uri: jadlodajnia.iconUrl }} ></Image>
                <View style={{ flexDirection: 'column', flex: 1, justifyContent: "center" }}>
                    <Text style={styles.avatarName}>{jadlodajnia.title}</Text>
                    <GradientDivider startColor={Colors.primary} endColor={Colors.accent}
                        from="left" locationEnd={0.7} dividerStyle={{ flex: 0 }} />
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

function renderDania(danie) {
    return (
        <Danie id={danie.danie_id} nazwa={danie.nazwa} cena={danie.cena}></Danie>
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
    buttonStyle: {
        paddingVertical: 9,
        paddingHorizontal: 50
    },
    androidButtonView: {
        backgroundColor: Colors.colorTextWhite,
        borderRadius: Dimensions.defaultBorderRadius,
        alignSelf: 'center'
    },
});

export default Jadlodajnia;