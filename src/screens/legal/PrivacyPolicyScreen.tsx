import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Animated,
  Easing,
  Linking,
  LayoutChangeEvent,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import Icon from '@react-native-vector-icons/feather';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const APP_NAME = 'YourApp';
const LAST_UPDATED = 'October 14, 2026';
const SUPPORT_EMAIL = 'privacy@yourapp.com';

interface PolicySection {
  id: string;
  short: string;
  title: string;
  icon: string;
  color: string;
  paragraphs?: string[];
  bullets?: string[];
}

// PLACEHOLDER COPY: replace with your real policy, reviewed by a lawyer.
const SECTIONS: PolicySection[] = [
  {
    id: 'collect',
    short: 'Data we collect',
    title: 'Information We Collect',
    icon: 'database',
    color: '#4A90E2',
    paragraphs: ['We collect the information you give us and some data created when you use the app.'],
    bullets: [
      'Account details such as your name, phone number and email address.',
      'Delivery addresses you save in the app.',
      'Order history, favourites and items in your cart.',
      'Device information such as model, operating system and app version.',
      'Approximate or precise location, only when you allow it.',
    ],
  },
  {
    id: 'use',
    short: 'How we use it',
    title: 'How We Use Your Information',
    icon: 'settings',
    color: '#55cc70',
    paragraphs: ['We use your information to run and improve our service.'],
    bullets: [
      'To process orders, deliveries and refunds.',
      'To show your saved addresses and payment methods at checkout.',
      'To send order updates, and offers if you have turned them on.',
      'To prevent fraud and keep your account secure.',
      'To understand how the app is used and make it better.',
    ],
  },
  {
    id: 'sharing',
    short: 'Sharing',
    title: 'How We Share Information',
    icon: 'share-2',
    color: '#F39C12',
    paragraphs: [
      'We do not sell your personal information. We share it only when needed to deliver our service.',
    ],
    bullets: [
      'Delivery partners receive your name, address and phone number for your order.',
      'Payment providers process your payments securely.',
      'Service providers help us with hosting, analytics and support.',
      'Authorities, when we are legally required to share information.',
    ],
  },
  {
    id: 'payments',
    short: 'Payments',
    title: 'Payment Information',
    icon: 'credit-card',
    color: '#9B59B6',
    paragraphs: [
      'Card, UPI and wallet details are handled by our payment partners. We do not store your full card number or CVV on our servers. We keep only limited details, such as the card brand and last four digits, so you can recognise your saved methods.',
    ],
  },
  {
    id: 'security',
    short: 'Security',
    title: 'Data Retention & Security',
    icon: 'shield',
    color: '#1ABC9C',
    paragraphs: [
      'We use encryption and access controls to protect your data. We keep your information for as long as your account is active or as needed to meet legal obligations, and delete or anonymise it afterwards.',
      'No system is completely secure, so please use a strong password and never share your OTP with anyone.',
    ],
  },
  {
    id: 'rights',
    short: 'Your rights',
    title: 'Your Choices & Rights',
    icon: 'user-check',
    color: '#FF6B6B',
    paragraphs: ['You are in control of your information.'],
    bullets: [
      'Update your profile and addresses anytime from the Profile screen.',
      'Turn notifications and offers on or off in Settings.',
      'Turn off location access in your device settings.',
      'Ask us to access, correct or delete your data by contacting us.',
      'Delete your account from Settings > Delete Account.',
    ],
  },
  {
    id: 'children',
    short: 'Children',
    title: "Children's Privacy",
    icon: 'users',
    color: '#7F8C8D',
    paragraphs: [
      'Our app is not meant for children under 13, and we do not knowingly collect their information. If you believe a child has given us data, contact us and we will delete it.',
    ],
  },
  {
    id: 'changes',
    short: 'Changes',
    title: 'Changes to This Policy',
    icon: 'refresh-cw',
    color: '#4A90E2',
    paragraphs: [
      'We may update this policy from time to time. When we make important changes, we will notify you in the app and update the date at the top of this page.',
    ],
  },
];

const PrivacyPolicyScreen = ({ navigation }: any) => {
  const insets = useSafeAreaInsets();
  const scrollRef = useRef<React.ElementRef<typeof ScrollView> | null>(null);
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
    const y = e.nativeEvent.contentOffset.y;
    const shouldShow = y > 400;
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
        <Text style={styles.headerTitle}>Privacy Policy</Text>
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
            <Icon name="shield" size={28} color="#55cc70" />
          </View>
          <Text style={styles.introTitle}>Your privacy matters</Text>
          <Text style={styles.introSubtitle}>
            This policy explains what {APP_NAME} collects, why we collect it, and the choices
            you have.
          </Text>
          <View style={styles.updatedBadge}>
            <Icon name="clock" size={12} color="#55cc70" style={{ marginRight: 6 }} />
            <Text style={styles.updatedText}>Last updated {LAST_UPDATED}</Text>
          </View>
        </Animated.View>

        {/* Jump chips */}
        <Animated.View style={fadeUp(chipsAnim, 12)}>
          <Text style={styles.sectionTitle}>Jump to</Text>
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
                  <Text style={[styles.chipText, active && styles.chipTextActive]}>
                    {s.short}
                  </Text>
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
              <Text style={styles.cardTitle}>{section.title}</Text>
            </View>

            {section.paragraphs?.map((p, i) => (
              <Text key={i} style={styles.paragraph}>
                {p}
              </Text>
            ))}

            {section.bullets?.map((b, i) => (
              <View key={i} style={styles.bulletRow}>
                <View style={[styles.bulletDot, { backgroundColor: section.color }]} />
                <Text style={styles.bulletText}>{b}</Text>
              </View>
            ))}
          </Animated.View>
        ))}

        {/* Contact */}
        <Animated.View style={fadeUp(contactAnim)}>
          <TouchableOpacity
            style={styles.contactCard}
            activeOpacity={0.85}
            onPress={() =>
              Linking.openURL(
                `mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent('Privacy question')}`
              ).catch(() => {})
            }
          >
            <View style={styles.contactIcon}>
              <Icon name="mail" size={20} color="#55cc70" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.contactTitle}>Questions about your data?</Text>
              <Text style={styles.contactSubtitle}>{SUPPORT_EMAIL}</Text>
            </View>
            <Icon name="chevron-right" size={20} color="#c0c0c0" />
          </TouchableOpacity>

          <View style={styles.infoNote}>
            <Icon name="info" size={16} color="#55cc70" style={{ marginRight: 10 }} />
            <Text style={styles.infoNoteText}>
              By using {APP_NAME}, you agree to the practices described in this policy.
            </Text>
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

  // Contact
  contactCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 18,
    padding: 16,
    marginTop: 4,
    marginBottom: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  contactIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: 'rgba(85, 204, 112, 0.12)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  contactTitle: {
    fontSize: 14,
    fontFamily: 'Poppins-SemiBold',
    color: '#1a1a1a',
  },
  contactSubtitle: {
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

export default PrivacyPolicyScreen;