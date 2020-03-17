import React from 'react';
import { View, Text, StyleSheet, Animated, ScrollView,Image, TouchableNativeFeedback, TouchableOpacity } from 'react-native';
import Colors from "../src/themes/colors";
import dimensions from '../src/themes/dimensions';
// import Dimensions from "../src/themes/Dimensions";
// import Strings from "../src/themes/strings";
const HEADER_EXPANDED_HEIGHT = 300;
const HEADER_COLLAPSED_HEIGHT = 56;

import { Ionicons, Foundation, MaterialCommunityIcons } from '@expo/vector-icons';

export default class JadlodajnieWiecej extends React.Component {

    // const {jadlodajnia_id} = props.route;

    constructor(props) {
        super(props);
        this.state = {
            scrollY: new Animated.Value(0)
        }
    }

    render() {
        const headerHeight = this.state.scrollY.interpolate(
            {
                inputRange: [0, HEADER_EXPANDED_HEIGHT - HEADER_COLLAPSED_HEIGHT],
                outputRange: [HEADER_EXPANDED_HEIGHT, HEADER_COLLAPSED_HEIGHT],
                extrapolate: 'clamp'
            })
        const headerTitleOpacity = this.state.scrollY.interpolate({
            inputRange: [0, HEADER_EXPANDED_HEIGHT - HEADER_COLLAPSED_HEIGHT],
            outputRange: [0, 1],
            extrapolate: 'clamp'
        });
        const heroTitleOpacity = this.state.scrollY.interpolate({
            inputRange: [0, HEADER_EXPANDED_HEIGHT - HEADER_COLLAPSED_HEIGHT],
            outputRange: [1, 0],
            extrapolate: 'clamp'
        });
        return (
            <View style={styles.container}>
                <Animated.View style={[styles.header, { height: headerHeight }]} >
                    <Animated.View style={styles.headerImageContainer}>
                    <Animated.Image source={{uri:'https://restaumatic.imgix.net/uploads/accounts/28994/media_library/15fdee8f-00c9-4a69-93c0-eb69c6de5727.jpg?auto=compress&crop=focalpoint&fit=crop&h=256&w=341'}}
                        style={[styles.headerImage,{       height:headerHeight, 
                            opacity:heroTitleOpacity, }]}
                    ></Animated.Image>
                    <Animated.Text style={[styles.headerExpanded,{ opacity: 1 }]}>Pełny gar</Animated.Text>
                    </Animated.View>
                </Animated.View>
                <View style={styles.backButtonContainer}>
                    <TouchableOpacity  
                    onPress={()=>{
                        this.props.navigation.goBack();
                    }}>
                    <Ionicons name="ios-arrow-round-back" size={36} color={Colors.colorTextWhite}></Ionicons>
                    </TouchableOpacity>
                </View>
                <ScrollView
                    contentContainerStyle={styles.scrollContainer}
                    onScroll={Animated.event(
                        [{
                            nativeEvent: {
                                contentOffset: {
                                    y: this.state.scrollY
                                }
                            }
                        }])}
                    scrollEventThrottle={16}
                >
                    <Text>
                    Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passage, and going through the cites of the word in classical literature, discovered the undoubtable source. Lorem Ipsum comes from sections 1.10.32 and 1.10.33 of "de Finibus Bonorum et Malorum" (The Extremes of Good and Evil) by Cicero, written in 45 BC. This book is a treatise on the theory of ethics, very popular during the Renaissance. The first line of Lorem Ipsum, "Lorem ipsum dolor sit amet..", comes from a line in section 1.10.32.

The standard chunk of Lorem Ipsum used since the 1500s is reproduced below for those interested. Sections 1.10.32 and 1.10.33 from "de Finibus Bonorum et Malorum" by Cicero are also reproduced in their exact original form, accompanied by English versions from the 1914 translation by H. Rackham.
ontrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passage, and going through the cites of the word in classical literature, discovered the undoubtable source. Lorem Ipsum comes from sections 1.10.32 and 1.10.33 of "de Finibus Bonorum et Malorum" (The Extremes of Good and Evil) by Cicero, written in 45 BC. This book is a treatise on the theory of ethics, very popular during the Renaissance. The first line of Lorem Ipsum, "Lorem ipsum dolor sit amet..", comes from a line in section 1.10.32.

The standard chunk of Lorem Ipsum used since the 1500s is reproduced below for those interested. Sections 1.10.32 and 1.10.33 from "de Finibus Bonorum et Malorum" by Cicero are also reproduced in their exact original form, accompanied by English versions from the 1914 translation by H. Rackham.
                    
                    </Text>
                </ScrollView>
            </View>
        )
    }
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: 'center',
    },
    header: {
        backgroundColor: Colors.primary,
        position: 'absolute',
        width: "100%",
        top: 0,
        left: 0,
        zIndex: 9998
    },
    headerImageContainer:{
        position: 'absolute', 
        top: 0, 
        left: 0, 
        right: 0, 
        bottom: 0, 
        justifyContent: 'center', 
        alignItems: 'center'
    },
    backButtonContainer:{
        flex:1,
        left:0,
        top:0,
        position:'absolute', 
        height:56,
        width:56,
        alignItems:"center",
        justifyContent:'center',
        opacity:1,
        zIndex: 9999
    },
    backButton:{
        // width:dimensions.defaultIconSize, 
        // height:dimensions.defaultIconSize,
    },
    headerImage:{
        width:"100%"
    },
    headerCollapsed:{
         position:'absolute', textAlign:"center", fontSize: 18, color: Colors.colorTextWhite, marginTop: 28,
    },
    headerExpanded:{
        textAlign: 'center', fontSize: dimensions.toolbarFontSize, color: Colors.colorTextWhite, position: 'absolute', bottom: dimensions.defaultMargin
    },
    scrollContainer: {
        paddingTop: HEADER_EXPANDED_HEIGHT
    }
})