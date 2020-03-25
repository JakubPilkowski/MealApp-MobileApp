import React from "react";
import { View, StyleSheet, Text, SafeAreaView, Platform} from 'react-native';
import { Divider, Avatar } from 'react-native-elements';
import { LinearGradient } from 'expo-linear-gradient';
import {
  DrawerContentScrollView,
  DrawerItemList,
} from '@react-navigation/drawer';
import Colors from '../src/themes/colors';
import Dimensions from '../src/themes/dimensions';
import AndroidButton from './AndroidButton';
import IosButton from './IosButton';
import { TouchableNativeFeedback } from 'react-native-gesture-handler';
import dimensions from "../src/themes/dimensions";

const CustomDrawer = props => {
  let loginButton;
  if (Platform.OS === "android") {
    loginButton = <AndroidButton text="Zaloguj się" containerStyle={{borderRadius:dimensions.defaultHugeBorderRadius}} buttonStyle={{ color: Colors.accent, borderWidth:0 }} />
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
        <DrawerItemList {...props} />
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
