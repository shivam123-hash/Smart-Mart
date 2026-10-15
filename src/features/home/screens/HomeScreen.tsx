import React, { useState, useEffect, useRef } from 'react';
import LocalizedText from '../../../shared/i18n/LocalizedText';
import { View, StyleSheet, ScrollView, Image, Dimensions, StatusBar, Animated, Modal, TouchableWithoutFeedback } from 'react-native';
import TouchableOpacity from '../../../shared/components/AnimatedTouchableOpacity';
import Icon from '@react-native-vector-icons/feather';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SharedProductCard } from '../../../shared/components/sharedTransition';
import { HomeSkeleton, useHomeEntranceAnimation, AnimatedSectionWrapper } from '../components/animations';

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
  { id: '9', name: 'Snacks &\nMunchies', image: 'https://cdn-icons-png.flaticon.com/512/2553/2553691.png' },
  { id: '10', name: 'Bakery &\nBiscuits', image: 'https://cdn-icons-png.flaticon.com/512/3082/3082060.png' },
  { id: '11', name: 'Personal\nCare', image: 'https://cdn-icons-png.flaticon.com/512/2553/2553673.png' },
  { id: '12', name: 'Household\nItems', image: 'https://cdn-icons-png.flaticon.com/512/3655/3655589.png' },
  { id: '13', name: 'Baby\nCare', image: 'https://cdn-icons-png.flaticon.com/512/3082/3082011.png' },
  { id: '14', name: 'Pet\nCare', image: 'https://cdn-icons-png.flaticon.com/512/2347/2347028.png' },
  { id: '15', name: 'Organic &\nHealthy', image: 'https://cdn-icons-png.flaticon.com/512/415/415682.png' },
  { id: '16', name: 'Cleaning\nEssentials', image: 'https://cdn-icons-png.flaticon.com/512/2553/2553691.png' },
];

const BEST_DEALS = [
  { id: '1', name: 'Surf Excel Easy Wash Detergent Powder', size: '1 kg', price: '$12', originalPrice: '$15', image: 'https://cdn-icons-png.flaticon.com/512/2553/2553691.png' },
  { id: '2', name: 'Fortune Arhar Dal (Toor Dal)', size: '1 kg', price: '$10', originalPrice: '$13', image: 'https://cdn-icons-png.flaticon.com/512/2553/2553609.png' },
  { id: '3', name: 'Fresh Apples (Fuji)', size: '1 kg', price: '$4', originalPrice: '$6', image: 'https://cdn-icons-png.flaticon.com/512/3194/3194591.png' },
  { id: '4', name: 'Aashirvaad Shudh Chakki Atta', size: '5 kg', price: '$18', originalPrice: '$23', image: 'https://cdn-icons-png.flaticon.com/512/3014/3014436.png' },
  { id: '5', name: 'Amul Taaza Toned Milk', size: '1 L', price: '$1.8', originalPrice: '$2.2', image: 'https://cdn-icons-png.flaticon.com/512/869/869687.png' },
  { id: '6', name: 'Tropicana Orange Juice', size: '1 L', price: '$4.5', originalPrice: '$6', image: 'https://cdn-icons-png.flaticon.com/512/2405/2405597.png' },
  { id: '7', name: 'Tata Tea Premium', size: '500 g', price: '$7', originalPrice: '$9', image: 'https://cdn-icons-png.flaticon.com/512/924/924514.png' },
  { id: '8', name: 'Maggi 2-Minute Noodles', size: '12 pack', price: '$5', originalPrice: '$6.5', image: 'https://cdn-icons-png.flaticon.com/512/3014/3014493.png' },
  { id: '9', name: 'Fortune Sunlite Refined Oil', size: '5 L', price: '$22', originalPrice: '$27', image: 'https://cdn-icons-png.flaticon.com/512/2553/2553609.png' },
  { id: '10', name: 'Fresh Farm Chicken Breast', size: '500 g', price: '$5.5', originalPrice: '$7', image: 'https://cdn-icons-png.flaticon.com/512/3143/3143645.png' },
  { id: '11', name: 'Britannia Good Day Cookies', size: '600 g', price: '$4', originalPrice: '$5.5', image: 'https://cdn-icons-png.flaticon.com/512/3082/3082060.png' },
  { id: '12', name: 'Lay\'s Classic Salted Chips', size: '150 g', price: '$2.5', originalPrice: '$3.2', image: 'https://cdn-icons-png.flaticon.com/512/2553/2553691.png' },
];

const NEARBY = [
  { id: '1', name: 'Aashirvaad Shudh Chakki Atta', size: '5 kg', price: '$20', originalPrice: '$25', image: 'https://cdn-icons-png.flaticon.com/512/3014/3014436.png' },
  { id: '2', name: 'Fresh Dairy Milk 1L', size: '1 L', price: '$2', originalPrice: '$3', image: 'https://cdn-icons-png.flaticon.com/512/869/869687.png' },
  { id: '3', name: 'Orange Juice Premium', size: '1 L', price: '$5', originalPrice: '$7', image: 'https://cdn-icons-png.flaticon.com/512/2405/2405597.png' },
  { id: '4', name: 'Organic Bananas', size: '1 dozen', price: '$3', originalPrice: '$4', image: 'https://cdn-icons-png.flaticon.com/512/3194/3194591.png' },
  { id: '5', name: 'Mother Dairy Curd', size: '400 g', price: '$1.5', originalPrice: '$2', image: 'https://cdn-icons-png.flaticon.com/512/869/869687.png' },
  { id: '6', name: 'Real Fruit Juice Mixed', size: '1 L', price: '$3.5', originalPrice: '$4.5', image: 'https://cdn-icons-png.flaticon.com/512/2405/2405597.png' },
  { id: '7', name: 'India Gate Basmati Rice', size: '5 kg', price: '$28', originalPrice: '$34', image: 'https://cdn-icons-png.flaticon.com/512/3014/3014436.png' },
  { id: '8', name: 'Fresh Tomatoes', size: '1 kg', price: '$1.8', originalPrice: '$2.5', image: 'https://cdn-icons-png.flaticon.com/512/3194/3194591.png' },
  { id: '9', name: 'Amul Butter', size: '500 g', price: '$6', originalPrice: '$7.5', image: 'https://cdn-icons-png.flaticon.com/512/869/869687.png' },
  { id: '10', name: 'Fresh Coriander Leaves', size: '100 g', price: '$0.8', originalPrice: '$1.2', image: 'https://cdn-icons-png.flaticon.com/512/3194/3194591.png' },
];

const ORDER_AGAIN = [
  { id: '1', name: 'Lipton Green Tea Bags', size: '100 pcs', price: '$8', originalPrice: '$10', image: 'https://cdn-icons-png.flaticon.com/512/924/924514.png' },
  { id: '2', name: 'Frozen Green Peas', size: '1 kg', price: '$3', originalPrice: '$4', image: 'https://cdn-icons-png.flaticon.com/512/3014/3014493.png' },
  { id: '3', name: 'Fresh Chicken Breast', size: '500 g', price: '$6', originalPrice: '$8', image: 'https://cdn-icons-png.flaticon.com/512/3143/3143645.png' },
  { id: '4', name: 'Nescafe Classic Coffee', size: '200 g', price: '$9', originalPrice: '$11', image: 'https://cdn-icons-png.flaticon.com/512/924/924514.png' },
  { id: '5', name: 'McCain French Fries', size: '1.5 kg', price: '$7', originalPrice: '$9', image: 'https://cdn-icons-png.flaticon.com/512/3014/3014493.png' },
  { id: '6', name: 'Fresh Rohu Fish', size: '1 kg', price: '$8', originalPrice: '$10', image: 'https://cdn-icons-png.flaticon.com/512/3143/3143645.png' },
  { id: '7', name: 'Tata Salt', size: '1 kg', price: '$1.2', originalPrice: '$1.5', image: 'https://cdn-icons-png.flaticon.com/512/2553/2553609.png' },
  { id: '8', name: 'Britannia Bread', size: '400 g', price: '$1.5', originalPrice: '$2', image: 'https://cdn-icons-png.flaticon.com/512/3082/3082060.png' },
  { id: '9', name: 'Eggs (Farm Fresh)', size: '12 pcs', price: '$3', originalPrice: '$3.8', image: 'https://cdn-icons-png.flaticon.com/512/869/869687.png' },
  { id: '10', name: 'Frozen Mixed Vegetables', size: '1 kg', price: '$4', originalPrice: '$5.5', image: 'https://cdn-icons-png.flaticon.com/512/3014/3014493.png' },
];

const SAVED_ADDRESSES = [
  {
    id: '1',
    type: 'Home',
    address: '6391 Elgin St. Celina, Delaware 10299',
    isDefault: true,
  },
  {
    id: '2',
    type: 'Work',
    address: '1901 Thornridge Cir. Shiloh, Hawaii 81063',
    isDefault: false,
  },
  {
    id: '3',
    type: 'Other',
    address: '2464 Royal Ln. Mesa, New Jersey 45463',
    isDefault: false,
  },
];

const HomeScreen = ({ navigation }: any) => {
  const [isLoading, setIsLoading] = useState(true);
  const [showAddressDropdown, setShowAddressDropdown] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(SAVED_ADDRESSES[0]);

  const dropdownAnim = useRef(new Animated.Value(0)).current;
  const dropdownScale = useRef(new Animated.Value(0.95)).current;

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1200);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (showAddressDropdown) {
      Animated.parallel([
        Animated.spring(dropdownAnim, {
          toValue: 1,
          friction: 8,
          tension: 60,
          useNativeDriver: true,
        }),
        Animated.spring(dropdownScale, {
          toValue: 1,
          friction: 7,
          tension: 50,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(dropdownAnim, {
          toValue: 0,
          duration: 180,
          useNativeDriver: true,
        }),
        Animated.timing(dropdownScale, {
          toValue: 0.95,
          duration: 180,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [showAddressDropdown]);

  const insets = useSafeAreaInsets();

  const { headerStyle, getCategoryStyle, getSectionStyle, isHeaderLanded } = useHomeEntranceAnimation(
    isLoading,
    8,
    insets.top
  );

  const handleSelectAddress = (addr: typeof SAVED_ADDRESSES[0]) => {
    setSelectedAddress(addr);
    setShowAddressDropdown(false);
  };

  if (isLoading) {
    return <HomeSkeleton />;
  }

  return (
    <View style={[styles.rootContainer, { backgroundColor: isHeaderLanded ? '#55cc70' : '#ffffff' }]}>
      <StatusBar barStyle={isHeaderLanded ? 'light-content' : 'dark-content'} />
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

        {/* Curved Green Header */}
        <Animated.View style={[styles.curvedHeader, { paddingTop: insets.top + 8 }, headerStyle]}>
          <View style={styles.headerTop}>
            {/* Location - opens dropdown */}
            <TouchableOpacity
              style={styles.locationContainer}
              activeOpacity={0.85}
              onPress={() => setShowAddressDropdown(true)}
            >
              <View style={styles.locationIconWrapper}>
                <Icon name="map-pin" size={18} color="#ffffff" />
              </View>
              <View style={styles.addressWrapper}>
                <View style={styles.homeRow}>
                  <LocalizedText style={styles.homeText}>{selectedAddress.type}</LocalizedText>
                  <Icon
                    name={showAddressDropdown ? 'chevron-up' : 'chevron-down'}
                    size={18}
                    color="#ffffff"
                    style={styles.chevron}
                  />
                </View>
                <LocalizedText style={styles.addressText} numberOfLines={1}>
                  {selectedAddress.address}
                </LocalizedText>
              </View>
            </TouchableOpacity>

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

          <View style={styles.searchSection}>
            <TouchableOpacity
              style={styles.searchBar}
              activeOpacity={0.9}
              onPress={() => navigation.navigate('SearchAndFilterScreen')}
            >
              <Icon name="search" size={18} color="#7a7a7a" style={styles.searchIcon} />
              <LocalizedText style={styles.searchPlaceholder}>Search</LocalizedText>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.filterButton}
              activeOpacity={0.85}
              onPress={() => navigation.navigate('SearchAndFilterScreen')}
            >
              <Icon name="sliders" size={18} color="#55cc70" />
            </TouchableOpacity>
          </View>
        </Animated.View>

        {/* Shop By Category - only first 8 */}
        <View style={styles.sectionHeader}>
          <LocalizedText style={styles.sectionTitle}>Shop By Category</LocalizedText>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('CategoryListScreen', {
                title: 'All Categories',
                products: CATEGORIES,
              });
            }}
          >
            <LocalizedText style={styles.seeAllText}>See All</LocalizedText>
          </TouchableOpacity>
        </View>

        <View style={styles.categoryGrid}>
          {CATEGORIES.slice(0, 8).map((item, index) => (
            <Animated.View
              key={item.id}
              style={[styles.categoryItemWrapper, getCategoryStyle(index)]}
            >
              <TouchableOpacity
                style={styles.categoryItem}
                activeOpacity={0.8}
                onPress={() => {
                  navigation.navigate('ProductListScreen', {
                    title: item.name.replace('\n', ' '),
                  });
                }}
              >
                <View style={styles.categoryImageContainer}>
                  <Image source={{ uri: item.image }} style={styles.categoryImage} resizeMode="contain" />
                </View>
                <LocalizedText style={styles.categoryText}>{item.name}</LocalizedText>
              </TouchableOpacity>
            </Animated.View>
          ))}
        </View>

        {/* Best Deal */}
        <AnimatedSectionWrapper animStyle={getSectionStyle(0)}>
          <View style={styles.sectionHeader}>
            <LocalizedText style={styles.sectionTitle}>Best Deal</LocalizedText>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('ProductListScreen', {
                  title: 'Best Deal',
                  products: BEST_DEALS,
                });
              }}
            >
              <LocalizedText style={styles.seeAllText}>See All</LocalizedText>
            </TouchableOpacity>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalList}>
            {BEST_DEALS.slice(0, 5).map((item) => (
              <SharedProductCard key={item.id} item={item} />
            ))}
          </ScrollView>
        </AnimatedSectionWrapper>

        {/* Near by you */}
        <AnimatedSectionWrapper animStyle={getSectionStyle(1)}>
          <View style={styles.sectionHeader}>
            <LocalizedText style={styles.sectionTitle}>Near by you</LocalizedText>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('ProductListScreen', {
                  title: 'Near By You',
                  products: NEARBY,
                });
              }}
            >
              <LocalizedText style={styles.seeAllText}>See All</LocalizedText>
            </TouchableOpacity>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalList}>
            {NEARBY.slice(0, 5).map((item) => (
              <SharedProductCard key={item.id} item={item} />
            ))}
          </ScrollView>
        </AnimatedSectionWrapper>

        {/* Order Again */}
        <AnimatedSectionWrapper animStyle={getSectionStyle(2)}>
          <View style={styles.sectionHeader}>
            <LocalizedText style={styles.sectionTitle}>Order Again</LocalizedText>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('ProductListScreen', {
                  title: 'Order Again',
                  products: ORDER_AGAIN,
                });
              }}
            >
              <LocalizedText style={styles.seeAllText}>See All</LocalizedText>
            </TouchableOpacity>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalList}>
            {ORDER_AGAIN.slice(0, 5).map((item) => (
              <SharedProductCard key={item.id} item={item} />
            ))}
          </ScrollView>
        </AnimatedSectionWrapper>

        <View style={{ height: 20 }} />
      </ScrollView>

      {/* ==================== ADDRESS DROPDOWN ==================== */}
      <Modal
        transparent
        visible={showAddressDropdown}
        animationType="none"
        statusBarTranslucent
        onRequestClose={() => setShowAddressDropdown(false)}
      >
        <TouchableWithoutFeedback onPress={() => setShowAddressDropdown(false)}>
          <View style={styles.dropdownOverlay}>
            <TouchableWithoutFeedback>
              <Animated.View
                style={[
                  styles.dropdownContainer,
                  {
                    top: insets.top + 70,
                    opacity: dropdownAnim,
                    transform: [
                      { scale: dropdownScale },
                      {
                        translateY: dropdownAnim.interpolate({
                          inputRange: [0, 1],
                          outputRange: [-12, 0],
                        }),
                      },
                    ],
                  },
                ]}
              >
                {/* Arrow */}
                <View style={styles.dropdownArrow} />

                <LocalizedText style={styles.dropdownTitle}>Select Delivery Address</LocalizedText>

                {SAVED_ADDRESSES.map((addr) => {
                  const isSelected = selectedAddress.id === addr.id;
                  return (
                    <TouchableOpacity
                      key={addr.id}
                      style={[
                        styles.dropdownItem,
                        isSelected && styles.dropdownItemSelected,
                      ]}
                      activeOpacity={0.8}
                      onPress={() => handleSelectAddress(addr)}
                    >
                      <View style={styles.dropdownItemLeft}>
                        <View
                          style={[
                            styles.dropdownRadio,
                            isSelected && styles.dropdownRadioSelected,
                          ]}
                        >
                          {isSelected && <View style={styles.dropdownRadioInner} />}
                        </View>
                        <View style={{ flex: 1 }}>
                          <View style={styles.dropdownTypeRow}>
                            <LocalizedText style={styles.dropdownType}>{addr.type}</LocalizedText>
                            {addr.isDefault && (
                              <View style={styles.dropdownDefaultBadge}>
                                <LocalizedText style={styles.dropdownDefaultText}>Default</LocalizedText>
                              </View>
                            )}
                          </View>
                          <LocalizedText style={styles.dropdownAddress} numberOfLines={2}>
                            {addr.address}
                          </LocalizedText>
                        </View>
                      </View>
                    </TouchableOpacity>
                  );
                })}

                {/* Manage / Add more */}
                <TouchableOpacity
                  style={styles.manageAddressesBtn}
                  activeOpacity={0.8}
                  onPress={() => {
                    setShowAddressDropdown(false);
                    navigation.navigate('AddressScreen');
                  }}
                >
                  <Icon name="plus" size={16} color="#55cc70" style={{ marginRight: 8 }} />
                  <LocalizedText style={styles.manageAddressesText}>Manage Addresses</LocalizedText>
                </TouchableOpacity>
              </Animated.View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
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
  searchPlaceholder: {
    flex: 1,
    fontSize: 15,
    fontFamily: 'Poppins-Regular',
    color: '#9e9e9e',
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

  // ===== Address Dropdown =====
  dropdownOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.25)',
  },
  dropdownContainer: {
    position: 'absolute',
    left: 16,
    right: 16,
    backgroundColor: '#ffffff',
    borderRadius: 20,
    paddingTop: 16,
    paddingBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 20,
  },
  dropdownArrow: {
    position: 'absolute',
    top: -8,
    left: 28,
    width: 16,
    height: 16,
    backgroundColor: '#ffffff',
    transform: [{ rotate: '45deg' }],
    borderTopLeftRadius: 4,
  },
  dropdownTitle: {
    fontSize: 14,
    fontFamily: 'Poppins-SemiBold',
    color: '#7a7a7a',
    paddingHorizontal: 18,
    marginBottom: 10,
  },
  dropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingVertical: 14,
  },
  dropdownItemSelected: {
    backgroundColor: '#f0faf3',
  },
  dropdownItemLeft: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    flex: 1,
  },
  dropdownRadio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#c8c8c8',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    marginTop: 2,
  },
  dropdownRadioSelected: {
    borderColor: '#55cc70',
  },
  dropdownRadioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#55cc70',
  },
  dropdownTypeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  dropdownType: {
    fontSize: 15,
    fontFamily: 'Poppins-SemiBold',
    color: '#1a1a1a',
  },
  dropdownDefaultBadge: {
    backgroundColor: '#55cc70',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 6,
    marginLeft: 8,
  },
  dropdownDefaultText: {
    fontSize: 10,
    fontFamily: 'Poppins-Bold',
    color: '#ffffff',
  },
  dropdownAddress: {
    fontSize: 13,
    fontFamily: 'Poppins-Regular',
    color: '#7a7a7a',
    lineHeight: 18,
  },
  manageAddressesBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    marginTop: 4,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#f0f0f0',
  },
  manageAddressesText: {
    fontSize: 14,
    fontFamily: 'Poppins-SemiBold',
    color: '#55cc70',
  },
});

export default HomeScreen;