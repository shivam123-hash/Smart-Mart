import React, { useState, useRef, useEffect, useMemo } from 'react';
import LocalizedText from '../../../shared/i18n/LocalizedText';
import { View, StyleSheet, ScrollView, StatusBar, Animated, Easing, Image } from 'react-native';
import TouchableOpacity from '../../../shared/components/AnimatedTouchableOpacity';
import Icon from '@react-native-vector-icons/feather';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ProductDetailPressable } from '../../../shared/components/sharedTransition';
import RateOrderSheet from '../components/RateOrderSheet';
import ReorderSheet from '../components/ReorderSheet';
import { useCart } from '../../cart/context/CartContext';

interface OrderItem {
    id: string;
    name: string;
    size: string;
    qty: number;
    price: string; // unit price, e.g. '₹12'
    image: string;
}

const STATUS_COLORS: Record<string, string> = {
    Delivered: '#55cc70',
    'On the way': '#4A90E2',
    Processing: '#F39C12',
    Cancelled: '#ff4d4f',
};

// Fallback data for when the screen is opened without route params.
// Replace with data from your API / navigation params.
const DEFAULT_ITEMS: OrderItem[] = [
    {
        id: '1',
        name: 'Surf Excel Easy Wash Detergent Powder',
        size: '1 kg',
        qty: 1,
        price: '₹12',
        image: 'https://cdn-icons-png.flaticon.com/512/2553/2553691.png',
    },
    {
        id: '2',
        name: 'Fortune Arhar Dal (Toor Dal)',
        size: '1 kg',
        qty: 2,
        price: '₹10',
        image: 'https://cdn-icons-png.flaticon.com/512/2553/2553609.png',
    },
    {
        id: '3',
        name: 'Fresh Apples (Fuji)',
        size: '1 kg',
        qty: 1,
        price: '₹4',
        image: 'https://cdn-icons-png.flaticon.com/512/3194/3194591.png',
    },
];

const DEFAULT_ORDER = {
    id: 'ORD-78421',
    date: '12 Oct 2026, 2:30 PM',
    status: 'Delivered',
    deliveryFee: 2.5,
    tax: 1.8,
    addressType: 'Home',
    address: '6391 Elgin St. Celina, Delaware 10299',
};

const toNumber = (price: string) => parseFloat(String(price).replace(/[^0-9.]/g, '')) || 0;
const money = (n: number) => `₹${n.toFixed(2)}`;

const OrderDetailsScreen = ({ route, navigation }: any) => {
    const insets = useSafeAreaInsets();
    const { addProducts } = useCart();
    const order = { ...DEFAULT_ORDER, ...(route?.params?.order || {}) };
    const items: OrderItem[] = order.items?.length ? order.items : DEFAULT_ITEMS;
    const statusColor: string = order.statusColor ?? STATUS_COLORS[order.status] ?? '#55cc70';

    // Bill is always computed from the items, so the lines and the total can never disagree.
    const bill = useMemo(() => {
        const itemTotal = items.reduce((sum, i) => sum + toNumber(i.price) * i.qty, 0);
        const deliveryFee = Number(order.deliveryFee) || 0;
        const tax = Number(order.tax) || 0;
        return { itemTotal, deliveryFee, tax, grandTotal: itemTotal + deliveryFee + tax };
    }, [items, order.deliveryFee, order.tax]);

    const [showRate, setShowRate] = useState(false);
    const [showReorder, setShowReorder] = useState(false);
    const [rated, setRated] = useState<number>(order.rating || 0);

    // Animations
    const headerAnim = useRef(new Animated.Value(0)).current;
    const sectionAnims = useRef([0, 1, 2, 3, 4].map(() => new Animated.Value(0))).current;

    useEffect(() => {
        Animated.timing(headerAnim, {
            toValue: 1,
            duration: 380,
            easing: Easing.out(Easing.cubic),
            useNativeDriver: true,
        }).start();

        Animated.stagger(
            80,
            sectionAnims.map((anim) =>
                Animated.timing(anim, {
                    toValue: 1,
                    duration: 420,
                    delay: 120,
                    easing: Easing.out(Easing.cubic),
                    useNativeDriver: true,
                })
            )
        ).start();
    }, [headerAnim, sectionAnims]);

    const sectionStyle = (index: number) => ({
        opacity: sectionAnims[index],
        transform: [
            {
                translateY: sectionAnims[index].interpolate({
                    inputRange: [0, 1],
                    outputRange: [24, 0],
                }),
            },
        ],
    });

    const handleSubmitRating = (stars: number, _review: string) => {
        // TODO: send to your API
        // await api.rateOrder(order.id, stars, review);
        setRated(stars);
        setShowRate(false);
    };

    const handleReorderConfirm = (selected: OrderItem[]) => {
        addProducts(selected.flatMap((item) =>
            Array.from({ length: item.qty }, () => ({
                id: item.id,
                name: item.name,
                size: item.size,
                price: item.price,
                image: item.image,
            })),
        ));
        navigation.navigate('MainNavigation', { screen: 'Cart' });
    };

    const isDelivered = order.status === 'Delivered';
    const isActive = order.status === 'On the way' || order.status === 'Processing';

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
                                    outputRange: [-16, 0],
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
                <LocalizedText style={styles.headerTitle}>Order Details</LocalizedText>
                <View style={{ width: 40 }} />
            </Animated.View>

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={[
                    styles.scrollContent,
                    { paddingBottom: insets.bottom + 30 },
                ]}
            >
                {/* Status Card */}
                <Animated.View style={[styles.statusCard, sectionStyle(0)]}>
                    <View style={{ flex: 1 }}>
                        <LocalizedText style={styles.orderId}>{order.id}</LocalizedText>
                        <LocalizedText style={styles.orderDate}>{order.date}</LocalizedText>
                    </View>
                    <View style={[styles.statusBadge, { backgroundColor: `${statusColor}1F` }]}>
                        <LocalizedText style={[styles.statusText, { color: statusColor }]}>
                            {order.status}
                        </LocalizedText>
                    </View>
                </Animated.View>

                {/* Items */}
                <Animated.View style={sectionStyle(1)}>
                    <LocalizedText style={styles.sectionTitle}>Items ({items.length})</LocalizedText>
                    <View style={styles.card}>
                        {items.map((item, index) => {
                            const unit = toNumber(item.price);
                            const isLast = index === items.length - 1;
                            return (
                                <View
                                    key={item.id}
                                    style={[styles.itemRow, !isLast && styles.itemDivider]}
                                >
                                    <ProductDetailPressable item={item} style={styles.orderProduct}>
                                        <View style={styles.itemImageWrapper}>
                                            <Image
                                                source={{ uri: item.image }}
                                                style={styles.itemImage}
                                                resizeMode="contain"
                                            />
                                        </View>
                                        <View style={styles.itemInfo}>
                                            <LocalizedText style={styles.itemName} numberOfLines={1}>
                                                {item.name}
                                            </LocalizedText>
                                            <LocalizedText style={styles.itemSize}>
                                                {item.size} • Qty: {item.qty}
                                            </LocalizedText>
                                        </View>
                                        <View style={styles.itemPriceCol}>
                                            <LocalizedText style={styles.itemPrice}>{money(unit * item.qty)}</LocalizedText>
                                            {item.qty > 1 && (
                                                <LocalizedText style={styles.itemEach}>{money(unit)} each</LocalizedText>
                                            )}
                                        </View>
                                    </ProductDetailPressable>
                                </View>
                            );
                        })}
                    </View>
                </Animated.View>

                {/* Bill Summary */}
                <Animated.View style={sectionStyle(2)}>
                    <LocalizedText style={styles.sectionTitle}>Bill Summary</LocalizedText>
                    <View style={[styles.card, styles.billCard]}>
                        <View style={styles.billRow}>
                            <LocalizedText style={styles.billLabel}>Item Total</LocalizedText>
                            <LocalizedText style={styles.billValue}>{money(bill.itemTotal)}</LocalizedText>
                        </View>
                        <View style={styles.billRow}>
                            <LocalizedText style={styles.billLabel}>Delivery Fee</LocalizedText>
                            <LocalizedText style={styles.billValue}>{money(bill.deliveryFee)}</LocalizedText>
                        </View>
                        <View style={styles.billRow}>
                            <LocalizedText style={styles.billLabel}>Tax</LocalizedText>
                            <LocalizedText style={styles.billValue}>{money(bill.tax)}</LocalizedText>
                        </View>
                        <View style={styles.divider} />
                        <View style={[styles.billRow, { marginBottom: 0 }]}>
                            <LocalizedText style={styles.totalLabel}>Grand Total</LocalizedText>
                            <LocalizedText style={styles.totalValue}>{money(bill.grandTotal)}</LocalizedText>
                        </View>
                    </View>
                </Animated.View>

                {/* Delivery Address */}
                <Animated.View style={sectionStyle(3)}>
                    <LocalizedText style={styles.sectionTitle}>Delivery Address</LocalizedText>
                    <View style={styles.addressCard}>
                        <View style={styles.addressIcon}>
                            <Icon name="map-pin" size={18} color="#55cc70" />
                        </View>
                        <View style={{ flex: 1 }}>
                            <LocalizedText style={styles.addressType}>{order.addressType}</LocalizedText>
                            <LocalizedText style={styles.addressText}>{order.address}</LocalizedText>
                        </View>
                    </View>
                </Animated.View>

                {/* Actions */}
                <Animated.View style={sectionStyle(4)}>
                    {isDelivered && (
                        <View style={styles.actionsRow}>
                            {rated > 0 ? (
                                <View style={styles.ratedBtn}>
                                    <Icon name="star" size={16} color="#FFB800" style={{ marginRight: 8 }} />
                                    <LocalizedText style={styles.ratedBtnText}>Rated {rated}/5</LocalizedText>
                                </View>
                            ) : (
                                <TouchableOpacity
                                    style={styles.outlineBtn}
                                    activeOpacity={0.85}
                                    onPress={() => setShowRate(true)}
                                >
                                    <LocalizedText style={styles.outlineBtnText}>Rate Order</LocalizedText>
                                </TouchableOpacity>
                            )}

                            <TouchableOpacity
                                style={styles.primaryBtn}
                                activeOpacity={0.85}
                                onPress={() => setShowReorder(true)}
                            >
                                <LocalizedText style={styles.primaryBtnText}>Reorder</LocalizedText>
                            </TouchableOpacity>
                        </View>
                    )}

                    {isActive && (
                        <TouchableOpacity
                            style={styles.primaryBtnFull}
                            activeOpacity={0.85}
                            onPress={() => navigation.navigate('TrackOrderScreen', { order })}
                        >
                            <Icon name="truck" size={18} color="#ffffff" style={{ marginRight: 8 }} />
                            <LocalizedText style={styles.primaryBtnText}>Track Order</LocalizedText>
                        </TouchableOpacity>
                    )}

                    {/* Help */}
                    <TouchableOpacity
                        style={styles.helpCard}
                        activeOpacity={0.85}
                        onPress={() => navigation.navigate('LiveChatScreen', { orderId: order.id })}
                    >
                        <Icon name="headphones" size={20} color="#55cc70" style={{ marginRight: 12 }} />
                        <View style={{ flex: 1 }}>
                            <LocalizedText style={styles.helpTitle}>Need help with this order?</LocalizedText>
                            <LocalizedText style={styles.helpSubtitle}>Chat with our support team</LocalizedText>
                        </View>
                        <Icon name="chevron-right" size={20} color="#c0c0c0" />
                    </TouchableOpacity>
                </Animated.View>
            </ScrollView>

            <RateOrderSheet
                visible={showRate}
                onClose={() => setShowRate(false)}
                onSubmit={handleSubmitRating}
            />

            <ReorderSheet
                visible={showReorder}
                onClose={() => setShowReorder(false)}
                orderId={order.id}
                items={items}
                onConfirm={handleReorderConfirm}
            />
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
        fontSize: 18,
        fontFamily: 'Poppins-Bold',
        color: '#1a1a1a',
    },
    scrollContent: {
        paddingHorizontal: 16,
        paddingTop: 20,
    },
    sectionTitle: {
        fontSize: 16,
        fontFamily: 'Poppins-Bold',
        color: '#1a1a1a',
        marginBottom: 14,
    },

    // Status
    statusCard: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#ffffff',
        borderRadius: 20,
        padding: 18,
        marginBottom: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.06,
        shadowRadius: 12,
        elevation: 4,
    },
    orderId: {
        fontSize: 16,
        fontFamily: 'Poppins-SemiBold',
        color: '#1a1a1a',
    },
    orderDate: {
        fontSize: 13,
        fontFamily: 'Poppins-Regular',
        color: '#9e9e9e',
        marginTop: 2,
    },
    statusBadge: {
        paddingHorizontal: 14,
        paddingVertical: 6,
        borderRadius: 20,
        marginLeft: 12,
    },
    statusText: {
        fontSize: 13,
        fontFamily: 'Poppins-SemiBold',
    },

    // Cards
    card: {
        backgroundColor: '#ffffff',
        borderRadius: 20,
        marginBottom: 24,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.04,
        shadowRadius: 8,
        elevation: 2,
    },
    itemRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 14,
    },
    orderProduct: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
    },
    itemDivider: {
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: '#f0f0f0',
    },
    itemImageWrapper: {
        width: 50,
        height: 50,
        borderRadius: 14,
        backgroundColor: '#f5f6f8',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 14,
    },
    itemImage: {
        width: 32,
        height: 32,
    },
    itemInfo: {
        flex: 1,
    },
    itemName: {
        fontSize: 14,
        fontFamily: 'Poppins-SemiBold',
        color: '#1a1a1a',
    },
    itemSize: {
        fontSize: 12,
        fontFamily: 'Poppins-Regular',
        color: '#9e9e9e',
        marginTop: 2,
    },
    itemPriceCol: {
        alignItems: 'flex-end',
        marginLeft: 10,
    },
    itemPrice: {
        fontSize: 15,
        fontFamily: 'Poppins-Bold',
        color: '#1a1a1a',
    },
    itemEach: {
        fontSize: 11,
        fontFamily: 'Poppins-Regular',
        color: '#9e9e9e',
        marginTop: 2,
    },

    // Bill
    billCard: {
        padding: 18,
    },
    billRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 12,
    },
    billLabel: {
        fontSize: 14,
        fontFamily: 'Poppins-Regular',
        color: '#7a7a7a',
    },
    billValue: {
        fontSize: 14,
        fontFamily: 'Poppins-Medium',
        color: '#1a1a1a',
    },
    divider: {
        height: StyleSheet.hairlineWidth,
        backgroundColor: '#e8e8e8',
        marginBottom: 12,
    },
    totalLabel: {
        fontSize: 16,
        fontFamily: 'Poppins-Bold',
        color: '#1a1a1a',
    },
    totalValue: {
        fontSize: 18,
        fontFamily: 'Poppins-Bold',
        color: '#55cc70',
    },

    // Address
    addressCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#ffffff',
        borderRadius: 18,
        padding: 16,
        marginBottom: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.04,
        shadowRadius: 8,
        elevation: 2,
    },
    addressIcon: {
        width: 44,
        height: 44,
        borderRadius: 14,
        backgroundColor: 'rgba(85, 204, 112, 0.12)',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 14,
    },
    addressType: {
        fontSize: 14,
        fontFamily: 'Poppins-SemiBold',
        color: '#1a1a1a',
    },
    addressText: {
        fontSize: 13,
        fontFamily: 'Poppins-Regular',
        color: '#7a7a7a',
        marginTop: 2,
        lineHeight: 18,
    },

    // Actions
    actionsRow: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 16,
    },
    outlineBtn: {
        flex: 1,
        height: 54,
        borderRadius: 16,
        borderWidth: 1.5,
        borderColor: '#55cc70',
        justifyContent: 'center',
        alignItems: 'center',
    },
    outlineBtnText: {
        fontSize: 15,
        fontFamily: 'Poppins-SemiBold',
        color: '#55cc70',
    },
    ratedBtn: {
        flex: 1,
        height: 54,
        borderRadius: 16,
        backgroundColor: '#fffbea',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    ratedBtnText: {
        fontSize: 15,
        fontFamily: 'Poppins-SemiBold',
        color: '#b88a00',
    },
    primaryBtn: {
        flex: 1,
        height: 54,
        borderRadius: 16,
        backgroundColor: '#55cc70',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#55cc70',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5,
    },
    primaryBtnFull: {
        height: 54,
        borderRadius: 16,
        backgroundColor: '#55cc70',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
        shadowColor: '#55cc70',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5,
    },
    primaryBtnText: {
        fontSize: 15,
        fontFamily: 'Poppins-Bold',
        color: '#ffffff',
    },

    // Help
    helpCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#ffffff',
        borderRadius: 18,
        padding: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.04,
        shadowRadius: 8,
        elevation: 2,
    },
    helpTitle: {
        fontSize: 14,
        fontFamily: 'Poppins-SemiBold',
        color: '#1a1a1a',
    },
    helpSubtitle: {
        fontSize: 12,
        fontFamily: 'Poppins-Regular',
        color: '#9e9e9e',
        marginTop: 2,
    },
});

export default OrderDetailsScreen;