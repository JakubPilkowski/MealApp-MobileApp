import React from 'react';
import { View, StyleSheet, Platform, TouchableOpacity, TouchableNativeFeedback } from "react-native";
import Dimensions from '../src/themes/dimensions';
import Colors from '../src/themes/colors';
import Swipeable from 'react-native-gesture-handler/Swipeable';





const Card = props => {
    const cardView =
        <View style={styles.cardContainer}>
            {props.content}
        </View>;
    let touchableView;
    if (props.pressEnabled) {
        if (Platform.OS === "ios") {
            touchableView =
                <TouchableOpacity onPress={props.onCardPress} onLongPress={props.onLongCardPress}>
                    {cardView}
                </TouchableOpacity>
        }
        if (Platform.OS === "android") {
            touchableView =
                <TouchableNativeFeedback onPress={props.onCardPress} onLongPress={props.onLongCardPress} background={TouchableNativeFeedback.Ripple(Colors.primary, false)}
                    useForeground={false}>
                    {cardView}
                </TouchableNativeFeedback>
        }
    }
    else{
        touchableView=cardView;
    }
    return (
        <View>
            <Swipeable
                renderRightActions={props.onSwipeRight}
                containerStyle={[styles.container, props.cardStyle]}
            >
                {touchableView}
            </Swipeable>
        </View>
    );
}


const styles = StyleSheet.create({
    container: {
        justifyContent: "center",
        marginHorizontal: Dimensions.defaultSmallMargin,
        borderRadius: Dimensions.defaultSmallBorderRadius,
        borderColor: Colors.accent,
        borderWidth: Dimensions.defaultBorderWidth,
    },
    cardContainer: {
        backgroundColor: Colors.colorTextWhite,
        padding: Dimensions.defaultPadding,
    }
});

export default Card;