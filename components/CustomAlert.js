import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, Modal, TouchableNativeFeedback } from 'react-native';
import colors from '../src/themes/colors';
import dimensions from '../src/themes/dimensions';
import IosButton from './IosButton';
import AndroidButton from './AndroidButton';



const CustomAlert = props => {
    const [enteredGoal, setEnteredGoal] = useState('');

    const goalInputHandler = (enteredText) => {
        setEnteredGoal(enteredText);
    };
    const addGoalHandler = () => {
        props.onPositiveClick(enteredGoal);
        setEnteredGoal('');
    };
    const onCancelHandler = () => {
        props.onCancel();
        setEnteredGoal('');
    }
    let cancelButton;
    let okButton;
    if (Platform.OS === 'ios') {
        cancelButton =
            <IosButton onClick={onCancelHandler} text="Anuluj"/>;
        okButton =
            <IosButton onClick={addGoalHandler} text="Ok"/>;
    }
    if (Platform.OS === "android") {
        cancelButton =
            <AndroidButton onClick={onCancelHandler} text="Anuluj" containerStyle={{marginHorizontal:dimensions.defaultHugeMargin}}/>
        okButton =
            <AndroidButton onClick={addGoalHandler} text="Ok" />
    }
    return (
        <Modal
            visible={props.visibility}
            transparent={true}
            animationType={"fade"}
        >
            <View style={styles.mainOuterComponent}>
                <View style={styles.container}>
                    <Text style={styles.title}>Dodaj powiadomienie</Text>
                    <Text style={styles.message}>Wpisz nazwe alertu:</Text>
                    <TextInput selectionColor={colors.accent} style={styles.input} onChangeText={goalInputHandler} value={enteredGoal} />
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
        height: '30%',
        minHeight: 200,
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
        marginBottom: dimensions.defaultMargin,
        fontSize: 16,
        fontWeight: 'bold'
    },
    message: {
        width: '80%',
        alignSelf: 'center',
        textAlign: 'left'
    },
    input: {
        width: '80%',
        borderColor: colors.accent,
        borderWidth: 1,
        padding: 6,
        marginBottom: 20
    },
    buttonsContainer: {
        flexDirection: "row",
        justifyContent: 'flex-end',
        width: '100%',
    },
    buttonContainer: {

        marginHorizontal: dimensions.defaultMargin,
    },
    androidButtonView: {
        backgroundColor: colors.colorTextWhite,
        borderRadius: dimensions.defaultBorderRadius
    },
    moreButtonText: {
        paddingVertical: dimensions.defaultSmallPadding,
        paddingHorizontal: dimensions.defaultPadding,
        textAlign: "center",
        color: colors.primary,
        fontSize: dimensions.hugeFontSize,
        fontWeight: "bold",
        borderColor: colors.primary,
        borderRadius: dimensions.defaultBorderRadius,
        borderWidth: dimensions.defaultBorderWidth
    },

});


export default CustomAlert;