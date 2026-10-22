import React, { useEffect, useRef } from 'react';
import LocalizedText from '../../../shared/i18n/LocalizedText';
import { Animated, Easing, ScrollView, StatusBar, StyleSheet, View } from 'react-native';
import TouchableOpacity from '../../../shared/components/AnimatedTouchableOpacity';
import Icon from '@react-native-vector-icons/feather';
import { SafeAreaView } from 'react-native-safe-area-context';

const WEEKLY_EARNINGS = [
  { day: 'M', amount: 12, label: '₹12' },
  { day: 'T', amount: 22, label: '₹22' },
  { day: 'W', amount: 18, label: '₹18' },
  { day: 'T', amount: 24, label: '₹24' },
  { day: 'F', amount: 20, label: '₹20' },
  { day: 'S', amount: 42.5, label: '₹42.50' },
  { day: 'S', amount: 30, label: '₹30' },
];

type EarningBreakdownItem = {
  title: string;
  subtitle: string;
  amount: string;
  icon: React.ComponentProps<typeof Icon>['name'];
  color: string;
};

const EARNING_BREAKDOWN: EarningBreakdownItem[] = [
  { title: 'Delivery earnings', subtitle: '3 completed deliveries', amount: '₹34.50', icon: 'package', color: '#2fa64c' },
  { title: 'Customer tips', subtitle: 'Tips from customers', amount: '₹6.00', icon: 'heart', color: '#e97878' },
  { title: 'Peak hour bonus', subtitle: 'Busy hour incentive', amount: '₹2.00', icon: 'zap', color: '#d49a2a' },
];

const EarningsScreen = ({ navigation }: { navigation: any }) => {
  const headerAnim = useRef(new Animated.Value(0)).current;
  const balanceAnim = useRef(new Animated.Value(0)).current;
  const chartAnim = useRef(new Animated.Value(0)).current;
  const breakdownAnims = useRef(
    EARNING_BREAKDOWN.map(() => new Animated.Value(0)),
  ).current;
  const barAnims = useRef(
    WEEKLY_EARNINGS.map(() => new Animated.Value(0)),
  ).current;

  useEffect(() => {
    const entrance = Animated.stagger(110, [
      Animated.timing(headerAnim, {
        toValue: 1,
        duration: 420,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.spring(balanceAnim, {
        toValue: 1,
        friction: 8,
        tension: 50,
        useNativeDriver: true,
      }),
      Animated.timing(chartAnim, {
        toValue: 1,
        duration: 500,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]);
    entrance.start();
    const rows = breakdownAnims.map((anim, index) =>
      Animated.timing(anim, {
        toValue: 1,
        duration: 360,
        delay: index * 70,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    );
    Animated.stagger(45, rows).start();
    const bars = barAnims.map((anim, index) =>
      Animated.spring(anim, {
        toValue: 1,
        delay: index * 65,
        friction: 7,
        tension: 45,
        useNativeDriver: true,
      }),
    );
    Animated.stagger(45, bars).start();

    return () => {
      entrance.stop();
      rows.forEach((animation) => animation.stop());
      bars.forEach((animation) => animation.stop());
    };
  }, [balanceAnim, barAnims, breakdownAnims, chartAnim, headerAnim]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Animated.View
          style={[
            styles.header,
            {
              opacity: headerAnim,
              transform: [{
                translateY: headerAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [-14, 0],
                }),
              }],
            },
          ]}
        >
          <TouchableOpacity
            accessibilityRole="button"
            accessibilityLabel="Go back"
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <Icon name="arrow-left" size={19} color="#253329" />
          </TouchableOpacity>
          <View style={styles.headerCopy}>
            <LocalizedText style={styles.eyebrow}>YOUR MONEY</LocalizedText>
            <LocalizedText style={styles.title}>Earnings</LocalizedText>
          </View>
        </Animated.View>

        <Animated.View
          style={[
            styles.balanceCard,
            {
              opacity: balanceAnim,
              transform: [{
                translateY: balanceAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [24, 0],
                }),
              }],
            },
          ]}
        >
          <View style={styles.balanceDecorLarge} />
          <View style={styles.balanceDecorSmall} />
          <View style={styles.balanceTop}>
            <View>
              <LocalizedText style={styles.balanceCaption}>TOTAL EARNED THIS WEEK</LocalizedText>
              <LocalizedText style={styles.balanceAmount}>₹168.50</LocalizedText>
            </View>
            <View style={styles.balanceIcon}>
              <Icon name="trending-up" size={21} color="#ffffff" />
            </View>
          </View>
          <View style={styles.balanceDivider} />
          <View style={styles.balanceBottom}>
            <View style={styles.balanceMetric}>
              <Icon name="package" size={14} color="rgba(255,255,255,0.8)" />
              <LocalizedText style={styles.balanceMetricText}>12 deliveries</LocalizedText>
            </View>
            <View style={styles.growthPill}>
              <Icon name="arrow-up-right" size={12} color="#ffffff" />
              <LocalizedText style={styles.growthText}>12% this week</LocalizedText>
            </View>
          </View>
        </Animated.View>

        <Animated.View
          style={[
            styles.chartCard,
            {
              opacity: chartAnim,
              transform: [{
                translateY: chartAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [20, 0],
                }),
              }],
            },
          ]}
        >
          <View style={styles.sectionHeader}>
            <View>
              <LocalizedText style={styles.sectionTitle}>Weekly overview</LocalizedText>
              <LocalizedText style={styles.sectionSubtitle}>Your earnings over the last 7 days</LocalizedText>
            </View>
            <View style={styles.chartPeriod}>
              <LocalizedText style={styles.chartPeriodText}>This week</LocalizedText>
              <Icon name="chevron-down" size={13} color="#657168" />
            </View>
          </View>
          <View style={styles.chart}>
            {WEEKLY_EARNINGS.map((item, index) => {
              const barHeight = 42 + item.amount;
              const barAnim = barAnims[index];
              return (
                <View key={`${item.day}-${index}`} style={styles.chartColumn}>
                  <View style={styles.barArea}>
                    <LocalizedText style={styles.barValue}>{item.label}</LocalizedText>
                    <Animated.View
                      style={[
                        styles.chartBar,
                        {
                          height: barHeight,
                          opacity: barAnim,
                          transform: [{
                            scaleY: barAnim.interpolate({
                              inputRange: [0, 1],
                              outputRange: [0.03, 1],
                            }),
                          }],
                        },
                        index === 5 && styles.chartBarHighlight,
                      ]}
                    />
                  </View>
                  <LocalizedText style={[styles.chartDay, index === 5 && styles.chartDayHighlight]}>
                    {item.day}
                  </LocalizedText>
                </View>
              );
            })}
          </View>
          <View style={styles.chartLegend}>
            <View style={styles.legendDot} />
            <LocalizedText style={styles.legendText}>Daily earnings</LocalizedText>
          </View>
        </Animated.View>

        <View style={styles.payoutCard}>
          <View style={styles.payoutIcon}>
            <Icon name="credit-card" size={19} color="#4A90E2" />
          </View>
          <View style={styles.payoutCopy}>
            <LocalizedText style={styles.payoutTitle}>Next payout</LocalizedText>
            <LocalizedText style={styles.payoutSubtitle}>Friday · Bank account •••• 4821</LocalizedText>
          </View>
          <LocalizedText style={styles.payoutAmount}>₹126.00</LocalizedText>
        </View>

        <View style={styles.breakdownHeader}>
          <View>
            <LocalizedText style={styles.sectionTitle}>Earnings breakdown</LocalizedText>
            <LocalizedText style={styles.sectionSubtitle}>Where your money comes from</LocalizedText>
          </View>
          <LocalizedText style={styles.breakdownTotal}>₹42.50 today</LocalizedText>
        </View>

        {EARNING_BREAKDOWN.map((item, index) => {
          const anim = breakdownAnims[index];
          return (
            <Animated.View
              key={item.title}
              style={{
                opacity: anim,
                transform: [{
                  translateY: anim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [16, 0],
                  }),
                }],
              }}
            >
              <View style={styles.breakdownRow}>
                <View style={[styles.breakdownIcon, { backgroundColor: `${item.color}16` }]}>
                  <Icon name={item.icon} size={17} color={item.color} />
                </View>
                <View style={styles.breakdownCopy}>
                  <LocalizedText style={styles.breakdownTitle}>{item.title}</LocalizedText>
                  <LocalizedText style={styles.breakdownSubtitle}>{item.subtitle}</LocalizedText>
                </View>
                <LocalizedText style={styles.breakdownAmount}>{item.amount}</LocalizedText>
              </View>
            </Animated.View>
          );
        })}

        <TouchableOpacity
          accessibilityRole="button"
          style={styles.historyButton}
          activeOpacity={0.8}
          onPress={() => navigation.navigate('PayoutHistoryScreen')}
        >
          <Icon name="clock" size={16} color="#258e43" />
          <LocalizedText style={styles.historyButtonText}>View payout history</LocalizedText>
          <Icon name="arrow-right" size={15} color="#258e43" />
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#ffffff' },
  content: { paddingHorizontal: 18, paddingBottom: 30 },
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    paddingTop: 12,
    paddingBottom: 17,
  },
  backButton: {
    alignItems: 'center',
    backgroundColor: '#f3f7f3',
    borderRadius: 13,
    height: 42,
    justifyContent: 'center',
    width: 42,
  },
  headerCopy: { flex: 1, marginLeft: 12 },
  eyebrow: {
    color: '#2fa64c',
    fontFamily: 'Poppins-SemiBold',
    fontSize: 9,
    letterSpacing: 1,
  },
  title: { color: '#202820', fontFamily: 'Poppins-Bold', fontSize: 22 },
  balanceCard: {
    backgroundColor: '#258e43',
    borderRadius: 22,
    marginBottom: 17,
    overflow: 'hidden',
    padding: 19,
  },
  balanceDecorLarge: {
    backgroundColor: 'rgba(255,255,255,0.09)',
    borderRadius: 90,
    height: 180,
    position: 'absolute',
    right: -55,
    top: -100,
    width: 180,
  },
  balanceDecorSmall: {
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: 52,
    bottom: -40,
    height: 104,
    position: 'absolute',
    right: 65,
    width: 104,
  },
  balanceTop: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between' },
  balanceCaption: {
    color: 'rgba(255,255,255,0.78)',
    fontFamily: 'Poppins-SemiBold',
    fontSize: 9,
    letterSpacing: 0.8,
  },
  balanceAmount: {
    color: '#ffffff',
    fontFamily: 'Poppins-Bold',
    fontSize: 34,
    marginTop: 3,
  },
  balanceIcon: {
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.18)',
    borderRadius: 17,
    height: 46,
    justifyContent: 'center',
    width: 46,
  },
  balanceDivider: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    height: StyleSheet.hairlineWidth,
    marginVertical: 15,
  },
  balanceBottom: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between' },
  balanceMetric: { alignItems: 'center', flexDirection: 'row' },
  balanceMetricText: {
    color: 'rgba(255,255,255,0.9)',
    fontFamily: 'Poppins-Medium',
    fontSize: 10,
    marginLeft: 6,
  },
  growthPill: {
    alignItems: 'center',
    backgroundColor: 'rgba(15,92,37,0.3)',
    borderRadius: 11,
    flexDirection: 'row',
    paddingHorizontal: 9,
    paddingVertical: 6,
  },
  growthText: {
    color: '#ffffff',
    fontFamily: 'Poppins-SemiBold',
    fontSize: 9,
    marginLeft: 4,
  },
  chartCard: {
    backgroundColor: '#ffffff',
    borderColor: '#edf1ed',
    borderRadius: 19,
    borderWidth: 1,
    marginBottom: 14,
    padding: 15,
  },
  sectionHeader: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between' },
  sectionTitle: { color: '#202820', fontFamily: 'Poppins-SemiBold', fontSize: 14 },
  sectionSubtitle: { color: '#89918a', fontFamily: 'Poppins-Regular', fontSize: 9, marginTop: 2 },
  chartPeriod: {
    alignItems: 'center',
    backgroundColor: '#f4f7f4',
    borderRadius: 9,
    flexDirection: 'row',
    paddingHorizontal: 8,
    paddingVertical: 6,
  },
  chartPeriodText: { color: '#657168', fontFamily: 'Poppins-Medium', fontSize: 8, marginRight: 4 },
  chart: {
    alignItems: 'flex-end',
    flexDirection: 'row',
    height: 145,
    justifyContent: 'space-between',
    marginTop: 18,
    paddingHorizontal: 3,
  },
  chartColumn: { alignItems: 'center', flex: 1, height: '100%', justifyContent: 'flex-end' },
  barArea: { alignItems: 'center', flex: 1, justifyContent: 'flex-end', width: '100%' },
  barValue: { color: '#9aa39b', fontFamily: 'Poppins-Medium', fontSize: 8, marginBottom: 5 },
  chartBar: {
    backgroundColor: '#a9dfb4',
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
    maxHeight: 105,
    minHeight: 20,
    width: 18,
  },
  chartBarHighlight: { backgroundColor: '#2fa64c' },
  chartDay: { color: '#929b93', fontFamily: 'Poppins-Medium', fontSize: 9, marginTop: 7 },
  chartDayHighlight: { color: '#258e43', fontFamily: 'Poppins-Bold' },
  chartLegend: { alignItems: 'center', flexDirection: 'row', marginTop: 12 },
  legendDot: { backgroundColor: '#2fa64c', borderRadius: 4, height: 7, width: 7 },
  legendText: { color: '#778078', fontFamily: 'Poppins-Regular', fontSize: 9, marginLeft: 6 },
  payoutCard: {
    alignItems: 'center',
    backgroundColor: '#f4f8ff',
    borderColor: '#e1ebfb',
    borderRadius: 16,
    borderWidth: 1,
    flexDirection: 'row',
    marginBottom: 22,
    padding: 13,
  },
  payoutIcon: {
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    height: 40,
    justifyContent: 'center',
    marginRight: 10,
    width: 40,
  },
  payoutCopy: { flex: 1 },
  payoutTitle: { color: '#293b55', fontFamily: 'Poppins-SemiBold', fontSize: 11 },
  payoutSubtitle: { color: '#8391a5', fontFamily: 'Poppins-Regular', fontSize: 8, marginTop: 2 },
  payoutAmount: { color: '#386eb6', fontFamily: 'Poppins-Bold', fontSize: 13 },
  breakdownHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  breakdownTotal: { color: '#258e43', fontFamily: 'Poppins-SemiBold', fontSize: 9 },
  breakdownRow: {
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderBottomColor: '#edf0ed',
    borderBottomWidth: StyleSheet.hairlineWidth,
    flexDirection: 'row',
    minHeight: 66,
    paddingVertical: 8,
  },
  breakdownIcon: {
    alignItems: 'center',
    borderRadius: 12,
    height: 39,
    justifyContent: 'center',
    marginRight: 10,
    width: 39,
  },
  breakdownCopy: { flex: 1 },
  breakdownTitle: { color: '#303a32', fontFamily: 'Poppins-SemiBold', fontSize: 10 },
  breakdownSubtitle: { color: '#929a93', fontFamily: 'Poppins-Regular', fontSize: 8, marginTop: 2 },
  breakdownAmount: { color: '#303a32', fontFamily: 'Poppins-SemiBold', fontSize: 11 },
  historyButton: {
    alignItems: 'center',
    backgroundColor: '#f1faf3',
    borderColor: '#d9efde',
    borderRadius: 13,
    borderWidth: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 18,
    minHeight: 48,
  },
  historyButtonText: {
    color: '#258e43',
    fontFamily: 'Poppins-SemiBold',
    fontSize: 11,
    marginHorizontal: 8,
  },
});

export default EarningsScreen;
