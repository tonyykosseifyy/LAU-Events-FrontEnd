import 'react-native-gesture-handler';
import { useFonts } from 'expo-font';
import { StatusBar } from 'expo-status-bar';
import { useCallback, useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import TextWrapper from './src/components/TextWrapper';
import { NavigationContainer } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createStackNavigator } from '@react-navigation/stack';
import OnBoarding from './src/screens/OnBoarding';
import Home from './src/screens/Home';
import Signin from './src/screens/Signin';
import { AuthProvider } from './src/context/AuthContext';

SplashScreen.preventAutoHideAsync();
const Stack = createStackNavigator();

export default function App() {
  const [firstLaunch, setFirstLaunch] = useState<boolean | null>(null);
  useEffect(() => {
    async function setData() {
      const appData = await AsyncStorage.getItem('appLaunched');
      if (appData === null) {
        setFirstLaunch(true);
        AsyncStorage.setItem('appLaunched', 'false');
      } else {
        setFirstLaunch(false);
        AsyncStorage.removeItem('appLaunched');
      }
    }
    setData();
  }, []);

  const [fontsLoaded] = useFonts({
    'PT Sans': require('./assets/fonts/PTSans-Regular.ttf'),
  });

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded || firstLaunch === null) {
    return null;
  }

  console.log(firstLaunch);
  return (
    <AuthProvider>
      <NavigationContainer onReady={onLayoutRootView}>
        <Stack.Navigator
          initialRouteName={firstLaunch ? 'Onboarding' : 'Signin'}
          screenOptions={{
            headerShown: false,
          }}>
          <Stack.Screen name="Onboarding" component={OnBoarding} />
          <Stack.Screen name="Home" component={Home} />
          <Stack.Screen name="Signin" component={Signin} />
        </Stack.Navigator>
      </NavigationContainer>
    </AuthProvider>
  );
}
