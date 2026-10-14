import React from 'react';
import { Platform } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SplashScreen from '../screens/auth/SplashScreen';
import OnBoardingScreen from '../screens/auth/OnboardingScreen';
import LoginScreen from '../screens/auth/LoginScreen';
import SignupScreen from '../screens/auth/SignupScreen';
import ProductDetailsScreen from '../screens/catalog/ProductDetailsScreen';
import ReviewsScreen from '../screens/catalog/ReviewsScreen';
import ProductListScreen from '../screens/catalog/ProductListScreen';
import ShopDetailsScreen from '../screens/catalog/ShopDetailsScreen';
import CategoryListScreen from '../screens/catalog/CategoryListScreen';
import CartScreen from '../screens/cart/CartScreen';
import SearchAndFilterScreen from '../screens/catalog/SearchAndFilterScreen';
import AddressScreen from '../screens/account/AddressScreen';
import AddEditAddressScreen from '../screens/account/AddEditAddressScreen';
import EditProfileScreen from '../screens/account/EditProfileScreen';
import MyOrdersScreen from '../screens/orders/MyOrdersScreen';
import OrderDetailsScreen from '../screens/orders/OrderDetailsScreen';
import TrackOrderScreen from '../screens/orders/TrackOrderScreen';
import PaymentMethodsScreen from '../screens/account/PaymentMethodsScreen';
import AddPaymentMethodScreen from '../screens/account/AddPaymentMethodScreen';
import NotificationsScreen from '../screens/account/NotificationsScreen';
import HelpScreen from '../screens/support/HelpScreen';
import LiveChatScreen from '../screens/support/LiveChatScreen';
import SettingsScreen from '../screens/account/SettingsScreen';
import PrivacyPolicyScreen from '../screens/legal/PrivacyPolicyScreen';
import TermsOfServiceScreen from '../screens/legal/TermsOfServiceScreen';
import MainNavigation from './MainNavigation';

const Stack = createNativeStackNavigator();

const RootNavigation = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: Platform.OS === 'ios' ? 'fade' : 'slide_from_right',
        freezeOnBlur: true,
      }}
    >
      <Stack.Screen name="SplashScreen" component={SplashScreen} />
      <Stack.Screen name="OnBoardingScreen" component={OnBoardingScreen} />
      <Stack.Screen name="LoginScreen" component={LoginScreen} />
      <Stack.Screen name="SignupScreen" component={SignupScreen} />
      <Stack.Screen name="MainNavigation" component={MainNavigation} />
      <Stack.Screen name="ProductDetailsScreen" component={ProductDetailsScreen} />
      <Stack.Screen name="ReviewsScreen" component={ReviewsScreen} />
      <Stack.Screen name="ProductListScreen" component={ProductListScreen} />
      <Stack.Screen name="ShopDetailsScreen" component={ShopDetailsScreen} />
      <Stack.Screen name="CategoryListScreen" component={CategoryListScreen} />
      <Stack.Screen name="CartScreen" component={CartScreen} />
      <Stack.Screen name="SearchAndFilterScreen" component={SearchAndFilterScreen} />
      <Stack.Screen name="AddressScreen" component={AddressScreen} />
      <Stack.Screen name="AddEditAddressScreen" component={AddEditAddressScreen} />
      <Stack.Screen name="EditProfileScreen" component={EditProfileScreen} />
      <Stack.Screen name="MyOrdersScreen" component={MyOrdersScreen} />
      <Stack.Screen name="OrderDetailsScreen" component={OrderDetailsScreen} />
      <Stack.Screen name="TrackOrderScreen" component={TrackOrderScreen} />
      <Stack.Screen name="PaymentMethodsScreen" component={PaymentMethodsScreen} />
      <Stack.Screen name="AddPaymentMethodScreen" component={AddPaymentMethodScreen} />
      <Stack.Screen name="NotificationsScreen" component={NotificationsScreen} />
      <Stack.Screen name="HelpScreen" component={HelpScreen} />
      <Stack.Screen name="LiveChatScreen" component={LiveChatScreen} />
      <Stack.Screen name="SettingsScreen" component={SettingsScreen} />
      <Stack.Screen name="PrivacyPolicyScreen" component={PrivacyPolicyScreen} />
      <Stack.Screen name="TermsOfServiceScreen" component={TermsOfServiceScreen} />
    </Stack.Navigator>
  );
};

export default RootNavigation;
