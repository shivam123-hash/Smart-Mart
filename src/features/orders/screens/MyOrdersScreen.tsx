import React, { useState, useRef, useEffect } from 'react';
import LocalizedText from '../../../shared/i18n/LocalizedText';
import LocalizedTextInput from '../../../shared/i18n/LocalizedTextInput';
import { View, StyleSheet, ScrollView, StatusBar, Animated, Image, FlatList, Modal, TouchableWithoutFeedback, Dimensions } from 'react-native';
import TouchableOpacity from '../../../shared/components/AnimatedTouchableOpacity';
import Icon from '@react-native-vector-icons/feather';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ProductDetailPressable } from '../../../shared/components/sharedTransition';
import { useCart } from '../../cart/context/CartContext';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

const TABS = ['All', 'Ongoing', 'Completed', 'Cancelled'];

const ORDERS = [
  {
    id: 'ORD-78421',
    date: '12 Oct 2026, 2:30 PM',
    status: 'Delivered',
    statusColor: '#55cc70',
    items: 4,
    total: '₹48.50',
    image: 'https://cdn-icons-png.flaticon.com/512/2553/2553691.png',
    products: 'Surf Excel, Fortune Dal, Apples...',
  },
  {
    id: 'ORD-78395',
    date: '10 Oct 2026, 11:15 AM',
    status: 'On the way',
    statusColor: '#4A90E2',
    items: 2,
    total: '₹22.00',
    image: 'https://cdn-icons-png.flaticon.com/512/869/869687.png',
    products: 'Amul Milk, Tropicana Juice',
  },
  {
    id: 'ORD-78310',
    date: '08 Oct 2026, 6:45 PM',
    status: 'Processing',
    statusColor: '#F39C12',
    items: 6,
    total: '₹67.80',
    image: 'https://cdn-icons-png.flaticon.com/512/3014/3014436.png',
    products: 'Aashirvaad Atta, Rice, Oil...',
  },
  {
    id: 'ORD-78244',
    date: '05 Oct 2026, 1:20 PM',
    status: 'Cancelled',
    statusColor: '#ff4d4f',
    items: 3,
    total: '₹19.50',
    image: 'https://cdn-icons-png.flaticon.com/512/3143/3143645.png',
    products: 'Chicken Breast, Eggs',
  },
  {
    id: 'ORD-78188',
    date: '02 Oct 2026, 9:10 AM',
    status: 'Delivered',
    statusColor: '#55cc70',
    items: 5,
    total: '₹35.20',
    image: 'https://cdn-icons-png.flaticon.com/512/924/924514.png',
    products: 'Tata Tea, Maggi, Chips...',
  },
];

const DEFAULT_REORDER_ITEMS = [
  { id: '1', name: 'Surf Excel Easy Wash Detergent Powder', size: '1 kg', qty: 1, price: '₹12', image: 'https://cdn-icons-png.flaticon.com/512/2553/2553691.png' },
  { id: '2', name: 'Fortune Arhar Dal (Toor Dal)', size: '1 kg', qty: 2, price: '₹10', image: 'https://cdn-icons-png.flaticon.com/512/2553/2553609.png' },
  { id: '3', name: 'Fresh Apples (Fuji)', size: '1 kg', qty: 1, price: '₹4', image: 'https://cdn-icons-png.flaticon.com/512/3194/3194591.png' },
];

const MyOrdersScreen = ({ navigation }: any) => {
  const { addProducts } = useCart();
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState('All');
  const [showRateSheet, setShowRateSheet] = useState(false);
  const [showReorderSheet, setShowReorderSheet] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState('');
  const [reorderItems, setReorderItems] = useState(DEFAULT_REORDER_ITEMS);

  // Animations
  const headerAnim = useRef(new Animated.Value(0)).current;
  const tabsAnim = useRef(new Animated.Value(0)).current;
  const listAnim = useRef(new Animated.Value(0)).current;
  const itemAnims = useRef(ORDERS.map(() => new Animated.Value(0))).current;

  // Sheet animations
  const rateSlide = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
  const rateBackdrop = useRef(new Animated.Value(0)).current;
  const reorderSlide = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
  const reorderBackdrop = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.stagger(60, [
      Animated.timing(headerAnim, { toValue: 1, duration: 380, useNativeDriver: true }),
      Animated.timing(tabsAnim, { toValue: 1, duration: 400, useNativeDriver: true }),
      Animated.timing(listAnim, { toValue: 1, duration: 420, useNativeDriver: true }),
    ]).start();

    const anims = itemAnims.map((anim, index) =>
      Animated.timing(anim, {
        toValue: 1,
        duration: 400,
        delay: 220 + index * 70,
        useNativeDriver: true,
      })
    );
    Animated.stagger(40, anims).start();
  }, [headerAnim, itemAnims, listAnim, tabsAnim]);

  // Rate sheet animation
  useEffect(() => {
    if (showRateSheet) {
      setRating(0);
      setReview('');
      Animated.parallel([
        Animated.spring(rateSlide, { toValue: 0, friction: 9, tension: 65, useNativeDriver: true }),
        Animated.timing(rateBackdrop, { toValue: 1, duration: 280, useNativeDriver: true }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(rateSlide, { toValue: SCREEN_HEIGHT, duration: 280, useNativeDriver: true }),
        Animated.timing(rateBackdrop, { toValue: 0, duration: 250, useNativeDriver: true }),
      ]).start();
    }
  }, [rateBackdrop, rateSlide, showRateSheet]);

  // Reorder sheet animation
  useEffect(() => {
    if (showReorderSheet) {
      setReorderItems(DEFAULT_REORDER_ITEMS.map((i) => ({ ...i })));
      Animated.parallel([
        Animated.spring(reorderSlide, { toValue: 0, friction: 9, tension: 65, useNativeDriver: true }),
        Animated.timing(reorderBackdrop, { toValue: 1, duration: 280, useNativeDriver: true }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(reorderSlide, { toValue: SCREEN_HEIGHT, duration: 280, useNativeDriver: true }),
        Animated.timing(reorderBackdrop, { toValue: 0, duration: 250, useNativeDriver: true }),
      ]).start();
    }
  }, [reorderBackdrop, reorderSlide, showReorderSheet]);

  const filteredOrders =
    activeTab === 'All'
      ? ORDERS
      : activeTab === 'Ongoing'
        ? ORDERS.filter((o) => o.status === 'On the way' || o.status === 'Processing')
        : activeTab === 'Completed'
          ? ORDERS.filter((o) => o.status === 'Delivered')
          : ORDERS.filter((o) => o.status === 'Cancelled');

  const getStatusIcon = (status: string) => {
    if (status === 'Delivered') return 'check-circle';
    if (status === 'On the way') return 'truck';
    if (status === 'Processing') return 'clock';
    return 'x-circle';
  };

  const openRateSheet = (order: any) => {
    setSelectedOrder(order);
    setShowRateSheet(true);
  };

  const openReorderSheet = (order: any) => {
    setSelectedOrder(order);
    setShowReorderSheet(true);
  };

  const submitRating = () => {
    console.log('Rated:', selectedOrder?.id, rating, review);
    setShowRateSheet(false);
  };

  const updateQty = (id: string, delta: number) => {
    setReorderItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          return { ...item, qty: Math.max(0, item.qty + delta) };
        }
        return item;
      })
    );
  };

  const totalItems = reorderItems.reduce((sum, i) => sum + i.qty, 0);
  const totalPrice = reorderItems
    .reduce((sum, i) => sum + parseFloat(i.price.replace(/[^0-9.]/g, '')) * i.qty, 0)
    .toFixed(2);

  const confirmReorder = () => {
    const itemsToAdd = reorderItems.filter((i) => i.qty > 0);
    addProducts(itemsToAdd.flatMap((item) =>
      Array.from({ length: item.qty }, () => ({
        id: item.id,
        name: item.name,
        size: item.size,
        price: item.price,
        image: item.image,
      })),
    ));
    setShowReorderSheet(false);
    navigation.navigate('MainNavigation', { screen: 'Cart' });
  };

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <Animated.View
        style={[
          styles.header,
          {
            opacity: headerAnim,
            transform: [{ translateY: headerAnim.interpolate({ inputRange: [0, 1], outputRange: [-16, 0] }) }],
          },
        ]}
      >
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton} hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}>
          <Icon name="chevron-left" size={26} color="#1a1a1a" />
        </TouchableOpacity>
        <LocalizedText style={styles.headerTitle}>My Orders</LocalizedText>
        <View style={{ width: 40 }} />
      </Animated.View>

      {/* Tabs */}
      <Animated.View
        style={[
          styles.tabsContainer,
          {
            opacity: tabsAnim,
            transform: [{ translateY: tabsAnim.interpolate({ inputRange: [0, 1], outputRange: [12, 0] }) }],
          },
        ]}
      >
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabsScroll}>
          {TABS.map((tab) => (
            <TouchableOpacity
              key={tab}
              style={[styles.tab, activeTab === tab && styles.tabActive]}
              onPress={() => setActiveTab(tab)}
              activeOpacity={0.8}
            >
              <LocalizedText style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>{tab}</LocalizedText>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </Animated.View>

      {/* Orders List */}
      <Animated.View style={{ flex: 1, opacity: listAnim }}>
        {filteredOrders.length === 0 ? (
          <View style={styles.emptyContainer}>
            <View style={styles.emptyIconWrapper}>
              <Icon name="package" size={42} color="#55cc70" />
            </View>
            <LocalizedText style={styles.emptyTitle}>No orders found</LocalizedText>
            <LocalizedText style={styles.emptySubtitle}>You don’t have any {activeTab.toLowerCase()} orders yet.</LocalizedText>
            <TouchableOpacity style={styles.shopNowBtn} activeOpacity={0.85} onPress={() => navigation.navigate('MainNavigation', { screen: 'Home' })}>
              <LocalizedText style={styles.shopNowBtnText}>Start Shopping</LocalizedText>
            </TouchableOpacity>
          </View>
        ) : (
          <FlatList
            data={filteredOrders}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={[styles.listContent, { paddingBottom: insets.bottom + 24 }]}
            renderItem={({ item, index }) => {
              const anim = itemAnims[index] || new Animated.Value(1);
              return (
                <Animated.View
                  style={{
                    opacity: anim,
                    transform: [{ translateY: anim.interpolate({ inputRange: [0, 1], outputRange: [24, 0] }) }],
                  }}
                >
                  <TouchableOpacity
                    style={styles.orderCard}
                    activeOpacity={0.85}
                    onPress={() => navigation.navigate('OrderDetailsScreen', { order: item })}
                  >
                    <View style={styles.orderTop}>
                      <View>
                        <LocalizedText style={styles.orderId}>{item.id}</LocalizedText>
                        <LocalizedText style={styles.orderDate}>{item.date}</LocalizedText>
                      </View>
                      <View style={[styles.statusBadge, { backgroundColor: `${item.statusColor}18` }]}>
                        <Icon name={getStatusIcon(item.status) as any} size={13} color={item.statusColor} style={{ marginRight: 5 }} />
                        <LocalizedText style={[styles.statusText, { color: item.statusColor }]}>{item.status}</LocalizedText>
                      </View>
                    </View>

                    <View style={styles.productRow}>
                      <View style={styles.productImageWrapper}>
                        <Image source={{ uri: item.image }} style={styles.productImage} resizeMode="contain" />
                      </View>
                      <View style={styles.productInfo}>
                        <LocalizedText style={styles.productNames} numberOfLines={1}>{item.products}</LocalizedText>
                        <LocalizedText style={styles.itemCount}>{item.items} {item.items === 1 ? 'item' : 'items'}</LocalizedText>
                      </View>
                      <LocalizedText style={styles.orderTotal}>{item.total}</LocalizedText>
                    </View>

                    <View style={styles.orderActions}>
                      {item.status === 'Delivered' && (
                        <>
                          <TouchableOpacity style={styles.actionBtn} activeOpacity={0.8} onPress={() => openReorderSheet(item)}>
                            <LocalizedText style={styles.actionBtnText}>Reorder</LocalizedText>
                          </TouchableOpacity>
                          <TouchableOpacity style={[styles.actionBtn, styles.actionBtnOutline]} activeOpacity={0.8} onPress={() => openRateSheet(item)}>
                            <LocalizedText style={[styles.actionBtnText, styles.actionBtnTextOutline]}>Rate Order</LocalizedText>
                          </TouchableOpacity>
                        </>
                      )}
                      {(item.status === 'On the way' || item.status === 'Processing') && (
                        <TouchableOpacity style={styles.actionBtn} activeOpacity={0.8} onPress={() => navigation.navigate('TrackOrderScreen', { order: item })}>
                          <LocalizedText style={styles.actionBtnText}>Track Order</LocalizedText>
                        </TouchableOpacity>
                      )}
                      {item.status === 'Cancelled' && (
                        <TouchableOpacity style={styles.actionBtn} activeOpacity={0.8} onPress={() => openReorderSheet(item)}>
                          <LocalizedText style={styles.actionBtnText}>Order Again</LocalizedText>
                        </TouchableOpacity>
                      )}
                    </View>
                  </TouchableOpacity>
                </Animated.View>
              );
            }}
          />
        )}
      </Animated.View>

      {/* ==================== RATE ORDER SHEET ==================== */}
      <Modal transparent visible={showRateSheet} animationType="none" statusBarTranslucent>
        <View style={styles.sheetContainer}>
          <TouchableWithoutFeedback onPress={() => setShowRateSheet(false)}>
            <Animated.View style={[styles.sheetBackdrop, { opacity: rateBackdrop.interpolate({ inputRange: [0, 1], outputRange: [0, 0.5] }) }]} />
          </TouchableWithoutFeedback>
          <Animated.View style={[styles.sheet, { paddingBottom: insets.bottom + 20, transform: [{ translateY: rateSlide }] }]}>
            <View style={styles.sheetHandle} />
            <LocalizedText style={styles.sheetTitle}>Rate your order</LocalizedText>
            <LocalizedText style={styles.sheetSubtitle}>{selectedOrder ? `How was order ${selectedOrder.id}?` : 'How was your experience?'}</LocalizedText>
            <View style={styles.starsRow}>
              {[1, 2, 3, 4, 5].map((star) => (
                <TouchableOpacity key={star} onPress={() => setRating(star)} activeOpacity={0.7}>
                  <Icon name="star" size={36} color={star <= rating ? '#FFB800' : '#e0e0e0'} style={{ marginHorizontal: 6 }} />
                </TouchableOpacity>
              ))}
            </View>
            <LocalizedTextInput
              style={styles.reviewInput}
              placeholder="Write a review (optional)"
              placeholderTextColor="#9e9e9e"
              multiline
              value={review}
              onChangeText={setReview}
            />
            <TouchableOpacity style={[styles.submitBtn, rating === 0 && styles.submitBtnDisabled]} disabled={rating === 0} activeOpacity={0.85} onPress={submitRating}>
              <LocalizedText style={styles.submitBtnText}>Submit Rating</LocalizedText>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </Modal>

      {/* ==================== REORDER SHEET ==================== */}
      <Modal transparent visible={showReorderSheet} animationType="none" statusBarTranslucent>
        <View style={styles.sheetContainer}>
          <TouchableWithoutFeedback onPress={() => setShowReorderSheet(false)}>
            <Animated.View style={[styles.sheetBackdrop, { opacity: reorderBackdrop.interpolate({ inputRange: [0, 1], outputRange: [0, 0.5] }) }]} />
          </TouchableWithoutFeedback>
          <Animated.View style={[styles.reorderSheet, { paddingBottom: insets.bottom + 16, transform: [{ translateY: reorderSlide }] }]}>
            <View style={styles.sheetHandle} />
            <View style={styles.reorderHeader}>
              <LocalizedText style={styles.sheetTitle}>Reorder Items</LocalizedText>
              <LocalizedText style={styles.sheetSubtitle}>from {selectedOrder?.id || 'Order'}</LocalizedText>
            </View>

            <ScrollView style={styles.reorderList} showsVerticalScrollIndicator={false} bounces={false}>
              {reorderItems.map((item) => (
                <View key={item.id} style={styles.reorderItemRow}>
                  <ProductDetailPressable
                    item={item}
                    style={styles.reorderProduct}
                    onOpen={(openProduct) => {
                      setShowReorderSheet(false);
                      setTimeout(openProduct, 300);
                    }}
                  >
                    <View style={styles.reorderImageWrapper}>
                      <Image source={{ uri: item.image }} style={styles.reorderImage} resizeMode="contain" />
                    </View>
                    <View style={styles.reorderItemInfo}>
                      <LocalizedText style={styles.reorderItemName} numberOfLines={1}>{item.name}</LocalizedText>
                      <LocalizedText style={styles.reorderItemSize}>{item.size}</LocalizedText>
                      <LocalizedText style={styles.reorderItemPrice}>{item.price}</LocalizedText>
                    </View>
                  </ProductDetailPressable>
                  <View style={styles.qtyControl}>
                    {item.qty === 0 ? (
                      <TouchableOpacity style={styles.addBtn} onPress={() => updateQty(item.id, 1)} activeOpacity={0.8}>
                        <LocalizedText style={styles.addBtnText}>ADD</LocalizedText>
                      </TouchableOpacity>
                    ) : (
                      <View style={styles.qtyRow}>
                        <TouchableOpacity style={styles.qtyBtn} onPress={() => updateQty(item.id, -1)} activeOpacity={0.7}>
                          <Icon name="minus" size={16} color="#55cc70" />
                        </TouchableOpacity>
                        <LocalizedText style={styles.qtyText}>{item.qty}</LocalizedText>
                        <TouchableOpacity style={styles.qtyBtn} onPress={() => updateQty(item.id, 1)} activeOpacity={0.7}>
                          <Icon name="plus" size={16} color="#55cc70" />
                        </TouchableOpacity>
                      </View>
                    )}
                  </View>
                </View>
              ))}
            </ScrollView>

            <View style={styles.reorderFooter}>
              <View style={styles.totalRow}>
                <LocalizedText style={styles.totalLabel}>{totalItems} {totalItems === 1 ? 'item' : 'items'}</LocalizedText>
                <LocalizedText style={styles.totalValue}>₹{totalPrice}</LocalizedText>
              </View>
              <TouchableOpacity
                style={[styles.confirmBtn, totalItems === 0 && styles.confirmBtnDisabled]}
                activeOpacity={0.85}
                disabled={totalItems === 0}
                onPress={confirmReorder}
              >
                <LocalizedText style={styles.confirmBtnText}>{totalItems === 0 ? 'No items selected' : 'Add to Cart'}</LocalizedText>
                {totalItems > 0 && <Icon name="shopping-bag" size={18} color="#ffffff" style={{ marginLeft: 8 }} />}
              </TouchableOpacity>
            </View>
          </Animated.View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#ffffff' },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingVertical: 12, backgroundColor: '#ffffff',
    borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: '#f0f0f0',
  },
  backButton: { width: 40, height: 40, justifyContent: 'center', alignItems: 'flex-start' },
  headerTitle: { fontSize: 18, fontFamily: 'Poppins-Bold', color: '#1a1a1a' },
  tabsContainer: { backgroundColor: '#ffffff', paddingVertical: 12, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: '#f0f0f0' },
  tabsScroll: { paddingHorizontal: 16 },
  tab: { paddingHorizontal: 18, paddingVertical: 8, borderRadius: 20, backgroundColor: '#f5f6f8', marginRight: 10 },
  tabActive: { backgroundColor: '#55cc70' },
  tabText: { fontSize: 13, fontFamily: 'Poppins-Medium', color: '#7a7a7a' },
  tabTextActive: { color: '#ffffff', fontFamily: 'Poppins-SemiBold' },
  listContent: { paddingHorizontal: 16, paddingTop: 16 },
  orderCard: {
    backgroundColor: '#ffffff', borderRadius: 18, padding: 16, marginBottom: 14,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.04, shadowRadius: 8, elevation: 2,
  },
  orderTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 },
  orderId: { fontSize: 15, fontFamily: 'Poppins-SemiBold', color: '#1a1a1a' },
  orderDate: { fontSize: 12, fontFamily: 'Poppins-Regular', color: '#9e9e9e', marginTop: 2 },
  statusBadge: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 10 },
  statusText: { fontSize: 12, fontFamily: 'Poppins-SemiBold' },
  productRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 14 },
  productImageWrapper: { width: 52, height: 52, borderRadius: 12, backgroundColor: '#f5f6f8', justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  productImage: { width: 34, height: 34 },
  productInfo: { flex: 1 },
  productNames: { fontSize: 14, fontFamily: 'Poppins-Medium', color: '#1a1a1a', marginBottom: 2 },
  itemCount: { fontSize: 12, fontFamily: 'Poppins-Regular', color: '#9e9e9e' },
  orderTotal: { fontSize: 16, fontFamily: 'Poppins-Bold', color: '#1a1a1a' },
  orderActions: { flexDirection: 'row', gap: 10 },
  actionBtn: { flex: 1, height: 40, borderRadius: 12, backgroundColor: '#55cc70', justifyContent: 'center', alignItems: 'center' },
  actionBtnOutline: { backgroundColor: 'transparent', borderWidth: 1.5, borderColor: '#55cc70' },
  actionBtnText: { fontSize: 13, fontFamily: 'Poppins-SemiBold', color: '#ffffff' },
  actionBtnTextOutline: { color: '#55cc70' },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 40 },
  emptyIconWrapper: { width: 90, height: 90, borderRadius: 45, backgroundColor: 'rgba(85, 204, 112, 0.12)', justifyContent: 'center', alignItems: 'center', marginBottom: 20 },
  emptyTitle: { fontSize: 18, fontFamily: 'Poppins-Bold', color: '#1a1a1a', marginBottom: 8 },
  emptySubtitle: { fontSize: 14, fontFamily: 'Poppins-Regular', color: '#9e9e9e', textAlign: 'center', lineHeight: 22, marginBottom: 28 },
  shopNowBtn: { backgroundColor: '#55cc70', paddingHorizontal: 28, paddingVertical: 14, borderRadius: 14 },
  shopNowBtnText: { fontSize: 15, fontFamily: 'Poppins-Bold', color: '#ffffff' },

  // Sheets common
  sheetContainer: { flex: 1, justifyContent: 'flex-end' },
  sheetBackdrop: { ...StyleSheet.absoluteFill, backgroundColor: '#000' },
  sheet: { backgroundColor: '#ffffff', borderTopLeftRadius: 28, borderTopRightRadius: 28, paddingHorizontal: 24, paddingTop: 12 },
  sheetHandle: { width: 40, height: 4, borderRadius: 2, backgroundColor: '#e0e0e0', alignSelf: 'center', marginBottom: 20 },
  sheetTitle: { fontSize: 20, fontFamily: 'Poppins-Bold', color: '#1a1a1a', textAlign: 'center' },
  sheetSubtitle: { fontSize: 14, fontFamily: 'Poppins-Regular', color: '#7a7a7a', textAlign: 'center', marginTop: 6, marginBottom: 24 },
  starsRow: { flexDirection: 'row', justifyContent: 'center', marginBottom: 24 },
  reviewInput: { backgroundColor: '#f5f6f8', borderRadius: 14, padding: 16, height: 100, textAlignVertical: 'top', fontSize: 14, fontFamily: 'Poppins-Regular', color: '#1a1a1a', marginBottom: 20 },
  submitBtn: { backgroundColor: '#55cc70', height: 52, borderRadius: 16, justifyContent: 'center', alignItems: 'center' },
  submitBtnDisabled: { backgroundColor: '#c8e6d0' },
  submitBtnText: { fontSize: 16, fontFamily: 'Poppins-Bold', color: '#ffffff' },

  // Reorder specific
  reorderSheet: { backgroundColor: '#ffffff', borderTopLeftRadius: 28, borderTopRightRadius: 28, paddingTop: 12, maxHeight: SCREEN_HEIGHT * 0.75 },
  reorderHeader: { paddingHorizontal: 24, marginBottom: 8 },
  reorderList: { paddingHorizontal: 20, maxHeight: 300 },
  reorderItemRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: '#f0f0f0' },
  reorderProduct: { flex: 1, flexDirection: 'row', alignItems: 'center' },
  reorderImageWrapper: { width: 56, height: 56, borderRadius: 14, backgroundColor: '#f5f6f8', justifyContent: 'center', alignItems: 'center', marginRight: 14 },
  reorderImage: { width: 36, height: 36 },
  reorderItemInfo: { flex: 1 },
  reorderItemName: { fontSize: 14, fontFamily: 'Poppins-SemiBold', color: '#1a1a1a' },
  reorderItemSize: { fontSize: 12, fontFamily: 'Poppins-Regular', color: '#9e9e9e', marginTop: 2 },
  reorderItemPrice: { fontSize: 14, fontFamily: 'Poppins-Bold', color: '#1a1a1a', marginTop: 4 },
  qtyControl: { marginLeft: 10 },
  addBtn: { backgroundColor: '#55cc70', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 10 },
  addBtnText: { fontSize: 13, fontFamily: 'Poppins-Bold', color: '#ffffff' },
  qtyRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f0faf3', borderRadius: 10, borderWidth: 1, borderColor: '#d4f0dc' },
  qtyBtn: { width: 34, height: 34, justifyContent: 'center', alignItems: 'center' },
  qtyText: { fontSize: 15, fontFamily: 'Poppins-Bold', color: '#1a1a1a', minWidth: 28, textAlign: 'center' },
  reorderFooter: { paddingHorizontal: 20, paddingTop: 16, borderTopWidth: 1, borderTopColor: '#f0f0f0' },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 },
  totalLabel: { fontSize: 14, fontFamily: 'Poppins-Medium', color: '#7a7a7a' },
  totalValue: { fontSize: 20, fontFamily: 'Poppins-Bold', color: '#1a1a1a' },
  confirmBtn: { backgroundColor: '#55cc70', height: 54, borderRadius: 16, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
  confirmBtnDisabled: { backgroundColor: '#c8e6d0' },
  confirmBtnText: { fontSize: 16, fontFamily: 'Poppins-Bold', color: '#ffffff' },
});

export default MyOrdersScreen;