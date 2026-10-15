import React, { useRef, useEffect } from 'react';
import LocalizedText from '../../../shared/i18n/LocalizedText';
import { View, StyleSheet, ScrollView, StatusBar, Animated, Easing } from 'react-native';
import TouchableOpacity from '../../../shared/components/AnimatedTouchableOpacity';
import Icon from '@react-native-vector-icons/feather';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const TIMELINE = [
  { title: 'Order Placed', time: '2:30 PM', done: true, icon: 'check-circle' },
  { title: 'Order Confirmed', time: '2:35 PM', done: true, icon: 'check-circle' },
  { title: 'Preparing', time: '2:50 PM', done: true, icon: 'package' },
  { title: 'Out for Delivery', time: '3:20 PM', done: true, current: true, icon: 'truck' },
  { title: 'Delivered', time: 'Expected 4:00 PM', done: false, icon: 'home' },
];

const TrackOrderScreen = ({ route, navigation }: any) => {
  const insets = useSafeAreaInsets();
  const order = route?.params?.order || { id: 'ORD-78395' };

  // Animations
  const headerAnim = useRef(new Animated.Value(0)).current;
  const etaAnim = useRef(new Animated.Value(0)).current;
  const sectionAnim = useRef(new Animated.Value(0)).current;
  const deliveryAnim = useRef(new Animated.Value(0)).current;
  const stepAnims = useRef(TIMELINE.map(() => new Animated.Value(0))).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Entrance sequence
    Animated.stagger(80, [
      Animated.timing(headerAnim, {
        toValue: 1,
        duration: 380,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.spring(etaAnim, {
        toValue: 1,
        friction: 7,
        tension: 50,
        useNativeDriver: true,
      }),
      Animated.timing(sectionAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start();

    // Staggered timeline steps
    const stepAnimations = stepAnims.map((anim, index) =>
      Animated.timing(anim, {
        toValue: 1,
        duration: 420,
        delay: 280 + index * 90,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      })
    );
    Animated.stagger(50, stepAnimations).start();

    // Delivery card
    Animated.timing(deliveryAnim, {
      toValue: 1,
      duration: 400,
      delay: 700,
      useNativeDriver: true,
    }).start();

    // Pulse animation for current step
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.25,
          duration: 800,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 800,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    );
    pulse.start();

    return () => pulse.stop();
  }, []);

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <StatusBar barStyle="dark-content"/>

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
        <LocalizedText style={styles.headerTitle}>Track Order</LocalizedText>
        <View style={{ width: 40 }} />
      </Animated.View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + 30 },
        ]}
      >
        {/* ETA Card */}
        <Animated.View
          style={[
            styles.etaCard,
            {
              opacity: etaAnim,
              transform: [
                {
                  translateY: etaAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [24, 0],
                  }),
                },
                {
                  scale: etaAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.94, 1],
                  }),
                },
              ],
            },
          ]}
        >
          <View style={styles.etaIconWrapper}>
            <Icon name="truck" size={28} color="#55cc70" />
          </View>
          <LocalizedText style={styles.orderId}>{order.id}</LocalizedText>
          <LocalizedText style={styles.etaText}>Arriving in 25-30 mins</LocalizedText>
          <View style={styles.etaBadge}>
            <View style={styles.liveDot} />
            <LocalizedText style={styles.etaBadgeText}>On the way</LocalizedText>
          </View>
        </Animated.View>

        {/* Section Title */}
        <Animated.Text
          style={[
            styles.sectionTitle,
            {
              opacity: sectionAnim,
              transform: [
                {
                  translateY: sectionAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [12, 0],
                  }),
                },
              ],
            },
          ]}
        >
          Order Status
        </Animated.Text>

        {/* Timeline */}
        <View style={styles.timelineContainer}>
          {TIMELINE.map((step, index) => {
            const anim = stepAnims[index];
            const isLast = index === TIMELINE.length - 1;

            return (
              <Animated.View
                key={index}
                style={[
                  styles.timelineRow,
                  {
                    opacity: anim,
                    transform: [
                      {
                        translateX: anim.interpolate({
                          inputRange: [0, 1],
                          outputRange: [-20, 0],
                        }),
                      },
                    ],
                  },
                ]}
              >
                {/* Left: Dot + Line */}
                <View style={styles.timelineLeft}>
                  {step.current ? (
                    <Animated.View
                      style={[
                        styles.dotCurrentOuter,
                        { transform: [{ scale: pulseAnim }] },
                      ]}
                    >
                      <View style={styles.dotCurrentInner}>
                        <Icon name={step.icon as any} size={14} color="#ffffff" />
                      </View>
                    </Animated.View>
                  ) : (
                    <View
                      style={[
                        styles.dot,
                        step.done && styles.dotDone,
                        !step.done && styles.dotPending,
                      ]}
                    >
                      {step.done ? (
                        <Icon name="check" size={13} color="#ffffff" />
                      ) : (
                        <Icon name={step.icon as any} size={13} color="#c0c0c0" />
                      )}
                    </View>
                  )}

                  {!isLast && (
                    <View
                      style={[
                        styles.line,
                        step.done && styles.lineDone,
                      ]}
                    />
                  )}
                </View>

                {/* Content */}
                <View style={[styles.timelineContent, isLast && { paddingBottom: 0 }]}>
                  <LocalizedText
                    style={[
                      styles.stepTitle,
                      step.current && styles.stepTitleCurrent,
                      !step.done && !step.current && styles.stepTitlePending,
                    ]}
                  >
                    {step.title}
                  </LocalizedText>
                  <LocalizedText
                    style={[
                      styles.stepTime,
                      step.current && styles.stepTimeCurrent,
                    ]}
                  >
                    {step.time}
                  </LocalizedText>
                </View>
              </Animated.View>
            );
          })}
        </View>

        {/* Delivery Address */}
        <Animated.View
          style={[
            styles.deliveryCard,
            {
              opacity: deliveryAnim,
              transform: [
                {
                  translateY: deliveryAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [20, 0],
                  }),
                },
              ],
            },
          ]}
        >
          <View style={styles.deliveryIconWrapper}>
            <Icon name="map-pin" size={18} color="#55cc70" />
          </View>
          <View style={styles.deliveryInfo}>
            <LocalizedText style={styles.deliveryLabel}>Delivery Address</LocalizedText>
            <LocalizedText style={styles.deliveryText}>
              6391 Elgin St. Celina, Delaware 10299
            </LocalizedText>
          </View>
        </Animated.View>

        {/* Help Card */}
        <Animated.View
          style={[
            styles.helpCard,
            {
              opacity: deliveryAnim,
              transform: [
                {
                  translateY: deliveryAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [20, 0],
                  }),
                },
              ],
            },
          ]}
        >
          <Icon name="headphones" size={20} color="#55cc70" style={{ marginRight: 12 }} />
          <View style={{ flex: 1 }}>
            <LocalizedText style={styles.helpTitle}>Need Help?</LocalizedText>
            <LocalizedText style={styles.helpSubtitle}>Contact support regarding this order</LocalizedText>
          </View>
          <Icon name="chevron-right" size={20} color="#c0c0c0" />
        </Animated.View>
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
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: 'Poppins-Bold',
    color: '#1a1a1a',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },

  // ETA Card
  etaCard: {
    backgroundColor: '#ffffff',
    borderRadius: 24,
    paddingVertical: 28,
    paddingHorizontal: 20,
    alignItems: 'center',
    marginBottom: 28,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 4,
  },
  etaIconWrapper: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(85, 204, 112, 0.12)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  orderId: {
    fontSize: 15,
    fontFamily: 'Poppins-SemiBold',
    color: '#7a7a7a',
    marginBottom: 6,
  },
  etaText: {
    fontSize: 22,
    fontFamily: 'Poppins-Bold',
    color: '#1a1a1a',
    marginBottom: 14,
  },
  etaBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(74, 144, 226, 0.12)',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
  },
  liveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#4A90E2',
    marginRight: 8,
  },
  etaBadgeText: {
    fontSize: 13,
    fontFamily: 'Poppins-SemiBold',
    color: '#4A90E2',
  },

  sectionTitle: {
    fontSize: 16,
    fontFamily: 'Poppins-Bold',
    color: '#1a1a1a',
    marginBottom: 20,
  },

  // Timeline
  timelineContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  timelineRow: {
    flexDirection: 'row',
  },
  timelineLeft: {
    alignItems: 'center',
    width: 36,
  },
  dot: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#e8e8e8',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  dotDone: {
    backgroundColor: '#55cc70',
  },
  dotPending: {
    backgroundColor: '#f0f0f0',
    borderWidth: 1.5,
    borderColor: '#e0e0e0',
  },
  dotCurrentOuter: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(74, 144, 226, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  dotCurrentInner: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#4A90E2',
    justifyContent: 'center',
    alignItems: 'center',
  },
  line: {
    width: 2.5,
    flex: 1,
    backgroundColor: '#e8e8e8',
    minHeight: 36,
  },
  lineDone: {
    backgroundColor: '#55cc70',
  },
  timelineContent: {
    flex: 1,
    paddingLeft: 14,
    paddingBottom: 28,
    justifyContent: 'center',
  },
  stepTitle: {
    fontSize: 15,
    fontFamily: 'Poppins-SemiBold',
    color: '#1a1a1a',
  },
  stepTitleCurrent: {
    color: '#4A90E2',
  },
  stepTitlePending: {
    color: '#b0b0b0',
  },
  stepTime: {
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    color: '#9e9e9e',
    marginTop: 3,
  },
  stepTimeCurrent: {
    color: '#4A90E2',
    fontFamily: 'Poppins-Medium',
  },

  // Delivery Card
  deliveryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 18,
    padding: 16,
    marginBottom: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  deliveryIconWrapper: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: 'rgba(85, 204, 112, 0.12)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  deliveryInfo: {
    flex: 1,
  },
  deliveryLabel: {
    fontSize: 13,
    fontFamily: 'Poppins-SemiBold',
    color: '#1a1a1a',
  },
  deliveryText: {
    fontSize: 13,
    fontFamily: 'Poppins-Regular',
    color: '#7a7a7a',
    marginTop: 2,
    lineHeight: 18,
  },

  // Help Card
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

export default TrackOrderScreen;