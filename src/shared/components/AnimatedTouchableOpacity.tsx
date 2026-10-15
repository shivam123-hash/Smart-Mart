import React, { useCallback, useMemo, useRef } from 'react';
import {
  Animated,
  GestureResponderEvent,
  StyleSheet,
  TouchableOpacity,
  TouchableOpacityProps,
} from 'react-native';
import { useLocalization } from '../i18n/LocalizationProvider';

const NativeAnimatedTouchableOpacity =
  Animated.createAnimatedComponent(TouchableOpacity);

const AnimatedTouchableOpacity = (props: TouchableOpacityProps) => {
  const { accessibilityLabel, onPressIn, onPressOut, style, ...rest } = props;
  const { t } = useLocalization();
  const scale = useRef(new Animated.Value(1)).current;

  const handlePressIn = useCallback((event: GestureResponderEvent) => {
    onPressIn?.(event);
    Animated.spring(scale, {
      toValue: 0.96,
      friction: 5,
      tension: 180,
      useNativeDriver: true,
    }).start();
  }, [onPressIn, scale]);

  const handlePressOut = useCallback((event: GestureResponderEvent) => {
    onPressOut?.(event);
    Animated.spring(scale, {
      toValue: 1,
      friction: 5,
      tension: 180,
      useNativeDriver: true,
    }).start();
  }, [onPressOut, scale]);

  const animatedStyle = useMemo(() => {
    const transforms = StyleSheet.flatten(style)?.transform;
    return [
      style,
      { transform: [...(Array.isArray(transforms) ? transforms : []), { scale }] },
    ];
  }, [scale, style]);

  return (
    <NativeAnimatedTouchableOpacity
      {...rest}
      accessibilityLabel={
        accessibilityLabel ? t(accessibilityLabel) : accessibilityLabel
      }
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={animatedStyle}
    />
  );
};

export default AnimatedTouchableOpacity;
