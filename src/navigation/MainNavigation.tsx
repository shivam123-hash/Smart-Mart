import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from '@react-native-vector-icons/feather';
import HomeScreen from '../screens/dashBoardScreens/HomeScreen';

const Tab = createBottomTabNavigator();

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
      <Tab.Screen name="Favorites" children={() => <DummyScreen name="Favorites" />} />
      <Tab.Screen name="Cart" children={() => <DummyScreen name="Cart" />} />
      <Tab.Screen name="Profile" children={() => <DummyScreen name="Profile" />} />
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
