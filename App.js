import React, { useState, useEffect } from 'react';
import { AsyncStorage } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import CustomLoadingComponent from './components/CustomLoadingComponent';
import WyborLokalizacji from './screens/WyborLokalizacji';
import Home from './screens/Home';


const Stack = createStackNavigator();

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [firstUse, setFirstUse] = useState();
  const forFade = ({ current, closing }) => ({
    cardStyle: {
      opacity: current.progress,
    },
  });
  useEffect(() => {
    fetchStorage();
  }, [isLoading]);

  async function fetchStorage() {
    if (isLoading) {
      try {
        setFirstUse(await AsyncStorage.getItem("firstUse"));
        setIsLoading(false);
      }
      catch (error) {

      }
    }
  }
  if (isLoading) {
    return <CustomLoadingComponent />
  }
  else {
    return (
      <NavigationContainer>
        <Stack.Navigator initialRouteName={firstUse === "false" ? "Home" : "WyborLokalizacji"} >
          <Stack.Screen name="WyborLokalizacji" component={WyborLokalizacji}
            options={{
              headerStyle: {
                opacity: 0, height: 0
              },
              cardStyleInterpolator: forFade
            }} />
          <Stack.Screen name="Home" component={Home}
            options={{
              headerStyle: {
                opacity: 0, height: 0
              },
              cardStyleInterpolator: forFade
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }
}
