import React, { useEffect, useRef } from 'react';
import LocalizedText from '../../../shared/i18n/LocalizedText';
import { View, StyleSheet, ScrollView, Image, StatusBar, Animated, Dimensions } from 'react-native';
import TouchableOpacity from '../../../shared/components/AnimatedTouchableOpacity';
import Icon from '@react-native-vector-icons/feather';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

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
  // Extra categories for a fuller "See All" screen
  { id: '9', name: 'Snacks &\nMunchies', image: 'https://cdn-icons-png.flaticon.com/512/2553/2553691.png' },
  { id: '10', name: 'Bakery &\nBiscuits', image: 'https://cdn-icons-png.flaticon.com/512/3082/3082060.png' },
  { id: '11', name: 'Personal\nCare', image: 'https://cdn-icons-png.flaticon.com/512/2553/2553673.png' },
  { id: '12', name: 'Household\nItems', image: 'https://cdn-icons-png.flaticon.com/512/3655/3655589.png' },
];

const CategoryListScreen = ({ navigation }: any) => {
  const insets = useSafeAreaInsets();

  // Staggered entrance animation
  const itemAnims = useRef(
    CATEGORIES.map(() => new Animated.Value(0))
  ).current;

  useEffect(() => {
    const animations = itemAnims.map((anim, index) =>
      Animated.timing(anim, {
        toValue: 1,
        duration: 400,
        delay: index * 50,
        useNativeDriver: true,
      })
    );
    Animated.stagger(35, animations).start();
  }, []);

  const getItemStyle = (index: number) => ({
    opacity: itemAnims[index],
    transform: [
      {
        translateY: itemAnims[index].interpolate({
          inputRange: [0, 1],
          outputRange: [24, 0],
        }),
      },
      {
        scale: itemAnims[index].interpolate({
          inputRange: [0, 1],
          outputRange: [0.9, 1],
        }),
      },
    ],
  });

  const handleCategoryPress = (category: typeof CATEGORIES[0]) => {
    const cleanTitle = category.name.replace('\n', ' ');
    navigation.navigate('ProductListScreen', {
      title: cleanTitle,
      // You can later pass filtered products here
    });
  };

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <StatusBar barStyle="dark-content" />

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

        <LocalizedText style={styles.headerTitle}>All Categories</LocalizedText>

        <TouchableOpacity style={styles.cartIconWrapper} activeOpacity={0.85}>
          <View style={styles.cartButton}>
            <Icon name="shopping-bag" size={20} color="#1a1a1a" />
            <View style={styles.cartBadge}>
              <LocalizedText style={styles.cartBadgeText}>2</LocalizedText>
            </View>
          </View>
        </TouchableOpacity>
      </View>

      {/* Categories Grid */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + 30 },
        ]}
      >
        <View style={styles.grid}>
          {CATEGORIES.map((item, index) => (
            <Animated.View
              key={item.id}
              style={[styles.categoryWrapper, getItemStyle(index)]}
            >
              <TouchableOpacity
                style={styles.categoryItem}
                activeOpacity={0.8}
                onPress={() => handleCategoryPress(item)}
              >
                <View style={styles.imageContainer}>
                  <Image
                    source={{ uri: item.image }}
                    style={styles.categoryImage}
                    resizeMode="contain"
                  />
                </View>
                <LocalizedText style={styles.categoryText}>{item.name}</LocalizedText>
              </TouchableOpacity>
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
    paddingTop: 20,
    paddingHorizontal: 12,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  categoryWrapper: {
    width: '25%',
    alignItems: 'center',
    marginBottom: 28,
  },
  categoryItem: {
    width: '100%',
    alignItems: 'center',
  },
  imageContainer: {
    width: 72,
    height: 72,
    backgroundColor: '#f8f8f8',
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    // subtle shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  categoryImage: {
    width: 46,
    height: 46,
  },
  categoryText: {
    fontSize: 12,
    fontFamily: 'Poppins-Medium',
    color: '#1a1a1a',
    textAlign: 'center',
    lineHeight: 16,
  },
});

export default CategoryListScreen;