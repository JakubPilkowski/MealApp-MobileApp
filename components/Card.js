import React from 'react';
import { View, StyleSheet } from "react-native";
import Dimensions from '../src/themes/dimensions';
import Colors from '../src/themes/colors';
import Swipeable from 'react-native-gesture-handler/Swipeable';





const Card = props => {

    return (
        <Swipeable 
            renderRightActions={props.onSwipeRight}
            containerStyle={[props.cardStyle,styles.container]}
            >
            <View style={styles.cardContainer}>
                {props.content}
            </View>
        </Swipeable>
    );
}


const styles = StyleSheet.create({
    container: {
        justifyContent: "center",
        marginHorizontal: Dimensions.defaultSmallMargin,
        borderRadius: Dimensions.defaultSmallBorderRadius,
    },
    cardContainer:{
        backgroundColor: Colors.colorTextWhite,
        borderColor: Colors.accent,
        borderWidth: Dimensions.defaultBorderWidth,
        padding: Dimensions.defaultPadding,
    }
});

export default Card;