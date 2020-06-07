import React from 'react';
import { StyleSheet, View, Text, Modal, Platform } from 'react-native';
import colors from '../src/themes/colors';
import dimensions from '../src/themes/dimensions';
import IosButton from './IosButton';
import AndroidButton from './AndroidButton';

const CustomAlert = props => {
    let cancelButton;
    let okButton;
    if (Platform.OS === "ios" || (Platform.OS === "android" && Platform.Version < 21)) {
        cancelButton =
            <IosButton containerStyle={{ flex: 1 }} onClick={props.onNegativeClick} text="Nie" />
        okButton =
            <IosButton containerStyle={{ flex: 1 }} onClick={props.onPositiveClick} text="Tak" />
    }
    if (Platform.OS === "android" && Platform.Version >= 21) {
        cancelButton =
            <AndroidButton onClick={props.onNegativeClick} text="Nie" />
        okButton =
            <AndroidButton onClick={props.onPositiveClick} text="Tak" />
    }
    return (
        <Modal
            visible={props.visibility}
            transparent={true}
            animationType={"fade"}>
            <View style={styles.mainOuterComponent}>
                <View style={styles.container}>
                    <Text style={styles.title}>{props.title}</Text>
                    <Text style={styles.message}>{props.message}</Text>
                    <View style={styles.buttonsContainer}>
                        {cancelButton}{okButton}
                    </View>
                </View>
            </View>
        </Modal>
    );
}


const styles = StyleSheet.create({
    mainOuterComponent: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#00000088'
    },
    container: {
        minHeight: 125,
        width: '80%',
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: "center",
        backgroundColor: colors.backgroundColor,
        borderWidth: 2,
        borderColor: colors.accent,
        borderRadius: dimensions.defaultBorderRadius,
        padding: dimensions.defaultPadding
    },
    title: {
        textAlign: "center",
        marginBottom: dimensions.defaultSmallMargin,
        fontSize: 16,
        fontWeight: 'bold'
    },
    message: {
        width: '80%',
        alignSelf: 'center',
        textAlign: 'center',
        marginBottom: dimensions.defaultSmallMargin
    },
    buttonsContainer: {
        flexDirection: "row",
        justifyContent: 'space-between',
        width: '75%',
    },
});


export default CustomAlert;