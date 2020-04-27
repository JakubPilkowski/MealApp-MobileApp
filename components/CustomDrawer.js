import React, { useState, useEffect } from "react";
import { View, StyleSheet, Text, Platform, TouchableNativeFeedback, Image, AsyncStorage, ActivityIndicator } from 'react-native';
import { Divider, Avatar } from 'react-native-elements';
import { LinearGradient } from 'expo-linear-gradient';
import {
  DrawerContentScrollView,
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
import dimensions from "../src/themes/dimensions";

import {
  MaterialIcons
} from '@expo/vector-icons';

const CustomDrawer = props => {
  let loginButton;
  let editButton;
  let loginStatus = props.dataSource.loginStatus;
  const [loginButtonEnabled, setLoginButtonEnabled] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [nazwa, setNazwa] = useState(props.dataSource.login);
  const [email, setEmail] = useState(props.dataSource.email);
  const [avatar, setAvatar] = useState(props.dataSource.avatar);
  const [isLoggedIn, setIsLoggedIn] = useState(loginStatus);

  if (Platform.OS === "android" && Platform.Version >= 21) {
    loginButton = <AndroidButton text={isLoggedIn ? "Wyloguj się" : "Zaloguj się"}
      enabled={loginButtonEnabled}
      containerStyle={{ borderRadius: dimensions.defaultHugeBorderRadius }}
      buttonStyle={{ color: Colors.accent, borderWidth: 0 }} onClick={() => loginClick()} />
    editButton =
      <View style={{ backgroundColor: Colors.primary, position: 'absolute', right: 12 }}>
        <TouchableNativeFeedback background={TouchableNativeFeedback.Ripple(Colors.accent, true)}
          onPress={() => { props.navigation.navigate("EdytujProfil"); }}
          useForeground={true}>
          <View style={{ flexDirection: 'column' }}>
            <MaterialIcons name="edit" color={Colors.colorTextWhite} size={28} />
          </View>
        </TouchableNativeFeedback>
      </View>
  }
  if (Platform.OS === "ios" || (Platform.OS === "android" && Platform.Version < 21)) {
    loginButton = <IosButton text={isLoggedIn ? "Wyloguj się" : "Zaloguj się"} buttonStyle={{ color: Colors.colorTextWhite }}
    enabled={loginButtonEnabled}
    onClick={() => loginClick()}/>
  }

  useEffect(() => {

  }, [isLoggedIn])

  async function loginClick() {
    if (isLoggedIn) {
      setLoginButtonEnabled(false);
      setIsLoading(true);
      setNazwa("");
      setEmail("");
      setAvatar("");
      await AsyncStorage.setItem("login", "");
      await AsyncStorage.setItem("email", "");
      await AsyncStorage.setItem("avatar", "");
      const facebookId = await AsyncStorage.getItem("facebookId");
      console.log(facebookId);
      const authToken = await AsyncStorage.getItem("authToken");
      if (facebookId !== "") {
        const token = `access_token=${authToken}`;
        await fetch(`https://graph.facebook.com/${facebookId}/permissions`, { method: "DELETE", body: token })
        await AsyncStorage.setItem("facebookId", "");
      }
      props.navigation.closeDrawer();
      await AsyncStorage.setItem("authToken", "");
      setIsLoading(false);
      setLoginButtonEnabled(true);
      setIsLoggedIn(false);
    }
    else {
      props.navigation.navigate("Logowanie");
    }
  }

  return (
    <LinearGradient
      style={styles.container}
      colors={[Colors.primary, Colors.accent]}
      locations={[0, 1.0]}
    >
      <DrawerContentScrollView {...props}>
        <View style={{ flexDirection: 'row', alignItems: 'center', }}>
          <Text style={styles.drawerTitle}>MealApp</Text>
          {editButton}
        </View>
        <View style={styles.drawerUserInfoContainer}>

          <Image style={styles.drawerAvatar} source={avatar.length > 0 ? { uri: avatar } : require("../src/images/image_default.png")} />
          <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'center', }}>
            <Text style={[styles.drawerUserInfo, { fontSize: email.length - 1 > 20 ? 14 : 16 }]}>
              {email.length > 0 ? email : "Brak maila"}
            </Text>
            <Divider style={styles.divider}></Divider>
            <Text style={[styles.drawerUserInfo, { fontSize: nazwa.length - 1 > 20 ? 14 : 16 }]}>
              {nazwa.length > 0 ? nazwa : "Brak loginu"}
            </Text>
          </View>
        </View>
        <View style={styles.drawerLoginContainer} >
          <View style={{ flexDirection: 'row' }} >
            <View style={{position:'absolute', width:'100%' }}>
              <ActivityIndicator size="large" color={Colors.colorTextWhite} animating={isLoading} />
            </View>
            {loginButton}
          </View>
        </View>
        <Divider style={styles.divider}></Divider>
        {
          props.state.routes.map((route, i) => {
            const focused = i === props.state.index;
            const { title, drawerLabel, drawerIcon } = props.descriptors[route.key].options;
            if (title !== "Logowanie" && title !== "EdytujProfil") {
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
                  style={{ paddingLeft: dimensions.defaultSmallPadding }}
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
  },
  container: {
    flex: 1,
  },
  drawerTitle: {
    fontSize: Dimensions.toolbarFontSize,
    color: Colors.colorTextWhite,
    flex: 1,
    textAlign: "center",
    marginVertical: 10
  },
  drawerUserInfoContainer: {
    flex: 1,
    flexDirection: 'row',
    marginVertical: Dimensions.defaultSmallMargin,
    marginHorizontal: 9
  },
  drawerAvatar: {
    height: 65,
    width: 65,
    borderRadius: 45,
    borderWidth: Dimensions.defaultBorderWidth,
    borderColor: Colors.colorTextWhite,
  },
  drawerUserInfo: {
    color: Colors.colorTextWhite,
    marginHorizontal: Dimensions.defaultSmallPadding
  },
  drawerLoginContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: "center",
    marginVertical: 6
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
