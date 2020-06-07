
import React from 'react';
import { View, StyleSheet, Picker } from 'react-native';
import Colors from "../src/themes/colors";
import Dimensions from "../src/themes/dimensions";
import {AntDesign} from "react-native-vector-icons";


const CustomPicker = props => {

    const pickerItems = props.pickerItems;

    const onPickerChangedHandler = (item,index) => {

        let chosenItem;
        pickerItems.map((pickerItem,pickerIndex) =>{
            if(index===pickerIndex){
                chosenItem = pickerItem;
            }
        })
        props.onPickerChange(chosenItem);
    }


    return (
        <View style={[styles.container, props.containerStyle]}>
            <Picker
                mode="dialog"
                enabled={props.enabled === null ? true: props.enabled}
                selectedValue={props.selectedValue}
                style={styles.pickerStyle}
                onValueChange={(itemValue, itemIndex) => onPickerChangedHandler(itemValue, itemIndex)}>
                {pickerItems.map(item => {
                    return (
                        <Picker.Item label={item.label} value={item.value} color={props.selectedValue === item.value ? Colors.primary : Colors.colorTextDark} />
                    )
                })}

            </Picker>
            <View style={{ position: 'absolute', alignSelf: 'flex-end', right: 10 }}>
                <AntDesign name="downcircle" color={Colors.accent} size={24} />
            </View>
        </View>
    )

}

const styles = StyleSheet.create({
    container: {
        width: "75%",
        borderWidth: Dimensions.defaultBorderWidth,
        backgroundColor: Colors.colorTextWhite,
        borderColor: Colors.accent,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: Dimensions.defaultBorderRadius
    },
    pickerStyle: {
        height: 45, width: "100%", backgroundColor: 'transparent'
    }
});

export default CustomPicker;