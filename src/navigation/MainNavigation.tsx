import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from '@react-native-vector-icons/feather';
import HomeScreen from '../screens/home/HomeScreen';
import CartScreen from '../screens/cart/CartScreen';
import ProductListScreen from '../screens/catalog/ProductListScreen';
import ProfileScreen from '../screens/account/ProfileScreen';

const Tab = createBottomTabNavigator();

const SAMPLE_FAVOURITES = [
  {
    id: '1',
    name: 'Surf Excel Easy Wash Detergent Powder',
    size: '1 kg',
    price: '$12',
    originalPrice: '$15',
    image: 'https://cdn-icons-png.flaticon.com/512/2553/2553691.png',
  },
  {
    id: '3',
    name: 'Fresh Apples (Fuji)',
    size: '1 kg',
    price: '$4',
    originalPrice: '$6',
    image: 'https://cdn-icons-png.flaticon.com/512/3194/3194591.png',
  },
  {
    id: '5',
    name: 'Amul Taaza Toned Milk',
    size: '1 L',
    price: '$1.8',
    originalPrice: '$2.2',
    image: 'https://cdn-icons-png.flaticon.com/512/869/869687.png',
  },
  {
    id: '7',
    name: 'Tata Tea Premium',
    size: '500 g',
    price: '$7',
    originalPrice: '$9',
    image: 'https://cdn-icons-png.flaticon.com/512/924/924514.png',
  },
];

const DummyScreen = ({ name }: { name: string }) => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <Text>{name} Screen</Text>
  </View>
);

const CustomTabBarButton = ({ children, onPress, accessibilityState }: any) => {
  const isSelected = accessibilityState?.selected;
  return (
    <TouchableOpacity
      style={styles.tabButton}
      onPress={onPress}
      activeOpacity={1}
    >
      <View style={styles.tabIconContainer}>
        {isSelected && (
          <View style={styles.activeGlowContainer}>
            <View style={styles.activeGlow} />
          </View>
        )}
        {children}
      </View>
    </TouchableOpacity>
  );
};

const MainNavigation = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: styles.tabBar,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName = 'home';
          if (route.name === 'Home') iconName = 'home';
          else if (route.name === 'Favorites') iconName = 'heart';
          else if (route.name === 'Cart') iconName = 'shopping-bag';
          else if (route.name === 'Profile') iconName = 'user';

          return <Icon name={iconName as any} size={24} color={focused ? '#55cc70' : '#1a1a1a'} />;
        },
        tabBarButton: (props) => <CustomTabBarButton {...props} />,
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen
        name="Favorites"
        component={ProductListScreen}
        initialParams={{
          title: 'My Favourites',
          products: SAMPLE_FAVOURITES,
          isFavourites: true,
        }}
      />
      <Tab.Screen name="Cart" component={CartScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: '#ffffff',
    height: Platform.OS === 'ios' ? 85 : 70,
    paddingBottom: Platform.OS === 'ios' ? 20 : 0,
    paddingTop: Platform.OS === 'ios' ? 10 : 0,
    borderTopWidth: 0,
    elevation: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -5 },
    shadowOpacity: 0.05,
    shadowRadius: 15,
  },
  tabButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabIconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 60,
    height: 60,
  },
  activeGlowContainer: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? -25 : -15,
    width: 60,
    height: 25,
    overflow: 'hidden',
    alignItems: 'center',
  },
  activeGlow: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#55cc70',
    opacity: 0.2,
    transform: [{ translateY: -25 }],
    shadowColor: '#55cc70',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 1,
    shadowRadius: 15,
  }
});

export default MainNavigation;
