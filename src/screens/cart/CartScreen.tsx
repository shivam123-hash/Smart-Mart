import React, { useState, useRef, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Image,
    StatusBar,
    Animated,
    Platform,
    Easing,
} from 'react-native';
import Icon from '@react-native-vector-icons/feather';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ProductDetailPressable } from '../../components/sharedTransition';

const INITIAL_CART = [
    {
        id: '1',
        name: 'Surf Excel Easy Wash Detergent Powder',
        size: '1 kg',
        price: 12,
        originalPrice: 15,
        image: 'https://cdn-icons-png.flaticon.com/512/2553/2553691.png',
        quantity: 1,
    },
    {
        id: '2',
        name: 'Fortune Arhar Dal (Toor Dal)',
        size: '1 kg',
        price: 10,
        originalPrice: 13,
        image: 'https://cdn-icons-png.flaticon.com/512/2553/2553609.png',
        quantity: 2,
    },
    {
        id: '3',
        name: 'Fresh Apples (Fuji)',
        size: '1 kg',
        price: 4,
        originalPrice: 6,
        image: 'https://cdn-icons-png.flaticon.com/512/3194/3194591.png',
        quantity: 1,
    },
    {
        id: '4',
        name: 'Amul Taaza Toned Milk',
        size: '1 L',
        price: 1.8,
        originalPrice: 2.2,
        image: 'https://cdn-icons-png.flaticon.com/512/869/869687.png',
        quantity: 3,
    },
];

const CartScreen = ({ navigation }: any) => {
    const insets = useSafeAreaInsets();
    const [cartItems, setCartItems] = useState(INITIAL_CART);

    const itemAnims = useRef(
        INITIAL_CART.map(() => ({
            opacity: new Animated.Value(0),
            translateY: new Animated.Value(40),
            scale: new Animated.Value(0.92),
        }))
    ).current;

    const bottomBarAnim = useRef(new Animated.Value(0)).current;
    const billAnim = useRef(new Animated.Value(0)).current;
    const emptyAnim = useRef(new Animated.Value(0)).current;

    const [removingIds, setRemovingIds] = useState<string[]>([]);

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
    }, []);

    useEffect(() => {
        if (cartItems.length === 0) {
            emptyAnim.setValue(0);
            Animated.spring(emptyAnim, {
                toValue: 1,
                friction: 6,
                tension: 50,
                useNativeDriver: true,
            }).start();
        }
    }, [cartItems.length === 0]);

    const updateQuantity = (id: string, delta: number) => {
        setCartItems((prev) =>
            prev
                .map((item) =>
                    item.id === id
                        ? { ...item, quantity: Math.max(0, item.quantity + delta) }
                        : item
                )
                .filter((item) => item.quantity > 0)
        );
    };

    const removeItem = (id: string) => {
        const index = cartItems.findIndex((item) => item.id === id);
        if (index === -1) return;

        setRemovingIds((prev) => [...prev, id]);

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
            setCartItems((prev) => prev.filter((item) => item.id !== id));
            setRemovingIds((prev) => prev.filter((rid) => rid !== id));
        });
    };

    const clearCart = () => {
        const animations = itemAnims.map((anim, index) =>
            Animated.parallel([
                Animated.timing(anim.opacity, {
                    toValue: 0,
                    duration: 250,
                    delay: index * 50,
                    useNativeDriver: true,
                }),
                Animated.timing(anim.translateY, {
                    toValue: -15,
                    duration: 250,
                    delay: index * 50,
                    useNativeDriver: true,
                }),
            ])
        );

        Animated.stagger(40, animations).start(() => {
            setCartItems([]);
        });
    };

    const subtotal = cartItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
    );
    const deliveryFee = subtotal > 0 ? 2.5 : 0;
    const total = subtotal + deliveryFee;
    const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

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

                <Text style={styles.headerTitle}>My Cart</Text>

                <View style={styles.headerRight}>
                    {cartItems.length > 0 && (
                        <TouchableOpacity
                            onPress={clearCart}
                            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                        >
                            <Text style={styles.clearText}>Clear</Text>
                        </TouchableOpacity>
                    )}
                </View>
            </View>

            {cartItems.length === 0 ? (
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
                    <Text style={styles.emptyTitle}>Your cart is empty</Text>
                    <Text style={styles.emptySubtitle}>
                        Looks like you haven’t added anything yet.
                    </Text>
                    <TouchableOpacity
                        style={styles.shopNowBtn}
                        activeOpacity={0.85}
                        onPress={() => navigation.navigate('MainNavigation', { screen: 'Home' })}
                    >
                        <Text style={styles.shopNowBtnText}>Start Shopping</Text>
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
                                    key={item.id}
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
                                            <Text style={styles.itemName} numberOfLines={2}>
                                                {item.name}
                                            </Text>
                                            <Text style={styles.itemSize}>{item.size}</Text>

                                            <View style={styles.priceRow}>
                                                <Text style={styles.itemPrice}>
                                                    ${item.price.toFixed(2)}
                                                </Text>
                                                {item.originalPrice > item.price && (
                                                    <Text style={styles.itemOriginalPrice}>
                                                        ${item.originalPrice.toFixed(2)}
                                                    </Text>
                                                )}
                                            </View>
                                        </View>
                                    </ProductDetailPressable>

                                    <View style={styles.rightActions}>
                                        <TouchableOpacity
                                            style={styles.removeBtn}
                                            onPress={() => removeItem(item.id)}
                                            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                                        >
                                            <Icon name="trash-2" size={16} color="#ff4d4f" />
                                        </TouchableOpacity>

                                        <View style={styles.qtyControl}>
                                            <TouchableOpacity
                                                style={styles.qtyBtn}
                                                onPress={() => updateQuantity(item.id, -1)}
                                                activeOpacity={0.7}
                                            >
                                                <Icon name="minus" size={14} color="#1a1a1a" />
                                            </TouchableOpacity>

                                            <Text style={styles.qtyText}>{item.quantity}</Text>

                                            <TouchableOpacity
                                                style={[styles.qtyBtn, styles.qtyBtnPlus]}
                                                onPress={() => updateQuantity(item.id, 1)}
                                                activeOpacity={0.7}
                                            >
                                                <Icon name="plus" size={14} color="#ffffff" />
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                </Animated.View>
                            );
                        })}

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
                            <Text style={styles.billTitle}>Bill Details</Text>

                            <View style={styles.billRow}>
                                <Text style={styles.billLabel}>
                                    Item Total ({totalItems} items)
                                </Text>
                                <Text style={styles.billValue}>${subtotal.toFixed(2)}</Text>
                            </View>

                            <View style={styles.billRow}>
                                <Text style={styles.billLabel}>Delivery Fee</Text>
                                <Text style={styles.billValue}>${deliveryFee.toFixed(2)}</Text>
                            </View>

                            <View style={styles.divider} />

                            <View style={styles.billRow}>
                                <Text style={styles.totalLabel}>To Pay</Text>
                                <Text style={styles.totalValue}>${total.toFixed(2)}</Text>
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
                            <Text style={styles.bottomTotalLabel}>Total</Text>
                            <Text style={styles.bottomTotalValue}>${total.toFixed(2)}</Text>
                        </View>

                        <TouchableOpacity
                            style={styles.checkoutBtn}
                            activeOpacity={0.85}
                            onPress={() => {
                                console.log('Proceed to Checkout');
                            }}
                        >
                            <Text style={styles.checkoutBtnText}>Proceed to Checkout</Text>
                            <Icon
                                name="arrow-right"
                                size={18}
                                color="#ffffff"
                                style={{ marginLeft: 8 }}
                            />
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