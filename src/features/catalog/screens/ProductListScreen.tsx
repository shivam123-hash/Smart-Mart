import React, { useEffect, useRef, useState } from 'react';
import LocalizedText from '../../../shared/i18n/LocalizedText';
import { View, StyleSheet, ScrollView, StatusBar, Animated, Dimensions } from 'react-native';
import TouchableOpacity from '../../../shared/components/AnimatedTouchableOpacity';
import Icon from '@react-native-vector-icons/feather';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SharedProductCard } from '../../../shared/components/sharedTransition';

const { width } = Dimensions.get('window');
const CARD_GAP = 12;
const HORIZONTAL_PADDING = 16;
const CARD_WIDTH = (width - HORIZONTAL_PADDING * 2 - CARD_GAP) / 2;

const FALLBACK_PRODUCTS = [
  {
    id: '1',
    name: 'Surf Excel Easy Wash Detergent Powder',
    size: '1 kg',
    price: '$12',
    originalPrice: '$15',
    image: 'https://cdn-icons-png.flaticon.com/512/2553/2553691.png',
  },
  {
    id: '2',
    name: 'Fortune Arhar Dal (Toor Dal)',
    size: '1 kg',
    price: '$10',
    originalPrice: '$13',
    image: 'https://cdn-icons-png.flaticon.com/512/2553/2553609.png',
  },
  {
    id: '3',
    name: 'Fresh Apples (Fuji)',
    size: '1 kg',
    price: '$4',
    originalPrice: '$6',
    image: 'https://cdn-icons-png.flaticon.com/512/3194/3194591.png',
  },
  {
    id: '4',
    name: 'Aashirvaad Shudh Chakki Atta',
    size: '5 kg',
    price: '$18',
    originalPrice: '$23',
    image: 'https://cdn-icons-png.flaticon.com/512/3014/3014436.png',
  },
  {
    id: '5',
    name: 'Amul Taaza Toned Milk',
    size: '1 L',
    price: '$1.8',
    originalPrice: '$2.2',
    image: 'https://cdn-icons-png.flaticon.com/512/869/869687.png',
  },
  {
    id: '6',
    name: 'Tropicana Orange Juice',
    size: '1 L',
    price: '$4.5',
    originalPrice: '$6',
    image: 'https://cdn-icons-png.flaticon.com/512/2405/2405597.png',
  },
  {
    id: '7',
    name: 'Tata Tea Premium',
    size: '500 g',
    price: '$7',
    originalPrice: '$9',
    image: 'https://cdn-icons-png.flaticon.com/512/924/924514.png',
  },
  {
    id: '8',
    name: 'Maggi 2-Minute Noodles',
    size: '12 pack',
    price: '$5',
    originalPrice: '$6.5',
    image: 'https://cdn-icons-png.flaticon.com/512/3014/3014493.png',
  },
];

const ProductListScreen = ({ route, navigation }: any) => {
  const insets = useSafeAreaInsets();

  const {
    title = 'All Products',
    products: initialProducts = FALLBACK_PRODUCTS,
    isFavourites = false, // ← pass true when opening as Favourites
  } = route?.params || {};

  const [products, setProducts] = useState(initialProducts);

  // Staggered entrance animation
  const itemAnims = useRef(
    products.map(() => new Animated.Value(0))
  ).current;

  useEffect(() => {
    // Reset animations when products change
    itemAnims.forEach((anim: Animated.Value) => anim.setValue(0));

    const animations = itemAnims.map((anim: Animated.Value, index: number) =>
      Animated.timing(anim, {
        toValue: 1,
        duration: 420,
        delay: index * 60,
        useNativeDriver: true,
      })
    );
    Animated.stagger(40, animations).start();
  }, [products.length]);

  const getItemStyle = (index: number) => {
    const anim = itemAnims[index] || new Animated.Value(1);
    return {
      opacity: anim,
      transform: [
        {
          translateY: anim.interpolate({
            inputRange: [0, 1],
            outputRange: [28, 0],
          }),
        },
        {
          scale: anim.interpolate({
            inputRange: [0, 1],
            outputRange: [0.92, 1],
          }),
        },
      ],
    };
  };

  // Remove from favourites
  const handleFavorite = (item: any) => {
    if (isFavourites) {
      setProducts((prev: any[]) => prev.filter((p) => p.id !== item.id));
    }
  };

  const isEmpty = products.length === 0;

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <StatusBar barStyle="dark-content"/>

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          activeOpacity={0.7}
        >
          <Icon name="chevron-left" size={26} color="#1a1a1a" />
        </TouchableOpacity>

        <LocalizedText style={styles.headerTitle} numberOfLines={1}>
          {title}
        </LocalizedText>

        <TouchableOpacity
          style={styles.cartIconWrapper}
          activeOpacity={0.85}
          onPress={() => navigation.navigate('CartScreen')}
        >
          <View style={styles.cartButton}>
            <Icon name="shopping-bag" size={20} color="#1a1a1a" />
            <View style={styles.cartBadge}>
              <LocalizedText style={styles.cartBadgeText}>2</LocalizedText>
            </View>
          </View>
        </TouchableOpacity>
      </View>

      {isEmpty ? (
        // Empty State
        <View style={styles.emptyContainer}>
          <View style={styles.emptyIconWrapper}>
            <Icon
              name={isFavourites ? 'heart' : 'package'}
              size={48}
              color="#55cc70"
            />
          </View>
          <LocalizedText style={styles.emptyTitle}>
            {isFavourites ? 'No favourites yet' : 'No products found'}
          </LocalizedText>
          <LocalizedText style={styles.emptySubtitle}>
            {isFavourites
              ? 'Tap the heart icon on any product to add it here.'
              : 'Try browsing other categories.'}
          </LocalizedText>
          <TouchableOpacity
            style={styles.shopNowBtn}
            activeOpacity={0.85}
            onPress={() => navigation.navigate('MainNavigation', { screen: 'Home' })}
          >
            <LocalizedText style={styles.shopNowBtnText}>
              {isFavourites ? 'Browse Products' : 'Go to Home'}
            </LocalizedText>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[
            styles.scrollContent,
            { paddingBottom: insets.bottom + 24 },
          ]}
        >
          <View style={styles.grid}>
            {products.map((item: any, index: number) => (
              <Animated.View
                key={item.id}
                style={[styles.cardWrapper, getItemStyle(index)]}
              >
                <SharedProductCard
                  item={item}
                  style={styles.gridCard} // override width & margin
                  onFavorite={handleFavorite}
                />
              </Animated.View>
            ))}
          </View>
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#ffffff',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#f0f0f0',
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  headerTitle: {
    flex: 1,
    fontSize: 18,
    fontFamily: 'Poppins-Bold',
    color: '#1a1a1a',
    textAlign: 'center',
    marginHorizontal: 8,
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
    paddingTop: 16,
    paddingHorizontal: HORIZONTAL_PADDING,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  cardWrapper: {
    width: CARD_WIDTH,
    marginBottom: CARD_GAP + 4,
  },
  // Important: override the default horizontal-list styles of SharedProductCard
  gridCard: {
    width: '100%',
    marginRight: 0,
  },

  // Empty State
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyIconWrapper: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(85, 204, 112, 0.12)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  emptyTitle: {
    fontSize: 20,
    fontFamily: 'Poppins-Bold',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: '#9e9e9e',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 32,
  },
  shopNowBtn: {
    backgroundColor: '#55cc70',
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 16,
  },
  shopNowBtnText: {
    fontSize: 15,
    fontFamily: 'Poppins-Bold',
    color: '#ffffff',
  },
});

export default ProductListScreen;