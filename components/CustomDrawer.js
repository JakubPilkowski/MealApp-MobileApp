import React, { useState } from "react";
import { View, StyleSheet, Text, Platform } from 'react-native';
import { Divider, Avatar } from 'react-native-elements';
import { LinearGradient } from 'expo-linear-gradient';
import {
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem
} from '@react-navigation/drawer';
import {
  CommonActions,
  DrawerActions,
} from '@react-navigation/native';
import Colors from '../src/themes/colors';
import Dimensions from '../src/themes/dimensions';
import AndroidButton from './AndroidButton';
import IosButton from './IosButton';
import { createStackNavigator } from '@react-navigation/stack';
import dimensions from "../src/themes/dimensions";

import { Ionicons, Foundation, MaterialCommunityIcons } from '@expo/vector-icons';
import Logowanie from "../screens/Logowanie";

const CustomDrawer = props => {
  let loginButton;
  if (Platform.OS === "android") {
    loginButton = <AndroidButton text="Zaloguj się" containerStyle={{ borderRadius: dimensions.defaultHugeBorderRadius }}
      buttonStyle={{ color: Colors.accent, borderWidth: 0 }} onClick={() => {
        props.navigation.navigate("Logowanie");
      }} />
  }
  if (Platform.OS === "ios") {
    loginButton = <IosButton text="Zaloguj się" buttonStyle={{ color: Colors.colorTextWhite }} />
  }
  return (


    <LinearGradient
      style={styles.container}
      colors={[Colors.primary, Colors.accent]}
      locations={[0, 1.0]}
    >
      <DrawerContentScrollView {...props}>
        <Text style={styles.drawerTitle}>MealApp</Text>
        <View style={styles.drawerUserInfoContainer}>
          <Avatar rounded size="large" containerStyle={styles.drawerAvatar} />
          <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'center', }}>
            <Text style={styles.drawerUserInfo}>Nazwa</Text>
            <Divider style={styles.divider}></Divider>
            <Text style={styles.drawerUserInfo}>Email</Text>
          </View>
        </View>
        <View style={styles.drawerLoginContainer} >
          {loginButton}
        </View>
        <Divider style={styles.divider}></Divider>
        {
          props.state.routes.map((route, i) => {
            const focused = i === props.state.index;
            const { title, drawerLabel, drawerIcon } = props.descriptors[route.key].options;
            if (title !== "Logowanie") {
              return (
                <DrawerItem
                  key={route.key}
                  label={
                    drawerLabel !== undefined
                      ? drawerLabel
                      : title !== undefined
                        ? title
                        : route.name
                  }
                  icon={drawerIcon}
                  focused={focused}
                  activeTintColor={props.activeTintColor}
                  inactiveTintColor={props.inactiveTintColor}
                  activeBackgroundColor={props.activeBackgroundColor}
                  inactiveBackgroundColor={props.inactiveBackgroundColor}
                  labelStyle={props.labelStyle}
                  style={props.itemStyle}
                  onPress={() => {
                    props.navigation.dispatch({
                      ...(focused
                        ? DrawerActions.closeDrawer()
                        : CommonActions.navigate(route.name)),
                      target: props.state.key,
                    });
                  }}
                />
              );
            }
          })

        }

      </DrawerContentScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primary
  },
  container: {
    flex: 1,
  },
  drawerTitle: {
    fontSize: Dimensions.toolbarFontSize,
    color: Colors.colorTextWhite,
    textAlign: "center",
    marginVertical: 10
  },
  drawerUserInfoContainer: {
    flex: 1,
    flexDirection: 'row',
    marginVertical: Dimensions.defaultSmallMargin,
    marginHorizontal: Dimensions.defaultHugeMargin
  },
  drawerAvatar: {
    borderWidth: Dimensions.defaultBorderWidth,
    borderColor: Colors.colorTextWhite,
  },
  drawerUserInfo: {
    color: Colors.colorTextWhite,
    fontSize: 16,
    marginHorizontal: Dimensions.defaultSmallPadding
  },
  drawerLoginContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: "center"
  },
  drawerLoginView: {
    backgroundColor: Colors.colorTextWhite,
    borderRadius: Dimensions.defaultHugeBorderRadius
  },
  drawerLoginText: {
    color: Colors.accent,
    textAlign: "center",
    paddingVertical: Dimensions.defaultSmallPadding,
    paddingHorizontal: Dimensions.defaultHugePadding,
    fontSize: 18,
    fontWeight: "bold"
  },
  divider: {
    backgroundColor: Colors.colorTextWhite,
    height: 2,
    marginVertical: Dimensions.defaultSmallMargin
  }
});


export default CustomDrawer;
