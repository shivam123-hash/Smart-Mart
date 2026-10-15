import React, { useState, useRef, useEffect } from 'react';
import LocalizedText from '../../../shared/i18n/LocalizedText';
import { View, StyleSheet, ScrollView, StatusBar, Animated, Easing } from 'react-native';
import TouchableOpacity from '../../../shared/components/AnimatedTouchableOpacity';
import Icon from '@react-native-vector-icons/feather';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import LogoutBottomSheet from '../components/LogoutBottomSheet';

const APP_VERSION = '1.0.0';

// Maps each menu item to its route name. Change names here if your routes differ.
const MENU_ROUTES: Record<string, string> = {
    orders: 'MyOrdersScreen',
    addresses: 'AddressScreen',
    favourites: 'Favorites',
    payments: 'PaymentMethodsScreen',
    notifications: 'NotificationsScreen',
    help: 'HelpScreen',
    settings: 'SettingsScreen',
};

const MENU_ITEMS = [
    {
        id: 'orders',
        title: 'My Orders',
        subtitle: 'Track, return or buy again',
        icon: 'package',
        color: '#55cc70',
    },
    {
        id: 'addresses',
        title: 'Saved Addresses',
        subtitle: 'Manage delivery locations',
        icon: 'map-pin',
        color: '#4A90E2',
    },
    {
        id: 'favourites',
        title: 'Favourites',
        subtitle: 'Your liked products',
        icon: 'heart',
        color: '#FF6B6B',
    },
    {
        id: 'payments',
        title: 'Payment Methods',
        subtitle: 'Cards, UPI & wallets',
        icon: 'credit-card',
        color: '#9B59B6',
    },
    {
        id: 'notifications',
        title: 'Notifications',
        subtitle: 'Offers & order updates',
        icon: 'bell',
        color: '#F39C12',
    },
    {
        id: 'help',
        title: 'Help & Support',
        subtitle: 'FAQs, chat & call us',
        icon: 'help-circle',
        color: '#1ABC9C',
    },
    {
        id: 'settings',
        title: 'Settings',
        subtitle: 'Language, privacy & more',
        icon: 'settings',
        color: '#7F8C8D',
    },
];

const ProfileScreen = ({ navigation }: any) => {
    const insets = useSafeAreaInsets();

    // TODO: replace with real user and cart data from your store / API.
    const user = {
        name: 'John Doe',
        phone: '+1 202 555 0147',
        email: 'john.doe@email.com',
    };
    const cartCount = 2;

    const [showLogout, setShowLogout] = useState(false);
    const [loggingOut, setLoggingOut] = useState(false);

    // Animations
    const headerAnim = useRef(new Animated.Value(0)).current;
    const profileAnim = useRef(new Animated.Value(0)).current;
    const menuAnims = useRef(MENU_ITEMS.map(() => new Animated.Value(0))).current;
    const logoutAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.stagger(70, [
            Animated.timing(headerAnim, {
                toValue: 1,
                duration: 400,
                easing: Easing.out(Easing.cubic),
                useNativeDriver: true,
            }),
            Animated.spring(profileAnim, {
                toValue: 1,
                friction: 7,
                tension: 50,
                useNativeDriver: true,
            }),
        ]).start();

        const menuAnimations = menuAnims.map((anim, index) =>
            Animated.timing(anim, {
                toValue: 1,
                duration: 380,
                delay: 200 + index * 60,
                easing: Easing.out(Easing.cubic),
                useNativeDriver: true,
            })
        );
        Animated.stagger(40, menuAnimations).start();

        Animated.timing(logoutAnim, {
            toValue: 1,
            duration: 400,
            delay: 550,
            useNativeDriver: true,
        }).start();
    }, []);

    const handleMenuPress = (id: string) => {
        const route = MENU_ROUTES[id];
        if (!route) return;

        const tabRoutes = ['Home', 'Favorites', 'Cart', 'Profile'];
        if (tabRoutes.includes(route)) {
            navigation.navigate('MainNavigation', { screen: route });
            return;
        }

        navigation.navigate(route);
    };

    const handleLogout = async () => {
        setLoggingOut(true);
        try {
            // TODO: call your logout API, then clear tokens, cart and user state
            // (AsyncStorage / MMKV / Redux / Zustand) and remove the push token.
            setShowLogout(false);
            navigation.reset({ index: 0, routes: [{ name: 'LoginScreen' }] });
        } catch (e) {
            // TODO: show an error toast
        } finally {
            setLoggingOut(false);
        }
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
                <LocalizedText style={styles.headerTitle}>My Profile</LocalizedText>
                <TouchableOpacity
                    style={styles.cartIconWrapper}
                    activeOpacity={0.85}
                    onPress={() => navigation.navigate('MainNavigation', { screen: 'Cart' })}
                >
                    <View style={styles.cartButton}>
                        <Icon name="shopping-bag" size={20} color="#1a1a1a" />
                        {cartCount > 0 && (
                            <View style={styles.cartBadge}>
                                <LocalizedText style={styles.cartBadgeText}>
                                    {cartCount > 99 ? '99+' : cartCount}
                                </LocalizedText>
                            </View>
                        )}
                    </View>
                </TouchableOpacity>
            </Animated.View>

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={[
                    styles.scrollContent,
                    { paddingBottom: insets.bottom + 30 },
                ]}
            >
                {/* Profile Card */}
                <Animated.View
                    style={[
                        styles.profileCard,
                        {
                            opacity: profileAnim,
                            transform: [
                                {
                                    translateY: profileAnim.interpolate({
                                        inputRange: [0, 1],
                                        outputRange: [24, 0],
                                    }),
                                },
                                {
                                    scale: profileAnim.interpolate({
                                        inputRange: [0, 1],
                                        outputRange: [0.96, 1],
                                    }),
                                },
                            ],
                        },
                    ]}
                >
                    <View style={styles.avatarWrapper}>
                        <View style={styles.avatar}>
                            <Icon name="user" size={36} color="#55cc70" />
                        </View>
                        <TouchableOpacity
                            style={styles.editAvatarBtn}
                            activeOpacity={0.8}
                            onPress={() => navigation.navigate('EditProfileScreen')}
                        >
                            <Icon name="camera" size={14} color="#ffffff" />
                        </TouchableOpacity>
                    </View>

                    <LocalizedText style={styles.userName}>{user.name}</LocalizedText>
                    <LocalizedText style={styles.userPhone}>{user.phone}</LocalizedText>
                    <LocalizedText style={styles.userEmail}>{user.email}</LocalizedText>

                    <TouchableOpacity
                        style={styles.editProfileBtn}
                        activeOpacity={0.85}
                        onPress={() => navigation.navigate('EditProfileScreen')}
                    >
                        <Icon name="edit-2" size={15} color="#55cc70" style={{ marginRight: 8 }} />
                        <LocalizedText style={styles.editProfileText}>Edit Profile</LocalizedText>
                    </TouchableOpacity>

                    <TouchableOpacity
                        accessibilityRole="button"
                        onPress={() =>
                            navigation.getParent().reset({
                                index: 0,
                                routes: [{ name: 'DeliveryNavigation' }],
                            })
                        }
                        activeOpacity={0.85}
                        style={styles.switchRoleButton}
                    >
                        <View style={styles.switchRoleIcon}>
                            <Icon name="truck" size={17} color="#258e43" />
                        </View>
                        <View style={styles.switchRoleCopy}>
                            <LocalizedText style={styles.switchRoleTitle}>Switch to delivery</LocalizedText>
                            <LocalizedText style={styles.switchRoleSubtitle}>
                                Open your delivery partner space
                            </LocalizedText>
                        </View>
                        <Icon name="arrow-right" size={17} color="#258e43" />
                    </TouchableOpacity>
                </Animated.View>

                {/* Menu Items */}
                <View style={styles.menuSection}>
                    {MENU_ITEMS.map((item, index) => {
                        const anim = menuAnims[index];
                        return (
                            <Animated.View
                                key={item.id}
                                style={{
                                    opacity: anim,
                                    transform: [
                                        {
                                            translateY: anim.interpolate({
                                                inputRange: [0, 1],
                                                outputRange: [20, 0],
                                            }),
                                        },
                                    ],
                                }}
                            >
                                <TouchableOpacity
                                    style={styles.menuItem}
                                    activeOpacity={0.75}
                                    onPress={() => handleMenuPress(item.id)}
                                >
                                    <View
                                        style={[
                                            styles.menuIconWrapper,
                                            { backgroundColor: `${item.color}15` },
                                        ]}
                                    >
                                        <Icon name={item.icon as any} size={20} color={item.color} />
                                    </View>

                                    <View style={styles.menuTextWrapper}>
                                        <LocalizedText style={styles.menuTitle}>{item.title}</LocalizedText>
                                        <LocalizedText style={styles.menuSubtitle}>{item.subtitle}</LocalizedText>
                                    </View>

                                    <Icon name="chevron-right" size={20} color="#c0c0c0" />
                                </TouchableOpacity>
                            </Animated.View>
                        );
                    })}
                </View>

                {/* Logout */}
                <Animated.View
                    style={{
                        opacity: logoutAnim,
                        transform: [
                            {
                                translateY: logoutAnim.interpolate({
                                    inputRange: [0, 1],
                                    outputRange: [16, 0],
                                }),
                            },
                        ],
                    }}
                >
                    <TouchableOpacity
                        style={styles.logoutBtn}
                        activeOpacity={0.85}
                        onPress={() => setShowLogout(true)}
                    >
                        <Icon name="log-out" size={18} color="#ff4d4f" style={{ marginRight: 10 }} />
                        <LocalizedText style={styles.logoutText}>Logout</LocalizedText>
                    </TouchableOpacity>
                </Animated.View>

                <LocalizedText style={styles.versionText}>App Version {APP_VERSION}</LocalizedText>
            </ScrollView>

            {/* Logout confirmation */}
            <LogoutBottomSheet
                visible={showLogout}
                onClose={() => setShowLogout(false)}
                onConfirm={handleLogout}
                loading={loggingOut}
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
        paddingHorizontal: 20,
        paddingVertical: 14,
        backgroundColor: '#ffffff',
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: '#f0f0f0',
    },
    headerTitle: {
        fontSize: 20,
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
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
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
        paddingHorizontal: 16,
        paddingTop: 20,
    },

    // Profile Card
    profileCard: {
        backgroundColor: '#ffffff',
        borderRadius: 24,
        paddingVertical: 28,
        paddingHorizontal: 20,
        alignItems: 'center',
        marginBottom: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.06,
        shadowRadius: 12,
        elevation: 4,
    },
    avatarWrapper: {
        position: 'relative',
        marginBottom: 16,
    },
    avatar: {
        width: 90,
        height: 90,
        borderRadius: 45,
        backgroundColor: 'rgba(85, 204, 112, 0.12)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    editAvatarBtn: {
        position: 'absolute',
        bottom: 2,
        right: 2,
        width: 30,
        height: 30,
        borderRadius: 15,
        backgroundColor: '#55cc70',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2.5,
        borderColor: '#ffffff',
    },
    userName: {
        fontSize: 22,
        fontFamily: 'Poppins-Bold',
        color: '#1a1a1a',
        marginBottom: 4,
    },
    userPhone: {
        fontSize: 14,
        fontFamily: 'Poppins-Medium',
        color: '#7a7a7a',
        marginBottom: 2,
    },
    userEmail: {
        fontSize: 13,
        fontFamily: 'Poppins-Regular',
        color: '#9e9e9e',
        marginBottom: 18,
    },
    editProfileBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 12,
        backgroundColor: 'rgba(85, 204, 112, 0.1)',
    },
    editProfileText: {
        fontSize: 14,
        fontFamily: 'Poppins-SemiBold',
        color: '#55cc70',
    },
    switchRoleButton: {
        alignItems: 'center',
        alignSelf: 'stretch',
        backgroundColor: '#f1faf3',
        borderColor: '#d9efde',
        borderRadius: 14,
        borderWidth: 1,
        flexDirection: 'row',
        marginTop: 16,
        paddingHorizontal: 12,
        paddingVertical: 10,
    },
    switchRoleIcon: {
        alignItems: 'center',
        backgroundColor: '#ffffff',
        borderRadius: 11,
        height: 38,
        justifyContent: 'center',
        marginRight: 10,
        width: 38,
    },
    switchRoleCopy: {
        flex: 1,
        alignItems: 'flex-start',
    },
    switchRoleTitle: {
        color: '#258e43',
        fontFamily: 'Poppins-SemiBold',
        fontSize: 12,
    },
    switchRoleSubtitle: {
        color: '#7a8d7e',
        fontFamily: 'Poppins-Regular',
        fontSize: 9,
        marginTop: 1,
    },

    // Menu
    menuSection: {
        backgroundColor: '#ffffff',
        borderRadius: 20,
        paddingVertical: 8,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.04,
        shadowRadius: 8,
        elevation: 2,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 14,
    },
    menuIconWrapper: {
        width: 44,
        height: 44,
        borderRadius: 14,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 14,
    },
    menuTextWrapper: {
        flex: 1,
    },
    menuTitle: {
        fontSize: 15,
        fontFamily: 'Poppins-SemiBold',
        color: '#1a1a1a',
        marginBottom: 2,
    },
    menuSubtitle: {
        fontSize: 12,
        fontFamily: 'Poppins-Regular',
        color: '#9e9e9e',
    },

    // Logout
    logoutBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#ffffff',
        borderRadius: 16,
        paddingVertical: 16,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: '#ffe0e0',
    },
    logoutText: {
        fontSize: 15,
        fontFamily: 'Poppins-SemiBold',
        color: '#ff4d4f',
    },
    versionText: {
        textAlign: 'center',
        fontSize: 12,
        fontFamily: 'Poppins-Regular',
        color: '#b0b0b0',
        marginBottom: 10,
    },
});

export default ProfileScreen;