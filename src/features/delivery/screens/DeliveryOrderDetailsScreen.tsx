import React, { useEffect, useRef, useState } from 'react';
import LocalizedText from '../../../shared/i18n/LocalizedText';
import { Animated, Easing, Linking, ScrollView, StatusBar, StyleSheet, View } from 'react-native';
import TouchableOpacity from '../../../shared/components/AnimatedTouchableOpacity';
import Icon from '@react-native-vector-icons/feather';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLocalization } from '../../../shared/i18n/LocalizationProvider';
import { useFeedback } from '../../../shared/components/feedback/FeedbackProvider';

interface DeliveryOrder {
  orderId: string;
  customer: string;
  pickup: string;
  dropoff: string;
  distance: string;
  eta: string;
  earning: string;
  status: 'Active' | 'Completed';
  time: string;
}

const ORDER_STAGES = [
  {
    title: 'Order accepted',
    detail: 'This delivery is assigned to you.',
    icon: 'check',
  },
  {
    title: 'Picked up',
    detail: 'The order has been collected from the store.',
    icon: 'package',
  },
  {
    title: 'On the way',
    detail: 'You’re heading to the customer.',
    icon: 'navigation',
  },
  {
    title: 'Delivered',
    detail: 'The order has been delivered successfully.',
    icon: 'check-circle',
  },
] as const;

const ORDER_ITEMS = [
  { name: 'Fresh grocery order', description: '6 items · 2 bags' },
  { name: 'Delivery instruction', description: 'Leave at the front door' },
];

const CUSTOMER_PHONE = '+12025550147';

const DeliveryOrderDetailsScreen = ({
  navigation,
  route,
}: {
  navigation: any;
  route: { params?: { order?: DeliveryOrder } };
}) => {
  const insets = useSafeAreaInsets();
  const { t } = useLocalization();
  const { showDialog } = useFeedback();
  const order = route.params?.order;
  const [currentStage, setCurrentStage] = useState(
    order?.status === 'Completed' ? ORDER_STAGES.length - 1 : 0,
  );
  const headerAnim = useRef(new Animated.Value(0)).current;
  const summaryAnim = useRef(new Animated.Value(0)).current;
  const routeAnim = useRef(new Animated.Value(0)).current;
  const actionAnim = useRef(new Animated.Value(0)).current;
  const stageAnim = useRef(ORDER_STAGES.map(() => new Animated.Value(0))).current;
  const progressAnim = useRef(new Animated.Value(0)).current;
  const currentStepPulse = useRef(new Animated.Value(1)).current;
  const actionScale = useRef(new Animated.Value(1)).current;
  const isCompleted = currentStage === ORDER_STAGES.length - 1;

  useEffect(() => {
    const entrance = Animated.stagger(90, [
      Animated.timing(headerAnim, {
        toValue: 1,
        duration: 420,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.spring(summaryAnim, {
        toValue: 1,
        friction: 8,
        tension: 50,
        useNativeDriver: true,
      }),
      Animated.timing(routeAnim, {
        toValue: 1,
        duration: 440,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(actionAnim, {
        toValue: 1,
        duration: 380,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]);
    entrance.start();

    return () => entrance.stop();
  }, [actionAnim, headerAnim, routeAnim, summaryAnim]);

  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: currentStage / (ORDER_STAGES.length - 1),
      duration: 550,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start();

    stageAnim.forEach((anim, index) => {
      Animated.spring(anim, {
        toValue: index <= currentStage ? 1 : 0,
        friction: 8,
        tension: 55,
        useNativeDriver: true,
      }).start();
    });
  }, [currentStage, progressAnim, stageAnim]);

  useEffect(() => {
    if (isCompleted) {
      currentStepPulse.setValue(1);
      return;
    }

    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(currentStepPulse, {
          toValue: 1.12,
          duration: 750,
          useNativeDriver: true,
        }),
        Animated.timing(currentStepPulse, {
          toValue: 1,
          duration: 750,
          useNativeDriver: true,
        }),
      ]),
    );
    pulse.start();
    return () => pulse.stop();
  }, [currentStepPulse, isCompleted]);

  if (!order) {
    return (
      <View style={[styles.safeArea, { paddingTop: insets.top }]}>
        <StatusBar barStyle="dark-content" />
        <View style={styles.missingOrder}>
          <Icon name="alert-circle" size={36} color="#d49a2a" />
          <LocalizedText style={styles.missingTitle}>Order details unavailable</LocalizedText>
          <LocalizedText style={styles.missingCopy}>
            Go back to your deliveries and select an order to view its details.
          </LocalizedText>
          <TouchableOpacity
            accessibilityRole="button"
            onPress={() => navigation.goBack()}
            style={styles.missingButton}
          >
            <LocalizedText style={styles.missingButtonText}>Back to deliveries</LocalizedText>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  const advanceStage = () => {
    if (currentStage < ORDER_STAGES.length - 1) {
      setCurrentStage((stage) => stage + 1);
    }
  };

  const openContactApp = async (url: string, appName: string) => {
    try {
      await Linking.openURL(url);
    } catch {
      showDialog(
        `${appName} ${t('unavailable')}`,
        `${t('Couldn’t open')} ${appName.toLowerCase()} ${t('on this device')}.`,
      );
    }
  };

  const primaryAction =
    currentStage === 0
      ? 'Confirm pickup'
      : currentStage === 1
        ? 'Start delivery'
        : currentStage === 2
          ? 'Mark as delivered'
          : 'Delivery complete';
  const primaryIcon =
    currentStage === 0 ? 'package' : currentStage === 1 ? 'navigation' : 'check';

  return (
    <View style={styles.safeArea}>
      <StatusBar barStyle="light-content" />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Animated.View
          style={[
            styles.hero,
            { paddingTop: insets.top + 10 },
            {
              opacity: headerAnim,
              transform: [{
                translateY: headerAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [-20, 0],
                }),
              }],
            },
          ]}
        >
          <View style={styles.heroDecorationOne} />
          <View style={styles.heroDecorationTwo} />
          <TouchableOpacity
            accessibilityRole="button"
            accessibilityLabel="Go back to deliveries"
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <Icon name="arrow-left" size={19} color="#ffffff" />
          </TouchableOpacity>
          <View style={styles.heroLabelRow}>
            <LocalizedText style={styles.heroEyebrow}>DELIVERY DETAILS</LocalizedText>
          </View>
          <View style={styles.heroTitleRow}>
            <View>
              <LocalizedText style={styles.heroTitle}>Order #{order.orderId}</LocalizedText>
              <LocalizedText style={styles.heroSubtitle}>Assigned to your route</LocalizedText>
            </View>
            <View style={[styles.heroStatus, isCompleted && styles.heroStatusComplete]}>
              <View style={[styles.heroStatusDot, isCompleted && styles.heroStatusDotComplete]} />
              <LocalizedText style={styles.heroStatusText}>
                {isCompleted ? 'Completed' : 'Active'}
              </LocalizedText>
            </View>
          </View>
          <View style={styles.heroMeta}>
            <View style={styles.heroMetaItem}>
              <Icon name="navigation" size={14} color="rgba(255,255,255,0.85)" />
              <LocalizedText style={styles.heroMetaText}>{order.distance}</LocalizedText>
            </View>
            <View style={styles.heroMetaDivider} />
            <View style={styles.heroMetaItem}>
              <Icon name="clock" size={14} color="rgba(255,255,255,0.85)" />
              <LocalizedText style={styles.heroMetaText}>
                {isCompleted ? order.time : `${order.eta} estimated`}
              </LocalizedText>
            </View>
            <View style={styles.heroEarned}>
              <LocalizedText style={styles.heroEarnedLabel}>EARNING</LocalizedText>
              <LocalizedText style={styles.heroEarnedValue}>{order.earning}</LocalizedText>
            </View>
          </View>
        </Animated.View>

        <Animated.View
          style={[
            styles.progressCard,
            {
              opacity: summaryAnim,
              transform: [{
                translateY: summaryAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [20, 0],
                }),
              }],
            },
          ]}
        >
          <View style={styles.sectionHeading}>
            <View>
              <LocalizedText style={styles.sectionTitle}>Delivery progress</LocalizedText>
              <LocalizedText style={styles.sectionSubtitle}>
                {isCompleted ? 'Order delivered' : 'Update the status as you go'}
              </LocalizedText>
            </View>
            <LocalizedText style={styles.stageCount}>
              {currentStage + 1}/{ORDER_STAGES.length}
            </LocalizedText>
          </View>

          <View style={styles.progressTrack}>
            <Animated.View
              style={[
                styles.progressFill,
                {
                  width: progressAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: ['0%', '100%'],
                  }),
                },
              ]}
            />
          </View>

          <View style={styles.timeline}>
            {ORDER_STAGES.map((stage, index) => {
              const isReached = index <= currentStage;
              const stageValue = stageAnim[index];
              return (
                <Animated.View
                  key={stage.title}
                  style={[
                    styles.timelineRow,
                    {
                      opacity: stageValue.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0.58, 1],
                      }),
                      transform: [{
                        translateX: stageValue.interpolate({
                          inputRange: [0, 1],
                          outputRange: [-8, 0],
                        }),
                      }],
                    },
                  ]}
                >
                  <View style={styles.timelineMarkerColumn}>
                    <Animated.View
                      style={[
                        styles.timelineMarker,
                        isReached && styles.timelineMarkerReached,
                        {
                          transform: [{
                            scale: stageValue.interpolate({
                              inputRange: [0, 1],
                              outputRange: [0.86, 1],
                            }),
                          }],
                        },
                      ]}
                    >
                      <Icon
                        name={isReached ? 'check' : stage.icon}
                        size={13}
                        color={isReached ? '#ffffff' : '#a4ada5'}
                      />
                    </Animated.View>
                    {index < ORDER_STAGES.length - 1 && (
                      <View
                        style={[
                          styles.timelineLine,
                          index < currentStage && styles.timelineLineReached,
                        ]}
                      />
                    )}
                  </View>
                  <View style={styles.timelineCopy}>
                    <LocalizedText style={[styles.timelineTitle, isReached && styles.timelineTitleReached]}>
                      {stage.title}
                    </LocalizedText>
                    <LocalizedText style={styles.timelineDetail}>{stage.detail}</LocalizedText>
                  </View>
                  {index === currentStage && !isCompleted && (
                    <Animated.View
                      style={[
                        styles.currentStepBadge,
                        { transform: [{ scale: currentStepPulse }] },
                      ]}
                    >
                      <LocalizedText style={styles.currentStepText}>CURRENT</LocalizedText>
                    </Animated.View>
                  )}
                </Animated.View>
              );
            })}
          </View>
        </Animated.View>

        <Animated.View
          style={[
            styles.routeCard,
            {
              opacity: routeAnim,
              transform: [{
                translateY: routeAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [18, 0],
                }),
              }],
            },
          ]}
        >
          <View style={styles.sectionHeading}>
            <View>
              <LocalizedText style={styles.sectionTitle}>Route & customer</LocalizedText>
              <LocalizedText style={styles.sectionSubtitle}>Pickup and drop-off information</LocalizedText>
            </View>
            <TouchableOpacity
              accessibilityRole="button"
              accessibilityLabel="Open route in Google Maps"
              style={styles.routeIcon}
              activeOpacity={0.8}
              onPress={() =>
                openContactApp(
                  `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(order.pickup)}&destination=${encodeURIComponent(order.dropoff)}&travelmode=driving`,
                  'Google Maps',
                )
              }
            >
              <Icon name="map" size={17} color="#258e43" />
            </TouchableOpacity>
          </View>
          <View style={styles.addressRow}>
            <View style={styles.addressMarkerColumn}>
              <View style={styles.pickupMarker} />
              <View style={styles.addressLine} />
              <View style={styles.dropoffMarker}>
                <Icon name="map-pin" size={10} color="#ffffff" />
              </View>
            </View>
            <View style={styles.addressCopy}>
              <View style={styles.addressBlock}>
                <LocalizedText style={styles.addressLabel}>PICKUP FROM</LocalizedText>
                <LocalizedText style={styles.addressTitle}>{order.pickup}</LocalizedText>
                <LocalizedText style={styles.addressNote}>Ready for collection</LocalizedText>
              </View>
              <View style={styles.addressBlock}>
                <LocalizedText style={styles.addressLabel}>DELIVER TO</LocalizedText>
                <LocalizedText style={styles.addressTitle}>{order.dropoff}</LocalizedText>
                <LocalizedText style={styles.addressNote}>Customer delivery address</LocalizedText>
              </View>
            </View>
          </View>
          <View style={styles.distanceBanner}>
            <Icon name="navigation" size={15} color="#258e43" />
            <LocalizedText style={styles.distanceText}>{order.distance} total route</LocalizedText>
            <View style={styles.distanceBannerSpacer} />
            <Icon name="clock" size={14} color="#258e43" />
            <LocalizedText style={styles.distanceText}>{order.eta}</LocalizedText>
          </View>
        </Animated.View>

        <Animated.View
          style={[
            styles.customerCard,
            {
              opacity: routeAnim,
              transform: [{
                translateY: routeAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [18, 0],
                }),
              }],
            },
          ]}
        >
          <View style={styles.sectionHeading}>
            <View>
              <LocalizedText style={styles.sectionTitle}>Customer</LocalizedText>
              <LocalizedText style={styles.sectionSubtitle}>Delivery contact</LocalizedText>
            </View>
            <View style={styles.customerAvatar}>
              <Icon name="user" size={18} color="#258e43" />
            </View>
          </View>
          <View style={styles.customerInfo}>
            <View style={styles.customerIdentity}>
              <LocalizedText style={styles.customerName}>{order.customer}</LocalizedText>
              <LocalizedText style={styles.customerPhone}>+1 (202) 555-0147</LocalizedText>
            </View>
            <View style={styles.contactButtons}>
              <TouchableOpacity
                accessibilityRole="button"
                accessibilityLabel="Call customer"
                style={styles.contactButton}
                activeOpacity={0.8}
                onPress={() => openContactApp(`tel:${CUSTOMER_PHONE}`, 'Phone app')}
              >
                <Icon name="phone" size={15} color="#258e43" />
              </TouchableOpacity>
              <TouchableOpacity
                accessibilityRole="button"
                accessibilityLabel="Message customer"
                style={styles.contactButton}
                activeOpacity={0.8}
                onPress={() => openContactApp(`sms:${CUSTOMER_PHONE}`, 'Messaging app')}
              >
                <Icon name="message-circle" size={15} color="#258e43" />
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.instructionsBox}>
            <Icon name="info" size={14} color="#c08a26" />
            <LocalizedText style={styles.instructionsText}>Leave the order at the front door.</LocalizedText>
          </View>
        </Animated.View>

        <Animated.View
          style={[
            styles.itemsCard,
            {
              opacity: routeAnim,
              transform: [{
                translateY: routeAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [18, 0],
                }),
              }],
            },
          ]}
        >
          <View style={styles.sectionHeading}>
            <View>
              <LocalizedText style={styles.sectionTitle}>Order information</LocalizedText>
              <LocalizedText style={styles.sectionSubtitle}>What you’re delivering</LocalizedText>
            </View>
            <View style={styles.itemsBadge}>
              <LocalizedText style={styles.itemsBadgeText}>6 ITEMS</LocalizedText>
            </View>
          </View>
          {ORDER_ITEMS.map((item, index) => (
            <View key={item.name} style={[styles.itemRow, index > 0 && styles.itemRowBorder]}>
              <View style={styles.itemIcon}>
                <Icon name={index === 0 ? 'shopping-bag' : 'clipboard'} size={15} color="#258e43" />
              </View>
              <View style={styles.itemCopy}>
                <LocalizedText style={styles.itemTitle}>{item.name}</LocalizedText>
                <LocalizedText style={styles.itemDescription}>{item.description}</LocalizedText>
              </View>
            </View>
          ))}
          <View style={styles.earningRow}>
            <LocalizedText style={styles.earningRowLabel}>Your delivery earning</LocalizedText>
            <LocalizedText style={styles.earningRowAmount}>{order.earning}</LocalizedText>
          </View>
        </Animated.View>

        <Animated.View
          style={[
            styles.actionContainer,
            {
              opacity: actionAnim,
              transform: [{
                translateY: actionAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [16, 0],
                }),
              }],
            },
          ]}
        >
          <View style={styles.statusNote}>
            <Icon name="info" size={13} color="#74839a" />
            <LocalizedText style={styles.statusNoteText}>
              Status updates are not saved when you leave this screen.
            </LocalizedText>
          </View>
          <TouchableOpacity
            accessibilityRole="button"
            accessibilityState={{ disabled: isCompleted }}
            disabled={isCompleted}
            onPress={advanceStage}
            onPressIn={() =>
              Animated.spring(actionScale, {
                toValue: 0.975,
                useNativeDriver: true,
              }).start()
            }
            onPressOut={() =>
              Animated.spring(actionScale, {
                toValue: 1,
                friction: 5,
                tension: 80,
                useNativeDriver: true,
              }).start()
            }
            activeOpacity={0.85}
            style={[
              styles.primaryAction,
              isCompleted && styles.primaryActionComplete,
              { transform: [{ scale: actionScale }] },
            ]}
          >
            <Icon name={isCompleted ? 'check-circle' : primaryIcon} size={18} color="#ffffff" />
            <LocalizedText style={styles.primaryActionText}>{primaryAction}</LocalizedText>
            {!isCompleted && <Icon name="arrow-right" size={16} color="#ffffff" />}
          </TouchableOpacity>
        </Animated.View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#ffffff' },
  content: { paddingBottom: 26 },
  hero: {
    backgroundColor: '#258e43',
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    overflow: 'hidden',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 19,
  },
  heroDecorationOne: {
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 100,
    height: 200,
    position: 'absolute',
    right: -75,
    top: -112,
    width: 200,
  },
  heroDecorationTwo: {
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: 65,
    bottom: -55,
    height: 130,
    position: 'absolute',
    right: 90,
    width: 130,
  },
  backButton: {
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.16)',
    borderRadius: 12,
    height: 40,
    justifyContent: 'center',
    marginBottom: 16,
    width: 40,
  },
  heroLabelRow: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between' },
  heroEyebrow: {
    color: 'rgba(255,255,255,0.75)',
    fontFamily: 'Poppins-SemiBold',
    fontSize: 9,
    letterSpacing: 1,
  },
  heroTitleRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  heroTitle: { color: '#ffffff', fontFamily: 'Poppins-Bold', fontSize: 22 },
  heroSubtitle: { color: 'rgba(255,255,255,0.75)', fontFamily: 'Poppins-Regular', fontSize: 10, marginTop: 1 },
  heroStatus: {
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.17)',
    borderRadius: 10,
    flexDirection: 'row',
    paddingHorizontal: 9,
    paddingVertical: 6,
  },
  heroStatusComplete: { backgroundColor: 'rgba(255,255,255,0.24)' },
  heroStatusDot: { backgroundColor: '#f4c64d', borderRadius: 4, height: 7, marginRight: 5, width: 7 },
  heroStatusDotComplete: { backgroundColor: '#b9ef5b' },
  heroStatusText: { color: '#ffffff', fontFamily: 'Poppins-SemiBold', fontSize: 9 },
  heroMeta: { alignItems: 'center', flexDirection: 'row', marginTop: 18 },
  heroMetaItem: { alignItems: 'center', flexDirection: 'row' },
  heroMetaText: { color: '#ffffff', fontFamily: 'Poppins-Medium', fontSize: 10, marginLeft: 5 },
  heroMetaDivider: { backgroundColor: 'rgba(255,255,255,0.3)', height: 15, marginHorizontal: 12, width: StyleSheet.hairlineWidth },
  heroEarned: { alignItems: 'flex-end', marginLeft: 'auto' },
  heroEarnedLabel: { color: 'rgba(255,255,255,0.72)', fontFamily: 'Poppins-SemiBold', fontSize: 8, letterSpacing: 0.6 },
  heroEarnedValue: { color: '#ffffff', fontFamily: 'Poppins-Bold', fontSize: 16 },
  progressCard: {
    backgroundColor: '#ffffff',
    borderColor: '#edf0ed',
    borderRadius: 19,
    borderWidth: 1,
    marginHorizontal: 16,
    marginTop: 15,
    padding: 15,
    shadowColor: '#14381e',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  sectionHeading: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between' },
  sectionTitle: { color: '#202820', fontFamily: 'Poppins-SemiBold', fontSize: 13 },
  sectionSubtitle: { color: '#89918a', fontFamily: 'Poppins-Regular', fontSize: 9, marginTop: 2 },
  stageCount: { color: '#258e43', fontFamily: 'Poppins-Bold', fontSize: 12 },
  progressTrack: { backgroundColor: '#eaf1eb', borderRadius: 3, height: 5, marginTop: 15, overflow: 'hidden' },
  progressFill: { backgroundColor: '#2fa64c', borderRadius: 3, height: 5 },
  timeline: { marginTop: 17 },
  timelineRow: { alignItems: 'flex-start', flexDirection: 'row', minHeight: 57 },
  timelineMarkerColumn: { alignItems: 'center', marginRight: 11, width: 25 },
  timelineMarker: {
    alignItems: 'center',
    backgroundColor: '#f0f3f0',
    borderColor: '#e4e9e4',
    borderRadius: 13,
    borderWidth: 1,
    height: 26,
    justifyContent: 'center',
    width: 26,
  },
  timelineMarkerReached: { backgroundColor: '#2fa64c', borderColor: '#2fa64c' },
  timelineLine: { backgroundColor: '#e2e9e3', flex: 1, marginVertical: 3, width: 2 },
  timelineLineReached: { backgroundColor: '#85d194' },
  timelineCopy: { flex: 1, paddingTop: 2 },
  timelineTitle: { color: '#89918a', fontFamily: 'Poppins-Medium', fontSize: 10 },
  timelineTitleReached: { color: '#28372b', fontFamily: 'Poppins-SemiBold' },
  timelineDetail: { color: '#9ba39c', fontFamily: 'Poppins-Regular', fontSize: 8, marginTop: 2 },
  currentStepBadge: { backgroundColor: '#eaf8ed', borderRadius: 7, marginTop: 3, paddingHorizontal: 7, paddingVertical: 4 },
  currentStepText: { color: '#258e43', fontFamily: 'Poppins-SemiBold', fontSize: 7, letterSpacing: 0.4 },
  routeCard: {
    backgroundColor: '#ffffff',
    borderColor: '#edf0ed',
    borderRadius: 19,
    borderWidth: 1,
    marginHorizontal: 16,
    marginTop: 13,
    padding: 15,
    shadowColor: '#14381e',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  routeIcon: { alignItems: 'center', backgroundColor: '#eaf8ed', borderRadius: 11, height: 35, justifyContent: 'center', width: 35 },
  addressRow: { flexDirection: 'row', marginTop: 17, minHeight: 94 },
  addressMarkerColumn: { alignItems: 'center', marginLeft: 3, marginRight: 12, paddingTop: 3, width: 17 },
  pickupMarker: { backgroundColor: '#2fa64c', borderColor: '#dff3e4', borderRadius: 7, borderWidth: 3, height: 14, width: 14 },
  addressLine: { borderColor: '#b8dfc1', borderStyle: 'dashed', borderLeftWidth: 1, flex: 1, marginVertical: 3 },
  dropoffMarker: { alignItems: 'center', backgroundColor: '#e5a72f', borderRadius: 9, height: 18, justifyContent: 'center', width: 18 },
  addressCopy: { flex: 1, justifyContent: 'space-between' },
  addressBlock: { minHeight: 43 },
  addressLabel: { color: '#9aa39b', fontFamily: 'Poppins-SemiBold', fontSize: 8, letterSpacing: 0.7 },
  addressTitle: { color: '#303a32', fontFamily: 'Poppins-SemiBold', fontSize: 10, marginTop: 2 },
  addressNote: { color: '#929a93', fontFamily: 'Poppins-Regular', fontSize: 8, marginTop: 1 },
  distanceBanner: { alignItems: 'center', backgroundColor: '#f1faf3', borderRadius: 11, flexDirection: 'row', marginTop: 12, paddingHorizontal: 11, paddingVertical: 10 },
  distanceText: { color: '#526b56', fontFamily: 'Poppins-Medium', fontSize: 9, marginLeft: 5 },
  distanceBannerSpacer: { flex: 1 },
  customerCard: {
    backgroundColor: '#ffffff',
    borderColor: '#edf0ed',
    borderRadius: 19,
    borderWidth: 1,
    marginHorizontal: 16,
    marginTop: 13,
    padding: 15,
    shadowColor: '#14381e',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  customerAvatar: { alignItems: 'center', backgroundColor: '#eaf8ed', borderRadius: 11, height: 35, justifyContent: 'center', width: 35 },
  customerInfo: { alignItems: 'center', flexDirection: 'row', marginTop: 14 },
  customerIdentity: { flex: 1 },
  customerName: { color: '#303a32', fontFamily: 'Poppins-SemiBold', fontSize: 12 },
  customerPhone: { color: '#818b83', fontFamily: 'Poppins-Regular', fontSize: 9, marginTop: 2 },
  contactButtons: { flexDirection: 'row', gap: 8 },
  contactButton: { alignItems: 'center', backgroundColor: '#eaf8ed', borderRadius: 11, height: 36, justifyContent: 'center', width: 36 },
  instructionsBox: { alignItems: 'center', backgroundColor: '#fff8e9', borderRadius: 10, flexDirection: 'row', marginTop: 13, padding: 10 },
  instructionsText: { color: '#8e713a', flex: 1, fontFamily: 'Poppins-Medium', fontSize: 9, marginLeft: 7 },
  itemsCard: {
    backgroundColor: '#ffffff',
    borderColor: '#edf0ed',
    borderRadius: 19,
    borderWidth: 1,
    marginHorizontal: 16,
    marginTop: 13,
    paddingHorizontal: 15,
    paddingTop: 15,
    shadowColor: '#14381e',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  itemsBadge: { backgroundColor: '#f0f3f0', borderRadius: 8, paddingHorizontal: 8, paddingVertical: 5 },
  itemsBadgeText: { color: '#747e76', fontFamily: 'Poppins-SemiBold', fontSize: 8, letterSpacing: 0.4 },
  itemRow: { alignItems: 'center', flexDirection: 'row', paddingVertical: 12 },
  itemRowBorder: { borderTopColor: '#edf0ed', borderTopWidth: StyleSheet.hairlineWidth },
  itemIcon: { alignItems: 'center', backgroundColor: '#eaf8ed', borderRadius: 10, height: 34, justifyContent: 'center', marginRight: 9, width: 34 },
  itemCopy: { flex: 1 },
  itemTitle: { color: '#303a32', fontFamily: 'Poppins-Medium', fontSize: 10 },
  itemDescription: { color: '#929a93', fontFamily: 'Poppins-Regular', fontSize: 8, marginTop: 2 },
  earningRow: { alignItems: 'center', borderTopColor: '#edf0ed', borderTopWidth: StyleSheet.hairlineWidth, flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 13 },
  earningRowLabel: { color: '#667168', fontFamily: 'Poppins-Medium', fontSize: 10 },
  earningRowAmount: { color: '#258e43', fontFamily: 'Poppins-Bold', fontSize: 14 },
  actionContainer: { marginHorizontal: 16, marginTop: 14 },
  statusNote: { alignItems: 'center', flexDirection: 'row', justifyContent: 'center', marginBottom: 10 },
  statusNoteText: { color: '#8794a4', fontFamily: 'Poppins-Regular', fontSize: 8, marginLeft: 5 },
  primaryAction: { alignItems: 'center', backgroundColor: '#2fa64c', borderRadius: 15, flexDirection: 'row', justifyContent: 'space-between', minHeight: 52, paddingHorizontal: 17, shadowColor: '#2fa64c', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.22, shadowRadius: 8, elevation: 4 },
  primaryActionComplete: { backgroundColor: '#849188', shadowOpacity: 0, elevation: 0 },
  primaryActionText: { color: '#ffffff', flex: 1, fontFamily: 'Poppins-SemiBold', fontSize: 12, marginLeft: 9 },
  missingOrder: { alignItems: 'center', flex: 1, justifyContent: 'center', padding: 28 },
  missingTitle: { color: '#263329', fontFamily: 'Poppins-SemiBold', fontSize: 17, marginTop: 15 },
  missingCopy: { color: '#778078', fontFamily: 'Poppins-Regular', fontSize: 12, lineHeight: 19, marginTop: 7, textAlign: 'center' },
  missingButton: { backgroundColor: '#2fa64c', borderRadius: 12, marginTop: 20, paddingHorizontal: 18, paddingVertical: 12 },
  missingButtonText: { color: '#ffffff', fontFamily: 'Poppins-SemiBold', fontSize: 11 },
});

export default DeliveryOrderDetailsScreen;
