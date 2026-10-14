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
import ImagePath from '../../units/ImagePath';

export type FloatingItemLayer = 'back' | 'front';

interface FloatingItemConfig {
  id: string;
  name: string;
  source: ImageSourcePropType;
  layer: FloatingItemLayer;
  left: `${number}%`;
  initialY: number;
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
    initialY: -100,
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
    initialY: -150,
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
    initialY: -200,
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
    initialY: -50,
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
    initialY: -120,
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
    initialY: -180,
    duration: 4200,
    delay: 2500,
    rotation: '-15deg',
    size: 60,
  },
];

interface FloatingItemsProps {
  layer: FloatingItemLayer;
}

interface FloatingItemProps {
  item: FloatingItemConfig;
}

const { height } = Dimensions.get('window');
const FADE_IN_DURATION = 250;
const FADE_OUT_DURATION = 200;

const FloatingItem = ({ item }: FloatingItemProps) => {
  const translateY = useRef(new Animated.Value(item.initialY)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.85)).current;
  const scaleTarget = 1;
  const restingOpacity = item.layer === 'back' ? 0.85 : 1;

  useEffect(() => {
    const cycleDuration = item.duration - FADE_IN_DURATION - FADE_OUT_DURATION;
    const animation = Animated.loop(
      Animated.sequence([
        Animated.parallel([
          Animated.timing(translateY, {
            toValue: height * 0.45 + 50,
            duration: item.duration,
            delay: item.delay,
            easing: Easing.linear,
            useNativeDriver: true,
          }),
          Animated.sequence([
            Animated.timing(opacity, {
              toValue: restingOpacity,
              duration: FADE_IN_DURATION,
              delay: item.delay,
              easing: Easing.out(Easing.cubic),
              useNativeDriver: true,
            }),
            Animated.timing(opacity, {
              toValue: restingOpacity,
              duration: cycleDuration,
              easing: Easing.linear,
              useNativeDriver: true,
            }),
            Animated.timing(opacity, {
              toValue: 0,
              duration: FADE_OUT_DURATION,
              useNativeDriver: true,
            }),
          ]),
          Animated.sequence([
            Animated.timing(scale, {
              toValue: scaleTarget,
              duration: FADE_IN_DURATION,
              delay: item.delay,
              easing: Easing.out(Easing.back(1.2)),
              useNativeDriver: true,
            }),
            Animated.timing(scale, {
              toValue: scaleTarget,
              duration: item.duration - FADE_IN_DURATION,
              easing: Easing.linear,
              useNativeDriver: true,
            }),
          ]),
        ]),
        Animated.parallel([
          Animated.timing(translateY, {
            toValue: -100,
            duration: 0,
            useNativeDriver: true,
          }),
          Animated.timing(opacity, {
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
  }, [item, opacity, restingOpacity, scale, scaleTarget, translateY]);

  const size = item.size * (item.layer === 'back' ? 0.9 : 1.08);

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

const FloatingItems = ({ layer }: FloatingItemsProps) => (
  <View
    pointerEvents="none"
    style={[
      StyleSheet.absoluteFill,
      layer === 'back' ? styles.backLayer : styles.frontLayer,
    ]}
  >
    {FLOATING_ITEMS.filter((item) => item.layer === layer).map((item) => (
      <FloatingItem key={item.id} item={item} />
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
