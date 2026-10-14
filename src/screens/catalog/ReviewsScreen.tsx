import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  Image,
  Modal,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Icon from '@react-native-vector-icons/feather';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { getProductReviews, ProductReview } from '../../data/productReviews';

const { width } = Dimensions.get('window');

const ReviewCard = ({
  review,
  entrance,
  onPhotoPress,
}: {
  review: ProductReview;
  entrance: Animated.Value;
  onPhotoPress: (image: string) => void;
}) => (
  <Animated.View
    style={[
      styles.reviewCard,
      {
        opacity: entrance,
        transform: [
          {
            translateY: entrance.interpolate({
              inputRange: [0, 1],
              outputRange: [22, 0],
            }),
          },
          {
            scale: entrance.interpolate({
              inputRange: [0, 1],
              outputRange: [0.98, 1],
            }),
          },
        ],
      },
    ]}
  >
    <View style={styles.reviewHeader}>
      <View style={styles.reviewerInfo}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{review.name.charAt(0)}</Text>
        </View>
        <View>
          <Text style={styles.reviewerName}>{review.name}</Text>
          <Text style={styles.reviewDate}>{review.date}</Text>
        </View>
      </View>
      <View style={styles.ratingPill}>
        <Icon name="star" size={13} color="#f3a72f" />
        <Text style={styles.ratingText}>{review.rating}.0</Text>
      </View>
    </View>

    <View style={styles.reviewStars}>
      {[1, 2, 3, 4, 5].map((star) => (
        <Icon
          key={star}
          name="star"
          size={15}
          color={star <= review.rating ? '#f3a72f' : '#dfe4e1'}
          style={styles.star}
        />
      ))}
    </View>

    <Text style={styles.reviewText}>{review.text}</Text>

    {review.images.length > 0 && (
      <View style={styles.photosSection}>
        <Text style={styles.photosLabel}>Customer photos</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.photosList}
        >
          {review.images.map((image, index) => (
            <TouchableOpacity
              key={`${review.id}-photo-${index}`}
              onPress={() => onPhotoPress(image)}
              activeOpacity={0.85}
              accessibilityRole="button"
              accessibilityLabel={`Open customer photo ${index + 1} from ${review.name}`}
            >
              <Image source={{ uri: image }} style={styles.reviewPhoto} />
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    )}
  </Animated.View>
);

const ReviewsScreen = ({ navigation, route }: any) => {
  const insets = useSafeAreaInsets();
  const product = route?.params?.item ?? {};
  const productName = product.name ?? 'Product';
  const productReviews = getProductReviews(product);
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);
  const headerEntrance = useRef(new Animated.Value(0)).current;
  const summaryEntrance = useRef(new Animated.Value(0)).current;
  const reviewEntrances = useRef(
    productReviews.map(() => new Animated.Value(0)),
  ).current;
  const photoScale = useRef(new Animated.Value(0.88)).current;

  useEffect(() => {
    const entrance = Animated.stagger(75, [
      Animated.timing(headerEntrance, {
        toValue: 1,
        duration: 320,
        useNativeDriver: true,
      }),
      Animated.timing(summaryEntrance, {
        toValue: 1,
        duration: 360,
        useNativeDriver: true,
      }),
      ...reviewEntrances.map((animation) =>
        Animated.timing(animation, {
          toValue: 1,
          duration: 320,
          useNativeDriver: true,
        }),
      ),
    ]);

    const startEntrance = () => entrance.start();
    if (Platform.OS === 'android') {
      const unsubscribe = navigation.addListener('transitionEnd', (event: any) => {
        if (!event.data.closing) {
          startEntrance();
        }
      });
      return () => {
        unsubscribe();
        entrance.stop();
      };
    }

    startEntrance();
    return () => entrance.stop();
  }, [headerEntrance, summaryEntrance, reviewEntrances, navigation]);

  useEffect(() => {
    if (!selectedPhoto) {
      photoScale.setValue(0.88);
      return;
    }

    const animation = Animated.spring(photoScale, {
      toValue: 1,
      friction: 7,
      tension: 55,
      useNativeDriver: true,
    });
    animation.start();
    return () => animation.stop();
  }, [selectedPhoto, photoScale]);

  const averageRating =
    productReviews.reduce((total, review) => total + review.rating, 0) /
    productReviews.length;

  const entranceStyle = (animation: Animated.Value) => ({
    opacity: animation,
    transform: [
      {
        translateY: animation.interpolate({
          inputRange: [0, 1],
          outputRange: [16, 0],
        }),
      },
    ],
  });

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <StatusBar barStyle="dark-content" />

      <Animated.View style={[styles.header, entranceStyle(headerEntrance)]}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <Icon name="chevron-left" size={26} color="#1a1a1a" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Reviews</Text>
        <View style={styles.headerSpacer} />
      </Animated.View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + 24 },
        ]}
      >
        <Animated.View style={[styles.summaryCard, entranceStyle(summaryEntrance)]}>
          <Text style={styles.productName} numberOfLines={1}>
            {productName}
          </Text>
          <View style={styles.summaryRow}>
            <View style={styles.averageBlock}>
              <Text style={styles.averageRating}>{averageRating.toFixed(1)}</Text>
              <View style={styles.summaryStars}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <Icon key={star} name="star" size={15} color="#f3a72f" />
                ))}
              </View>
              <Text style={styles.reviewCount}>
                Based on {productReviews.length} reviews
              </Text>
            </View>
            <View style={styles.ratingBreakdown}>
              {[5, 4, 3, 2, 1].map((rating) => {
                const count = productReviews.filter(
                  (review) => review.rating === rating,
                ).length;
                return (
                  <View key={rating} style={styles.ratingRow}>
                    <Text style={styles.ratingRowLabel}>{rating}</Text>
                    <Icon name="star" size={11} color="#f3a72f" />
                    <View style={styles.ratingTrack}>
                      <View
                        style={[
                          styles.ratingFill,
                          { width: `${(count / productReviews.length) * 100}%` },
                        ]}
                      />
                    </View>
                  </View>
                );
              })}
            </View>
          </View>
        </Animated.View>

        <Text style={styles.listTitle}>Customer reviews</Text>
        {productReviews.map((review, index) => (
          <ReviewCard
            key={review.id}
            review={review}
            entrance={reviewEntrances[index]}
            onPhotoPress={setSelectedPhoto}
          />
        ))}
      </ScrollView>

      <Modal
        visible={selectedPhoto !== null}
        transparent
        animationType="fade"
        onRequestClose={() => setSelectedPhoto(null)}
      >
        <View style={styles.photoModal}>
          <TouchableOpacity
            style={styles.photoCloseButton}
            onPress={() => setSelectedPhoto(null)}
            accessibilityRole="button"
            accessibilityLabel="Close photo"
          >
            <Icon name="x" size={24} color="#ffffff" />
          </TouchableOpacity>
          {selectedPhoto && (
            <Animated.Image
              source={{ uri: selectedPhoto }}
              resizeMode="contain"
              style={[
                styles.fullPhoto,
                { transform: [{ scale: photoScale }] },
              ]}
            />
          )}
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    height: 56,
    paddingHorizontal: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#ffffff',
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: 'Poppins-Bold',
    color: '#1a1a1a',
  },
  headerSpacer: {
    width: 40,
  },
  scrollContent: {
    paddingHorizontal: 18,
    paddingTop: 18,
  },
  summaryCard: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 18,
    marginBottom: 24,
    shadowColor: '#152b1d',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
  },
  productName: {
    fontSize: 15,
    fontFamily: 'Poppins-SemiBold',
    color: '#1a1a1a',
    marginBottom: 16,
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  averageBlock: {
    width: '42%',
    alignItems: 'center',
  },
  averageRating: {
    fontSize: 38,
    lineHeight: 45,
    fontFamily: 'Poppins-Bold',
    color: '#1a1a1a',
  },
  summaryStars: {
    flexDirection: 'row',
    gap: 2,
    marginTop: 2,
  },
  reviewCount: {
    marginTop: 6,
    fontSize: 10,
    fontFamily: 'Poppins-Regular',
    color: '#7a7a7a',
    textAlign: 'center',
  },
  ratingBreakdown: {
    flex: 1,
    gap: 5,
    paddingLeft: 8,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingRowLabel: {
    width: 10,
    fontSize: 10,
    fontFamily: 'Poppins-Medium',
    color: '#4a4a4a',
  },
  ratingTrack: {
    flex: 1,
    height: 6,
    borderRadius: 4,
    overflow: 'hidden',
    backgroundColor: '#edf0ed',
    marginLeft: 4,
  },
  ratingFill: {
    height: '100%',
    borderRadius: 4,
    backgroundColor: '#55cc70',
  },
  listTitle: {
    fontSize: 18,
    fontFamily: 'Poppins-Bold',
    color: '#1a1a1a',
    marginBottom: 12,
  },
  reviewCard: {
    backgroundColor: '#ffffff',
    borderRadius: 18,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#152b1d',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  reviewerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#e8f6ec',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 11,
  },
  avatarText: {
    fontSize: 17,
    fontFamily: 'Poppins-Bold',
    color: '#30984d',
  },
  reviewerName: {
    fontSize: 13,
    fontFamily: 'Poppins-SemiBold',
    color: '#1a1a1a',
  },
  reviewDate: {
    marginTop: 2,
    fontSize: 11,
    fontFamily: 'Poppins-Regular',
    color: '#9e9e9e',
  },
  ratingPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    borderRadius: 12,
    backgroundColor: '#fff7e8',
    paddingHorizontal: 9,
    paddingVertical: 5,
  },
  ratingText: {
    fontSize: 11,
    fontFamily: 'Poppins-SemiBold',
    color: '#66440d',
  },
  reviewStars: {
    flexDirection: 'row',
    marginTop: 12,
    marginBottom: 8,
  },
  star: {
    marginRight: 3,
  },
  reviewText: {
    fontSize: 13,
    fontFamily: 'Poppins-Regular',
    color: '#4a4a4a',
    lineHeight: 20,
  },
  photosSection: {
    marginTop: 14,
  },
  photosLabel: {
    fontSize: 11,
    fontFamily: 'Poppins-Medium',
    color: '#7a7a7a',
    marginBottom: 8,
  },
  photosList: {
    gap: 9,
  },
  reviewPhoto: {
    width: 96,
    height: 92,
    borderRadius: 12,
    backgroundColor: '#edf0ed',
  },
  photoModal: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.94)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  photoCloseButton: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 58 : 28,
    right: 20,
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: 'rgba(255,255,255,0.16)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  fullPhoto: {
    width: width,
    height: '78%',
  },
});

export default ReviewsScreen;
