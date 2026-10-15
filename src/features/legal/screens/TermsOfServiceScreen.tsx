import React, { useState, useRef, useEffect } from 'react';
import LocalizedText from '../../../shared/i18n/LocalizedText';
import { View, StyleSheet, ScrollView, StatusBar, Animated, Easing, Linking, LayoutChangeEvent, NativeSyntheticEvent, NativeScrollEvent } from 'react-native';
import TouchableOpacity from '../../../shared/components/AnimatedTouchableOpacity';
import Icon from '@react-native-vector-icons/feather';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const APP_NAME = 'YourApp';
const LAST_UPDATED = 'October 14, 2026';
const SUPPORT_EMAIL = 'support@yourapp.com';

interface TermsSection {
  id: string;
  short: string;
  title: string;
  icon: string;
  color: string;
  paragraphs?: string[];
  bullets?: string[];
}

// PLACEHOLDER COPY: replace with your real terms, reviewed by a lawyer.
const SECTIONS: TermsSection[] = [
  {
    id: 'acceptance',
    short: 'Acceptance',
    title: 'Accepting These Terms',
    icon: 'check-circle',
    color: '#55cc70',
    paragraphs: [
      `By creating an account or using ${APP_NAME}, you agree to these Terms of Service. If you do not agree, please do not use the app.`,
      'You must be at least 18 years old, or have permission from a parent or guardian, to place orders.',
    ],
  },
  {
    id: 'account',
    short: 'Your account',
    title: 'Your Account',
    icon: 'user',
    color: '#4A90E2',
    paragraphs: ['You are responsible for keeping your account safe.'],
    bullets: [
      'Give accurate name, phone number and address details.',
      'Keep your password and OTPs private. Do not share them with anyone.',
      'Tell us right away if you think someone else is using your account.',
      'You are responsible for activity that happens under your account.',
    ],
  },
  {
    id: 'orders',
    short: 'Orders & pricing',
    title: 'Orders & Pricing',
    icon: 'shopping-bag',
    color: '#F39C12',
    paragraphs: [
      'An order is confirmed only after you receive a confirmation in the app. Prices, offers and item availability can change without notice.',
      'If an item is unavailable or priced incorrectly, we may cancel or adjust that item and refund you for it.',
    ],
  },
  {
    id: 'payments',
    short: 'Payments',
    title: 'Payments',
    icon: 'credit-card',
    color: '#9B59B6',
    paragraphs: [
      'You can pay with the methods shown at checkout, such as cards, UPI and wallets. Payments are processed by our payment partners, and you agree to their terms when you use them.',
      'You confirm that you are allowed to use the payment method you add.',
    ],
  },
  {
    id: 'delivery',
    short: 'Delivery',
    title: 'Delivery',
    icon: 'truck',
    color: '#1ABC9C',
    paragraphs: [
      'Delivery times shown in the app are estimates and can change because of traffic, weather or high demand.',
    ],
    bullets: [
      'Make sure someone is available at the address to receive the order.',
      'If we cannot reach you or deliver, the order may be cancelled.',
      'Check items at delivery and report any issues in the app quickly.',
    ],
  },
  {
    id: 'refunds',
    short: 'Cancellations & refunds',
    title: 'Cancellations & Refunds',
    icon: 'rotate-ccw',
    color: '#FF6B6B',
    paragraphs: [
      'You can cancel an order before it is marked as Preparing. After that, the items are packed and cannot be changed.',
      'If an item is missing, damaged or incorrect, report it from My Orders and we will refund or replace it after review. Approved refunds usually reach your original payment method within 5-7 business days.',
    ],
  },
  {
    id: 'conduct',
    short: 'Acceptable use',
    title: 'Acceptable Use',
    icon: 'slash',
    color: '#ff4d4f',
    paragraphs: ['Please use the app fairly and lawfully. You agree not to:'],
    bullets: [
      'Misuse offers, promo codes or referral programs.',
      'Give false information or place fake orders.',
      'Harass our delivery partners or support team.',
      'Try to hack, copy, or disrupt the app or its services.',
    ],
  },
  {
    id: 'ip',
    short: 'Ownership',
    title: 'Ownership & Content',
    icon: 'award',
    color: '#7F8C8D',
    paragraphs: [
      `The ${APP_NAME} name, logo, design and content belong to us or our licensors. You may use the app for personal use only, and you may not copy, resell or modify any part of it without our written permission.`,
    ],
  },
  {
    id: 'liability',
    short: 'Liability',
    title: 'Limits of Liability',
    icon: 'alert-triangle',
    color: '#F39C12',
    paragraphs: [
      'We work hard to keep the app running smoothly, but we cannot promise it will always be available or error free. To the extent allowed by law, we are not responsible for indirect or incidental losses arising from your use of the app.',
      'Nothing in these terms limits your rights under applicable consumer protection laws.',
    ],
  },
  {
    id: 'termination',
    short: 'Termination',
    title: 'Suspension & Termination',
    icon: 'user-x',
    color: '#9B59B6',
    paragraphs: [
      'You can stop using the app or delete your account anytime from Settings. We may suspend or close accounts that break these terms or are used for fraud or abuse.',
    ],
  },
  {
    id: 'law',
    short: 'Governing law',
    title: 'Governing Law & Changes',
    icon: 'book-open',
    color: '#4A90E2',
    paragraphs: [
      'These terms are governed by the laws of India, and disputes are subject to the courts of your registered jurisdiction.',
      'We may update these terms from time to time. When we make important changes, we will let you know in the app. Continuing to use the app means you accept the updated terms.',
    ],
  },
];

const TermsOfServiceScreen = ({ navigation }: any) => {
  const insets = useSafeAreaInsets();
  const scrollRef = useRef<React.ComponentRef<typeof ScrollView>>(null);
  const sectionY = useRef<Record<string, number>>({});
  const [showTop, setShowTop] = useState(false);
  const [activeChip, setActiveChip] = useState<string | null>(null);

  // Animations
  const headerAnim = useRef(new Animated.Value(0)).current;
  const introAnim = useRef(new Animated.Value(0)).current;
  const chipsAnim = useRef(new Animated.Value(0)).current;
  const sectionAnims = useRef(SECTIONS.map(() => new Animated.Value(0))).current;
  const contactAnim = useRef(new Animated.Value(0)).current;
  const topBtnAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.stagger(80, [
      Animated.timing(headerAnim, {
        toValue: 1,
        duration: 380,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.spring(introAnim, {
        toValue: 1,
        friction: 7,
        tension: 50,
        useNativeDriver: true,
      }),
      Animated.timing(chipsAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start();

    const anims = sectionAnims.map((anim, index) =>
      Animated.timing(anim, {
        toValue: 1,
        duration: 420,
        delay: 300 + index * 70,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      })
    );
    Animated.stagger(40, anims).start();

    Animated.timing(contactAnim, {
      toValue: 1,
      duration: 400,
      delay: 300 + SECTIONS.length * 70,
      useNativeDriver: true,
    }).start();
  }, []);

  useEffect(() => {
    Animated.spring(topBtnAnim, {
      toValue: showTop ? 1 : 0,
      friction: 8,
      tension: 70,
      useNativeDriver: true,
    }).start();
  }, [showTop]);

  const handleScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const shouldShow = e.nativeEvent.contentOffset.y > 400;
    if (shouldShow !== showTop) setShowTop(shouldShow);
  };

  const handleSectionLayout = (id: string) => (e: LayoutChangeEvent) => {
    sectionY.current[id] = e.nativeEvent.layout.y;
  };

  const jumpTo = (id: string) => {
    setActiveChip(id);
    const y = sectionY.current[id];
    if (y !== undefined) {
      scrollRef.current?.scrollTo({ y: Math.max(0, y - 12), animated: true });
    }
  };

  const fadeUp = (anim: Animated.Value, distance = 20) => ({
    opacity: anim,
    transform: [
      {
        translateY: anim.interpolate({
          inputRange: [0, 1],
          outputRange: [distance, 0],
        }),
      },
    ],
  });

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
        <LocalizedText style={styles.headerTitle}>Terms of Service</LocalizedText>
        <View style={{ width: 40 }} />
      </Animated.View>

      <ScrollView
        ref={scrollRef}
        showsVerticalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={64}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + 30 },
        ]}
      >
        {/* Intro */}
        <Animated.View
          style={[
            styles.introCard,
            {
              opacity: introAnim,
              transform: [
                {
                  translateY: introAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [24, 0],
                  }),
                },
                {
                  scale: introAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.94, 1],
                  }),
                },
              ],
            },
          ]}
        >
          <View style={styles.introIcon}>
            <Icon name="file-text" size={28} color="#55cc70" />
          </View>
          <LocalizedText style={styles.introTitle}>Terms of Service</LocalizedText>
          <LocalizedText style={styles.introSubtitle}>
            Please read these terms carefully. They explain the rules for using {APP_NAME}.
          </LocalizedText>
          <View style={styles.updatedBadge}>
            <Icon name="clock" size={12} color="#55cc70" style={{ marginRight: 6 }} />
            <LocalizedText style={styles.updatedText}>Last updated {LAST_UPDATED}</LocalizedText>
          </View>
        </Animated.View>

        {/* Jump chips */}
        <Animated.View style={fadeUp(chipsAnim, 12)}>
          <LocalizedText style={styles.sectionTitle}>Jump to</LocalizedText>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.chipRow}
          >
            {SECTIONS.map((s) => {
              const active = activeChip === s.id;
              return (
                <TouchableOpacity
                  key={s.id}
                  style={[styles.chip, active && styles.chipActive]}
                  activeOpacity={0.8}
                  onPress={() => jumpTo(s.id)}
                >
                  <LocalizedText style={[styles.chipText, active && styles.chipTextActive]}>
                    {s.short}
                  </LocalizedText>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </Animated.View>

        {/* Sections */}
        {SECTIONS.map((section, index) => (
          <Animated.View
            key={section.id}
            onLayout={handleSectionLayout(section.id)}
            style={[styles.card, fadeUp(sectionAnims[index])]}
          >
            <View style={styles.cardHeader}>
              <View
                style={[styles.cardIcon, { backgroundColor: `${section.color}15` }]}
              >
                <Icon name={section.icon as any} size={20} color={section.color} />
              </View>
              <LocalizedText style={styles.cardTitle}>{section.title}</LocalizedText>
            </View>

            {section.paragraphs?.map((p, i) => (
              <LocalizedText key={i} style={styles.paragraph}>
                {p}
              </LocalizedText>
            ))}

            {section.bullets?.map((b, i) => (
              <View key={i} style={styles.bulletRow}>
                <View style={[styles.bulletDot, { backgroundColor: section.color }]} />
                <LocalizedText style={styles.bulletText}>{b}</LocalizedText>
              </View>
            ))}
          </Animated.View>
        ))}

        {/* Contact + related */}
        <Animated.View style={fadeUp(contactAnim)}>
          <TouchableOpacity
            style={styles.linkCard}
            activeOpacity={0.85}
            onPress={() => navigation.navigate('PrivacyPolicyScreen')}
          >
            <View style={styles.linkIcon}>
              <Icon name="shield" size={20} color="#55cc70" />
            </View>
            <View style={{ flex: 1 }}>
              <LocalizedText style={styles.linkTitle}>Privacy Policy</LocalizedText>
              <LocalizedText style={styles.linkSubtitle}>See how we handle your data</LocalizedText>
            </View>
            <Icon name="chevron-right" size={20} color="#c0c0c0" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.linkCard}
            activeOpacity={0.85}
            onPress={() =>
              Linking.openURL(
                `mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent('Terms question')}`
              ).catch(() => {})
            }
          >
            <View style={styles.linkIcon}>
              <Icon name="mail" size={20} color="#55cc70" />
            </View>
            <View style={{ flex: 1 }}>
              <LocalizedText style={styles.linkTitle}>Questions about these terms?</LocalizedText>
              <LocalizedText style={styles.linkSubtitle}>{SUPPORT_EMAIL}</LocalizedText>
            </View>
            <Icon name="chevron-right" size={20} color="#c0c0c0" />
          </TouchableOpacity>

          <View style={styles.infoNote}>
            <Icon name="info" size={16} color="#55cc70" style={{ marginRight: 10 }} />
            <LocalizedText style={styles.infoNoteText}>
              By using {APP_NAME}, you agree to these Terms of Service.
            </LocalizedText>
          </View>
        </Animated.View>
      </ScrollView>

      {/* Back to top */}
      <Animated.View
        pointerEvents={showTop ? 'auto' : 'none'}
        style={[
          styles.topBtnWrapper,
          {
            bottom: insets.bottom + 20,
            opacity: topBtnAnim,
            transform: [
              {
                scale: topBtnAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.6, 1],
                }),
              },
            ],
          },
        ]}
      >
        <TouchableOpacity
          style={styles.topBtn}
          activeOpacity={0.85}
          onPress={() => scrollRef.current?.scrollTo({ y: 0, animated: true })}
        >
          <Icon name="arrow-up" size={20} color="#ffffff" />
        </TouchableOpacity>
      </Animated.View>
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

  // Intro
  introCard: {
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
  introIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(85, 204, 112, 0.12)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  introTitle: {
    fontSize: 22,
    fontFamily: 'Poppins-Bold',
    color: '#1a1a1a',
    marginBottom: 6,
  },
  introSubtitle: {
    fontSize: 13,
    fontFamily: 'Poppins-Regular',
    color: '#7a7a7a',
    textAlign: 'center',
    lineHeight: 21,
    marginBottom: 16,
  },
  updatedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(85, 204, 112, 0.12)',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
  },
  updatedText: {
    fontSize: 12,
    fontFamily: 'Poppins-SemiBold',
    color: '#55cc70',
  },

  // Chips
  chipRow: {
    gap: 10,
    paddingBottom: 20,
    paddingRight: 4,
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 14,
    backgroundColor: '#f0faf3',
    borderWidth: 1.5,
    borderColor: '#d4f0dc',
  },
  chipActive: {
    backgroundColor: '#55cc70',
    borderColor: '#55cc70',
  },
  chipText: {
    fontSize: 13,
    fontFamily: 'Poppins-Medium',
    color: '#55cc70',
  },
  chipTextActive: {
    color: '#ffffff',
  },

  // Section cards
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 18,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  cardTitle: {
    flex: 1,
    fontSize: 15,
    fontFamily: 'Poppins-SemiBold',
    color: '#1a1a1a',
  },
  paragraph: {
    fontSize: 13,
    fontFamily: 'Poppins-Regular',
    color: '#7a7a7a',
    lineHeight: 21,
    marginBottom: 8,
  },
  bulletRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 6,
  },
  bulletDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginTop: 8,
    marginRight: 12,
  },
  bulletText: {
    flex: 1,
    fontSize: 13,
    fontFamily: 'Poppins-Regular',
    color: '#4a4a4a',
    lineHeight: 21,
  },

  // Link cards
  linkCard: {
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
  linkIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: 'rgba(85, 204, 112, 0.12)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  linkTitle: {
    fontSize: 14,
    fontFamily: 'Poppins-SemiBold',
    color: '#1a1a1a',
  },
  linkSubtitle: {
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    color: '#9e9e9e',
    marginTop: 2,
  },
  infoNote: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(85, 204, 112, 0.08)',
    borderRadius: 14,
    padding: 14,
  },
  infoNoteText: {
    flex: 1,
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    color: '#4a4a4a',
    lineHeight: 18,
  },

  // Back to top
  topBtnWrapper: {
    position: 'absolute',
    right: 20,
  },
  topBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#55cc70',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#55cc70',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
});

export default TermsOfServiceScreen;