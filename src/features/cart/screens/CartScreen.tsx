import React, { useState, useRef, useEffect } from 'react';
import LocalizedText from '../../../shared/i18n/LocalizedText';
import { View, StyleSheet, ScrollView, Image, StatusBar, Animated, Platform, Easing, ActivityIndicator, TextInput } from 'react-native';
import TouchableOpacity from '../../../shared/components/AnimatedTouchableOpacity';
import Icon from '@react-native-vector-icons/feather';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ProductDetailPressable } from '../../../shared/components/sharedTransition';
import RazorpayCheckout from 'react-native-razorpay';
import { createPaymentOrder, verifyPayment } from '../services/paymentApi';
import { useCart } from '../context/CartContext';
import { useFeedback } from '../../../shared/components/feedback/FeedbackProvider';

const CART_OFFERS = [
    { code: 'SAVE10', title: 'Get ₹10 off', detail: 'On orders above ₹30' },
    { code: 'FRESH15', title: 'Get 15% off', detail: 'Up to ₹15 off on orders above ₹40' },
];

const CartScreen = ({ navigation }: any) => {
    const insets = useSafeAreaInsets();
    const { items: cartItems, clearCart: clearSharedCart, removeProduct, updateQuantity, itemCount } = useCart();
    const { showDialog } = useFeedback();

    const itemAnims = useRef(
        cartItems.map(() => ({
            opacity: new Animated.Value(0),
            translateY: new Animated.Value(40),
            scale: new Animated.Value(0.92),
        }))
    ).current;

    const bottomBarAnim = useRef(new Animated.Value(0)).current;
    const billAnim = useRef(new Animated.Value(0)).current;
    const emptyAnim = useRef(new Animated.Value(0)).current;
    const [isProcessingPayment, setIsProcessingPayment] = useState(false);
    const [couponInput, setCouponInput] = useState('');
    const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
    const [couponMessage, setCouponMessage] = useState('');

    useEffect(() => {
        const itemAnimations = itemAnims.map((anim, index) =>
            Animated.parallel([
                Animated.timing(anim.opacity, {
                    toValue: 1,
                    duration: 380,
                    delay: index * 80,
                    useNativeDriver: true,
                    easing: Easing.out(Easing.cubic),
                }),
                Animated.timing(anim.translateY, {
                    toValue: 0,
                    duration: 420,
                    delay: index * 80,
                    useNativeDriver: true,
                    easing: Easing.out(Easing.cubic),
                }),
                Animated.spring(anim.scale, {
                    toValue: 1,
                    friction: 7,
                    tension: 60,
                    delay: index * 80,
                    useNativeDriver: true,
                }),
            ])
        );

        Animated.stagger(60, itemAnimations).start();

        Animated.timing(billAnim, {
            toValue: 1,
            duration: 500,
            delay: 300,
            useNativeDriver: true,
            easing: Easing.out(Easing.cubic),
        }).start();

        Animated.spring(bottomBarAnim, {
            toValue: 1,
            friction: 8,
            tension: 50,
            delay: 200,
            useNativeDriver: true,
        }).start();
    }, [billAnim, bottomBarAnim, itemAnims]);

    const isCartEmpty = cartItems.length === 0;
    useEffect(() => {
        if (isCartEmpty) {
            emptyAnim.setValue(0);
            Animated.spring(emptyAnim, {
                toValue: 1,
                friction: 6,
                tension: 50,
                useNativeDriver: true,
            }).start();
        }
    }, [emptyAnim, isCartEmpty]);

    const removeItem = (id: string) => {
        const index = cartItems.findIndex((item) => item.key === id);
        if (index === -1 || !itemAnims[index]) {
            removeProduct(id);
            return;
        }

        Animated.parallel([
            Animated.timing(itemAnims[index].opacity, {
                toValue: 0,
                duration: 280,
                useNativeDriver: true,
            }),
            Animated.timing(itemAnims[index].translateY, {
                toValue: -20,
                duration: 280,
                useNativeDriver: true,
            }),
            Animated.timing(itemAnims[index].scale, {
                toValue: 0.85,
                duration: 280,
                useNativeDriver: true,
            }),
        ]).start(() => {
            removeProduct(id);
        });
    };

    const clearCartItems = () => {
        clearSharedCart();
    };

    const subtotal = cartItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
    );
    const deliveryFee = subtotal > 0 ? 2.5 : 0;
    const freshDiscount = Math.min(
        15,
        Math.floor(Math.round(subtotal * 100) * 15 / 100) / 100,
    );
    const couponDiscount =
        appliedCoupon === 'SAVE10' && subtotal >= 30
            ? 10
            : appliedCoupon === 'FRESH15' && subtotal >= 40
                ? freshDiscount
                : 0;
    const total = Math.max(0, subtotal + deliveryFee - couponDiscount);
    const totalItems = itemCount;

    const applyCoupon = (code: string) => {
        const normalizedCode = code.trim().toUpperCase();
        const offer = CART_OFFERS.find((item) => item.code === normalizedCode);
        if (!offer) {
            setCouponMessage('That coupon code is not valid.');
            setAppliedCoupon(null);
            return;
        }
        const minimumSubtotal = normalizedCode === 'SAVE10' ? 30 : 40;
        if (subtotal < minimumSubtotal) {
            setCouponMessage(`Add items worth ₹${(minimumSubtotal - subtotal).toFixed(2)} more to use ${normalizedCode}.`);
            setAppliedCoupon(null);
            return;
        }
        setAppliedCoupon(normalizedCode);
        setCouponInput(normalizedCode);
        const discount = normalizedCode === 'SAVE10'
            ? 10
            : freshDiscount;
        setCouponMessage(`${normalizedCode} applied. You saved ₹${discount.toFixed(2)}.`);
    };

    const removeCoupon = () => {
        setAppliedCoupon(null);
        setCouponInput('');
        setCouponMessage('Coupon removed.');
    };

    useEffect(() => {
        const minimumSpend = appliedCoupon === 'SAVE10' ? 30 : 40;
        if (appliedCoupon && subtotal < minimumSpend) {
            setAppliedCoupon(null);
            setCouponMessage(`${appliedCoupon} was removed because your cart is below its minimum spend.`);
        }
    }, [appliedCoupon, subtotal]);

    const handleCheckout = async () => {
        if (cartItems.length === 0 || isProcessingPayment) {
            return;
        }

        setIsProcessingPayment(true);
        try {
            const order = await createPaymentOrder(
                cartItems.map((item) => ({
                    productName: item.name,
                    quantity: item.quantity,
                })),
                appliedCoupon && couponDiscount > 0 ? appliedCoupon : undefined,
            );

            let payment: Awaited<ReturnType<typeof RazorpayCheckout.open>>;
            try {
                payment = await RazorpayCheckout.open({
                    key: order.keyId,
                    amount: String(order.amount),
                    currency: order.currency,
                    name: 'Smart Mart',
                    description: `Payment for ${totalItems} cart items`,
                    order_id: order.orderId,
                    theme: { color: '#258e43' },
                });
            } catch (error) {
                const message =
                    error && typeof error === 'object' && 'description' in error &&
                    typeof error.description === 'string'
                        ? error.description
                        : 'The Razorpay checkout was cancelled or could not open.';
                showDialog(
                    'Payment not completed',
                    message,
                );
                return;
            }

            try {
                await verifyPayment({
                    razorpay_order_id: payment.razorpay_order_id,
                    razorpay_payment_id: payment.razorpay_payment_id,
                    razorpay_signature: payment.razorpay_signature,
                });
            } catch {
                showDialog(
                    'Payment verification pending',
                    'Razorpay returned a payment response, but the server could not verify it. Do not retry until this payment has been checked.',
                );
                return;
            }

            clearSharedCart();
            showDialog(
                'Test payment verified',
                'Razorpay verified this test payment. No real money was charged, and this demo does not create a delivery order.',
            );
        } catch (error) {
            showDialog(
                'Unable to start payment',
                error instanceof Error ? error.message : 'Please try again later.',
            );
        } finally {
            setIsProcessingPayment(false);
        }
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

                <LocalizedText style={styles.headerTitle}>My Cart</LocalizedText>

                <View style={styles.headerRight}>
                    {cartItems.length > 0 && (
                        <TouchableOpacity
                            onPress={clearCartItems}
                            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                        >
                            <LocalizedText style={styles.clearText}>Clear</LocalizedText>
                        </TouchableOpacity>
                    )}
                </View>
            </View>

            {isCartEmpty ? (
                <Animated.View
                    style={[
                        styles.emptyContainer,
                        {
                            opacity: emptyAnim,
                            transform: [
                                {
                                    scale: emptyAnim.interpolate({
                                        inputRange: [0, 1],
                                        outputRange: [0.85, 1],
                                    }),
                                },
                            ],
                        },
                    ]}
                >
                    <View style={styles.emptyIconWrapper}>
                        <Icon name="shopping-bag" size={48} color="#55cc70" />
                    </View>
                    <LocalizedText style={styles.emptyTitle}>Your cart is empty</LocalizedText>
                    <LocalizedText style={styles.emptySubtitle}>
                        Looks like you haven’t added anything yet.
                    </LocalizedText>
                    <TouchableOpacity
                        style={styles.shopNowBtn}
                        activeOpacity={0.85}
                        onPress={() => navigation.navigate('MainNavigation', { screen: 'Home' })}
                    >
                        <LocalizedText style={styles.shopNowBtnText}>Start Shopping</LocalizedText>
                    </TouchableOpacity>
                </Animated.View>
            ) : (
                <>
                    <ScrollView
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={[
                            styles.scrollContent,
                            { paddingBottom: 140 + insets.bottom },
                        ]}
                    >
                        {/* Cart Items with staggered animation */}
                        {cartItems.map((item, index) => {
                            const anim = itemAnims[index] || {
                                opacity: new Animated.Value(1),
                                translateY: new Animated.Value(0),
                                scale: new Animated.Value(1),
                            };

                            return (
                                <Animated.View
                                    key={item.key}
                                    style={[
                                        styles.cartItem,
                                        {
                                            opacity: anim.opacity,
                                            transform: [
                                                { translateY: anim.translateY },
                                                { scale: anim.scale },
                                            ],
                                        },
                                    ]}
                                >
                                    <ProductDetailPressable
                                        item={item}
                                        style={styles.cartProduct}
                                    >
                                        <View style={styles.imageWrapper}>
                                            <Image
                                                source={{ uri: item.image }}
                                                style={styles.itemImage}
                                                resizeMode="contain"
                                            />
                                        </View>

                                        <View style={styles.itemInfo}>
                                            <LocalizedText style={styles.itemName} numberOfLines={2}>
                                                {item.name}
                                            </LocalizedText>
                                            <LocalizedText style={styles.itemSize}>{item.size}</LocalizedText>

                                            <View style={styles.priceRow}>
                                                <LocalizedText style={styles.itemPrice}>
                                                    ₹{item.price.toFixed(2)}
                                                </LocalizedText>
                                                {item.originalPrice > item.price && (
                                                    <LocalizedText style={styles.itemOriginalPrice}>
                                                        ₹{item.originalPrice.toFixed(2)}
                                                    </LocalizedText>
                                                )}
                                            </View>
                                        </View>
                                    </ProductDetailPressable>

                                    <View style={styles.rightActions}>
                                        <TouchableOpacity
                                            style={styles.removeBtn}
                                            onPress={() => removeItem(item.key)}
                                            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                                        >
                                            <Icon name="trash-2" size={16} color="#ff4d4f" />
                                        </TouchableOpacity>

                                        <View style={styles.qtyControl}>
                                            <TouchableOpacity
                                                style={styles.qtyBtn}
                                                onPress={() => updateQuantity(item.key, -1)}
                                                activeOpacity={0.7}
                                            >
                                                <Icon name="minus" size={14} color="#1a1a1a" />
                                            </TouchableOpacity>

                                            <LocalizedText style={styles.qtyText}>{item.quantity}</LocalizedText>

                                            <TouchableOpacity
                                                style={[styles.qtyBtn, styles.qtyBtnPlus]}
                                                onPress={() => updateQuantity(item.key, 1)}
                                                activeOpacity={0.7}
                                            >
                                                <Icon name="plus" size={14} color="#ffffff" />
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                </Animated.View>
                            );
                        })}

                        <View style={styles.offerCard}>
                            <View style={styles.offerHeading}>
                                <View style={styles.offerIcon}>
                                    <Icon name="tag" size={17} color="#258e43" />
                                </View>
                                <View style={styles.offerHeadingCopy}>
                                    <LocalizedText style={styles.offerTitle}>Offers & coupons</LocalizedText>
                                    <LocalizedText style={styles.offerSubtitle}>Apply a code to save on this order</LocalizedText>
                                </View>
                            </View>

                            <View style={styles.couponEntryRow}>
                                <TextInput
                                    accessibilityLabel="Coupon code"
                                    autoCapitalize="characters"
                                    autoCorrect={false}
                                    editable={!isProcessingPayment}
                                    onChangeText={(value) => {
                                        setCouponInput(value);
                                        setCouponMessage('');
                                        if (appliedCoupon) setAppliedCoupon(null);
                                    }}
                                    onSubmitEditing={() => applyCoupon(couponInput)}
                                    placeholder="Enter coupon code"
                                    placeholderTextColor="#98a29b"
                                    returnKeyType="done"
                                    style={styles.couponInput}
                                    value={couponInput}
                                />
                                <TouchableOpacity
                                    accessibilityRole="button"
                                    disabled={isProcessingPayment || !couponInput.trim()}
                                    onPress={() => applyCoupon(couponInput)}
                                    style={[styles.applyCouponButton, (!couponInput.trim() || isProcessingPayment) && styles.applyCouponButtonDisabled]}
                                >
                                    <LocalizedText style={styles.applyCouponText}>Apply</LocalizedText>
                                </TouchableOpacity>
                            </View>

                            {couponMessage ? (
                                <View style={styles.couponMessageRow} accessibilityLiveRegion="polite">
                                    <Icon
                                        name={appliedCoupon ? 'check-circle' : 'info'}
                                        size={14}
                                        color={appliedCoupon ? '#258e43' : '#9a6a12'}
                                    />
                                    <LocalizedText style={[styles.couponMessage, appliedCoupon && styles.couponMessageSuccess]}>
                                        {couponMessage}
                                    </LocalizedText>
                                </View>
                            ) : null}

                            <LocalizedText style={styles.availableOffersLabel}>AVAILABLE OFFERS</LocalizedText>
                            {CART_OFFERS.map((offer) => (
                                <View key={offer.code} style={styles.offerRow}>
                                    <View style={styles.offerCodeBadge}>
                                        <LocalizedText style={styles.offerCodeText}>{offer.code}</LocalizedText>
                                    </View>
                                    <View style={styles.offerDetails}>
                                        <LocalizedText style={styles.offerDiscount}>{offer.title}</LocalizedText>
                                        <LocalizedText style={styles.offerTerms}>{offer.detail}</LocalizedText>
                                    </View>
                                    <TouchableOpacity
                                        accessibilityRole="button"
                                        accessibilityLabel={`Apply ${offer.code} offer`}
                                        disabled={isProcessingPayment}
                                        onPress={() => applyCoupon(offer.code)}
                                        style={styles.offerAction}
                                    >
                                        <LocalizedText style={styles.offerActionText}>
                                            {appliedCoupon === offer.code ? 'APPLIED' : 'APPLY'}
                                        </LocalizedText>
                                    </TouchableOpacity>
                                </View>
                            ))}
                        </View>

                        {/* Bill Summary */}
                        <Animated.View
                            style={[
                                styles.billCard,
                                {
                                    opacity: billAnim,
                                    transform: [
                                        {
                                            translateY: billAnim.interpolate({
                                                inputRange: [0, 1],
                                                outputRange: [20, 0],
                                            }),
                                        },
                                        {
                                            scale: billAnim.interpolate({
                                                inputRange: [0, 1],
                                                outputRange: [0.96, 1],
                                            }),
                                        },
                                    ],
                                },
                            ]}
                        >
                            <LocalizedText style={styles.billTitle}>Bill Details</LocalizedText>

                            <View style={styles.billRow}>
                                <LocalizedText style={styles.billLabel}>
                                    Item Total ({totalItems} items)
                                </LocalizedText>
                                <LocalizedText style={styles.billValue}>₹{subtotal.toFixed(2)}</LocalizedText>
                            </View>

                            <View style={styles.billRow}>
                                <LocalizedText style={styles.billLabel}>Delivery Fee</LocalizedText>
                                <LocalizedText style={styles.billValue}>₹{deliveryFee.toFixed(2)}</LocalizedText>
                            </View>

                            {couponDiscount > 0 && (
                                <View style={styles.billRow}>
                                    <LocalizedText style={styles.billLabel}>Coupon ({appliedCoupon})</LocalizedText>
                                    <View style={styles.discountValueRow}>
                                        <LocalizedText style={styles.discountValue}>−₹{couponDiscount.toFixed(2)}</LocalizedText>
                                        <TouchableOpacity
                                            accessibilityRole="button"
                                            accessibilityLabel="Remove applied coupon"
                                            disabled={isProcessingPayment}
                                            onPress={removeCoupon}
                                            style={styles.removeCouponButton}
                                        >
                                            <LocalizedText style={styles.removeCouponText}>Remove</LocalizedText>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            )}

                            <View style={styles.divider} />

                            <View style={styles.billRow}>
                                <LocalizedText style={styles.totalLabel}>To Pay</LocalizedText>
                                <LocalizedText style={styles.totalValue}>₹{total.toFixed(2)}</LocalizedText>
                            </View>
                        </Animated.View>
                    </ScrollView>

                    {/* Sticky Bottom Checkout Bar */}
                    <Animated.View
                        style={[
                            styles.bottomBar,
                            {
                                paddingBottom: Platform.OS === 'ios' ? insets.bottom || 20 : 16,
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
                        <View style={styles.totalInfo}>
                            <LocalizedText style={styles.bottomTotalLabel}>Total</LocalizedText>
                            <LocalizedText style={styles.bottomTotalValue}>₹{total.toFixed(2)}</LocalizedText>
                        </View>

                        <TouchableOpacity
                            style={[styles.checkoutBtn, isProcessingPayment && styles.checkoutBtnDisabled]}
                            activeOpacity={0.85}
                            disabled={isProcessingPayment || isCartEmpty}
                            accessibilityState={{ disabled: isProcessingPayment || isCartEmpty }}
                            onPress={handleCheckout}
                        >
                            {isProcessingPayment ? (
                                <>
                                    <ActivityIndicator color="#ffffff" />
                                    <LocalizedText style={[styles.checkoutBtnText, styles.checkoutLoadingText]}>
                                        Connecting to payment…
                                    </LocalizedText>
                                </>
                            ) : (
                                <>
                                    <LocalizedText style={styles.checkoutBtnText}>Proceed to Checkout</LocalizedText>
                                    <Icon
                                        name="arrow-right"
                                        size={18}
                                        color="#ffffff"
                                        style={{ marginLeft: 8 }}
                                    />
                                </>
                            )}
                        </TouchableOpacity>
                    </Animated.View>
                </>
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
    },
    headerRight: {
        width: 60,
        alignItems: 'flex-end',
    },
    clearText: {
        fontSize: 14,
        fontFamily: 'Poppins-Medium',
        color: '#ff4d4f',
    },
    scrollContent: {
        paddingHorizontal: 16,
        paddingTop: 16,
    },

    // Cart Item
    cartItem: {
        flexDirection: 'row',
        backgroundColor: '#ffffff',
        borderRadius: 16,
        padding: 12,
        marginBottom: 14,
        borderWidth: 1,
        borderColor: '#f0f2f5',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.04,
        shadowRadius: 6,
        elevation: 2,
    },
    cartProduct: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 12,
    },
    imageWrapper: {
        width: 72,
        height: 72,
        backgroundColor: '#f8f8f8',
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    itemImage: {
        width: 48,
        height: 48,
    },
    itemInfo: {
        flex: 1,
        justifyContent: 'center',
    },
    itemName: {
        fontSize: 14,
        fontFamily: 'Poppins-SemiBold',
        color: '#1a1a1a',
        lineHeight: 20,
        marginBottom: 2,
    },
    itemSize: {
        fontSize: 12,
        fontFamily: 'Poppins-Regular',
        color: '#9e9e9e',
        marginBottom: 6,
    },
    priceRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    itemPrice: {
        fontSize: 15,
        fontFamily: 'Poppins-Bold',
        color: '#1a1a1a',
        marginRight: 6,
    },
    itemOriginalPrice: {
        fontSize: 13,
        fontFamily: 'Poppins-Regular',
        color: '#9e9e9e',
        textDecorationLine: 'line-through',
    },
    rightActions: {
        alignItems: 'flex-end',
        justifyContent: 'space-between',
        paddingLeft: 8,
    },
    removeBtn: {
        padding: 4,
    },
    qtyControl: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f5f7f6',
        borderRadius: 20,
        padding: 3,
    },
    qtyBtn: {
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: '#ffffff',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#e8ece9',
    },
    qtyBtnPlus: {
        backgroundColor: '#55cc70',
        borderColor: '#55cc70',
    },
    qtyText: {
        fontSize: 14,
        fontFamily: 'Poppins-SemiBold',
        color: '#1a1a1a',
        marginHorizontal: 10,
        minWidth: 18,
        textAlign: 'center',
    },

    offerCard: {
        backgroundColor: '#ffffff',
        borderColor: '#edf2ee',
        borderRadius: 16,
        borderWidth: 1,
        marginTop: 8,
        marginBottom: 12,
        padding: 15,
    },
    offerHeading: {
        alignItems: 'center',
        flexDirection: 'row',
        marginBottom: 14,
    },
    offerIcon: {
        alignItems: 'center',
        backgroundColor: '#eaf8ed',
        borderRadius: 10,
        height: 36,
        justifyContent: 'center',
        width: 36,
    },
    offerHeadingCopy: {
        flex: 1,
        marginLeft: 10,
    },
    offerTitle: {
        color: '#1a1a1a',
        fontFamily: 'Poppins-SemiBold',
        fontSize: 14,
    },
    offerSubtitle: {
        color: '#7b857e',
        fontFamily: 'Poppins-Regular',
        fontSize: 10,
        marginTop: 1,
    },
    couponEntryRow: {
        alignItems: 'center',
        borderColor: '#dce5de',
        borderRadius: 12,
        borderWidth: 1,
        flexDirection: 'row',
        minHeight: 48,
        paddingLeft: 12,
        paddingRight: 5,
    },
    couponInput: {
        color: '#28372b',
        flex: 1,
        fontFamily: 'Poppins-Medium',
        fontSize: 12,
        paddingVertical: 9,
    },
    applyCouponButton: {
        alignItems: 'center',
        backgroundColor: '#eaf8ed',
        borderRadius: 9,
        justifyContent: 'center',
        minHeight: 36,
        minWidth: 70,
        paddingHorizontal: 10,
    },
    applyCouponButtonDisabled: {
        opacity: 0.5,
    },
    applyCouponText: {
        color: '#258e43',
        fontFamily: 'Poppins-SemiBold',
        fontSize: 11,
    },
    couponMessageRow: {
        alignItems: 'flex-start',
        flexDirection: 'row',
        marginTop: 9,
    },
    couponMessage: {
        color: '#9a6a12',
        flex: 1,
        fontFamily: 'Poppins-Medium',
        fontSize: 10,
        lineHeight: 15,
        marginLeft: 7,
    },
    couponMessageSuccess: {
        color: '#258e43',
    },
    availableOffersLabel: {
        color: '#89938c',
        fontFamily: 'Poppins-SemiBold',
        fontSize: 9,
        letterSpacing: 0.7,
        marginBottom: 4,
        marginTop: 16,
    },
    offerRow: {
        alignItems: 'center',
        borderTopColor: '#f0f3f1',
        borderTopWidth: StyleSheet.hairlineWidth,
        flexDirection: 'row',
        paddingVertical: 11,
    },
    offerCodeBadge: {
        alignItems: 'center',
        borderColor: '#a9d9b4',
        borderRadius: 7,
        borderStyle: 'dashed',
        borderWidth: 1,
        justifyContent: 'center',
        minWidth: 65,
        paddingHorizontal: 7,
        paddingVertical: 6,
    },
    offerCodeText: {
        color: '#258e43',
        fontFamily: 'Poppins-Bold',
        fontSize: 9,
    },
    offerDetails: {
        flex: 1,
        marginHorizontal: 9,
    },
    offerDiscount: {
        color: '#303a32',
        fontFamily: 'Poppins-SemiBold',
        fontSize: 10,
    },
    offerTerms: {
        color: '#858f88',
        fontFamily: 'Poppins-Regular',
        fontSize: 9,
        marginTop: 2,
    },
    offerAction: {
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 36,
        minWidth: 48,
    },
    offerActionText: {
        color: '#258e43',
        fontFamily: 'Poppins-Bold',
        fontSize: 9,
    },

    // Bill Summary
    billCard: {
        backgroundColor: '#f8faf9',
        borderRadius: 16,
        padding: 16,
        marginTop: 8,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: '#edf2ee',
    },
    billTitle: {
        fontSize: 16,
        fontFamily: 'Poppins-Bold',
        color: '#1a1a1a',
        marginBottom: 14,
    },
    billRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    billLabel: {
        fontSize: 14,
        fontFamily: 'Poppins-Regular',
        color: '#666666',
    },
    billValue: {
        fontSize: 14,
        fontFamily: 'Poppins-Medium',
        color: '#1a1a1a',
    },
    discountValueRow: {
        alignItems: 'center',
        flexDirection: 'row',
    },
    discountValue: {
        color: '#258e43',
        fontFamily: 'Poppins-SemiBold',
        fontSize: 14,
    },
    removeCouponButton: {
        marginLeft: 10,
        paddingVertical: 3,
    },
    removeCouponText: {
        color: '#7b857e',
        fontFamily: 'Poppins-Medium',
        fontSize: 9,
        textDecorationLine: 'underline',
    },
    divider: {
        height: 1,
        backgroundColor: '#e8ece9',
        marginVertical: 10,
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

    // Bottom Bar
    bottomBar: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#ffffff',
        paddingHorizontal: 20,
        paddingTop: 14,
        borderTopWidth: 1,
        borderTopColor: '#f0f0f0',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.08,
        shadowRadius: 10,
        elevation: 12,
    },
    totalInfo: {
        marginRight: 16,
    },
    bottomTotalLabel: {
        fontSize: 12,
        fontFamily: 'Poppins-Regular',
        color: '#9e9e9e',
    },
    bottomTotalValue: {
        fontSize: 18,
        fontFamily: 'Poppins-Bold',
        color: '#1a1a1a',
    },
    checkoutBtn: {
        flex: 1,
        height: 52,
        backgroundColor: '#55cc70',
        borderRadius: 16,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#55cc70',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5,
    },
    checkoutBtnText: {
        fontSize: 15,
        fontFamily: 'Poppins-Bold',
        color: '#ffffff',
    },
    checkoutBtnDisabled: {
        opacity: 0.7,
    },
    checkoutLoadingText: {
        marginLeft: 8,
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

export default CartScreen;