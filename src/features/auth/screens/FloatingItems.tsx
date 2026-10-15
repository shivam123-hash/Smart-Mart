import React, { useEffect, useRef } from 'react';
import {
  Animated,
  Dimensions,
  Easing,
  Image,
  ImageSourcePropType,
  StyleSheet,
  View,
} from 'react-native';
import ImagePath from '../../../shared/constants/ImagePath';

export type FloatingItemLayer = 'back' | 'front';

interface FloatingItemConfig {
  id: string;
  name: string;
  source: ImageSourcePropType;
  layer: FloatingItemLayer;
  left: `${number}%`;
  duration: number;
  delay: number;
  rotation: `${number}deg`;
  size: number;
}

export const FLOATING_ITEMS: FloatingItemConfig[] = [
  {
    id: 'kurkure',
    name: 'Kurkure',
    source: ImagePath.LoginImageOne,
    layer: 'back',
    left: '15%',
    duration: 4000,
    delay: 0,
    rotation: '15deg',
    size: 65,
  },
  {
    id: 'oreo',
    name: 'Oreo',
    source: ImagePath.LoginImageTwo,
    layer: 'front',
    left: '75%',
    duration: 5000,
    delay: 1000,
    rotation: '-20deg',
    size: 75,
  },
  {
    id: 'lays',
    name: "Lay's",
    source: ImagePath.LoginImageThree,
    layer: 'back',
    left: '30%',
    duration: 4500,
    delay: 2000,
    rotation: '10deg',
    size: 80,
  },
  {
    id: 'shopping-cart',
    name: 'Shopping cart',
    source: ImagePath.LoginImageFourth,
    layer: 'front',
    left: '7%',
    duration: 6000,
    delay: 500,
    rotation: '-10deg',
    size: 65,
  },
  {
    id: 'paper-bag',
    name: 'Paper bag',
    source: ImagePath.Snacks,
    layer: 'front',
    left: '43%',
    duration: 5500,
    delay: 1500,
    rotation: '5deg',
    size: 75,
  },
  {
    id: 'milk',
    name: 'Milk bottle',
    source: ImagePath.LoginImageSixth,
    layer: 'back',
    left: '10%',
    duration: 4200,
    delay: 2500,
    rotation: '-15deg',
    size: 60,
  },
  {
    id: 'kurkure-small',
    name: 'Kurkure packet',
    source: ImagePath.LoginImageOne,
    layer: 'back',
    left: '62%',
    duration: 5200,
    delay: 3200,
    rotation: '-12deg',
    size: 48,
  },
  {
    id: 'oreo-small',
    name: 'Oreo packet',
    source: ImagePath.LoginImageTwo,
    layer: 'back',
    left: '84%',
    duration: 4700,
    delay: 4100,
    rotation: '14deg',
    size: 52,
  },
  {
    id: 'lays-small',
    name: "Lay's packet",
    source: ImagePath.LoginImageThree,
    layer: 'back',
    left: '48%',
    duration: 5600,
    delay: 5000,
    rotation: '-8deg',
    size: 50,
  },
  {
    id: 'milk-small',
    name: 'Milk bottle',
    source: ImagePath.LoginImageSixth,
    layer: 'back',
    left: '90%',
    duration: 4900,
    delay: 5900,
    rotation: '10deg',
    size: 46,
  },
];

interface FloatingItemsProps {
  layer: FloatingItemLayer;
  travelHeight: number;
}

interface FloatingItemProps {
  item: FloatingItemConfig;
  travelHeight: number;
}

const { width } = Dimensions.get('window');

const FloatingItem = ({ item, travelHeight }: FloatingItemProps) => {
  const size = item.size * (item.layer === 'back' ? 0.9 : 1.08);
  const translateY = useRef(new Animated.Value(-size)).current;
  const translateX = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.85)).current;
  const visibleEnd = Math.max(0, travelHeight - size);
  const opacity = translateY.interpolate({
    inputRange: [-size, 0, visibleEnd, travelHeight],
    outputRange: [0, 1, 1, 0],
    extrapolate: 'clamp',
  });

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.delay(item.delay),
        Animated.parallel([
          Animated.timing(translateY, {
            toValue: travelHeight,
            duration: item.duration,
            easing: Easing.linear,
            useNativeDriver: true,
          }),
          Animated.sequence([
            Animated.timing(scale, {
              toValue: 1,
              duration: 420,
              easing: Easing.out(Easing.back(1.2)),
              useNativeDriver: true,
            }),
            Animated.timing(scale, {
              toValue: 1,
              duration: item.duration - 420,
              easing: Easing.linear,
              useNativeDriver: true,
            }),
          ]),
          Animated.sequence([
            Animated.timing(translateX, {
              toValue: width * 0.035,
              duration: item.duration * 0.32,
              easing: Easing.inOut(Easing.ease),
              useNativeDriver: true,
            }),
            Animated.timing(translateX, {
              toValue: -width * 0.025,
              duration: item.duration * 0.36,
              easing: Easing.inOut(Easing.ease),
              useNativeDriver: true,
            }),
            Animated.timing(translateX, {
              toValue: 0,
              duration: item.duration * 0.32,
              easing: Easing.inOut(Easing.ease),
              useNativeDriver: true,
            }),
          ]),
        ]),
        Animated.parallel([
          Animated.timing(translateY, {
            toValue: -size,
            duration: 0,
            useNativeDriver: true,
          }),
          Animated.timing(translateX, {
            toValue: 0,
            duration: 0,
            useNativeDriver: true,
          }),
          Animated.timing(scale, {
            toValue: 0.85,
            duration: 0,
            useNativeDriver: true,
          }),
        ]),
      ]),
    );

    animation.start();
    return () => animation.stop();
  }, [item, scale, size, translateX, translateY, travelHeight]);

  return (
    <Animated.View
      pointerEvents="none"
      style={[
        styles.item,
        { left: item.left },
        item.layer === 'front' && styles.frontItem,
        {
          opacity,
          transform: [
            { translateY },
            { translateX },
            { rotate: item.rotation },
            { scale },
          ],
        },
      ]}
    >
      <Image
        source={item.source}
        style={{ width: size, height: size }}
        resizeMode="contain"
        accessibilityLabel={item.name}
      />
    </Animated.View>
  );
};

const FloatingItems = ({ layer, travelHeight }: FloatingItemsProps) => (
  <View
    pointerEvents="none"
    style={[
      StyleSheet.absoluteFill,
      layer === 'back' ? styles.backLayer : styles.frontLayer,
    ]}
  >
    {FLOATING_ITEMS.filter((item) => item.layer === layer).map((item) => (
      <FloatingItem
        key={item.id}
        item={item}
        travelHeight={travelHeight}
      />
    ))}
  </View>
);

const styles = StyleSheet.create({
  backLayer: {
    zIndex: 0,
    elevation: 0,
  },
  frontLayer: {
    zIndex: 2,
    elevation: 2,
  },
  item: {
    position: 'absolute',
    top: 0,
  },
  frontItem: {
    shadowColor: '#163b24',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.16,
    shadowRadius: 5,
    elevation: 4,
  },
});

export default FloatingItems;
