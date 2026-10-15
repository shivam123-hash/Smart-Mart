import React from 'react';
import { Platform } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SplashScreen from '../../features/auth/screens/SplashScreen';
import OnBoardingScreen from '../../features/auth/screens/OnboardingScreen';
import LoginScreen from '../../features/auth/screens/LoginScreen';
import SignupScreen from '../../features/auth/screens/SignupScreen';
import ProductDetailsScreen from '../../features/catalog/screens/ProductDetailsScreen';
import ReviewsScreen from '../../features/catalog/screens/ReviewsScreen';
import ProductListScreen from '../../features/catalog/screens/ProductListScreen';
import ShopDetailsScreen from '../../features/catalog/screens/ShopDetailsScreen';
import CategoryListScreen from '../../features/catalog/screens/CategoryListScreen';
import CartScreen from '../../features/cart/screens/CartScreen';
import SearchAndFilterScreen from '../../features/catalog/screens/SearchAndFilterScreen';
import AddressScreen from '../../features/account/screens/AddressScreen';
import AddEditAddressScreen from '../../features/account/screens/AddEditAddressScreen';
import EditProfileScreen from '../../features/account/screens/EditProfileScreen';
import MyOrdersScreen from '../../features/orders/screens/MyOrdersScreen';
import OrderDetailsScreen from '../../features/orders/screens/OrderDetailsScreen';
import TrackOrderScreen from '../../features/orders/screens/TrackOrderScreen';
import PaymentMethodsScreen from '../../features/account/screens/PaymentMethodsScreen';
import AddPaymentMethodScreen from '../../features/account/screens/AddPaymentMethodScreen';
import NotificationsScreen from '../../features/account/screens/NotificationsScreen';
import HelpScreen from '../../features/support/screens/HelpScreen';
import LiveChatScreen from '../../features/support/screens/LiveChatScreen';
import SettingsScreen from '../../features/account/screens/SettingsScreen';
import PrivacyPolicyScreen from '../../features/legal/screens/PrivacyPolicyScreen';
import TermsOfServiceScreen from '../../features/legal/screens/TermsOfServiceScreen';
import MainNavigation from './MainNavigation';
import DeliveryNavigation from './DeliveryNavigation';
import EarningsScreen from '../../features/delivery/screens/EarningsScreen';
import PayoutHistoryScreen from '../../features/delivery/screens/PayoutHistoryScreen';
import DeliveryOrderDetailsScreen from '../../features/delivery/screens/DeliveryOrderDetailsScreen';
import DeliveryVehicleDocumentsScreen from '../../features/delivery/screens/DeliveryVehicleDocumentsScreen';

const Stack = createNativeStackNavigator();

const RootNavigation = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: Platform.OS === 'ios' ? 'fade_from_bottom' : 'slide_from_right',
        animationDuration: 280,
        freezeOnBlur: true,
      }}
    >
      <Stack.Screen name="SplashScreen" component={SplashScreen} />
      <Stack.Screen name="OnBoardingScreen" component={OnBoardingScreen} />
      <Stack.Screen name="LoginScreen" component={LoginScreen} />
      <Stack.Screen name="SignupScreen" component={SignupScreen} />
      <Stack.Screen name="MainNavigation" component={MainNavigation} />
      <Stack.Screen name="DeliveryNavigation" component={DeliveryNavigation} />
      <Stack.Screen name="EarningsScreen" component={EarningsScreen} />
      <Stack.Screen name="PayoutHistoryScreen" component={PayoutHistoryScreen} />
      <Stack.Screen name="DeliveryOrderDetailsScreen" component={DeliveryOrderDetailsScreen} />
      <Stack.Screen
        name="DeliveryVehicleDocumentsScreen"
        component={DeliveryVehicleDocumentsScreen}
      />
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
