import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  StyleSheet,
  Pressable,
  Animated,
  Easing,
  BackHandler,
} from 'react-native';
import Icon from '@react-native-vector-icons/feather';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import LocalizedText from '../../../../shared/i18n/LocalizedText';
import TouchableOpacity from '../../../../shared/components/AnimatedTouchableOpacity';

type IconName = React.ComponentProps<typeof Icon>['name'];

type Props = {
  visible: boolean;
  hasPhoto: boolean;
  onClose: () => void;
  onCamera: () => void;
  onGallery: () => void;
  onRemove: () => void;
};

const PhotoPickerSheet = ({
  visible,
  hasPhoto,
  onClose,
  onCamera,
  onGallery,
  onRemove,
}: Props) => {
  const insets = useSafeAreaInsets();
  const [mounted, setMounted] = useState(visible);
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      setMounted(true);
      Animated.timing(anim, {
        toValue: 1,
        duration: 260,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(anim, {
        toValue: 0,
        duration: 200,
        easing: Easing.in(Easing.cubic),
        useNativeDriver: true,
      }).start(({ finished }) => {
        if (finished) setMounted(false);
      });
    }
  }, [visible, anim]);

  // Android back button closes the sheet first
  useEffect(() => {
    if (!visible) return;
    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      onClose();
      return true;
    });
    return () => sub.remove();
  }, [visible, onClose]);

  if (!mounted) return null;

  return (
    <View style={styles.overlay}>
      <Animated.View
        style={[StyleSheet.absoluteFill, styles.backdrop, { opacity: anim }]}
      >
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
      </Animated.View>

      <Animated.View
        style={[
          styles.sheet,
          {
            paddingBottom: Math.max(insets.bottom, 16) + 8,
            transform: [
              {
                translateY: anim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [320, 0],
                }),
              },
            ],
          },
        ]}
      >
        <View style={styles.handle} />
        <LocalizedText style={styles.title}>Profile Photo</LocalizedText>

        <Option icon="camera" label="Take Photo" onPress={onCamera} />
        <Option icon="image" label="Choose from Gallery" onPress={onGallery} />
        {hasPhoto && (
          <Option icon="trash-2" label="Remove Photo" danger onPress={onRemove} />
        )}

        <TouchableOpacity
          style={styles.cancelBtn}
          activeOpacity={0.8}
          onPress={onClose}
        >
          <LocalizedText style={styles.cancelText}>Cancel</LocalizedText>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};

const Option = ({
  icon,
  label,
  danger,
  onPress,
}: {
  icon: IconName;
  label: string;
  danger?: boolean;
  onPress: () => void;
}) => (
  <TouchableOpacity style={styles.option} activeOpacity={0.7} onPress={onPress}>
    <View style={[styles.optionIcon, danger && styles.optionIconDanger]}>
      <Icon name={icon} size={20} color={danger ? '#e53935' : '#55cc70'} />
    </View>
    <LocalizedText style={[styles.optionText, danger && styles.optionTextDanger]}>
      {label}
    </LocalizedText>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFill,
    zIndex: 50,
    elevation: 50, // Android: stay above the Save button's elevation
  },
  backdrop: {
    backgroundColor: 'rgba(0,0,0,0.45)',
  },
  sheet: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  handle: {
    alignSelf: 'center',
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#e0e0e0',
    marginBottom: 14,
  },
  title: {
    fontSize: 17,
    fontFamily: 'Poppins-Bold',
    color: '#1a1a1a',
    textAlign: 'center',
    marginBottom: 8,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  optionIcon: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: 'rgba(85, 204, 112, 0.12)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  optionIconDanger: {
    backgroundColor: 'rgba(229, 57, 53, 0.1)',
  },
  optionText: {
    fontSize: 15,
    fontFamily: 'Poppins-SemiBold',
    color: '#1a1a1a',
  },
  optionTextDanger: {
    color: '#e53935',
  },
  cancelBtn: {
    marginTop: 10,
    height: 50,
    borderRadius: 14,
    backgroundColor: '#f5f6f8',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelText: {
    fontSize: 15,
    fontFamily: 'Poppins-SemiBold',
    color: '#7a7a7a',
  },
});

export default PhotoPickerSheet;