import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, Animated, Dimensions,
  Modal, TouchableWithoutFeedback, TextInput,
} from 'react-native';
import Icon from '@react-native-vector-icons/feather';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

interface Props {
  visible: boolean;
  onClose: () => void;
  onSubmit: (rating: number, review: string) => void;
}

const RateOrderSheet = ({ visible, onClose, onSubmit }: Props) => {
  const insets = useSafeAreaInsets();
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState('');
  const slideAnim = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
  const backdropAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      setRating(0);
      setReview('');
      Animated.parallel([
        Animated.spring(slideAnim, { toValue: 0, friction: 9, tension: 65, useNativeDriver: true }),
        Animated.timing(backdropAnim, { toValue: 1, duration: 280, useNativeDriver: true }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(slideAnim, { toValue: SCREEN_HEIGHT, duration: 280, useNativeDriver: true }),
        Animated.timing(backdropAnim, { toValue: 0, duration: 250, useNativeDriver: true }),
      ]).start();
    }
  }, [visible]);

  return (
    <Modal transparent visible={visible} animationType="none" statusBarTranslucent>
      <View style={styles.container}>
        <TouchableWithoutFeedback onPress={onClose}>
          <Animated.View style={[styles.backdrop, { opacity: backdropAnim.interpolate({ inputRange: [0, 1], outputRange: [0, 0.5] }) }]} />
        </TouchableWithoutFeedback>

        <Animated.View style={[styles.sheet, { paddingBottom: insets.bottom + 20, transform: [{ translateY: slideAnim }] }]}>
          <View style={styles.handle} />
          <Text style={styles.title}>Rate your order</Text>
          <Text style={styles.subtitle}>How was your experience?</Text>

          <View style={styles.starsRow}>
            {[1, 2, 3, 4, 5].map((star) => (
              <TouchableOpacity key={star} onPress={() => setRating(star)} activeOpacity={0.7}>
                <Icon
                  name="star"
                  size={36}
                  color={star <= rating ? '#FFB800' : '#e0e0e0'}
                  style={{ marginHorizontal: 6 }}
                />
              </TouchableOpacity>
            ))}
          </View>

          <TextInput
            style={styles.reviewInput}
            placeholder="Write a review (optional)"
            placeholderTextColor="#9e9e9e"
            multiline
            value={review}
            onChangeText={setReview}
          />

          <TouchableOpacity
            style={[styles.submitBtn, rating === 0 && styles.submitBtnDisabled]}
            disabled={rating === 0}
            activeOpacity={0.85}
            onPress={() => {
              onSubmit(rating, review);
              onClose();
            }}
          >
            <Text style={styles.submitBtnText}>Submit Rating</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'flex-end' },
  backdrop: { ...StyleSheet.absoluteFill, backgroundColor: '#000' },
  sheet: {
    backgroundColor: '#fff', borderTopLeftRadius: 28, borderTopRightRadius: 28,
    paddingHorizontal: 24, paddingTop: 12,
  },
  handle: { width: 40, height: 4, borderRadius: 2, backgroundColor: '#e0e0e0', alignSelf: 'center', marginBottom: 20 },
  title: { fontSize: 20, fontFamily: 'Poppins-Bold', color: '#1a1a1a', textAlign: 'center' },
  subtitle: { fontSize: 14, fontFamily: 'Poppins-Regular', color: '#7a7a7a', textAlign: 'center', marginTop: 6, marginBottom: 24 },
  starsRow: { flexDirection: 'row', justifyContent: 'center', marginBottom: 24 },
  reviewInput: {
    backgroundColor: '#f5f6f8', borderRadius: 14, padding: 16, height: 100,
    textAlignVertical: 'top', fontSize: 14, fontFamily: 'Poppins-Regular', color: '#1a1a1a', marginBottom: 20,
  },
  submitBtn: {
    backgroundColor: '#55cc70', height: 52, borderRadius: 16, justifyContent: 'center', alignItems: 'center',
  },
  submitBtnDisabled: { backgroundColor: '#c8e6d0' },
  submitBtnText: { fontSize: 16, fontFamily: 'Poppins-Bold', color: '#fff' },
});

export default RateOrderSheet;