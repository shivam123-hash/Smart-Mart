import React, { useEffect, useRef } from 'react';
import LocalizedText from '../../../shared/i18n/LocalizedText';
import { Animated, Easing, ScrollView, StatusBar, StyleSheet, View } from 'react-native';
import TouchableOpacity from '../../../shared/components/AnimatedTouchableOpacity';
import Icon from '@react-native-vector-icons/feather';
import { SafeAreaView } from 'react-native-safe-area-context';

const PAYOUTS = [
  {
    id: 'PO-1084',
    date: 'Friday, Oct 18',
    amount: '₹126.00',
    status: 'Processing',
    method: 'Bank account •••• 4821',
  },
  {
    id: 'PO-1076',
    date: 'Friday, Oct 11',
    amount: '₹184.25',
    status: 'Paid',
    method: 'Bank account •••• 4821',
  },
  {
    id: 'PO-1068',
    date: 'Friday, Oct 4',
    amount: '₹152.75',
    status: 'Paid',
    method: 'Bank account •••• 4821',
  },
];

const PayoutHistoryScreen = ({ navigation }: { navigation: any }) => {
  const headerAnim = useRef(new Animated.Value(0)).current;
  const balanceAnim = useRef(new Animated.Value(0)).current;
  const payoutAnims = useRef(PAYOUTS.map(() => new Animated.Value(0))).current;
  const processingPulse = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const entrance = Animated.stagger(100, [
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
    ]);
    entrance.start();
    const payoutRows = payoutAnims.map((anim, index) =>
      Animated.timing(anim, {
        toValue: 1,
        duration: 380,
        delay: index * 80,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    );
    Animated.stagger(60, payoutRows).start();

    return () => {
      entrance.stop();
      payoutRows.forEach((animation) => animation.stop());
    };
  }, [balanceAnim, headerAnim, payoutAnims]);

  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(processingPulse, {
          toValue: 1.5,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(processingPulse, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
      ]),
    );
    pulse.start();
    return () => pulse.stop();
  }, [processingPulse]);

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
            accessibilityLabel="Go back to earnings"
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <Icon name="arrow-left" size={19} color="#253329" />
          </TouchableOpacity>
          <View style={styles.headerCopy}>
            <LocalizedText style={styles.eyebrow}>YOUR MONEY</LocalizedText>
            <LocalizedText style={styles.title}>Payout history</LocalizedText>
          </View>
        </Animated.View>

        <Animated.View
          style={[
            styles.payoutOverview,
            {
              opacity: balanceAnim,
              transform: [{
                translateY: balanceAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [20, 0],
                }),
              }],
            },
          ]}
        >
          <View style={styles.overviewIcon}>
            <Icon name="credit-card" size={19} color="#258e43" />
          </View>
          <LocalizedText style={styles.overviewLabel}>NEXT PAYOUT</LocalizedText>
          <LocalizedText style={styles.overviewAmount}>₹126.00</LocalizedText>
          <View style={styles.processingBadge}>
            <Animated.View
              style={[
                styles.processingDot,
                { transform: [{ scale: processingPulse }] },
              ]}
            />
            <LocalizedText style={styles.processingText}>Processing · Friday, Oct 18</LocalizedText>
          </View>
          <View style={styles.overviewDivider} />
          <View style={styles.bankRow}>
            <View style={styles.bankIcon}>
              <Icon name="briefcase" size={16} color="#5078ad" />
            </View>
            <View style={styles.bankCopy}>
              <LocalizedText style={styles.bankName}>Primary bank account</LocalizedText>
              <LocalizedText style={styles.bankNumber}>Checking account •••• 4821</LocalizedText>
            </View>
            <Icon name="check-circle" size={17} color="#2fa64c" />
          </View>
        </Animated.View>

        <View style={styles.historyHeading}>
          <View>
            <LocalizedText style={styles.sectionTitle}>Recent payouts</LocalizedText>
            <LocalizedText style={styles.sectionSubtitle}>Your weekly payment activity</LocalizedText>
          </View>
          <View style={styles.paidTotalBadge}>
            <Icon name="check" size={11} color="#258e43" />
            <LocalizedText style={styles.paidTotalText}>3 PAYOUTS</LocalizedText>
          </View>
        </View>

        {PAYOUTS.map((payout, index) => {
          const anim = payoutAnims[index];
          const processing = payout.status === 'Processing';
          return (
            <Animated.View
              key={payout.id}
              style={{
                opacity: anim,
                transform: [{
                  translateY: anim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [18, 0],
                  }),
                }],
              }}
            >
              <View style={styles.payoutRow}>
                <View style={[styles.payoutIcon, processing && styles.processingIcon]}>
                  <Icon
                    name={processing ? 'clock' : 'check'}
                    size={17}
                    color={processing ? '#d49a2a' : '#258e43'}
                  />
                </View>
                <View style={styles.payoutDetails}>
                  <LocalizedText style={styles.payoutDate}>{payout.date}</LocalizedText>
                  <LocalizedText style={styles.payoutId}>Payout #{payout.id}</LocalizedText>
                  <LocalizedText style={styles.payoutMethod}>{payout.method}</LocalizedText>
                  <View
                    style={[
                      styles.statusBadge,
                      processing ? styles.processingStatus : styles.paidStatus,
                    ]}
                  >
                    <LocalizedText
                      style={[
                        styles.statusText,
                        processing ? styles.processingStatusText : styles.paidStatusText,
                      ]}
                    >
                      {payout.status}
                    </LocalizedText>
                  </View>
                </View>
                <LocalizedText style={styles.payoutAmount}>{payout.amount}</LocalizedText>
              </View>
            </Animated.View>
          );
        })}

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
    paddingBottom: 18,
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
  title: { color: '#202820', fontFamily: 'Poppins-Bold', fontSize: 21 },
  payoutOverview: {
    alignItems: 'center',
    backgroundColor: '#f5f9ff',
    borderColor: '#e2ecfa',
    borderRadius: 21,
    borderWidth: 1,
    marginBottom: 25,
    padding: 18,
  },
  overviewIcon: {
    alignItems: 'center',
    backgroundColor: '#e5f4e9',
    borderRadius: 17,
    height: 44,
    justifyContent: 'center',
    marginBottom: 9,
    width: 44,
  },
  overviewLabel: {
    color: '#8190a4',
    fontFamily: 'Poppins-SemiBold',
    fontSize: 9,
    letterSpacing: 0.8,
  },
  overviewAmount: {
    color: '#24364e',
    fontFamily: 'Poppins-Bold',
    fontSize: 33,
    marginTop: 2,
  },
  processingBadge: {
    alignItems: 'center',
    backgroundColor: '#fff4dc',
    borderRadius: 11,
    flexDirection: 'row',
    marginTop: 7,
    paddingHorizontal: 10,
    paddingVertical: 7,
  },
  processingDot: {
    backgroundColor: '#e1a432',
    borderRadius: 4,
    height: 7,
    marginRight: 6,
    width: 7,
  },
  processingText: { color: '#9b762e', fontFamily: 'Poppins-Medium', fontSize: 9 },
  overviewDivider: {
    backgroundColor: '#e1e9f3',
    height: StyleSheet.hairlineWidth,
    marginVertical: 17,
    width: '100%',
  },
  bankRow: { alignItems: 'center', flexDirection: 'row', width: '100%' },
  bankIcon: {
    alignItems: 'center',
    backgroundColor: '#eaf1fa',
    borderRadius: 11,
    height: 37,
    justifyContent: 'center',
    marginRight: 10,
    width: 37,
  },
  bankCopy: { flex: 1 },
  bankName: { color: '#34445a', fontFamily: 'Poppins-SemiBold', fontSize: 10 },
  bankNumber: { color: '#8391a5', fontFamily: 'Poppins-Regular', fontSize: 8, marginTop: 2 },
  historyHeading: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  sectionTitle: { color: '#202820', fontFamily: 'Poppins-SemiBold', fontSize: 14 },
  sectionSubtitle: { color: '#89918a', fontFamily: 'Poppins-Regular', fontSize: 9, marginTop: 2 },
  paidTotalBadge: {
    alignItems: 'center',
    backgroundColor: '#eaf8ed',
    borderRadius: 9,
    flexDirection: 'row',
    paddingHorizontal: 8,
    paddingVertical: 6,
  },
  paidTotalText: {
    color: '#258e43',
    fontFamily: 'Poppins-SemiBold',
    fontSize: 8,
    letterSpacing: 0.4,
    marginLeft: 4,
  },
  payoutRow: {
    alignItems: 'flex-start',
    backgroundColor: '#ffffff',
    borderColor: '#edf0ed',
    borderRadius: 16,
    borderWidth: 1,
    flexDirection: 'row',
    marginBottom: 11,
    padding: 13,
  },
  payoutIcon: {
    alignItems: 'center',
    backgroundColor: '#eaf8ed',
    borderRadius: 12,
    height: 40,
    justifyContent: 'center',
    marginRight: 10,
    width: 40,
  },
  processingIcon: { backgroundColor: '#fff4dc' },
  payoutDetails: { flex: 1 },
  payoutDate: { color: '#303a32', fontFamily: 'Poppins-SemiBold', fontSize: 11 },
  payoutId: { color: '#929a93', fontFamily: 'Poppins-Regular', fontSize: 8, marginTop: 2 },
  payoutMethod: { color: '#7c877e', fontFamily: 'Poppins-Regular', fontSize: 8, marginTop: 5 },
  statusBadge: {
    alignSelf: 'flex-start',
    borderRadius: 7,
    marginTop: 6,
    paddingHorizontal: 7,
    paddingVertical: 4,
  },
  processingStatus: { backgroundColor: '#fff4dc' },
  paidStatus: { backgroundColor: '#eaf8ed' },
  statusText: { fontFamily: 'Poppins-SemiBold', fontSize: 8 },
  processingStatusText: { color: '#9b762e' },
  paidStatusText: { color: '#258e43' },
  payoutAmount: { color: '#26372a', fontFamily: 'Poppins-Bold', fontSize: 13, marginLeft: 6 },
});

export default PayoutHistoryScreen;
