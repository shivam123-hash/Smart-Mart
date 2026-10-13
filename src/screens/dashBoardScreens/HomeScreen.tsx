import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Image, Dimensions, StatusBar, Animated } from 'react-native';
import Icon from '@react-native-vector-icons/feather';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SharedProductCard } from '../../components/sharedTransition';
import { HomeSkeleton, useHomeEntranceAnimation, AnimatedSectionWrapper } from '../../components/homeAnimations';

const { width } = Dimensions.get('window');

const CATEGORIES = [
  { id: '1', name: 'Vegetables\n& Fruits', image: 'https://cdn-icons-png.flaticon.com/512/3194/3194591.png' },
  { id: '2', name: 'Dairy &\nBreakfast', image: 'https://cdn-icons-png.flaticon.com/512/869/869687.png' },
  { id: '3', name: 'Cold Drinks\n& Juices', image: 'https://cdn-icons-png.flaticon.com/512/2405/2405597.png' },
  { id: '4', name: 'Instant &\nFrozen Food', image: 'https://cdn-icons-png.flaticon.com/512/3014/3014493.png' },
  { id: '5', name: 'Tea &\nCoffee', image: 'https://cdn-icons-png.flaticon.com/512/924/924514.png' },
  { id: '6', name: 'Atta, Rice\n& Dal', image: 'https://cdn-icons-png.flaticon.com/512/3014/3014436.png' },
  { id: '7', name: 'Masala, Oil\n& Dry Fruits', image: 'https://cdn-icons-png.flaticon.com/512/2553/2553609.png' },
  { id: '8', name: 'Chicken,\nMeat & Fish', image: 'https://cdn-icons-png.flaticon.com/512/3143/3143645.png' },
];

const BEST_DEALS = [
  { id: '1', name: 'Surf Excel Easy Wash Detergent Power', size: '500 ml', price: '$12', originalPrice: '$14', image: 'https://cdn-icons-png.flaticon.com/512/2553/2553691.png' },
  { id: '2', name: 'Fortune Arhar Dal (Toor Dal)', size: '1 kg', price: '$10', originalPrice: '$12', image: 'https://cdn-icons-png.flaticon.com/512/2553/2553609.png' },
  { id: '3', name: 'Fresh Apples (Fuji)', size: '1 kg', price: '$4', originalPrice: '$6', image: 'https://cdn-icons-png.flaticon.com/512/3194/3194591.png' },
];

const NEARBY = [
  { id: '1', name: 'Aashirvaad Shudh Chakki Atta', size: '5 kg', price: '$20', originalPrice: '$25', image: 'https://cdn-icons-png.flaticon.com/512/3014/3014436.png' },
  { id: '2', name: 'Fresh Dairy Milk 1L', size: '1 L', price: '$2', originalPrice: '$3', image: 'https://cdn-icons-png.flaticon.com/512/869/869687.png' },
  { id: '3', name: 'Orange Juice Premium', size: '1 L', price: '$5', originalPrice: '$7', image: 'https://cdn-icons-png.flaticon.com/512/2405/2405597.png' },
];

const ORDER_AGAIN = [
  { id: '1', name: 'Lipton Green Tea Bags', size: '100 pcs', price: '$8', originalPrice: '$10', image: 'https://cdn-icons-png.flaticon.com/512/924/924514.png' },
  { id: '2', name: 'Frozen Green Peas', size: '1 kg', price: '$3', originalPrice: '$4', image: 'https://cdn-icons-png.flaticon.com/512/3014/3014493.png' },
  { id: '3', name: 'Fresh Chicken Breast', size: '500 g', price: '$6', originalPrice: '$8', image: 'https://cdn-icons-png.flaticon.com/512/3143/3143645.png' },
];

const HomeScreen = ({ navigation }: any) => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulating API data load completion (1.2s)
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1200);
    return () => clearTimeout(timer);
  }, []);

  const insets = useSafeAreaInsets();
  const { headerStyle, getCategoryStyle, getSectionStyle, isHeaderLanded } = useHomeEntranceAnimation(
    isLoading,
    CATEGORIES.length,
    insets.top
  );

  if (isLoading) {
    return <HomeSkeleton />;
  }

  return (
    <View style={[styles.rootContainer, { backgroundColor: isHeaderLanded ? '#55cc70' : '#ffffff' }]}>
      <StatusBar barStyle={isHeaderLanded ? 'light-content' : 'dark-content'} />
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

        {/* Step 1: Animated Curved Green Header (Slides down from above top of screen) */}
        <Animated.View style={[styles.curvedHeader, { paddingTop: insets.top + 8 }, headerStyle]}>
          {/* Header Row: Location & Cart */}
          <View style={styles.headerTop}>
            <View style={styles.locationContainer}>
              <View style={styles.locationIconWrapper}>
                <Icon name="map-pin" size={18} color="#ffffff" />
              </View>
              <View style={styles.addressWrapper}>
                <View style={styles.homeRow}>
                  <Text style={styles.homeText}>Home</Text>
                  <Icon name="chevron-down" size={18} color="#ffffff" style={styles.chevron} />
                </View>
                <Text style={styles.addressText} numberOfLines={1}>6391 Elgin St. Celina, Delaware 10299</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.cartIconWrapper} activeOpacity={0.85}>
              <View style={styles.cartButton}>
                <Icon name="shopping-bag" size={20} color="#1a1a1a" />
                <View style={styles.cartBadge}>
                  <Text style={styles.cartBadgeText}>2</Text>
                </View>
              </View>
            </TouchableOpacity>
          </View>

          {/* Search Section inside the curved header */}
          <View style={styles.searchSection}>
            <View style={styles.searchBar}>
              <Icon name="search" size={18} color="#7a7a7a" style={styles.searchIcon} />
              <TextInput
                placeholder="Search"
                placeholderTextColor="#9e9e9e"
                style={styles.searchInput}
              />
            </View>
            <TouchableOpacity style={styles.filterButton} activeOpacity={0.85}>
              <Icon name="sliders" size={18} color="#55cc70" />
            </TouchableOpacity>
          </View>
        </Animated.View>

        {/* Step 2: Shop By Category (Staggered Spring slide-in from right) */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Shop By Category</Text>
          <TouchableOpacity>
            <Text style={styles.seeAllText}>See All</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.categoryGrid}>
          {CATEGORIES.map((item, index) => (
            <Animated.View
              key={item.id}
              style={[styles.categoryItemWrapper, getCategoryStyle(index)]}
            >
              <TouchableOpacity style={styles.categoryItem} activeOpacity={0.8}>
                <View style={styles.categoryImageContainer}>
                  <Image source={{ uri: item.image }} style={styles.categoryImage} resizeMode="contain" />
                </View>
                <Text style={styles.categoryText}>{item.name}</Text>
              </TouchableOpacity>
            </Animated.View>
          ))}
        </View>

        {/* Step 3: Remaining Feed Content (Staggered fade & slide up) */}
        {/* Section 1: Best Deal */}
        <AnimatedSectionWrapper animStyle={getSectionStyle(0)}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Best Deal</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalList}>
            {BEST_DEALS.map((item) => (
              <SharedProductCard key={item.id} item={item} />
            ))}
          </ScrollView>
        </AnimatedSectionWrapper>

        {/* Section 2: Near by you */}
        <AnimatedSectionWrapper animStyle={getSectionStyle(1)}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Near by you</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalList}>
            {NEARBY.map((item) => (
              <SharedProductCard key={item.id} item={item} />
            ))}
          </ScrollView>
        </AnimatedSectionWrapper>

        {/* Section 3: Order Again */}
        <AnimatedSectionWrapper animStyle={getSectionStyle(2)}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Order Again</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalList}>
            {ORDER_AGAIN.map((item) => (
              <SharedProductCard key={item.id} item={item} />
            ))}
          </ScrollView>
        </AnimatedSectionWrapper>

        <View style={{ height: 20 }} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  scrollContent: {
    flexGrow: 1,
    backgroundColor: '#ffffff',
  },
  curvedHeader: {
    backgroundColor: '#55cc70',
    borderBottomLeftRadius: 36,
    borderBottomRightRadius: 36,
    paddingHorizontal: 20,
    paddingBottom: 22,
    marginBottom: 20,
    shadowColor: '#55cc70',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 8,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  locationIconWrapper: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.22)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  addressWrapper: {
    flex: 1,
  },
  homeRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  homeText: {
    fontSize: 18,
    fontFamily: 'Poppins-Bold',
    color: '#ffffff',
    marginRight: 4,
  },
  chevron: {
    marginTop: 2,
  },
  addressText: {
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    color: 'rgba(255, 255, 255, 0.9)',
    marginTop: -1,
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
  searchSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 16,
    paddingHorizontal: 15,
    marginRight: 12,
    height: 50,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    height: '100%',
    fontSize: 15,
    fontFamily: 'Poppins-Regular',
    color: '#1a1a1a',
  },
  filterButton: {
    width: 50,
    height: 50,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 15,
    marginTop: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Poppins-Bold',
    color: '#1a1a1a',
  },
  seeAllText: {
    fontSize: 14,
    fontFamily: 'Poppins-Medium',
    color: '#55cc70',
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  categoryItemWrapper: {
    width: '25%',
    alignItems: 'center',
    marginBottom: 20,
  },
  categoryItem: {
    width: '100%',
    alignItems: 'center',
  },
  categoryImageContainer: {
    width: 70,
    height: 70,
    backgroundColor: '#f8f8f8',
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryImage: {
    width: 45,
    height: 45,
  },
  categoryText: {
    fontSize: 11,
    fontFamily: 'Poppins-Medium',
    color: '#1a1a1a',
    textAlign: 'center',
  },
  horizontalList: {
    paddingHorizontal: 15,
    paddingBottom: 20,
  },
});

export default HomeScreen;
