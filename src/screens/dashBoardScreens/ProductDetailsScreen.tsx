import React, { useRef, useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, Image, Dimensions, FlatList, Animated, Platform } from 'react-native';
import Icon from '@react-native-vector-icons/feather';

const { width } = Dimensions.get('window');

const SIMILAR_PRODUCTS = [
  { id: '1', name: 'Fortune Soyabean Refined Oil', size: '5 L', price: '$10', originalPrice: '$12', image: 'https://cdn-icons-png.flaticon.com/512/2553/2553609.png' },
  { id: '2', name: 'Fortune Rice Bran Refined Oil', size: '5 L', price: '$15', originalPrice: '$18', image: 'https://cdn-icons-png.flaticon.com/512/2553/2553609.png' },
];

const ProductDetailsScreen = ({ route, navigation }: any) => {
  const { item = {} } = route.params || {};
  const [isFavorite, setIsFavorite] = useState(false);
  const carouselRef = useRef<FlatList>(null);
  const scrollX = useRef(new Animated.Value(0)).current;
  const bottomBarAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(bottomBarAnim, {
      toValue: 1,
      friction: 8,
      tension: 40,
      useNativeDriver: true,
    }).start();
  }, []);

  interface SlideItem {
    id: string;
    uri?: string;
    source?: any;
    label: string;
  }

  const getProductGallery = (prodItem: any): SlideItem[] => {
    if (prodItem?.images && Array.isArray(prodItem.images) && prodItem.images.length > 0) {
      const labels = ['Front View', 'Back & Ingredients', 'Side View', 'Nutrition & Seal'];
      return prodItem.images.map((img: any, idx: number) => ({
        id: String(idx),
        uri: typeof img === 'string' ? img : undefined,
        source: typeof img !== 'string' ? img : undefined,
        label: labels[idx] || `Side ${idx + 1}`,
      }));
    }

    const name = (prodItem?.name || '').toLowerCase();
    const primaryImg = prodItem?.image || 'https://cdn-icons-png.flaticon.com/512/2553/2553691.png';

    // 1. Snacks / Chips / Munchies (e.g. Flaticon 2553691)
    if (name.includes('surf') || name.includes('detergent') || (typeof primaryImg === 'string' && primaryImg.includes('2553691'))) {
      return [
        { id: '1', uri: 'https://cdn-icons-png.flaticon.com/512/2553/2553691.png', label: 'Front Pack' },
        { id: '2', uri: 'https://cdn-icons-png.flaticon.com/512/3082/3082060.png', label: 'Back & Ingredients' },
        { id: '3', uri: 'https://cdn-icons-png.flaticon.com/512/2553/2553673.png', label: 'Side & Open Pack' },
        { id: '4', uri: 'https://cdn-icons-png.flaticon.com/512/3655/3655589.png', label: 'Nutrition Facts & Seal' },
      ];
    }

    // 2. Oil / Dal / Staples
    if (name.includes('oil') || name.includes('fortune') || name.includes('dal')) {
      return [
        { id: '1', uri: typeof primaryImg === 'string' ? primaryImg : 'https://cdn-icons-png.flaticon.com/512/2553/2553609.png', label: 'Front Bottle' },
        { id: '2', uri: 'https://cdn-icons-png.flaticon.com/512/3082/3082060.png', label: 'Back & Nutritional Info' },
        { id: '3', uri: 'https://cdn-icons-png.flaticon.com/512/2553/2553634.png', label: 'Side & Pouring Spout' },
        { id: '4', uri: 'https://cdn-icons-png.flaticon.com/512/3655/3655589.png', label: 'Purity & Quality Seal' },
      ];
    }

    // 3. Apples / Fruits
    if (name.includes('apple') || name.includes('fruit')) {
      return [
        { id: '1', uri: 'https://cdn-icons-png.flaticon.com/512/3194/3194591.png', label: 'Fresh Whole Fruit' },
        { id: '2', uri: 'https://cdn-icons-png.flaticon.com/512/415/415682.png', label: 'Sliced Cross-Section' },
        { id: '3', uri: 'https://cdn-icons-png.flaticon.com/512/3082/3082011.png', label: 'Farm Fresh Box' },
        { id: '4', uri: 'https://cdn-icons-png.flaticon.com/512/3655/3655589.png', label: 'Organic Certified' },
      ];
    }

    // 4. Atta / Flour
    if (name.includes('atta') || name.includes('flour') || name.includes('aashirvaad')) {
      return [
        { id: '1', uri: 'https://cdn-icons-png.flaticon.com/512/3014/3014436.png', label: 'Pack Front' },
        { id: '2', uri: 'https://cdn-icons-png.flaticon.com/512/3082/3082060.png', label: 'Back & Nutrition Table' },
        { id: '3', uri: 'https://cdn-icons-png.flaticon.com/512/992/992747.png', label: '100% Whole Wheat Grain' },
        { id: '4', uri: 'https://cdn-icons-png.flaticon.com/512/3014/3014476.png', label: 'Soft Roti Preparation' },
      ];
    }

    // 5. Milk / Dairy
    if (name.includes('milk') || name.includes('dairy')) {
      return [
        { id: '1', uri: 'https://cdn-icons-png.flaticon.com/512/869/869687.png', label: 'Carton Front' },
        { id: '2', uri: 'https://cdn-icons-png.flaticon.com/512/3082/3082060.png', label: 'Back & Barcode' },
        { id: '3', uri: 'https://cdn-icons-png.flaticon.com/512/2405/2405479.png', label: 'Poured Milk Glass' },
        { id: '4', uri: 'https://cdn-icons-png.flaticon.com/512/3655/3655589.png', label: 'Pure Dairy Certified' },
      ];
    }

    // 6. Juice / Cold drinks
    if (name.includes('juice') || name.includes('drink')) {
      return [
        { id: '1', uri: 'https://cdn-icons-png.flaticon.com/512/2405/2405597.png', label: 'Bottle Front' },
        { id: '2', uri: 'https://cdn-icons-png.flaticon.com/512/3082/3082060.png', label: 'Back & Ingredients' },
        { id: '3', uri: 'https://cdn-icons-png.flaticon.com/512/2405/2405451.png', label: 'Fresh Pour & Pulp' },
        { id: '4', uri: 'https://cdn-icons-png.flaticon.com/512/3655/3655589.png', label: '100% Real Juice Seal' },
      ];
    }

    // 7. Tea / Coffee
    if (name.includes('tea') || name.includes('coffee') || name.includes('lipton')) {
      return [
        { id: '1', uri: 'https://cdn-icons-png.flaticon.com/512/924/924514.png', label: 'Box Front' },
        { id: '2', uri: 'https://cdn-icons-png.flaticon.com/512/3082/3082060.png', label: 'Back & Brewing Guide' },
        { id: '3', uri: 'https://cdn-icons-png.flaticon.com/512/924/924512.png', label: 'Steaming Cup' },
        { id: '4', uri: 'https://cdn-icons-png.flaticon.com/512/1514/1514935.png', label: 'Handpicked Green Leaves' },
      ];
    }

    // 8. Frozen peas / Instant food
    if (name.includes('peas') || name.includes('frozen')) {
      return [
        { id: '1', uri: 'https://cdn-icons-png.flaticon.com/512/3014/3014493.png', label: 'Pack Front' },
        { id: '2', uri: 'https://cdn-icons-png.flaticon.com/512/3082/3082060.png', label: 'Back & Storage Info' },
        { id: '3', uri: 'https://cdn-icons-png.flaticon.com/512/2347/2347028.png', label: 'Fresh Green Pods' },
        { id: '4', uri: 'https://cdn-icons-png.flaticon.com/512/3655/3655589.png', label: 'Flash Frozen Lock' },
      ];
    }

    // 9. Chicken / Meat
    if (name.includes('chicken') || name.includes('meat')) {
      return [
        { id: '1', uri: 'https://cdn-icons-png.flaticon.com/512/3143/3143645.png', label: 'Sealed Tray Front' },
        { id: '2', uri: 'https://cdn-icons-png.flaticon.com/512/3082/3082060.png', label: 'Back & Expiry Details' },
        { id: '3', uri: 'https://cdn-icons-png.flaticon.com/512/1046/1046751.png', label: 'Fresh Boneless Cut' },
        { id: '4', uri: 'https://cdn-icons-png.flaticon.com/512/3655/3655589.png', label: 'Quality Certified' },
      ];
    }

    // Fallback
    return [
      { id: '1', uri: typeof primaryImg === 'string' ? primaryImg : undefined, source: typeof primaryImg !== 'string' ? primaryImg : undefined, label: 'Front View' },
      { id: '2', uri: 'https://cdn-icons-png.flaticon.com/512/3082/3082060.png', label: 'Back & Ingredients' },
      { id: '3', uri: 'https://cdn-icons-png.flaticon.com/512/2553/2553673.png', label: 'Side Profile' },
      { id: '4', uri: 'https://cdn-icons-png.flaticon.com/512/3655/3655589.png', label: 'Nutrition Facts & Seal' },
    ];
  };

  const gallery = getProductGallery(item);

  const handleDotPress = (index: number) => {
    carouselRef.current?.scrollToOffset({
      offset: index * width,
      animated: true,
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerIcon} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
          <Icon name="chevron-left" size={24} color="#1a1a1a" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Item Details</Text>
        <TouchableOpacity style={styles.cartIconWrapper} activeOpacity={0.85}>
          <View style={styles.cartButton}>
            <Icon name="shopping-bag" size={20} color="#1a1a1a" />
            <View style={styles.cartBadge}>
              <Text style={styles.cartBadgeText}>2</Text>
            </View>
          </View>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* Product Image Carousel */}
        <View style={styles.imageContainer}>
          <FlatList
            ref={carouselRef}
            data={gallery}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            bounces={false}
            keyExtractor={(slideItem) => slideItem.id}
            getItemLayout={(_, index) => ({
              length: width,
              offset: width * index,
              index,
            })}
            onScroll={Animated.event(
              [{ nativeEvent: { contentOffset: { x: scrollX } } }],
              { useNativeDriver: false }
            )}
            scrollEventThrottle={16}
            onScrollToIndexFailed={(info) => {
              setTimeout(() => {
                carouselRef.current?.scrollToOffset({ offset: info.index * width, animated: true });
              }, 100);
            }}
            renderItem={({ item: slide }) => (
              <View style={styles.imageSlide}>
                <Image 
                  source={slide.source ? slide.source : { uri: slide.uri }} 
                  style={styles.mainImage} 
                  resizeMode="contain"
                />
                <View style={styles.angleBadge}>
                  <Text style={styles.angleBadgeText}>{slide.label}</Text>
                </View>
              </View>
            )}
          />

          {/* Animated Liquid Pagination Dots */}
          <View style={styles.paginationContainer}>
            {gallery.map((_: SlideItem, idx: number) => {
              const isFirst = idx === 0;
              const isLast = idx === gallery.length - 1;

              const dotWidth = scrollX.interpolate({
                inputRange: [(idx - 1) * width, idx * width, (idx + 1) * width],
                outputRange: [
                  isFirst ? 24 : 8,
                  24,
                  isLast ? 24 : 8,
                ],
                extrapolate: 'clamp',
              });

              const dotColor = scrollX.interpolate({
                inputRange: [(idx - 1) * width, idx * width, (idx + 1) * width],
                outputRange: [
                  isFirst ? '#1a1a1a' : '#e4e6eb',
                  '#1a1a1a',
                  isLast ? '#1a1a1a' : '#e4e6eb',
                ],
                extrapolate: 'clamp',
              });

              const dotOpacity = scrollX.interpolate({
                inputRange: [(idx - 1) * width, idx * width, (idx + 1) * width],
                outputRange: [
                  isFirst ? 1 : 0.45,
                  1,
                  isLast ? 1 : 0.45,
                ],
                extrapolate: 'clamp',
              });

              return (
                <TouchableOpacity
                  key={idx}
                  onPress={() => handleDotPress(idx)}
                  activeOpacity={0.7}
                  hitSlop={{ top: 12, bottom: 12, left: 6, right: 6 }}
                  style={styles.dotTouchable}
                >
                  <Animated.View
                    style={[
                      styles.dot,
                      {
                        width: dotWidth,
                        backgroundColor: dotColor,
                        opacity: dotOpacity,
                      },
                    ]}
                  />
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        <View style={styles.detailsContainer}>
          {/* Product Name with Heart in Circular Button on the Right */}
          <View style={styles.nameAndFavoriteRow}>
            <Text style={styles.productName}>{item.name}</Text>
            <TouchableOpacity
              style={styles.favoriteCircleButton}
              activeOpacity={0.8}
              onPress={() => setIsFavorite(!isFavorite)}
            >
              <Icon
                name="heart"
                size={20}
                color={isFavorite ? '#ff4d4f' : '#1a1a1a'}
              />
            </TouchableOpacity>
          </View>

          {/* Price on Left, 4.5 Rating on Right Corner */}
          <View style={styles.priceAndRatingRow}>
            <View style={styles.priceContainer}>
              <Text style={styles.currentPrice}>{item.price}</Text>
              <Text style={styles.originalPrice}>{item.originalPrice}</Text>
              <View style={styles.discountBadge}>
                <Text style={styles.discountText}>10% OFF</Text>
              </View>
            </View>

            <View style={styles.ratingBadge}>
              <Icon name="star" size={16} color="#0d3b29" style={styles.ratingStarIcon} />
              <Text style={styles.ratingBadgeText}>4.5 Rating</Text>
            </View>
          </View>

          <Text style={styles.descriptionText}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Orci, sem feugiat ut nullam nisl orci, volutpat, felis. Nunc elit, et mattis commodo condimentum tellus et. <Text style={styles.readMoreText}>Read More</Text>
          </Text>

          {/* Shop Section */}
          <Text style={styles.sectionTitle}>Shop</Text>
          <View style={styles.shopCard}>
            <View style={styles.shopLeft}>
              <View style={styles.shopIconContainer}>
                <Icon name="shopping-bag" size={20} color="#55cc70" />
              </View>
              <View style={styles.shopInfo}>
                <Text style={styles.shopName}>Green Valley Organic Mart</Text>
                <Text style={styles.shopSubtext}>Delaware • 1.2 km away</Text>
              </View>
            </View>
            <View style={styles.ratingBadge}>
              <Icon name="star" size={15} color="#0d3b29" style={styles.ratingStarIcon} />
              <Text style={styles.ratingBadgeText}>4.8 Rating</Text>
            </View>
          </View>

          {/* Reviews Section */}
          <Text style={styles.sectionTitle}>Reviews</Text>

          {/* Single Review */}
          <View style={styles.reviewItem}>
            <View style={styles.reviewHeader}>
              <View style={styles.reviewerInfo}>
                <View style={styles.avatarPlaceholder} />
                <View>
                  <Text style={styles.reviewerName}>Johnson Smith</Text>
                  <Text style={styles.reviewDate}>April 10, 2023</Text>
                </View>
              </View>
              <View style={styles.starsContainer}>
                {[1,2,3,4,5].map(i => <Icon key={i} name="star" size={14} color="#55cc70" style={styles.star} />)}
              </View>
            </View>
            <Text style={styles.reviewText}>
              Recently I have purchased this product and it's quality is very nice. I loved it.
            </Text>
          </View>

          {/* Similar Products */}
          <Text style={styles.sectionTitle}>Similar Products</Text>
          <View style={styles.similarProductsGrid}>
            {SIMILAR_PRODUCTS.map(prod => (
              <TouchableOpacity 
                key={prod.id} 
                style={styles.similarCard}
                activeOpacity={0.9}
                onPress={() => navigation.push('ProductDetailsScreen', { item: prod })}
              >
                <TouchableOpacity style={styles.favoriteIcon}>
                  <Icon name="heart" size={18} color="#1a1a1a" />
                </TouchableOpacity>
                <Image source={{ uri: prod.image }} style={styles.similarImage} resizeMode="contain" />
                <Text style={styles.similarName} numberOfLines={2}>{prod.name}</Text>
                <Text style={styles.similarSize}>{prod.size}</Text>
                <View style={styles.similarPriceRow}>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Text style={styles.similarCurrentPrice}>{prod.price}</Text>
                    <Text style={styles.similarOriginalPrice}>{prod.originalPrice}</Text>
                  </View>
                  <TouchableOpacity style={styles.similarAddBtn}>
                    <Text style={styles.similarAddBtnText}>Add</Text>
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            ))}
          </View>

        </View>
      </ScrollView>

      {/* Animated Bottom Action Bar with 'Add to Cart' & 'Buy Now' */}
      <Animated.View
        style={[
          styles.bottomActionBar,
          {
            opacity: bottomBarAnim,
            transform: [
              {
                translateY: bottomBarAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [90, 0],
                }),
              },
            ],
          },
        ]}
      >
        <TouchableOpacity style={styles.addToCartBtn} activeOpacity={0.85}>
          <Icon name="shopping-bag" size={18} color="#55cc70" style={{ marginRight: 8 }} />
          <Text style={styles.addToCartBtnText}>Add to Cart</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.buyNowBtn} activeOpacity={0.85}>
          <Text style={styles.buyNowBtnText}>Buy Now</Text>
        </TouchableOpacity>
      </Animated.View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  headerIcon: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: 'Poppins-Bold',
    color: '#1a1a1a',
  },
  cartIconWrapper: {
    padding: 2,
  },
  cartButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
    elevation: 4,
    position: 'relative',
  },
  cartBadge: {
    position: 'absolute',
    top: -3,
    right: -3,
    backgroundColor: '#ff4d4f',
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
    borderWidth: 1.5,
    borderColor: '#ffffff',
  },
  cartBadgeText: {
    color: '#ffffff',
    fontSize: 10,
    fontFamily: 'Poppins-Bold',
  },
  scrollContent: {
    paddingBottom: 110,
  },
  imageContainer: {
    height: 310,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  imageSlide: {
    width: width,
    height: 270,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  mainImage: {
    width: width * 0.72,
    height: 200,
  },
  angleBadge: {
    position: 'absolute',
    bottom: 6,
    backgroundColor: '#f5f6f8',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#e8ecf0',
  },
  angleBadgeText: {
    fontSize: 11,
    fontFamily: 'Poppins-Medium',
    color: '#4a5568',
  },
  paginationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    bottom: 8,
  },
  dotTouchable: {
    paddingHorizontal: 4,
    paddingVertical: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dot: {
    height: 8,
    borderRadius: 4,
  },
  detailsContainer: {
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  nameAndFavoriteRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  productName: {
    flex: 1,
    fontSize: 20,
    fontFamily: 'Poppins-Bold',
    color: '#1a1a1a',
    marginRight: 15,
    lineHeight: 28,
  },
  favoriteCircleButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#f0f2f5',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 5,
    elevation: 3,
  },
  priceAndRatingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    marginTop: 4,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  currentPrice: {
    fontSize: 22,
    fontFamily: 'Poppins-Bold',
    color: '#1a1a1a',
    marginRight: 8,
  },
  originalPrice: {
    fontSize: 15,
    fontFamily: 'Poppins-Medium',
    color: '#9e9e9e',
    textDecorationLine: 'line-through',
    marginRight: 10,
  },
  discountBadge: {
    backgroundColor: 'rgba(85, 204, 112, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  discountText: {
    color: '#55cc70',
    fontSize: 11,
    fontFamily: 'Poppins-Bold',
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f2f8f5',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  ratingStarIcon: {
    marginRight: 5,
  },
  ratingBadgeText: {
    fontSize: 14,
    fontFamily: 'Poppins-SemiBold',
    color: '#0d3b29',
  },
  starsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 10,
  },
  star: {
    marginRight: 2,
  },
  bottomActionBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: Platform.OS === 'ios' ? 24 : 16,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 12,
  },
  addToCartBtn: {
    flex: 1,
    height: 50,
    borderRadius: 16,
    backgroundColor: '#ffffff',
    borderWidth: 1.5,
    borderColor: '#55cc70',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  addToCartBtnText: {
    fontSize: 15,
    fontFamily: 'Poppins-Bold',
    color: '#55cc70',
  },
  buyNowBtn: {
    flex: 1,
    height: 50,
    borderRadius: 16,
    backgroundColor: '#55cc70',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#55cc70',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 5,
  },
  buyNowBtnText: {
    fontSize: 15,
    fontFamily: 'Poppins-Bold',
    color: '#ffffff',
  },
  descriptionText: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: '#4a4a4a',
    lineHeight: 22,
    marginBottom: 30,
  },
  readMoreText: {
    color: '#55cc70',
    fontFamily: 'Poppins-Medium',
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Poppins-Bold',
    color: '#1a1a1a',
    marginBottom: 14,
    marginTop: 6,
  },
  shopCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f8faf9',
    borderRadius: 16,
    padding: 14,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#edf2ee',
  },
  shopLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 10,
  },
  shopIconContainer: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: 'rgba(85, 204, 112, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  shopInfo: {
    flex: 1,
  },
  shopName: {
    fontSize: 15,
    fontFamily: 'Poppins-Bold',
    color: '#1a1a1a',
  },
  shopSubtext: {
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    color: '#7a7a7a',
    marginTop: 1,
  },
  reviewItem: {
    marginBottom: 30,
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  reviewerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarPlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#e0e0e0',
    marginRight: 12,
  },
  reviewerName: {
    fontSize: 14,
    fontFamily: 'Poppins-Medium',
    color: '#1a1a1a',
  },
  reviewDate: {
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    color: '#9e9e9e',
  },
  reviewText: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: '#4a4a4a',
    lineHeight: 20,
  },
  similarProductsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  similarCard: {
    width: '48%',
    backgroundColor: '#f8f8f8',
    borderRadius: 20,
    padding: 15,
  },
  favoriteIcon: {
    position: 'absolute',
    top: 15,
    right: 15,
    zIndex: 1,
  },
  similarImage: {
    width: '100%',
    height: 90,
    marginBottom: 15,
  },
  similarName: {
    fontSize: 14,
    fontFamily: 'Poppins-Medium',
    color: '#1a1a1a',
    height: 40,
    marginBottom: 5,
  },
  similarSize: {
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    color: '#9e9e9e',
    marginBottom: 10,
  },
  similarPriceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  similarCurrentPrice: {
    fontSize: 14,
    fontFamily: 'Poppins-Bold',
    color: '#1a1a1a',
    marginRight: 5,
  },
  similarOriginalPrice: {
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    color: '#9e9e9e',
    textDecorationLine: 'line-through',
  },
  similarAddBtn: {
    backgroundColor: '#55cc70',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  similarAddBtnText: {
    color: '#ffffff',
    fontSize: 12,
    fontFamily: 'Poppins-Medium',
  },
});

export default ProductDetailsScreen;
