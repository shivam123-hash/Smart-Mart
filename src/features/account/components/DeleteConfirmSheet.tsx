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
  onConfirm: () => void;
  addressLabel?: string;
}

const DeleteConfirmSheet = ({ visible, onClose, onConfirm, addressLabel }: Props) => {
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
          duration: 260,
          useNativeDriver: true,
        }),
        Animated.timing(backdropAnim, {
          toValue: 0,
          duration: 240,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

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
          <View style={styles.handle} />

          <View style={styles.iconWrapper}>
            <Icon name="trash-2" size={28} color="#ff4d4f" />
          </View>

          <LocalizedText style={styles.title}>Delete Address?</LocalizedText>
          <LocalizedText style={styles.subtitle}>
            {addressLabel
              ? `Are you sure you want to delete “${addressLabel}”? This action cannot be undone.`
              : 'Are you sure you want to delete this address? This action cannot be undone.'}
          </LocalizedText>

          <TouchableOpacity style={styles.deleteBtn} activeOpacity={0.85} onPress={onConfirm}>
            <LocalizedText style={styles.deleteBtnText}>Yes, Delete</LocalizedText>
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
    backgroundColor: 'rgba(255, 77, 79, 0.1)',
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
    marginBottom: 28,
  },
  deleteBtn: {
    backgroundColor: '#ff4d4f',
    height: 52,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  deleteBtnText: {
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

export default DeleteConfirmSheet;