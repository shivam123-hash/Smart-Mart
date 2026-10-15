import React, { useEffect, useRef } from 'react';
import LocalizedText from '../../../shared/i18n/LocalizedText';
import { View, StyleSheet, Animated, Dimensions, Modal, TouchableWithoutFeedback } from 'react-native';
import TouchableOpacity from '../../../shared/components/AnimatedTouchableOpacity';
import Icon from '@react-native-vector-icons/feather';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

interface Props {
  visible: boolean;
  onClose: () => void;
  onConfirm: (address: string) => void;
}

const CurrentLocationSheet = ({ visible, onClose, onConfirm }: Props) => {
  const insets = useSafeAreaInsets();
  const slideAnim = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
  const backdropAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.spring(slideAnim, {
          toValue: 0,
          friction: 9,
          tension: 65,
          useNativeDriver: true,
        }),
        Animated.timing(backdropAnim, {
          toValue: 1,
          duration: 280,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: SCREEN_HEIGHT,
          duration: 280,
          useNativeDriver: true,
        }),
        Animated.timing(backdropAnim, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  const handleConfirm = () => {
    onConfirm('Current Location • Detected Address');
    onClose();
  };

  return (
    <Modal transparent visible={visible} animationType="none" statusBarTranslucent>
      <View style={styles.container}>
        <TouchableWithoutFeedback onPress={onClose}>
          <Animated.View
            style={[
              styles.backdrop,
              {
                opacity: backdropAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, 0.5],
                }),
              },
            ]}
          />
        </TouchableWithoutFeedback>

        <Animated.View
          style={[
            styles.sheet,
            {
              paddingBottom: insets.bottom + 20,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          {/* Handle */}
          <View style={styles.handle} />

          <View style={styles.iconWrapper}>
            <Icon name="navigation" size={28} color="#55cc70" />
          </View>

          <LocalizedText style={styles.title}>Use Current Location?</LocalizedText>
          <LocalizedText style={styles.subtitle}>
            We will use your device’s GPS to detect the nearest delivery address.
          </LocalizedText>

          <View style={styles.locationPreview}>
            <Icon name="map-pin" size={18} color="#55cc70" style={{ marginRight: 10 }} />
            <LocalizedText style={styles.locationText} numberOfLines={2}>
              Detecting precise location...
            </LocalizedText>
          </View>

          <TouchableOpacity style={styles.confirmBtn} activeOpacity={0.85} onPress={handleConfirm}>
            <LocalizedText style={styles.confirmBtnText}>Confirm & Continue</LocalizedText>
          </TouchableOpacity>

          <TouchableOpacity style={styles.cancelBtn} activeOpacity={0.8} onPress={onClose}>
            <LocalizedText style={styles.cancelBtnText}>Cancel</LocalizedText>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFill,
    backgroundColor: '#000',
  },
  sheet: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 24,
    paddingTop: 12,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#e0e0e0',
    alignSelf: 'center',
    marginBottom: 20,
  },
  iconWrapper: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(85, 204, 112, 0.12)',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontFamily: 'Poppins-Bold',
    color: '#1a1a1a',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: '#7a7a7a',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
  },
  locationPreview: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0faf3',
    borderRadius: 14,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#d4f0dc',
  },
  locationText: {
    flex: 1,
    fontSize: 14,
    fontFamily: 'Poppins-Medium',
    color: '#1a1a1a',
  },
  confirmBtn: {
    backgroundColor: '#55cc70',
    height: 52,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  confirmBtnText: {
    fontSize: 16,
    fontFamily: 'Poppins-Bold',
    color: '#ffffff',
  },
  cancelBtn: {
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelBtnText: {
    fontSize: 15,
    fontFamily: 'Poppins-Medium',
    color: '#7a7a7a',
  },
});

export default CurrentLocationSheet;