import React from 'react';
import { View, Text, Button, StyleSheet, Image, Platform } from 'react-native';
import { Divider, Avatar } from 'react-native-elements';
import Strings from '../src/themes/strings';
import Colors from '../src/themes/colors';
import Dimensions from '../src/themes/dimensions';
import { FlatList, TouchableOpacity, TouchableNativeFeedback } from 'react-native-gesture-handler';
import IosButton from './IosButton';
import AndroidButton from './AndroidButton';
import GradientDivider from './GradientDivider';
import Zestaw from './Zestaw';

const Jadlodajnia = props => {
    const jadlodajnia = props.jadlodajnia;
    let counter = 0;
    let moreButton;
    if (Platform.OS === "ios" || (Platform.OS === "android" && Platform.Version < 21)) {
        moreButton =
            <IosButton onClick={() => {
                props.onMoreClick();
            }} text={Strings.more} />
    }
    if (Platform.OS === 'android' && Platform.Version >= 21) {
        moreButton =
            <AndroidButton onClick={() => {
                props.onMoreClick();
            }} text={Strings.more} containerStyle={styles.androidButtonView} buttonStyle={styles.buttonStyle} />
    }
    let dailyContent;
    if (jadlodajnia.menuList.length > 0) {
        dailyContent =
            jadlodajnia.menuList.map(menuListItem =>
                menuListItem.contentList.map(zestaw => renderZestaw(zestaw))
            )
    }
    else {
        dailyContent =
            <Text style={{fontSize: 16, textAlign:'center'}}>Ta jadłodajnia nie udostępnia zestawów na dzisiaj</Text>
    }

    return (
        <View key={jadlodajnia.id} style={[styles.container, props.containerStyle]}>
            <View style={styles.avatarContainer}>
                <Image style={styles.image} source={jadlodajnia.logoUrl !== "notImplemented" ? { uri: jadlodajnia.logoUrl } : require("../src/images/ikonka_v3.png")} ></Image>
                <View style={{ flexDirection: 'column', flex: 1, justifyContent: "center" }}>
                    <Text style={[styles.avatarName, {fontSize: jadlodajnia.name.length > 15 ? 20 : 24}]}>{jadlodajnia.name}</Text>
                    <GradientDivider startColor={Colors.primary} endColor={Colors.accent}
                        from="left" locationEnd={0.7} dividerStyle={{ flex: 0 }} />
                    <Text style={[styles.avatarName, {fontSize: jadlodajnia.name.length > 15 ? 20 : 24}]}></Text>
                </View>
            </View>
            <View style={{ marginBottom: 20 }}>
                <Text style={styles.menu}>{Strings.todays_set}</Text>
                <Divider style={styles.divider}></Divider>
                {dailyContent}
            </View>
            {moreButton}
        </View>
    );
}

function renderZestaw(zestaw) {
    if (zestaw.type === "DAILY")
        return (
            <Zestaw id={zestaw.id} content={zestaw.content} danieStyle={{fontSize:16}}/>
        );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        backgroundColor: Colors.colorTextWhite,
        borderRadius: 12,
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
        marginBottom: Dimensions.defaultMargin
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