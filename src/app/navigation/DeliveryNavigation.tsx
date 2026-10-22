import React, { useEffect, useRef, useState } from 'react';
import LocalizedText from '../../shared/i18n/LocalizedText';
import { Animated, Easing, ScrollView, StatusBar, StyleSheet, View } from 'react-native';
import TouchableOpacity from '../../shared/components/AnimatedTouchableOpacity';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from '@react-native-vector-icons/feather';
import AnimatedTabIcon from './AnimatedTabIcon';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import LogoutBottomSheet from '../../features/account/components/LogoutBottomSheet';

const Tab = createBottomTabNavigator();

const ACTIVE_DELIVERY = {
  orderId: 'SM-2048',
  customer: 'Emma Wilson',
  pickup: 'Whole Foods Market, 1440 P St NW, Washington, DC 20005',
  dropoff: 'The White House, 1600 Pennsylvania Avenue NW, Washington, DC 20500',
  distance: '2.4 km',
  eta: '12 min',
  earning: '₹8.50',
};

type DeliveryStatus = 'Active' | 'Completed';
type DeliveryFilter = 'All' | DeliveryStatus;

type DeliveryOrder = typeof ACTIVE_DELIVERY & {
  status: DeliveryStatus;
  time: string;
};

const DELIVERY_ORDERS: DeliveryOrder[] = [
  { ...ACTIVE_DELIVERY, status: 'Active', time: 'In progress' },
  {
    orderId: 'SM-2041',
    customer: 'Oliver Smith',
    pickup: 'Smart Mart Market',
    dropoff: '72 Pine Street, Brookside',
    distance: '3.1 km',
    eta: 'Delivered',
    earning: '₹12.00',
    status: 'Completed',
    time: '10:24 AM',
  },
  {
    orderId: 'SM-2036',
    customer: 'Sophia Johnson',
    pickup: 'Smart Mart Market',
    dropoff: '5 Lakeview Road, Brookside',
    distance: '4.6 km',
    eta: 'Delivered',
    earning: '₹22.00',
    status: 'Completed',
    time: '9:15 AM',
  },
];

const DashboardTabIcon = ({ color, size, focused }: { color: string; size: number; focused: boolean }) => (
  <AnimatedTabIcon name="home" size={size} color={color} focused={focused} />
);

const DeliveriesTabIcon = ({ color, size, focused }: { color: string; size: number; focused: boolean }) => (
  <AnimatedTabIcon name="package" size={size} color={color} focused={focused} />
);

const ProfileTabIcon = ({ color, size, focused }: { color: string; size: number; focused: boolean }) => (
  <AnimatedTabIcon name="user" size={size} color={color} focused={focused} />
);

const DeliveryDashboard = ({ navigation }: { navigation: any }) => {
  const insets = useSafeAreaInsets();
  const [isOnline, setIsOnline] = useState(false);
  const headerAnim = useRef(new Animated.Value(0)).current;
  const statusAnim = useRef(new Animated.Value(0)).current;
  const statsAnim = useRef(new Animated.Value(0)).current;
  const activityAnim = useRef(new Animated.Value(0)).current;
  const onlinePulse = useRef(new Animated.Value(1)).current;
  const heroFloat = useRef(new Animated.Value(0)).current;
  const activityPulse = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const entrance = Animated.stagger(100, [
      Animated.parallel([
        Animated.timing(headerAnim, {
          toValue: 1,
          duration: 560,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]),
      Animated.spring(statusAnim, {
        toValue: 1,
        friction: 8,
        tension: 55,
        useNativeDriver: true,
      }),
      Animated.timing(statsAnim, {
        toValue: 1,
        duration: 480,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(activityAnim, {
        toValue: 1,
        duration: 480,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]);

    entrance.start();
    return () => entrance.stop();
  }, [activityAnim, headerAnim, statsAnim, statusAnim]);

  useEffect(() => {
    const float = Animated.loop(
      Animated.sequence([
        Animated.timing(heroFloat, {
          toValue: 1,
          duration: 1500,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(heroFloat, {
          toValue: 0,
          duration: 1500,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ]),
    );
    float.start();
    return () => float.stop();
  }, [heroFloat]);

  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(activityPulse, {
          toValue: 1.35,
          duration: 900,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(activityPulse, {
          toValue: 1,
          duration: 900,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ]),
    );
    pulse.start();
    return () => pulse.stop();
  }, [activityPulse]);

  useEffect(() => {
    if (!isOnline) {
      onlinePulse.setValue(1);
      return;
    }

    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(onlinePulse, {
          toValue: 1.08,
          duration: 850,
          useNativeDriver: true,
        }),
        Animated.timing(onlinePulse, {
          toValue: 1,
          duration: 850,
          useNativeDriver: true,
        }),
      ]),
    );
    pulse.start();

    return () => pulse.stop();
  }, [isOnline, onlinePulse]);

  return (
    <View style={styles.safeArea}>
      <StatusBar barStyle="light-content" />
      <ScrollView
        contentContainerStyle={styles.dashboardContent}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View
          style={[
            styles.dashboardHeader,
            { paddingTop: insets.top + 20 },
            {
              opacity: headerAnim,
              transform: [
                {
                  translateY: headerAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [-36, 0],
                  }),
                },
              ],
            },
          ]}
        >
          <View style={styles.headerDecorationLarge} />
          <View style={styles.headerDecorationSmall} />
          <View style={styles.headerTopRow}>
            <View>
              <LocalizedText style={styles.headerEyebrow}>SMART MART • DELIVERY</LocalizedText>
              <LocalizedText style={styles.headerTitle}>Your delivery hub</LocalizedText>
            </View>
            <Animated.View
              style={[
                styles.heroIllustration,
                {
                  transform: [
                    {
                      translateY: heroFloat.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0, -7],
                      }),
                    },
                  ],
                },
              ]}
            >
              <View style={styles.heroOrbit} />
              <View style={styles.heroRoute}>
                <View style={styles.routeDot} />
                <View style={styles.routeDash} />
                <View style={styles.routeDash} />
                <View style={styles.routeDotEnd}>
                  <Icon name="map-pin" size={11} color="#ffffff" />
                </View>
              </View>
              <View style={styles.heroAvatar}>
                <Icon name="truck" size={30} color="#239846" />
              </View>
              <View style={styles.heroSparkle}>
                <Icon name="star" size={12} color="#f3bc4d" />
              </View>
            </Animated.View>
          </View>
          <LocalizedText style={styles.headerSubtitle}>
            Ready when you are. Let’s make today count.
          </LocalizedText>
          <View style={styles.headerFooter}>
            <View style={styles.todayBadge}>
              <Icon name="sun" size={14} color="#ffffff" />
              <LocalizedText style={styles.todayBadgeText}>YOUR SHIFT</LocalizedText>
            </View>
            <LocalizedText style={styles.shiftTime}>Have a great day!</LocalizedText>
          </View>
        </Animated.View>

        <Animated.View
          style={[
            styles.statusCard,
            {
              opacity: statusAnim,
              transform: [
                {
                  translateY: statusAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [28, 0],
                  }),
                },
                {
                  scale: statusAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.96, 1],
                  }),
                },
              ],
            },
          ]}
        >
          <Animated.View
            style={[
              styles.statusIconWrap,
              isOnline && styles.statusIconOnline,
              { transform: [{ scale: onlinePulse }] },
            ]}
          >
            {isOnline && <View style={styles.statusOnlineDot} />}
            <Icon
              name={isOnline ? 'radio' : 'power'}
              size={21}
              color={isOnline ? '#ffffff' : '#818b83'}
            />
          </Animated.View>
          <View style={styles.statusCopy}>
            <LocalizedText style={styles.cardTitle}>
              {isOnline ? 'You’re online' : 'You’re offline'}
            </LocalizedText>
            <LocalizedText style={styles.cardSubtitle}>
              {isOnline
                ? 'You can receive delivery requests.'
                : 'Go online when you’re ready to work.'}
            </LocalizedText>
          </View>
          <TouchableOpacity
            accessibilityRole="switch"
            accessibilityState={{ checked: isOnline }}
            onPress={() => setIsOnline((online) => !online)}
            style={[
              styles.statusButton,
              isOnline && styles.onlineButton,
              !isOnline && styles.statusButtonReady,
            ]}
            activeOpacity={0.8}
          >
            {!isOnline && <View style={styles.buttonStatusDot} />}
            <LocalizedText
              style={[
                styles.statusButtonText,
                isOnline ? styles.onlineButtonText : styles.readyButtonText,
              ]}
            >
              {isOnline ? 'Go offline' : 'Go online'}
            </LocalizedText>
          </TouchableOpacity>
        </Animated.View>

        <Animated.View
          style={{
            opacity: statsAnim,
            transform: [
              {
                translateY: statsAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [24, 0],
                }),
              },
            ],
          }}
        >
          <View style={styles.sectionHeadingRow}>
            <View>
              <LocalizedText style={styles.sectionTitle}>Today at a glance</LocalizedText>
              <LocalizedText style={styles.sectionHint}>Your delivery activity</LocalizedText>
            </View>
            <View style={styles.dateBadge}>
              <Icon name="calendar" size={13} color="#258e43" />
              <LocalizedText style={styles.dateBadgeText}>Today</LocalizedText>
            </View>
          </View>

          <View style={styles.statsRow}>
            <View style={[styles.statCard, styles.deliveryStatCard]}>
              <View style={[styles.statIcon, styles.deliveryStatIcon]}>
                <Icon name="package" size={19} color="#2fa64c" />
              </View>
              <LocalizedText style={styles.statValue}>3</LocalizedText>
              <LocalizedText style={styles.statLabel}>Deliveries</LocalizedText>
              <LocalizedText style={styles.statFootnote}>today</LocalizedText>
            </View>
            <View style={[styles.statCard, styles.earningsStatCard]}>
              <View style={[styles.statIcon, styles.earningsStatIcon]}>
                <Icon name="dollar-sign" size={19} color="#dc9b23" />
              </View>
              <LocalizedText style={styles.statValue}>₹42.50</LocalizedText>
              <LocalizedText style={styles.statLabel}>Earnings</LocalizedText>
              <LocalizedText style={styles.statFootnote}>earned today</LocalizedText>
            </View>
          </View>
        </Animated.View>

        <Animated.View
          style={{
            opacity: activityAnim,
            transform: [
              {
                translateY: activityAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [24, 0],
                }),
              },
            ],
          }}
        >
          <View style={styles.sectionHeadingRow}>
            <View>
              <LocalizedText style={styles.sectionTitle}>Active delivery</LocalizedText>
              <LocalizedText style={styles.sectionHint}>Order assigned to your route</LocalizedText>
            </View>
            <View style={styles.nextDeliveryBadge}>
              <Animated.View
                style={[
                  styles.orderStatusDot,
                  { transform: [{ scale: activityPulse }] },
                ]}
              />
              <LocalizedText style={styles.nextDeliveryBadgeText}>IN PROGRESS</LocalizedText>
            </View>
          </View>
          <View style={styles.deliveryCard}>
            <View style={styles.deliveryCardTop}>
              <View style={styles.orderIcon}>
                <Icon name="package" size={21} color="#258e43" />
              </View>
              <View style={styles.orderDetails}>
                <LocalizedText style={styles.orderId}>Order #{ACTIVE_DELIVERY.orderId}</LocalizedText>
                <LocalizedText style={styles.orderCustomer}>{ACTIVE_DELIVERY.customer}</LocalizedText>
              </View>
              <View style={styles.earningBadge}>
                <LocalizedText style={styles.earningAmount}>{ACTIVE_DELIVERY.earning}</LocalizedText>
                <LocalizedText style={styles.earningCaption}>EARNING</LocalizedText>
              </View>
            </View>

            <View style={styles.routeDivider} />
            <View style={styles.routeRow}>
              <View style={styles.routeTimeline}>
                <View style={styles.pickupDot} />
                <View style={styles.routeLine} />
                <View style={styles.dropoffDot}>
                  <Icon name="map-pin" size={9} color="#ffffff" />
                </View>
              </View>
              <View style={styles.routeLocations}>
                <View style={styles.routeLocation}>
                  <LocalizedText style={styles.routeLabel}>PICK UP</LocalizedText>
                  <LocalizedText style={styles.routeAddress}>{ACTIVE_DELIVERY.pickup}</LocalizedText>
                </View>
                <View style={styles.routeLocation}>
                  <LocalizedText style={styles.routeLabel}>DROP OFF</LocalizedText>
                  <LocalizedText style={styles.routeAddress}>{ACTIVE_DELIVERY.dropoff}</LocalizedText>
                </View>
              </View>
            </View>

            <View style={styles.deliveryCardFooter}>
              <View style={styles.deliveryMeta}>
                <Icon name="navigation" size={14} color="#258e43" />
                <LocalizedText style={styles.deliveryMetaText}>{ACTIVE_DELIVERY.distance}</LocalizedText>
              </View>
              <View style={styles.metaDivider} />
              <View style={styles.deliveryMeta}>
                <Icon name="clock" size={14} color="#258e43" />
                <LocalizedText style={styles.deliveryMetaText}>{ACTIVE_DELIVERY.eta} away</LocalizedText>
              </View>
              <TouchableOpacity
                accessibilityRole="button"
                onPress={() =>
                  navigation.navigate('DeliveryOrderDetailsScreen', {
                    order: { ...ACTIVE_DELIVERY, status: 'Active', time: 'In progress' },
                  })
                }
                style={styles.orderDetailsButton}
              >
                <LocalizedText style={styles.orderDetailsText}>View details</LocalizedText>
                <Icon name="arrow-right" size={12} color="#258e43" />
              </TouchableOpacity>
            </View>
          </View>
        </Animated.View>
      </ScrollView>
    </View>
  );
};

const DeliveryOrderCard = ({
  order,
  index,
  onPress,
}: {
  order: DeliveryOrder;
  index: number;
  onPress: () => void;
}) => {
  const entrance = useRef(new Animated.Value(0)).current;
  const pressScale = useRef(new Animated.Value(1)).current;
  const isActive = order.status === 'Active';

  useEffect(() => {
    const animation = Animated.spring(entrance, {
      toValue: 1,
      delay: index * 90,
      friction: 8,
      tension: 55,
      useNativeDriver: true,
    });
    animation.start();
    return () => animation.stop();
  }, [entrance, index]);

  return (
    <Animated.View
      style={[
        {
          opacity: entrance,
          transform: [
            {
              translateY: entrance.interpolate({
                inputRange: [0, 1],
                outputRange: [20, 0],
              }),
            },
          ],
        },
      ]}
    >
      <TouchableOpacity
        accessibilityRole="button"
        accessibilityLabel={`View order ${order.orderId}`}
        onPress={onPress}
        onPressIn={() =>
          Animated.spring(pressScale, {
            toValue: 0.985,
            useNativeDriver: true,
          }).start()
        }
        onPressOut={() =>
          Animated.spring(pressScale, {
            toValue: 1,
            friction: 5,
            tension: 80,
            useNativeDriver: true,
          }).start()
        }
        activeOpacity={0.82}
        style={[styles.listOrderCard, { transform: [{ scale: pressScale }] }]}
      >
      <View style={styles.listCardHeader}>
        <View style={styles.listOrderIcon}>
          <Icon name="package" size={18} color="#258e43" />
        </View>
        <View style={styles.listOrderIdentity}>
          <LocalizedText style={styles.listOrderId}>Order #{order.orderId}</LocalizedText>
          <LocalizedText style={styles.listCustomer}>{order.customer}</LocalizedText>
        </View>
        <View
          style={[
            styles.listStatusBadge,
            isActive ? styles.activeStatusBadge : styles.completedStatusBadge,
          ]}
        >
          <View
            style={[
              styles.listStatusDot,
              isActive ? styles.activeStatusDot : styles.completedStatusDot,
            ]}
          />
          <LocalizedText
            style={[
              styles.listStatusText,
              isActive ? styles.activeStatusText : styles.completedStatusText,
            ]}
          >
            {order.status}
          </LocalizedText>
        </View>
      </View>

      <View style={styles.listRoute}>
        <View style={styles.listRouteMarkerColumn}>
          <View style={styles.listPickupMarker} />
          <View style={styles.listRouteLine} />
          <Icon name="map-pin" size={15} color="#e5a72f" />
        </View>
        <View style={styles.listRouteCopy}>
          <View style={styles.listRouteStop}>
            <LocalizedText style={styles.listRouteLabel}>PICK UP</LocalizedText>
            <LocalizedText style={styles.listRouteAddress}>{order.pickup}</LocalizedText>
          </View>
          <View style={styles.listRouteStop}>
            <LocalizedText style={styles.listRouteLabel}>DROP OFF</LocalizedText>
            <LocalizedText style={styles.listRouteAddress}>{order.dropoff}</LocalizedText>
          </View>
        </View>
      </View>

      <View style={styles.listCardFooter}>
        <View style={styles.listMetaGroup}>
          <View style={styles.deliveryMeta}>
            <Icon name="navigation" size={13} color="#7a857c" />
            <LocalizedText style={styles.listMetaText}>{order.distance}</LocalizedText>
          </View>
          <View style={styles.listMetaDivider} />
          <View style={styles.deliveryMeta}>
            <Icon name={isActive ? 'clock' : 'check-circle'} size={13} color="#7a857c" />
            <LocalizedText style={styles.listMetaText}>{order.time}</LocalizedText>
          </View>
        </View>
        <LocalizedText style={styles.listEarning}>{order.earning}</LocalizedText>
      </View>
      <View style={styles.listCardAction}>
        <LocalizedText style={styles.listViewDetails}>View details</LocalizedText>
        <Icon name="arrow-right" size={12} color="#258e43" />
      </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const DeliveriesScreen = ({ navigation }: { navigation: any }) => {
  const [filter, setFilter] = useState<DeliveryFilter>('All');
  const visibleDeliveries =
    filter === 'All'
      ? DELIVERY_ORDERS
      : DELIVERY_ORDERS.filter((order) => order.status === filter);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <StatusBar barStyle="dark-content" />
      <ScrollView
        contentContainerStyle={styles.deliveriesContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.deliveriesHeader}>
          <LocalizedText style={styles.eyebrow}>YOUR WORK</LocalizedText>
          <LocalizedText style={styles.heading}>Deliveries</LocalizedText>
          <LocalizedText style={styles.deliveriesSubtitle}>
            Keep track of your current and completed orders.
          </LocalizedText>
        </View>

        <View style={styles.deliveriesSummary}>
          <View style={styles.summaryIcon}>
            <Icon name="layers" size={19} color="#258e43" />
          </View>
          <View style={styles.summaryCopy}>
            <LocalizedText style={styles.summaryTitle}>3 deliveries today</LocalizedText>
            <LocalizedText style={styles.summaryCaption}>2 completed · 1 in progress</LocalizedText>
          </View>
          <LocalizedText style={styles.summaryEarnings}>₹42.50</LocalizedText>
        </View>

        <View style={styles.filterRow}>
          {(['All', 'Active', 'Completed'] as const).map((option) => {
            const isSelected = filter === option;
            const count =
              option === 'All'
                ? DELIVERY_ORDERS.length
                : DELIVERY_ORDERS.filter((order) => order.status === option).length;

            return (
              <TouchableOpacity
                key={option}
                accessibilityRole="button"
                accessibilityState={{ selected: isSelected }}
                onPress={() => setFilter(option)}
                activeOpacity={0.8}
                style={[styles.filterChip, isSelected && styles.filterChipSelected]}
              >
                <LocalizedText style={[styles.filterText, isSelected && styles.filterTextSelected]}>
                  {option}
                </LocalizedText>
                <View style={[styles.filterCount, isSelected && styles.filterCountSelected]}>
                  <LocalizedText
                    style={[
                      styles.filterCountText,
                      isSelected && styles.filterCountTextSelected,
                    ]}
                  >
                    {count}
                  </LocalizedText>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={styles.deliveryListHeading}>
          <LocalizedText style={styles.listSectionTitle}>
            {filter === 'All' ? 'Today’s orders' : `${filter} orders`}
          </LocalizedText>
        </View>

        {visibleDeliveries.map((order, index) => (
          <DeliveryOrderCard
            key={order.orderId}
            order={order}
            index={index}
            onPress={() => navigation.navigate('DeliveryOrderDetailsScreen', { order })}
          />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

type DeliveryProfileOption = {
  id: string;
  title: string;
  subtitle: string;
  icon: React.ComponentProps<typeof Icon>['name'];
  color: string;
  route?: string;
};

const DELIVERY_PROFILE_OPTIONS: DeliveryProfileOption[] = [
  {
    id: 'deliveries',
    title: 'My deliveries',
    subtitle: 'View active and completed orders',
    icon: 'package',
    color: '#2fa64c',
    route: 'Deliveries',
  },
  {
    id: 'earnings',
    title: 'Earnings & payouts',
    subtitle: 'Review your delivery earnings',
    icon: 'dollar-sign',
    color: '#d49a2a',
    route: 'EarningsScreen',
  },
  {
    id: 'vehicle',
    title: 'Vehicle & documents',
    subtitle: 'Manage your delivery details',
    icon: 'truck',
    color: '#4A90E2',
    route: 'DeliveryVehicleDocumentsScreen',
  },
  {
    id: 'notifications',
    title: 'Notifications',
    subtitle: 'Delivery updates and alerts',
    icon: 'bell',
    color: '#9B59B6',
    route: 'NotificationsScreen',
  },
  {
    id: 'help',
    title: 'Help & support',
    subtitle: 'Get help with a delivery',
    icon: 'help-circle',
    color: '#1ABC9C',
    route: 'HelpScreen',
  },
  {
    id: 'settings',
    title: 'Settings',
    subtitle: 'Preferences, privacy and security',
    icon: 'settings',
    color: '#7F8C8D',
    route: 'SettingsScreen',
  },
];

const DeliveryProfileScreen = ({ navigation }: { navigation: any }) => {
  const [showLogout, setShowLogout] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const headerAnim = useRef(new Animated.Value(0)).current;
  const profileAnim = useRef(new Animated.Value(0)).current;
  const optionAnims = useRef(
    DELIVERY_PROFILE_OPTIONS.map(() => new Animated.Value(0)),
  ).current;
  const optionPressScales = useRef(
    DELIVERY_PROFILE_OPTIONS.map(() => new Animated.Value(1)),
  ).current;

  useEffect(() => {
    const entrance = Animated.stagger(80, [
      Animated.timing(headerAnim, {
        toValue: 1,
        duration: 420,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.spring(profileAnim, {
        toValue: 1,
        friction: 8,
        tension: 50,
        useNativeDriver: true,
      }),
    ]);
    entrance.start();

    const optionAnimations = optionAnims.map((anim, index) =>
      Animated.timing(anim, {
        toValue: 1,
        duration: 360,
        delay: 180 + index * 45,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    );
    Animated.stagger(35, optionAnimations).start();

    return () => {
      entrance.stop();
      optionAnimations.forEach((animation) => animation.stop());
    };
  }, [headerAnim, optionAnims, profileAnim]);

  const openProfileOption = (option: DeliveryProfileOption) => {
    if (option.route) {
      navigation.navigate(option.route);
    }
  };

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      setShowLogout(false);
      navigation.getParent()?.reset({
        index: 0,
        routes: [{ name: 'LoginScreen' }],
      });
    } finally {
      setLoggingOut(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <StatusBar barStyle="dark-content" />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.profileContent}
      >
        <Animated.View
          style={[
            styles.profileHeader,
            {
              opacity: headerAnim,
              transform: [
                {
                  translateY: headerAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [-14, 0],
                  }),
                },
              ],
            },
          ]}
        >
          <LocalizedText style={styles.profileHeaderEyebrow}>DELIVERY PARTNER</LocalizedText>
          <LocalizedText style={styles.profileHeading}>My account</LocalizedText>
          <LocalizedText style={styles.profileHeaderSubtitle}>
            Your details, deliveries and preferences.
          </LocalizedText>
        </Animated.View>

        <Animated.View
          style={[
            styles.deliveryProfileCard,
            {
              opacity: profileAnim,
              transform: [
                {
                  translateY: profileAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [20, 0],
                  }),
                },
                {
                  scale: profileAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.97, 1],
                  }),
                },
              ],
            },
          ]}
        >
          <View style={styles.deliveryProfileAvatar}>
            <Icon name="user" size={30} color="#2fa64c" />
          </View>
          <View style={styles.deliveryProfileCopy}>
            <LocalizedText style={styles.deliveryProfileName}>Delivery partner</LocalizedText>
            <LocalizedText style={styles.deliveryProfileDescription}>
              Manage your delivery account
            </LocalizedText>
            <View style={styles.partnerBadge}>
              <Icon name="check-circle" size={12} color="#258e43" />
              <LocalizedText style={styles.partnerBadgeText}>PARTNER ACCOUNT</LocalizedText>
            </View>
          </View>
          <TouchableOpacity
            accessibilityRole="button"
            accessibilityLabel="Edit profile"
            onPress={() => navigation.navigate('EditProfileScreen')}
            style={styles.profileEditButton}
          >
            <Icon name="edit-2" size={16} color="#258e43" />
          </TouchableOpacity>
        </Animated.View>

        <TouchableOpacity
          accessibilityRole="button"
          onPress={() =>
            navigation.getParent().reset({
              index: 0,
              routes: [{ name: 'MainNavigation' }],
            })
          }
          activeOpacity={0.85}
          style={styles.switchRoleButton}
        >
          <View style={styles.switchRoleIcon}>
            <Icon name="shopping-bag" size={17} color="#258e43" />
          </View>
          <View style={styles.switchRoleCopy}>
            <LocalizedText style={styles.switchRoleTitle}>Switch to customer</LocalizedText>
            <LocalizedText style={styles.switchRoleSubtitle}>
              Open your grocery shopping space
            </LocalizedText>
          </View>
          <Icon name="arrow-right" size={17} color="#258e43" />
        </TouchableOpacity>

        <View style={styles.profileOptionsHeading}>
          <LocalizedText style={styles.profileOptionsTitle}>Account options</LocalizedText>
          <LocalizedText style={styles.profileOptionsHint}>Manage your work profile</LocalizedText>
        </View>

        <View style={styles.profileOptionsList}>
          {DELIVERY_PROFILE_OPTIONS.map((item, index) => {
            const anim = optionAnims[index];
            return (
              <Animated.View
                key={item.id}
                style={{
                  opacity: anim,
                  transform: [
                    {
                      translateY: anim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [16, 0],
                      }),
                    },
                  ],
                }}
              >
                <TouchableOpacity
                  accessibilityRole="button"
                  onPress={() => openProfileOption(item)}
                  onPressIn={() =>
                    Animated.spring(optionPressScales[index], {
                      toValue: 0.985,
                      useNativeDriver: true,
                    }).start()
                  }
                  onPressOut={() =>
                    Animated.spring(optionPressScales[index], {
                      toValue: 1,
                      friction: 5,
                      tension: 80,
                      useNativeDriver: true,
                    }).start()
                  }
                  activeOpacity={0.75}
                  style={[
                    styles.profileOption,
                    { transform: [{ scale: optionPressScales[index] }] },
                  ]}
                >
                  <View
                    style={[
                      styles.profileOptionIcon,
                      { backgroundColor: `${item.color}16` },
                    ]}
                  >
                    <Icon name={item.icon} size={19} color={item.color} />
                  </View>
                  <View style={styles.profileOptionCopy}>
                    <LocalizedText style={styles.profileOptionTitle}>{item.title}</LocalizedText>
                    <LocalizedText style={styles.profileOptionSubtitle}>{item.subtitle}</LocalizedText>
                  </View>
                  <Icon name="chevron-right" size={19} color="#bdc5be" />
                </TouchableOpacity>
              </Animated.View>
            );
          })}
        </View>

        <TouchableOpacity
          accessibilityRole="button"
          onPress={() => setShowLogout(true)}
          style={styles.profileLogoutButton}
          activeOpacity={0.8}
        >
          <Icon name="log-out" size={18} color="#d64545" />
          <LocalizedText style={styles.profileLogoutText}>Log out</LocalizedText>
        </TouchableOpacity>
        <LocalizedText style={styles.profileVersion}>Smart Mart Delivery · v1.0.0</LocalizedText>
      </ScrollView>
      <LogoutBottomSheet
        visible={showLogout}
        onClose={() => setShowLogout(false)}
        onConfirm={handleLogout}
        loading={loggingOut}
      />
    </SafeAreaView>
  );
};

const DeliveryNavigation = () => (
  <Tab.Navigator
    screenOptions={{
      headerShown: false,
      tabBarActiveTintColor: '#2fa64c',
      tabBarInactiveTintColor: '#777777',
      tabBarLabelStyle: styles.tabLabel,
      tabBarStyle: styles.tabBar,
      animation: 'shift',
      transitionSpec: {
        animation: 'timing',
        config: { duration: 240 },
      },
    }}
  >
    <Tab.Screen
      name="Dashboard"
      component={DeliveryDashboard}
      options={{ tabBarIcon: DashboardTabIcon }}
    />
    <Tab.Screen
      name="Deliveries"
      component={DeliveriesScreen}
      options={{ tabBarIcon: DeliveriesTabIcon }}
    />
    <Tab.Screen
      name="Profile"
      component={DeliveryProfileScreen}
      options={{ tabBarIcon: ProfileTabIcon }}
    />
  </Tab.Navigator>
);

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  dashboardContent: {
    paddingBottom: 28,
  },
  dashboardHeader: {
    backgroundColor: '#2fa64c',
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    minHeight: 228,
    overflow: 'hidden',
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 26,
  },
  headerDecorationLarge: {
    position: 'absolute',
    width: 235,
    height: 235,
    borderRadius: 118,
    right: -92,
    top: -105,
    backgroundColor: 'rgba(255,255,255,0.09)',
  },
  headerDecorationSmall: {
    position: 'absolute',
    width: 145,
    height: 145,
    borderRadius: 73,
    right: 54,
    bottom: -100,
    backgroundColor: 'rgba(255,255,255,0.07)',
  },
  headerTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerEyebrow: {
    color: 'rgba(255,255,255,0.78)',
    fontFamily: 'Poppins-SemiBold',
    fontSize: 10,
    letterSpacing: 1.1,
    marginBottom: 7,
  },
  headerTitle: {
    color: '#ffffff',
    fontFamily: 'Poppins-Bold',
    fontSize: 25,
  },
  heroIllustration: {
    alignItems: 'center',
    height: 94,
    justifyContent: 'center',
    marginRight: -4,
    width: 98,
  },
  heroOrbit: {
    position: 'absolute',
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: 'rgba(255,255,255,0.12)',
  },
  heroRoute: {
    position: 'absolute',
    bottom: 5,
    left: 3,
    right: 2,
    height: 25,
    borderRadius: 14,
    backgroundColor: 'rgba(15,105,39,0.28)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
  },
  routeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#ffffff',
  },
  routeDash: {
    width: 7,
    height: 2,
    borderRadius: 1,
    backgroundColor: 'rgba(255,255,255,0.72)',
  },
  routeDotEnd: {
    width: 18,
    height: 18,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f3bc4d',
  },
  heroAvatar: {
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 32,
    height: 64,
    justifyContent: 'center',
    width: 64,
    shadowColor: '#15532a',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  heroSparkle: {
    position: 'absolute',
    top: 1,
    right: 4,
    alignItems: 'center',
    justifyContent: 'center',
    width: 23,
    height: 23,
    borderRadius: 12,
    backgroundColor: '#ffffff',
  },
  headerSubtitle: {
    color: 'rgba(255,255,255,0.88)',
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    marginTop: 7,
  },
  headerFooter: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 22,
  },
  todayBadge: {
    alignItems: 'center',
    backgroundColor: 'rgba(14,95,37,0.28)',
    borderRadius: 20,
    flexDirection: 'row',
    paddingHorizontal: 11,
    paddingVertical: 7,
  },
  todayBadgeText: {
    color: '#ffffff',
    fontFamily: 'Poppins-SemiBold',
    fontSize: 9,
    letterSpacing: 0.6,
    marginLeft: 6,
  },
  shiftTime: {
    color: 'rgba(255,255,255,0.84)',
    fontFamily: 'Poppins-Medium',
    fontSize: 11,
  },
  statusIconWrap: {
    alignItems: 'center',
    backgroundColor: '#edf0ed',
    borderRadius: 24,
    height: 46,
    justifyContent: 'center',
    marginRight: 12,
    width: 46,
  },
  statusIconOnline: {
    backgroundColor: '#2fa64c',
  },
  statusOnlineDot: {
    position: 'absolute',
    right: 0,
    top: 0,
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#ffffff',
    backgroundColor: '#b9ef5b',
  },
  content: {
    flexGrow: 1,
    padding: 24,
  },
  deliveriesContent: {
    paddingBottom: 28,
  },
  deliveriesHeader: {
    backgroundColor: '#ffffff',
    borderBottomLeftRadius: 26,
    borderBottomRightRadius: 26,
    paddingHorizontal: 22,
    paddingTop: 20,
    paddingBottom: 23,
  },
  deliveriesSubtitle: {
    color: '#7b857d',
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    lineHeight: 18,
    marginTop: 1,
  },
  deliveriesSummary: {
    alignItems: 'center',
    backgroundColor: '#eaf7ed',
    borderColor: '#d8efdd',
    borderRadius: 17,
    borderWidth: 1,
    flexDirection: 'row',
    marginHorizontal: 18,
    marginTop: 16,
    paddingHorizontal: 14,
    paddingVertical: 13,
  },
  summaryIcon: {
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 13,
    height: 40,
    justifyContent: 'center',
    marginRight: 11,
    width: 40,
  },
  summaryCopy: {
    flex: 1,
  },
  summaryTitle: {
    color: '#27402c',
    fontFamily: 'Poppins-SemiBold',
    fontSize: 12,
  },
  summaryCaption: {
    color: '#6c8972',
    fontFamily: 'Poppins-Regular',
    fontSize: 10,
    marginTop: 2,
  },
  summaryEarnings: {
    color: '#258e43',
    fontFamily: 'Poppins-Bold',
    fontSize: 14,
  },
  filterRow: {
    flexDirection: 'row',
    gap: 9,
    marginHorizontal: 20,
    marginTop: 22,
    marginBottom: 20,
  },
  filterChip: {
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderColor: '#e7ece7',
    borderRadius: 13,
    borderWidth: 1,
    flexDirection: 'row',
    minHeight: 40,
    paddingHorizontal: 12,
  },
  filterChipSelected: {
    backgroundColor: '#2fa64c',
    borderColor: '#2fa64c',
  },
  filterText: {
    color: '#717a72',
    fontFamily: 'Poppins-Medium',
    fontSize: 11,
  },
  filterTextSelected: {
    color: '#ffffff',
    fontFamily: 'Poppins-SemiBold',
  },
  filterCount: {
    alignItems: 'center',
    backgroundColor: '#f0f3f0',
    borderRadius: 8,
    height: 19,
    justifyContent: 'center',
    marginLeft: 7,
    minWidth: 19,
    paddingHorizontal: 4,
  },
  filterCountSelected: {
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  filterCountText: {
    color: '#717a72',
    fontFamily: 'Poppins-SemiBold',
    fontSize: 9,
  },
  filterCountTextSelected: {
    color: '#ffffff',
  },
  deliveryListHeading: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 21,
    marginBottom: 12,
  },
  listSectionTitle: {
    color: '#202820',
    fontFamily: 'Poppins-SemiBold',
    fontSize: 15,
  },
  listOrderCard: {
    backgroundColor: '#ffffff',
    borderColor: '#edf0ed',
    borderRadius: 18,
    borderWidth: 1,
    marginHorizontal: 18,
    marginBottom: 12,
    padding: 14,
    shadowColor: '#14381e',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.045,
    shadowRadius: 8,
    elevation: 2,
  },
  listCardHeader: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  listOrderIcon: {
    alignItems: 'center',
    backgroundColor: '#eaf8ed',
    borderRadius: 12,
    height: 40,
    justifyContent: 'center',
    marginRight: 10,
    width: 40,
  },
  listOrderIdentity: {
    flex: 1,
  },
  listOrderId: {
    color: '#202820',
    fontFamily: 'Poppins-SemiBold',
    fontSize: 12,
  },
  listCustomer: {
    color: '#818b83',
    fontFamily: 'Poppins-Regular',
    fontSize: 10,
    marginTop: 1,
  },
  listStatusBadge: {
    alignItems: 'center',
    borderRadius: 9,
    flexDirection: 'row',
    paddingHorizontal: 8,
    paddingVertical: 6,
  },
  activeStatusBadge: {
    backgroundColor: '#eaf8ed',
  },
  completedStatusBadge: {
    backgroundColor: '#f0f3f0',
  },
  listStatusDot: {
    borderRadius: 4,
    height: 6,
    marginRight: 5,
    width: 6,
  },
  activeStatusDot: {
    backgroundColor: '#2fa64c',
  },
  completedStatusDot: {
    backgroundColor: '#8a938c',
  },
  listStatusText: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 9,
  },
  activeStatusText: {
    color: '#258e43',
  },
  completedStatusText: {
    color: '#707971',
  },
  listRoute: {
    flexDirection: 'row',
    marginTop: 15,
    minHeight: 68,
  },
  listRouteMarkerColumn: {
    alignItems: 'center',
    marginLeft: 3,
    marginRight: 12,
    paddingTop: 3,
    width: 15,
  },
  listPickupMarker: {
    backgroundColor: '#2fa64c',
    borderColor: '#dff3e4',
    borderRadius: 6,
    borderWidth: 3,
    height: 12,
    width: 12,
  },
  listRouteLine: {
    borderColor: '#b8dfc1',
    borderStyle: 'dashed',
    borderLeftWidth: 1,
    flex: 1,
    marginVertical: 2,
  },
  listRouteCopy: {
    flex: 1,
    justifyContent: 'space-between',
  },
  listRouteStop: {
    minHeight: 32,
  },
  listRouteLabel: {
    color: '#a0a7a1',
    fontFamily: 'Poppins-SemiBold',
    fontSize: 8,
    letterSpacing: 0.7,
    marginBottom: 1,
  },
  listRouteAddress: {
    color: '#38423a',
    fontFamily: 'Poppins-Medium',
    fontSize: 10,
  },
  listCardFooter: {
    alignItems: 'center',
    borderTopColor: '#edf0ed',
    borderTopWidth: StyleSheet.hairlineWidth,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
    paddingTop: 11,
  },
  listMetaGroup: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  listMetaText: {
    color: '#747e76',
    fontFamily: 'Poppins-Medium',
    fontSize: 9,
    marginLeft: 4,
  },
  listMetaDivider: {
    backgroundColor: '#dfe5df',
    height: 14,
    marginHorizontal: 8,
    width: StyleSheet.hairlineWidth,
  },
  listEarning: {
    color: '#258e43',
    fontFamily: 'Poppins-Bold',
    fontSize: 13,
  },
  listCardAction: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 8,
  },
  listViewDetails: {
    color: '#258e43',
    fontFamily: 'Poppins-SemiBold',
    fontSize: 9,
    marginRight: 4,
  },
  eyebrow: {
    color: '#2fa64c',
    fontFamily: 'Poppins-SemiBold',
    fontSize: 11,
    letterSpacing: 1.2,
    marginBottom: 6,
  },
  heading: {
    color: '#1a1a1a',
    fontFamily: 'Poppins-Bold',
    fontSize: 27,
    marginBottom: 6,
  },
  subtitle: {
    color: '#777777',
    fontFamily: 'Poppins-Regular',
    fontSize: 13,
    lineHeight: 20,
    marginBottom: 24,
  },
  statusCard: {
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 20,
    elevation: 7,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 20,
    marginTop: -20,
    marginBottom: 26,
    padding: 15,
    shadowColor: '#14381e',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.08,
    shadowRadius: 14,
  },
  statusCopy: {
    flex: 1,
    marginRight: 8,
  },
  cardTitle: {
    color: '#1a1a1a',
    fontFamily: 'Poppins-SemiBold',
    fontSize: 15,
    marginBottom: 4,
  },
  cardSubtitle: {
    color: '#777777',
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    lineHeight: 18,
  },
  statusButton: {
    alignItems: 'center',
    backgroundColor: '#e8f7eb',
    borderRadius: 13,
    flexDirection: 'row',
    justifyContent: 'center',
    minHeight: 42,
    paddingHorizontal: 13,
  },
  statusButtonReady: {
    backgroundColor: '#2fa64c',
    shadowColor: '#2fa64c',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.22,
    shadowRadius: 6,
    elevation: 3,
  },
  onlineButton: {
    backgroundColor: '#f0f2f0',
  },
  statusButtonText: {
    color: '#238b3d',
    fontFamily: 'Poppins-SemiBold',
    fontSize: 11,
  },
  onlineButtonText: {
    color: '#626b64',
  },
  readyButtonText: {
    color: '#ffffff',
  },
  buttonStatusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#ffffff',
    marginRight: 6,
  },
  sectionHeadingRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 22,
    marginBottom: 13,
  },
  sectionTitle: {
    color: '#1a1a1a',
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
  },
  sectionHint: {
    color: '#8a938c',
    fontFamily: 'Poppins-Regular',
    fontSize: 11,
    marginTop: 1,
  },
  dateBadge: {
    alignItems: 'center',
    backgroundColor: '#eaf6ed',
    borderRadius: 12,
    flexDirection: 'row',
    paddingHorizontal: 10,
    paddingVertical: 7,
  },
  dateBadgeText: {
    color: '#258e43',
    fontFamily: 'Poppins-Medium',
    fontSize: 10,
    marginLeft: 5,
  },
  nextDeliveryBadge: {
    alignItems: 'center',
    backgroundColor: '#eaf8ed',
    borderRadius: 10,
    flexDirection: 'row',
    paddingHorizontal: 9,
    paddingVertical: 6,
  },
  nextDeliveryBadgeText: {
    color: '#258e43',
    fontFamily: 'Poppins-SemiBold',
    fontSize: 9,
    letterSpacing: 0.4,
    marginLeft: 5,
  },
  orderStatusDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: '#2fa64c',
  },
  statsRow: {
    flexDirection: 'row',
    gap: 13,
    marginHorizontal: 20,
    marginBottom: 25,
  },
  statCard: {
    backgroundColor: '#ffffff',
    borderRadius: 18,
    elevation: 3,
    flex: 1,
    minHeight: 154,
    padding: 15,
    shadowColor: '#14381e',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
  },
  deliveryStatCard: {
    borderBottomColor: '#55cc70',
    borderBottomWidth: 3,
  },
  earningsStatCard: {
    borderBottomColor: '#f0bd53',
    borderBottomWidth: 3,
  },
  statIcon: {
    alignItems: 'center',
    borderRadius: 13,
    height: 38,
    justifyContent: 'center',
    marginBottom: 9,
    width: 38,
  },
  deliveryStatIcon: {
    backgroundColor: '#e9f8ed',
  },
  earningsStatIcon: {
    backgroundColor: '#fff6e3',
  },
  statValue: {
    color: '#1a1a1a',
    fontFamily: 'Poppins-Bold',
    fontSize: 21,
  },
  statLabel: {
    color: '#4e5750',
    fontFamily: 'Poppins-SemiBold',
    fontSize: 11,
  },
  statFootnote: {
    color: '#a0a7a1',
    fontFamily: 'Poppins-Regular',
    fontSize: 9,
    marginTop: 2,
  },
  deliveryCard: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    elevation: 3,
    marginHorizontal: 20,
    padding: 17,
    shadowColor: '#14381e',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.05,
    shadowRadius: 9,
  },
  deliveryCardTop: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  orderIcon: {
    alignItems: 'center',
    backgroundColor: '#eaf8ed',
    borderRadius: 14,
    height: 46,
    justifyContent: 'center',
    marginRight: 11,
    width: 46,
  },
  orderDetails: {
    flex: 1,
  },
  orderId: {
    color: '#202820',
    fontFamily: 'Poppins-SemiBold',
    fontSize: 13,
  },
  orderCustomer: {
    color: '#818b83',
    fontFamily: 'Poppins-Regular',
    fontSize: 11,
    marginTop: 2,
  },
  earningBadge: {
    alignItems: 'flex-end',
    backgroundColor: '#fff7e7',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  earningAmount: {
    color: '#a87512',
    fontFamily: 'Poppins-Bold',
    fontSize: 14,
  },
  earningCaption: {
    color: '#b08b49',
    fontFamily: 'Poppins-SemiBold',
    fontSize: 8,
    letterSpacing: 0.6,
  },
  routeDivider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#e9eee9',
    marginVertical: 15,
  },
  routeRow: {
    flexDirection: 'row',
    minHeight: 86,
  },
  routeTimeline: {
    alignItems: 'center',
    marginRight: 13,
    paddingTop: 4,
    width: 15,
  },
  pickupDot: {
    backgroundColor: '#2fa64c',
    borderColor: '#dff3e4',
    borderRadius: 6,
    borderWidth: 3,
    height: 12,
    width: 12,
  },
  routeLine: {
    borderColor: '#b8dfc1',
    borderStyle: 'dashed',
    borderLeftWidth: 1,
    flex: 1,
    marginVertical: 3,
  },
  dropoffDot: {
    alignItems: 'center',
    backgroundColor: '#f1b844',
    borderRadius: 9,
    height: 18,
    justifyContent: 'center',
    width: 18,
  },
  routeLocations: {
    flex: 1,
    justifyContent: 'space-between',
    paddingBottom: 1,
  },
  routeLocation: {
    minHeight: 36,
  },
  routeLabel: {
    color: '#a0a7a1',
    fontFamily: 'Poppins-SemiBold',
    fontSize: 8,
    letterSpacing: 0.8,
    marginBottom: 2,
  },
  routeAddress: {
    color: '#38423a',
    fontFamily: 'Poppins-Medium',
    fontSize: 11,
  },
  deliveryCardFooter: {
    alignItems: 'center',
    borderTopColor: '#e9eee9',
    borderTopWidth: StyleSheet.hairlineWidth,
    flexDirection: 'row',
    marginTop: 13,
    paddingTop: 13,
  },
  deliveryMeta: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  deliveryMetaText: {
    color: '#68736a',
    fontFamily: 'Poppins-Medium',
    fontSize: 10,
    marginLeft: 5,
  },
  metaDivider: {
    backgroundColor: '#dfe5df',
    height: 16,
    marginHorizontal: 11,
    width: StyleSheet.hairlineWidth,
  },
  orderDetailsButton: {
    alignItems: 'center',
    flexDirection: 'row',
    marginLeft: 'auto',
    gap: 5,
    paddingVertical: 3,
  },
  orderDetailsText: {
    color: '#258e43',
    fontFamily: 'Poppins-SemiBold',
    fontSize: 10,
    letterSpacing: 0.4,
  },
  profileCard: {
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 16,
    flexDirection: 'row',
    marginTop: 16,
    padding: 18,
  },
  avatar: {
    alignItems: 'center',
    backgroundColor: '#e8f7eb',
    borderRadius: 28,
    height: 56,
    justifyContent: 'center',
    marginRight: 14,
    width: 56,
  },
  profileCopy: {
    flex: 1,
  },
  profileContent: {
    paddingBottom: 28,
  },
  profileHeader: {
    backgroundColor: '#ffffff',
    borderBottomLeftRadius: 26,
    borderBottomRightRadius: 26,
    paddingHorizontal: 22,
    paddingTop: 20,
    paddingBottom: 22,
  },
  profileHeaderEyebrow: {
    color: '#2fa64c',
    fontFamily: 'Poppins-SemiBold',
    fontSize: 10,
    letterSpacing: 1.1,
    marginBottom: 5,
  },
  profileHeading: {
    color: '#1a1a1a',
    fontFamily: 'Poppins-Bold',
    fontSize: 25,
  },
  profileHeaderSubtitle: {
    color: '#7b857d',
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    marginTop: 2,
  },
  deliveryProfileCard: {
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderColor: '#edf0ed',
    borderRadius: 19,
    borderWidth: 1,
    flexDirection: 'row',
    marginHorizontal: 18,
    marginTop: 16,
    padding: 15,
    shadowColor: '#14381e',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  deliveryProfileAvatar: {
    alignItems: 'center',
    backgroundColor: '#eaf8ed',
    borderRadius: 29,
    height: 58,
    justifyContent: 'center',
    marginRight: 12,
    width: 58,
  },
  deliveryProfileCopy: {
    flex: 1,
  },
  deliveryProfileName: {
    color: '#202820',
    fontFamily: 'Poppins-SemiBold',
    fontSize: 14,
  },
  deliveryProfileDescription: {
    color: '#818b83',
    fontFamily: 'Poppins-Regular',
    fontSize: 10,
    marginTop: 1,
  },
  partnerBadge: {
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: '#eaf8ed',
    borderRadius: 8,
    flexDirection: 'row',
    marginTop: 7,
    paddingHorizontal: 7,
    paddingVertical: 4,
  },
  partnerBadgeText: {
    color: '#258e43',
    fontFamily: 'Poppins-SemiBold',
    fontSize: 7,
    letterSpacing: 0.4,
    marginLeft: 4,
  },
  profileEditButton: {
    alignItems: 'center',
    backgroundColor: '#f4f8f4',
    borderRadius: 12,
    height: 38,
    justifyContent: 'center',
    width: 38,
  },
  profileOptionsHeading: {
    marginHorizontal: 22,
    marginTop: 23,
    marginBottom: 12,
  },
  switchRoleButton: {
    alignItems: 'center',
    backgroundColor: '#f1faf3',
    borderColor: '#d9efde',
    borderRadius: 15,
    borderWidth: 1,
    flexDirection: 'row',
    marginHorizontal: 18,
    marginTop: 14,
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
  profileOptionsTitle: {
    color: '#202820',
    fontFamily: 'Poppins-SemiBold',
    fontSize: 15,
  },
  profileOptionsHint: {
    color: '#8a938c',
    fontFamily: 'Poppins-Regular',
    fontSize: 10,
    marginTop: 2,
  },
  profileOptionsList: {
    backgroundColor: '#ffffff',
    borderColor: '#edf0ed',
    borderRadius: 18,
    borderWidth: 1,
    marginHorizontal: 18,
    overflow: 'hidden',
  },
  profileOption: {
    alignItems: 'center',
    flexDirection: 'row',
    minHeight: 74,
    paddingHorizontal: 13,
  },
  profileOptionIcon: {
    alignItems: 'center',
    borderRadius: 12,
    height: 42,
    justifyContent: 'center',
    marginRight: 11,
    width: 42,
  },
  profileOptionCopy: {
    flex: 1,
    paddingVertical: 10,
  },
  profileOptionTitle: {
    color: '#29322b',
    fontFamily: 'Poppins-SemiBold',
    fontSize: 12,
  },
  profileOptionSubtitle: {
    color: '#89918a',
    fontFamily: 'Poppins-Regular',
    fontSize: 9,
    marginTop: 2,
  },
  profileLogoutButton: {
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderColor: '#f0dddd',
    borderRadius: 15,
    borderWidth: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    marginHorizontal: 18,
    marginTop: 18,
    minHeight: 50,
  },
  profileLogoutText: {
    color: '#d64545',
    fontFamily: 'Poppins-SemiBold',
    fontSize: 13,
    marginLeft: 8,
  },
  profileVersion: {
    color: '#a3aaa4',
    fontFamily: 'Poppins-Regular',
    fontSize: 9,
    marginTop: 14,
    textAlign: 'center',
  },
  logoutButton: {
    alignItems: 'center',
    borderColor: '#f0dada',
    borderRadius: 14,
    borderWidth: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
    minHeight: 52,
  },
  logoutText: {
    color: '#d64545',
    fontFamily: 'Poppins-SemiBold',
    fontSize: 14,
    marginLeft: 8,
  },
  tabBar: {
    backgroundColor: '#ffffff',
    borderTopWidth: 0,
    elevation: 12,
    height: 68,
    paddingBottom: 8,
    paddingTop: 6,
  },
  tabLabel: {
    fontFamily: 'Poppins-Medium',
    fontSize: 10,
  },
});

export default DeliveryNavigation;
