import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Animated,
  Dimensions,
  FlatList,
  Keyboard,
} from 'react-native';
import Icon from '@react-native-vector-icons/feather';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SharedProductCard } from '../../components/sharedTransition';

const { width } = Dimensions.get('window');
const CARD_GAP = 12;
const HORIZONTAL_PADDING = 16;
const CARD_WIDTH = (width - HORIZONTAL_PADDING * 2 - CARD_GAP) / 2;

// Sample data
const ALL_PRODUCTS = [
  { id: '1', name: 'Surf Excel Easy Wash Detergent Powder', size: '1 kg', price: '$12', originalPrice: '$15', image: 'https://cdn-icons-png.flaticon.com/512/2553/2553691.png', category: 'Household' },
  { id: '2', name: 'Fortune Arhar Dal (Toor Dal)', size: '1 kg', price: '$10', originalPrice: '$13', image: 'https://cdn-icons-png.flaticon.com/512/2553/2553609.png', category: 'Staples' },
  { id: '3', name: 'Fresh Apples (Fuji)', size: '1 kg', price: '$4', originalPrice: '$6', image: 'https://cdn-icons-png.flaticon.com/512/3194/3194591.png', category: 'Fruits' },
  { id: '4', name: 'Aashirvaad Shudh Chakki Atta', size: '5 kg', price: '$18', originalPrice: '$23', image: 'https://cdn-icons-png.flaticon.com/512/3014/3014436.png', category: 'Staples' },
  { id: '5', name: 'Amul Taaza Toned Milk', size: '1 L', price: '$1.8', originalPrice: '$2.2', image: 'https://cdn-icons-png.flaticon.com/512/869/869687.png', category: 'Dairy' },
  { id: '6', name: 'Tropicana Orange Juice', size: '1 L', price: '$4.5', originalPrice: '$6', image: 'https://cdn-icons-png.flaticon.com/512/2405/2405597.png', category: 'Beverages' },
  { id: '7', name: 'Tata Tea Premium', size: '500 g', price: '$7', originalPrice: '$9', image: 'https://cdn-icons-png.flaticon.com/512/924/924514.png', category: 'Beverages' },
  { id: '8', name: 'Maggi 2-Minute Noodles', size: '12 pack', price: '$5', originalPrice: '$6.5', image: 'https://cdn-icons-png.flaticon.com/512/3014/3014493.png', category: 'Instant' },
  { id: '9', name: 'Fortune Sunlite Refined Oil', size: '5 L', price: '$22', originalPrice: '$27', image: 'https://cdn-icons-png.flaticon.com/512/2553/2553609.png', category: 'Staples' },
  { id: '10', name: 'Fresh Farm Chicken Breast', size: '500 g', price: '$5.5', originalPrice: '$7', image: 'https://cdn-icons-png.flaticon.com/512/3143/3143645.png', category: 'Meat' },
  { id: '11', name: 'Britannia Good Day Cookies', size: '600 g', price: '$4', originalPrice: '$5.5', image: 'https://cdn-icons-png.flaticon.com/512/3082/3082060.png', category: 'Snacks' },
  { id: '12', name: 'Lay\'s Classic Salted Chips', size: '150 g', price: '$2.5', originalPrice: '$3.2', image: 'https://cdn-icons-png.flaticon.com/512/2553/2553691.png', category: 'Snacks' },
];

const RECENT_SEARCHES = ['Milk', 'Apples', 'Atta', 'Detergent', 'Chicken'];
const POPULAR_SEARCHES = ['Fresh Fruits', 'Dairy', 'Rice & Dal', 'Snacks', 'Oil', 'Tea'];

const FILTER_CATEGORIES = ['All', 'Fruits', 'Dairy', 'Staples', 'Beverages', 'Snacks', 'Meat', 'Household', 'Instant'];
const PRICE_RANGES = ['All', 'Under $5', '$5 - $10', '$10 - $20', 'Above $20'];

const SearchAndFilterScreen = ({ navigation }: any) => {
  const insets = useSafeAreaInsets();
  const searchInputRef = useRef<React.ElementRef<typeof TextInput>>(null);

  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedPrice, setSelectedPrice] = useState('All');
  const [showFilters, setShowFilters] = useState(false);
  const [results, setResults] = useState<any[]>([]);

  // Animations
  const headerAnim = useRef(new Animated.Value(0)).current;
  const contentAnim = useRef(new Animated.Value(0)).current;
  const filterAnim = useRef(new Animated.Value(0)).current;
  const resultsAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Entrance animation
    Animated.stagger(80, [
      Animated.timing(headerAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.timing(contentAnim, {
        toValue: 1,
        duration: 450,
        useNativeDriver: true,
      }),
    ]).start();

    // Auto focus search
    setTimeout(() => {
      searchInputRef.current?.focus();
    }, 300);
  }, []);

  useEffect(() => {
    // Filter products
    let filtered = [...ALL_PRODUCTS];

    if (query.trim()) {
      const q = query.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q)
      );
    }

    if (selectedCategory !== 'All') {
      filtered = filtered.filter((p) => p.category === selectedCategory);
    }

    if (selectedPrice !== 'All') {
      filtered = filtered.filter((p) => {
        const price = parseFloat(p.price.replace('$', ''));
        if (selectedPrice === 'Under $5') return price < 5;
        if (selectedPrice === '$5 - $10') return price >= 5 && price <= 10;
        if (selectedPrice === '$10 - $20') return price > 10 && price <= 20;
        if (selectedPrice === 'Above $20') return price > 20;
        return true;
      });
    }

    setResults(filtered);

    // Animate results
    resultsAnim.setValue(0);
    Animated.timing(resultsAnim, {
      toValue: 1,
      duration: 350,
      useNativeDriver: true,
    }).start();
  }, [query, selectedCategory, selectedPrice]);

  const toggleFilters = () => {
    const toValue = showFilters ? 0 : 1;
    setShowFilters(!showFilters);

    Animated.spring(filterAnim, {
      toValue,
      friction: 8,
      tension: 50,
      useNativeDriver: true,
    }).start();
  };

  const clearSearch = () => {
    setQuery('');
    searchInputRef.current?.focus();
  };

  const handleRecentPress = (text: string) => {
    setQuery(text);
    Keyboard.dismiss();
  };

  const hasQueryOrFilter = query.trim().length > 0 || selectedCategory !== 'All' || selectedPrice !== 'All';

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <Animated.View
        style={[
          styles.header,
          {
            opacity: headerAnim,
            transform: [
              {
                translateY: headerAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [-20, 0],
                }),
              },
            ],
          },
        ]}
      >
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
        >
          <Icon name="chevron-left" size={26} color="#1a1a1a" />
        </TouchableOpacity>

        <View style={styles.searchBar}>
          <Icon name="search" size={18} color="#7a7a7a" style={styles.searchIcon} />
          <TextInput
            ref={searchInputRef}
            placeholder="Search products..."
            placeholderTextColor="#9e9e9e"
            style={styles.searchInput}
            value={query}
            onChangeText={setQuery}
            returnKeyType="search"
            autoCorrect={false}
          />
          {query.length > 0 && (
            <TouchableOpacity onPress={clearSearch} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
              <Icon name="x" size={18} color="#9e9e9e" />
            </TouchableOpacity>
          )}
        </View>

        <TouchableOpacity
          style={[styles.filterButton, showFilters && styles.filterButtonActive]}
          onPress={toggleFilters}
          activeOpacity={0.85}
        >
          <Icon name="sliders" size={18} color={showFilters ? '#ffffff' : '#55cc70'} />
        </TouchableOpacity>
      </Animated.View>

      {/* Filters Panel */}
      <Animated.View
        style={[
          styles.filtersPanel,
          {
            opacity: filterAnim,
            transform: [
              {
                translateY: filterAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [-10, 0],
                }),
              },
            ],
            height: showFilters ? undefined : 0,
            overflow: 'hidden',
          },
        ]}
        pointerEvents={showFilters ? 'auto' : 'none'}
      >
        <Text style={styles.filterLabel}>Category</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipsRow}>
          {FILTER_CATEGORIES.map((cat) => (
            <TouchableOpacity
              key={cat}
              style={[styles.chip, selectedCategory === cat && styles.chipActive]}
              onPress={() => setSelectedCategory(cat)}
              activeOpacity={0.8}
            >
              <Text style={[styles.chipText, selectedCategory === cat && styles.chipTextActive]}>
                {cat}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <Text style={[styles.filterLabel, { marginTop: 14 }]}>Price Range</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipsRow}>
          {PRICE_RANGES.map((range) => (
            <TouchableOpacity
              key={range}
              style={[styles.chip, selectedPrice === range && styles.chipActive]}
              onPress={() => setSelectedPrice(range)}
              activeOpacity={0.8}
            >
              <Text style={[styles.chipText, selectedPrice === range && styles.chipTextActive]}>
                {range}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </Animated.View>

      <Animated.View
        style={[
          styles.content,
          {
            opacity: contentAnim,
            transform: [
              {
                translateY: contentAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [20, 0],
                }),
              },
            ],
          },
        ]}
      >
        {!hasQueryOrFilter ? (
          // Default state - Recent & Popular
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: insets.bottom + 30 }}
            keyboardShouldPersistTaps="handled"
          >
            {/* Recent Searches */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Recent Searches</Text>
                <TouchableOpacity>
                  <Text style={styles.clearText}>Clear</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.tagsWrap}>
                {RECENT_SEARCHES.map((item) => (
                  <TouchableOpacity
                    key={item}
                    style={styles.tag}
                    onPress={() => handleRecentPress(item)}
                    activeOpacity={0.8}
                  >
                    <Icon name="clock" size={14} color="#7a7a7a" style={{ marginRight: 6 }} />
                    <Text style={styles.tagText}>{item}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Popular Searches */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Popular Searches</Text>
              <View style={styles.tagsWrap}>
                {POPULAR_SEARCHES.map((item) => (
                  <TouchableOpacity
                    key={item}
                    style={styles.tag}
                    onPress={() => handleRecentPress(item)}
                    activeOpacity={0.8}
                  >
                    <Icon name="trending-up" size={14} color="#55cc70" style={{ marginRight: 6 }} />
                    <Text style={styles.tagText}>{item}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </ScrollView>
        ) : (
          // Results
          <Animated.View style={{ flex: 1, opacity: resultsAnim }}>
            <View style={styles.resultsHeader}>
              <Text style={styles.resultsCount}>
                {results.length} {results.length === 1 ? 'result' : 'results'} found
              </Text>
            </View>

            {results.length === 0 ? (
              <View style={styles.emptyContainer}>
                <View style={styles.emptyIconWrapper}>
                  <Icon name="search" size={42} color="#55cc70" />
                </View>
                <Text style={styles.emptyTitle}>No products found</Text>
                <Text style={styles.emptySubtitle}>
                  Try a different keyword or adjust the filters
                </Text>
              </View>
            ) : (
              <FlatList
                data={results}
                keyExtractor={(item) => item.id}
                numColumns={2}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={[
                  styles.gridContent,
                  { paddingBottom: insets.bottom + 24 },
                ]}
                columnWrapperStyle={styles.gridRow}
                renderItem={({ item, index }) => (
                  <View style={styles.cardWrapper}>
                    <SharedProductCard
                      item={item}
                      style={styles.gridCard}
                    />
                  </View>
                )}
              />
            )}
          </Animated.View>
        )}
      </Animated.View>
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
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#f0f0f0',
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f6f8',
    borderRadius: 14,
    paddingHorizontal: 14,
    height: 46,
    marginRight: 10,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    fontFamily: 'Poppins-Regular',
    color: '#1a1a1a',
    height: '100%',
  },
  filterButton: {
    width: 46,
    height: 46,
    borderRadius: 14,
    backgroundColor: '#f0faf3',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#d4f0dc',
  },
  filterButtonActive: {
    backgroundColor: '#55cc70',
    borderColor: '#55cc70',
  },
  filtersPanel: {
    backgroundColor: '#fafafa',
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#f0f0f0',
  },
  filterLabel: {
    fontSize: 13,
    fontFamily: 'Poppins-SemiBold',
    color: '#1a1a1a',
    marginBottom: 10,
  },
  chipsRow: {
    paddingRight: 16,
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e8ece9',
    marginRight: 10,
  },
  chipActive: {
    backgroundColor: '#55cc70',
    borderColor: '#55cc70',
  },
  chipText: {
    fontSize: 13,
    fontFamily: 'Poppins-Medium',
    color: '#4a4a4a',
  },
  chipTextActive: {
    color: '#ffffff',
  },
  content: {
    flex: 1,
  },
  section: {
    paddingHorizontal: 20,
    marginTop: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: 'Poppins-Bold',
    color: '#1a1a1a',
  },
  clearText: {
    fontSize: 13,
    fontFamily: 'Poppins-Medium',
    color: '#55cc70',
  },
  tagsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f6f8',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    marginRight: 10,
    marginBottom: 10,
  },
  tagText: {
    fontSize: 13,
    fontFamily: 'Poppins-Medium',
    color: '#1a1a1a',
  },
  resultsHeader: {
    paddingHorizontal: 20,
    paddingVertical: 14,
  },
  resultsCount: {
    fontSize: 14,
    fontFamily: 'Poppins-Medium',
    color: '#7a7a7a',
  },
  gridContent: {
    paddingHorizontal: HORIZONTAL_PADDING,
  },
  gridRow: {
    justifyContent: 'space-between',
    marginBottom: CARD_GAP,
  },
  cardWrapper: {
    width: CARD_WIDTH,
  },
  gridCard: {
    width: '100%',
    marginRight: 0,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyIconWrapper: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: 'rgba(85, 204, 112, 0.12)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 18,
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
  },
});

export default SearchAndFilterScreen;