import React, { useEffect, useRef } from 'react';
import {
  Animated,
  Easing,
  Image,
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
import { SharedProductCard } from '../../components/sharedTransition';
import { SHOP_REVIEWS } from '../../data/productReviews';

const SHOP_PRODUCTS = [
  {
    id: '1',
    name: 'Fortune Soyabean Refined Oil',
    size: '5 L',
    price: '$10',
    originalPrice: '$12',
    image: 'https://cdn-icons-png.flaticon.com/512/2553/2553609.png',
  },
  {
    id: '2',
    name: 'Fortune Rice Bran Refined Oil',
    size: '5 L',
    price: '$15',
    originalPrice: '$18',
    image: 'https://cdn-icons-png.flaticon.com/512/2553/2553609.png',
  },
];

const ShopDetailsScreen = ({ navigation, route }: any) => {
  const insets = useSafeAreaInsets();
  const shop = route?.params?.shop ?? {};
  const shopName = shop.name ?? 'Green Valley Organic Mart';
  const address = shop.address ?? 'Delaware · 1.2 km away';
  const averageRating =
    SHOP_REVIEWS.reduce((total, review) => total + review.rating, 0) /
    SHOP_REVIEWS.length;
  
  const entranceAnims = useRef(
    Array.from({ length: SHOP_PRODUCTS.length + 5 }, () => new Animated.Value(0)),
  ).current;
  useEffect(() => {
    entranceAnims.forEach((anim) => anim.setValue(0));

    const startEntranceAnimation = () => {
      Animated.stagger(
        45,
        entranceAnims.map((anim) =>
          Animated.timing(anim, {
            toValue: 1,
            duration: 280,
            easing: Easing.out(Easing.cubic),
            useNativeDriver: true,
          }),
        ),
      ).start();
    };

    if (Platform.OS === 'android') {
      const unsubscribe = navigation.addListener('transitionEnd', (event: any) => {
        if (!event.data.closing) {
          startEntranceAnimation();
        }
      });

      return unsubscribe;
    }

    startEntranceAnimation();
  }, [entranceAnims, navigation]);

  const entranceStyle = (anim: Animated.Value) => ({
    opacity: anim,
    transform: [
      {
        translateY: anim.interpolate({
          inputRange: [0, 1],
          outputRange: [24, 0],
        }),
      },
      {
        scale: anim.interpolate({
          inputRange: [0, 1],
          outputRange: [0.96, 1],
        }),
      },
    ],
  });

  const openShopReviews = () => {
    navigation.push('ReviewsScreen', {
      item: {
        id: shop.id ?? 'green-valley-organic-mart',
        name: shopName,
        reviews: SHOP_REVIEWS,
      },
    });
  };

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <StatusBar barStyle="dark-content" />
      <Animated.View style={[styles.header, entranceStyle(entranceAnims[0])]}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <Icon name="chevron-left" size={26} color="#1a1a1a" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Shop Details</Text>
        <TouchableOpacity
          style={styles.cartButton}
          onPress={() => navigation.navigate('CartScreen')}
          accessibilityRole="button"
          accessibilityLabel="Open cart"
        >
          <Icon name="shopping-bag" size={20} color="#1a1a1a" />
          <View style={styles.cartBadge}>
            <Text style={styles.cartBadgeText}>2</Text>
          </View>
        </TouchableOpacity>
      </Animated.View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + 28 },
        ]}
      >
        <Animated.View style={[styles.shopHero, entranceStyle(entranceAnims[1])]}>
          <View style={styles.shopIcon}>
            <Icon name="shopping-bag" size={34} color="#55cc70" />
          </View>
          <Text style={styles.shopName}>{shopName}</Text>
          <Text style={styles.shopAddress}>{address}</Text>
          <View style={styles.ratingRow}>
            <Icon name="star" size={17} color="#0d3b29" />
            <Text style={styles.ratingText}>{averageRating.toFixed(1)}</Text>
            <Text style={styles.ratingCaption}>· {SHOP_REVIEWS.length} reviews</Text>
          </View>
          <View style={styles.openBadge}>
            <View style={styles.openDot} />
            <Text style={styles.openText}>Open · Closes at 10:00 PM</Text>
          </View>
        </Animated.View>

        <Animated.View style={[styles.infoCard, entranceStyle(entranceAnims[2])]}>
          <View style={styles.infoRow}>
            <View style={styles.infoIcon}>
              <Icon name="map-pin" size={18} color="#55cc70" />
            </View>
            <View style={styles.infoCopy}>
              <Text style={styles.infoTitle}>Store location</Text>
              <Text style={styles.infoText}>{address}</Text>
            </View>
          </View>
          <View style={styles.infoDivider} />
          <View style={styles.infoRow}>
            <View style={styles.infoIcon}>
              <Icon name="truck" size={18} color="#55cc70" />
            </View>
            <View style={styles.infoCopy}>
              <Text style={styles.infoTitle}>Delivery</Text>
              <Text style={styles.infoText}>Delivery in 20–30 minutes</Text>
            </View>
          </View>
        </Animated.View>

        <Animated.View style={[styles.reviewsSection, entranceStyle(entranceAnims[3])]}>
          <View style={styles.reviewsHeading}>
            <Text style={styles.sectionTitle}>Shop reviews</Text>
            <TouchableOpacity
              onPress={openShopReviews}
              activeOpacity={0.75}
              accessibilityRole="button"
              accessibilityLabel={`See all reviews for ${shopName}`}
            >
              <Text style={styles.seeAllReviews}>See all</Text>
            </TouchableOpacity>
          </View>
          {SHOP_REVIEWS.slice(0, 3).map((review) => (
            <View key={review.id} style={styles.reviewCard}>
              <View style={styles.reviewHeader}>
                <View style={styles.reviewerInfo}>
                  <View style={styles.reviewerAvatar}>
                    <Text style={styles.reviewerInitial}>{review.name.charAt(0)}</Text>
                  </View>
                  <View>
                    <Text style={styles.reviewerName}>{review.name}</Text>
                    <Text style={styles.reviewDate}>{review.date}</Text>
                  </View>
                </View>
                <View style={styles.reviewRating}>
                  <Icon name="star" size={12} color="#f3a72f" />
                  <Text style={styles.reviewRatingText}>{review.rating}.0</Text>
                </View>
              </View>
              <View style={styles.reviewStars}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <Icon
                    key={star}
                    name="star"
                    size={13}
                    color={star <= review.rating ? '#55cc70' : '#dfe4e1'}
                    style={styles.reviewStar}
                  />
                ))}
              </View>
              <Text style={styles.reviewText}>{review.text}</Text>
              {review.images.length > 0 && (
                <View style={styles.reviewPhotos}>
                  {review.images.slice(0, 2).map((image, index) => (
                    <Image
                      key={`${review.id}-photo-${index}`}
                      source={{ uri: image }}
                      style={styles.reviewPhoto}
                    />
                  ))}
                </View>
              )}
            </View>
          ))}
          <TouchableOpacity
            style={styles.allReviewsButton}
            onPress={openShopReviews}
            activeOpacity={0.75}
            accessibilityRole="button"
          >
            <Text style={styles.allReviewsButtonText}>
              See all {SHOP_REVIEWS.length} reviews
            </Text>
            <Icon name="arrow-right" size={16} color="#2fa64c" />
          </TouchableOpacity>
        </Animated.View>

        <Animated.View style={[styles.productsHeader, entranceStyle(entranceAnims[4])]}>
          <Text style={styles.sectionTitle}>Popular products</Text>
          <Text style={styles.productCount}>{SHOP_PRODUCTS.length} items</Text>
        </Animated.View>
        <View style={styles.productsGrid}>
          {SHOP_PRODUCTS.map((product, index) => (
            <Animated.View
              key={product.id}
              style={[
                styles.productCardWrapper,
                entranceStyle(entranceAnims[index + 5]),
              ]}
            >
              <SharedProductCard
                item={product}
                style={styles.productCard}
                onAdd={() => navigation.navigate('CartScreen')}
              />
            </Animated.View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    height: 64,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#f0f0f0',
  },
  backButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: 'Poppins-Bold',
    color: '#1a1a1a',
  },
  cartButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cartBadge: {
    position: 'absolute',
    top: 1,
    right: 0,
    minWidth: 18,
    height: 18,
    paddingHorizontal: 4,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 9,
    backgroundColor: '#ff4d4f',
    borderWidth: 1,
    borderColor: '#ffffff',
  },
  cartBadgeText: {
    color: '#ffffff',
    fontSize: 10,
    fontFamily: 'Poppins-Bold',
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  shopHero: {
    alignItems: 'center',
    paddingVertical: 24,
    paddingHorizontal: 16,
    backgroundColor: '#f8faf9',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#edf2ee',
  },
  shopIcon: {
    width: 76,
    height: 76,
    marginBottom: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 24,
    backgroundColor: 'rgba(85, 204, 112, 0.15)',
  },
  shopName: {
    textAlign: 'center',
    fontSize: 20,
    fontFamily: 'Poppins-Bold',
    color: '#1a1a1a',
  },
  shopAddress: {
    marginTop: 4,
    textAlign: 'center',
    fontSize: 13,
    fontFamily: 'Poppins-Regular',
    color: '#7a7a7a',
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
  },
  ratingText: {
    marginLeft: 5,
    fontSize: 14,
    fontFamily: 'Poppins-Bold',
    color: '#0d3b29',
  },
  ratingCaption: {
    marginLeft: 4,
    fontSize: 13,
    fontFamily: 'Poppins-Regular',
    color: '#7a7a7a',
  },
  openBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    paddingHorizontal: 11,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: 'rgba(85, 204, 112, 0.15)',
  },
  openDot: {
    width: 7,
    height: 7,
    marginRight: 7,
    borderRadius: 4,
    backgroundColor: '#35a853',
  },
  openText: {
    fontSize: 11,
    fontFamily: 'Poppins-Medium',
    color: '#25823d',
  },
  infoCard: {
    marginTop: 16,
    paddingHorizontal: 16,
    borderRadius: 16,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#edf0ed',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
  },
  infoIcon: {
    width: 38,
    height: 38,
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 19,
    backgroundColor: '#f1faf3',
  },
  infoCopy: {
    flex: 1,
  },
  infoTitle: {
    fontSize: 13,
    fontFamily: 'Poppins-SemiBold',
    color: '#1a1a1a',
  },
  infoText: {
    marginTop: 2,
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    color: '#7a7a7a',
  },
  infoDivider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#edf0ed',
  },
  reviewsSection: {
    marginTop: 24,
  },
  reviewsHeading: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  seeAllReviews: {
    fontSize: 13,
    fontFamily: 'Poppins-SemiBold',
    color: '#2fa64c',
  },
  reviewCard: {
    padding: 14,
    marginBottom: 12,
    borderRadius: 16,
    backgroundColor: '#f8faf8',
    borderWidth: 1,
    borderColor: '#edf2ee',
  },
  reviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  reviewerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  reviewerAvatar: {
    width: 40,
    height: 40,
    marginRight: 10,
    borderRadius: 20,
    backgroundColor: '#e8f6ec',
    alignItems: 'center',
    justifyContent: 'center',
  },
  reviewerInitial: {
    fontSize: 15,
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
  reviewRating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 12,
    backgroundColor: '#fff7e8',
  },
  reviewRatingText: {
    fontSize: 11,
    fontFamily: 'Poppins-SemiBold',
    color: '#66440d',
  },
  reviewStars: {
    flexDirection: 'row',
    marginTop: 10,
    marginBottom: 7,
  },
  reviewStar: {
    marginRight: 3,
  },
  reviewText: {
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    color: '#4a4a4a',
    lineHeight: 19,
  },
  reviewPhotos: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 10,
  },
  reviewPhoto: {
    width: 72,
    height: 68,
    borderRadius: 10,
    backgroundColor: '#edf0ed',
  },
  allReviewsButton: {
    minHeight: 46,
    marginTop: 2,
    paddingHorizontal: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#dcefe1',
    backgroundColor: '#f4fbf6',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  allReviewsButtonText: {
    fontSize: 13,
    fontFamily: 'Poppins-SemiBold',
    color: '#2fa64c',
  },
  productsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 24,
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Poppins-Bold',
    color: '#1a1a1a',
  },
  productCount: {
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    color: '#7a7a7a',
  },
  productsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  productCardWrapper: {
    width: '48%',
    marginBottom: 14,
  },
  productCard: {
    width: '100%',
    marginRight: 0,
  },
});

export default ShopDetailsScreen;