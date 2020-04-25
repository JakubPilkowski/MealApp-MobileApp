import React from 'react';
import { View, StyleSheet, Platform, TouchableOpacity, TouchableNativeFeedback } from "react-native";
import Dimensions from '../src/themes/dimensions';
import Colors from '../src/themes/colors';
import Swipeable from 'react-native-gesture-handler/Swipeable';





const Card = props => {
    const cardView =
        <View style={[styles.container, props.containerStyle]}>
            {props.content}
        </View>;
    let touchableView;
    if (props.pressEnabled) {
        if (Platform.OS === "ios" || (Platform.OS==="android" && Platform.Version < 21)) {
            touchableView =
                <TouchableOpacity onPress={props.onCardPress} onLongPress={props.onLongCardPress}>
                    {cardView}
                </TouchableOpacity>
        }
        if (Platform.OS === "android" && Platform.Version >= 21) {
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
                containerStyle={[styles.cardContainer, props.cardStyle]}
            >
                {touchableView}
            </Swipeable>
        </View>
    );
}


const styles = StyleSheet.create({
    cardContainer: {
        justifyContent: "center",
        marginHorizontal: Dimensions.defaultSmallMargin,
    },
    container: {
        backgroundColor: Colors.colorTextWhite,
        padding: Dimensions.defaultPadding,
        borderRadius: Dimensions.defaultSmallBorderRadius,
        borderColor: Colors.accent,
        borderWidth: Dimensions.defaultBorderWidth,
    }
});

export default Card;