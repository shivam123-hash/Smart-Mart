import React from 'react';
import { Platform } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SplashScreen from '../screens/authScreens/SplashScreen';
import OnBoardingScreen from '../screens/authScreens/OnBoardingScreen';
import LoginScreen from '../screens/authScreens/LoginScreen';
import ProductDetailsScreen from '../screens/dashBoardScreens/ProductDetailsScreen';
import MainNavigation from './MainNavigation';

const Stack = createNativeStackNavigator();

const RootNavigation = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false, animation: Platform.OS === 'ios' ? 'fade' : 'none' }} >
      <Stack.Screen name="SplashScreen" component={SplashScreen} />
      <Stack.Screen name="OnBoardingScreen" component={OnBoardingScreen} />
      <Stack.Screen name="LoginScreen" component={LoginScreen} />
      <Stack.Screen name="MainNavigation" component={MainNavigation} />
      <Stack.Screen name="ProductDetailsScreen" component={ProductDetailsScreen} options={{ animation: 'default' }} />
    </Stack.Navigator>
  );
};

export default RootNavigation;
