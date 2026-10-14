/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import { NewAppScreen } from '@react-native/new-app-screen';
import { useRef } from 'react';
import { Platform, StatusBar, StyleSheet, useColorScheme, View } from 'react-native';
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import {
  createNavigationContainerRef,
  NavigationContainer,
  ParamListBase,
  StackActions,
} from '@react-navigation/native';
import RootNavigation from './src/navigation/RootNavigation';
import {
  SharedTransitionProvider,
  SharedTransitionOverlay,
  useSharedTransition,
} from './src/components/sharedTransition';

const navigationRef = createNavigationContainerRef<ParamListBase>();

function App() {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <SafeAreaProvider>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <SharedTransitionProvider>
        <AppNavigation />
      </SharedTransitionProvider>
    </SafeAreaProvider>
  );
}

function AppNavigation() {
  const { activeItem, hideProduct, showProduct } = useSharedTransition();
  const overlayReturnRouteKey = useRef<string | null>(null);
  const overlayReturnTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleNavigationStateChange = () => {
    const currentRouteKey = navigationRef.getCurrentRoute()?.key;
    if (overlayReturnRouteKey.current === currentRouteKey && !overlayReturnTimer.current) {
      const returnRouteKey = currentRouteKey;
      overlayReturnTimer.current = setTimeout(() => {
        overlayReturnTimer.current = null;
        if (
          navigationRef.getCurrentRoute()?.key === returnRouteKey &&
          overlayReturnRouteKey.current === returnRouteKey
        ) {
          overlayReturnRouteKey.current = null;
          if (activeItem) {
            showProduct();
          }
        }
      }, Platform.OS === 'android' ? 360 : 0);
    } else if (
      overlayReturnTimer.current &&
      currentRouteKey !== overlayReturnRouteKey.current
    ) {
      clearTimeout(overlayReturnTimer.current);
      overlayReturnTimer.current = null;
      overlayReturnRouteKey.current = null;
    }
  };

  const pushWithOverlayHidden = (routeName: string, params?: ParamListBase[string]) => {
    if (overlayReturnTimer.current) {
      clearTimeout(overlayReturnTimer.current);
      overlayReturnTimer.current = null;
    }
    overlayReturnRouteKey.current = activeItem
      ? navigationRef.getCurrentRoute()?.key ?? null
      : null;
    hideProduct();
    navigationRef.dispatch(StackActions.push(routeName, params));
  };

  return (
    <>
      <NavigationContainer
        ref={navigationRef}
        onStateChange={handleNavigationStateChange}
      >
        <RootNavigation />
      </NavigationContainer>
      <SharedTransitionOverlay
        onNavigateToCart={() => pushWithOverlayHidden('CartScreen')}
        onNavigateToShop={() => pushWithOverlayHidden('ShopDetailsScreen')}
        onNavigateToReviews={(item) =>
          pushWithOverlayHidden('ReviewsScreen', { item })
        }
      />
    </>
  );
}

function AppContent() {
  const safeAreaInsets = useSafeAreaInsets();

  return (
    <View style={styles.container}>
      <NewAppScreen
        templateFileName="App.tsx"
        safeAreaInsets={safeAreaInsets}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;
