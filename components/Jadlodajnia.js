import React from 'react';
import { View, Text, Button, StyleSheet, Image, Platform } from 'react-native';
import { Divider, Avatar } from 'react-native-elements';
import Strings from '../src/themes/strings';
import Colors from '../src/themes/colors';
import Dimensions from '../src/themes/dimensions';
import SampleItem from './SampleItem';
import { FlatList, TouchableOpacity, TouchableNativeFeedback } from 'react-native-gesture-handler';


const Jadlodajnia = props => {
    const jadlodajnia = props.jadlodajnia;
    let moreButton;
    if (Platform.OS === 'ios') {
        moreButton = <TouchableOpacity style={styles.moreButton} onPress={props.onMoreClick}>
            <Text style={styles.moreButtonText}>{Strings.more}</Text>
        </TouchableOpacity>;
    }
    if (Platform.OS === 'android') {
        moreButton = 
        <View style={styles.drawerLoginContainer} >
            <View style={styles.drawerLoginView}>
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
                <Image style={styles.avatar} ></Image>
                <View style={{ flexDirection: 'column', flex: 1, justifyContent: "center" }}>
                    <Text style={styles.avatarName}>{jadlodajnia.title}</Text>
                    <Divider style={styles.divider}></Divider>
                    <Text style={styles.avatarName}></Text>
                </View>
            </View>
            <View style={{ marginBottom: 20 }}>
                <Text style={styles.menu}>{Strings.menu}</Text>
                <Divider style={styles.divider}></Divider>
                <FlatList />
            </View>
            {moreButton}

            {/* <Button style={styles.moreButton} title={Strings.more} onPress={props.onMoreClick} /> */}

        </View>
    );
}


const styles = StyleSheet.create({
    container: {
        // backgroundColor:props.color,
        flex: 1,
        justifyContent: "center",
        backgroundColor: Colors.colorTextWhite,
        borderColor: Colors.accent,
        borderWidth: Dimensions.defaultBorderWidth,
        borderRadius:Dimensions.defaultSmallBorderRadius,
        padding: Dimensions.defaultPadding,
        marginVertical: Dimensions.defaultMarginBetweenItems,
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
    avatar: {
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
    // moreButton: {
    //     paddingVertical: Dimensions.defaultSmallPadding,
    //     paddingHorizontal: Dimensions.defaultHugePadding,
    //     backgroundColor: Colors.primary,
    //     fontSize: Dimensions.defaultFontSize,
    //     borderColor: Colors.accent,
    //     borderWidth: Dimensions.defaultHugeBorderWidth,
    //     borderRadius: Dimensions.defaultBorderRadius
    // },
    moreButtonText: {
        paddingVertical: 9,
        paddingHorizontal: 50,
        textAlign: "center",
        color: Colors.colorTextWhite,
        fontSize: Dimensions.hugeFontSize,
        fontWeight: "bold"
    },


    drawerLoginContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: "center"
    },
    drawerLoginView: {
        backgroundColor: Colors.primary,
        // borderColor: Colors.accent,
        // borderWidth: Dimensions.defaultHugeBorderWidth,
        borderRadius: Dimensions.defaultBorderRadius
    },
});

export default Jadlodajnia;