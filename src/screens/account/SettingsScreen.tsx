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
  Modal,
  TouchableWithoutFeedback,
  Dimensions,
  Linking,
} from 'react-native';
import Icon from '@react-native-vector-icons/feather';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

const APP_VERSION = '1.0.0';
const PRIVACY_URL = 'https://yourapp.com/privacy';
const TERMS_URL = 'https://yourapp.com/terms';

const LANGUAGES = [
  { id: 'en', label: 'English', native: 'English' },
  { id: 'hi', label: 'Hindi', native: 'हिन्दी' },
  { id: 'pa', label: 'Punjabi', native: 'ਪੰਜਾਬੀ' },
];

/* ------------------------------ TOGGLE ------------------------------ */

const Toggle = ({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) => {
  const anim = useRef(new Animated.Value(value ? 1 : 0)).current;

  useEffect(() => {
    Animated.spring(anim, {
      toValue: value ? 1 : 0,
      friction: 8,
      tension: 80,
      useNativeDriver: true,
    }).start();
  }, [value]);

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={() => onChange(!value)}
      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
    >
      <View style={styles.toggleTrack}>
        <Animated.View style={[styles.toggleTrackOn, { opacity: anim }]} />
        <Animated.View
          style={[
            styles.toggleThumb,
            {
              transform: [
                {
                  translateX: anim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, 20],
                  }),
                },
              ],
            },
          ]}
        />
      </View>
    </TouchableOpacity>
  );
};

/* ---------------------------- BOTTOM SHEET ---------------------------- */

const BottomSheet = ({
  visible,
  onClose,
  children,
}: {
  visible: boolean;
  onClose: () => void;
  children: React.ReactNode;
}) => {
  const insets = useSafeAreaInsets();
  const slide = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
  const backdrop = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.spring(slide, {
          toValue: 0,
          friction: 9,
          tension: 65,
          useNativeDriver: true,
        }),
        Animated.timing(backdrop, {
          toValue: 1,
          duration: 280,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(slide, {
          toValue: SCREEN_HEIGHT,
          duration: 260,
          useNativeDriver: true,
        }),
        Animated.timing(backdrop, {
          toValue: 0,
          duration: 240,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  return (
    <Modal transparent visible={visible} animationType="none" statusBarTranslucent>
      <View style={styles.sheetContainer}>
        <TouchableWithoutFeedback onPress={onClose}>
          <Animated.View
            style={[
              styles.sheetBackdrop,
              {
                opacity: backdrop.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, 0.5],
                }),
              },
            ]}
          />
        </TouchableWithoutFeedback>

        <Animated.View
          style={[
            styles.sheet,
            {
              paddingBottom: insets.bottom + 20,
              transform: [{ translateY: slide }],
            },
          ]}
        >
          <View style={styles.sheetHandle} />
          {children}
        </Animated.View>
      </View>
    </Modal>
  );
};

/* ------------------------------ SCREEN ------------------------------ */

const SettingsScreen = ({ navigation }: any) => {
  const insets = useSafeAreaInsets();

  // Settings state
  const [pushEnabled, setPushEnabled] = useState(true);
  const [orderUpdates, setOrderUpdates] = useState(true);
  const [offersEnabled, setOffersEnabled] = useState(false);
  const [biometric, setBiometric] = useState(false);
  const [language, setLanguage] = useState('en');

  // Sheets
  const [showLanguage, setShowLanguage] = useState(false);
  const [showDelete, setShowDelete] = useState(false);

  // Animations
  const headerAnim = useRef(new Animated.Value(0)).current;
  const sectionAnims = useRef([0, 1, 2, 3].map(() => new Animated.Value(0))).current;

  useEffect(() => {
    Animated.timing(headerAnim, {
      toValue: 1,
      duration: 380,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();

    Animated.stagger(
      90,
      sectionAnims.map((anim) =>
        Animated.timing(anim, {
          toValue: 1,
          duration: 420,
          delay: 140,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        })
      )
    ).start();
  }, []);

  const sectionStyle = (index: number) => ({
    opacity: sectionAnims[index],
    transform: [
      {
        translateY: sectionAnims[index].interpolate({
          inputRange: [0, 1],
          outputRange: [24, 0],
        }),
      },
    ],
  });

  const currentLanguage = LANGUAGES.find((l) => l.id === language) || LANGUAGES[0];

  const openLink = (url: string) => Linking.openURL(url).catch(() => {});

  const handleDeleteAccount = () => {
    setShowDelete(false);
    // Call your delete-account API here, then reset navigation to the auth stack.
  };

  /* ---- row builders ---- */

  const renderToggleRow = (
    icon: string,
    color: string,
    title: string,
    subtitle: string,
    value: boolean,
    onChange: (v: boolean) => void,
    isLast = false
  ) => (
    <View style={[styles.row, !isLast && styles.rowDivider]}>
      <View style={[styles.rowIcon, { backgroundColor: `${color}15` }]}>
        <Icon name={icon as any} size={20} color={color} />
      </View>
      <View style={styles.rowText}>
        <Text style={styles.rowTitle}>{title}</Text>
        <Text style={styles.rowSubtitle}>{subtitle}</Text>
      </View>
      <Toggle value={value} onChange={onChange} />
    </View>
  );

  const renderLinkRow = (
    icon: string,
    color: string,
    title: string,
    subtitle: string,
    onPress: () => void,
    isLast = false,
    trailing?: string
  ) => (
    <TouchableOpacity
      style={[styles.row, !isLast && styles.rowDivider]}
      activeOpacity={0.75}
      onPress={onPress}
    >
      <View style={[styles.rowIcon, { backgroundColor: `${color}15` }]}>
        <Icon name={icon as any} size={20} color={color} />
      </View>
      <View style={styles.rowText}>
        <Text style={styles.rowTitle}>{title}</Text>
        <Text style={styles.rowSubtitle}>{subtitle}</Text>
      </View>
      {trailing ? <Text style={styles.rowTrailing}>{trailing}</Text> : null}
      <Icon name="chevron-right" size={20} color="#c0c0c0" />
    </TouchableOpacity>
  );

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
        <Text style={styles.headerTitle}>Settings</Text>
        <View style={{ width: 40 }} />
      </Animated.View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + 30 },
        ]}
      >
        {/* General */}
        <Animated.View style={sectionStyle(0)}>
          <Text style={styles.sectionTitle}>General</Text>
          <View style={styles.card}>
            {renderLinkRow(
              'globe',
              '#4A90E2',
              'Language',
              'Choose your app language',
              () => setShowLanguage(true),
              true,
              currentLanguage.native
            )}
          </View>
        </Animated.View>

        {/* Notifications */}
        <Animated.View style={sectionStyle(1)}>
          <Text style={styles.sectionTitle}>Notifications</Text>
          <View style={styles.card}>
            {renderToggleRow(
              'bell',
              '#F39C12',
              'Push Notifications',
              'Allow alerts on this device',
              pushEnabled,
              setPushEnabled
            )}
            {renderToggleRow(
              'package',
              '#55cc70',
              'Order Updates',
              'Status, delivery and refunds',
              orderUpdates,
              setOrderUpdates
            )}
            {renderToggleRow(
              'tag',
              '#FF6B6B',
              'Offers & Promotions',
              'Deals and discount codes',
              offersEnabled,
              setOffersEnabled,
              true
            )}
          </View>
        </Animated.View>

        {/* Privacy & Security */}
        <Animated.View style={sectionStyle(2)}>
          <Text style={styles.sectionTitle}>Privacy & Security</Text>
          <View style={styles.card}>
            {renderToggleRow(
              'unlock',
              '#9B59B6',
              'Biometric Lock',
              'Use fingerprint or face to open',
              biometric,
              setBiometric
            )}
            {renderLinkRow(
              'shield',
              '#7F8C8D',
              'Privacy Policy',
              'How we handle your data',
              () => navigation.navigate('PrivacyPolicyScreen')
            )}
            {renderLinkRow(
              'file-text',
              '#7F8C8D',
              'Terms of Service',
              'Rules for using the app',
              () => navigation.navigate('TermsOfServiceScreen')
            )}
          </View>
        </Animated.View>

        {/* Account / danger */}
        <Animated.View style={sectionStyle(3)}>
          <TouchableOpacity
            style={styles.deleteBtn}
            activeOpacity={0.85}
            onPress={() => setShowDelete(true)}
          >
            <Icon name="trash-2" size={18} color="#ff4d4f" style={{ marginRight: 10 }} />
            <Text style={styles.deleteText}>Delete Account</Text>
          </TouchableOpacity>

          <Text style={styles.versionText}>App Version {APP_VERSION}</Text>
        </Animated.View>
      </ScrollView>

      {/* ==================== LANGUAGE SHEET ==================== */}
      <BottomSheet visible={showLanguage} onClose={() => setShowLanguage(false)}>
        <Text style={styles.sheetHeading}>Select Language</Text>
        <Text style={styles.sheetSubheading}>Pick the language you are most comfortable with</Text>

        {LANGUAGES.map((lang) => {
          const selected = lang.id === language;
          return (
            <TouchableOpacity
              key={lang.id}
              style={[styles.langRow, selected && styles.langRowSelected]}
              activeOpacity={0.85}
              onPress={() => {
                setLanguage(lang.id);
                setShowLanguage(false);
              }}
            >
              <View style={[styles.radioOuter, selected && styles.radioOuterSelected]}>
                {selected && <View style={styles.radioInner} />}
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.langNative}>{lang.native}</Text>
                <Text style={styles.langLabel}>{lang.label}</Text>
              </View>
              {selected && <Icon name="check" size={18} color="#55cc70" />}
            </TouchableOpacity>
          );
        })}
      </BottomSheet>

      {/* ==================== DELETE ACCOUNT SHEET ==================== */}
      <BottomSheet visible={showDelete} onClose={() => setShowDelete(false)}>
        <View style={styles.deleteIconWrapper}>
          <Icon name="trash-2" size={28} color="#ff4d4f" />
        </View>
        <Text style={styles.sheetTitleCenter}>Delete Account?</Text>
        <Text style={styles.sheetTextCenter}>
          This will permanently remove your profile, saved addresses and order history. This
          cannot be undone.
        </Text>

        <TouchableOpacity
          style={styles.deleteConfirmBtn}
          activeOpacity={0.85}
          onPress={handleDeleteAccount}
        >
          <Text style={styles.deleteConfirmBtnText}>Yes, Delete</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.sheetCancelBtn}
          activeOpacity={0.8}
          onPress={() => setShowDelete(false)}
        >
          <Text style={styles.sheetCancelBtnText}>Cancel</Text>
        </TouchableOpacity>
      </BottomSheet>
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

  // Card + rows
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    marginBottom: 24,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  rowDivider: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#f0f0f0',
  },
  rowIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  rowText: {
    flex: 1,
    paddingRight: 8,
  },
  rowTitle: {
    fontSize: 15,
    fontFamily: 'Poppins-SemiBold',
    color: '#1a1a1a',
    marginBottom: 2,
  },
  rowSubtitle: {
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    color: '#9e9e9e',
  },
  rowTrailing: {
    fontSize: 13,
    fontFamily: 'Poppins-Medium',
    color: '#7a7a7a',
    marginRight: 6,
  },

  // Toggle
  toggleTrack: {
    width: 48,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#e0e0e0',
    justifyContent: 'center',
    paddingHorizontal: 3,
  },
  toggleTrackOn: {
    ...StyleSheet.absoluteFill,
    borderRadius: 14,
    backgroundColor: '#55cc70',
  },
  toggleThumb: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },

  // Delete button
  deleteBtn: {
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
  deleteText: {
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

  // Sheet
  sheetContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  sheetBackdrop: {
    ...StyleSheet.absoluteFill,
    backgroundColor: '#000',
  },
  sheet: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 24,
    paddingTop: 12,
  },
  sheetHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#e0e0e0',
    alignSelf: 'center',
    marginBottom: 20,
  },
  sheetHeading: {
    fontSize: 20,
    fontFamily: 'Poppins-Bold',
    color: '#1a1a1a',
  },
  sheetSubheading: {
    fontSize: 13,
    fontFamily: 'Poppins-Regular',
    color: '#9e9e9e',
    marginTop: 2,
    marginBottom: 18,
  },

  // Language rows
  langRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: '#f0f2f5',
    marginBottom: 12,
  },
  langRowSelected: {
    borderColor: '#55cc70',
    backgroundColor: '#f9fdf9',
  },
  radioOuter: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#c8c8c8',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  radioOuterSelected: {
    borderColor: '#55cc70',
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#55cc70',
  },
  langNative: {
    fontSize: 15,
    fontFamily: 'Poppins-SemiBold',
    color: '#1a1a1a',
  },
  langLabel: {
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    color: '#9e9e9e',
    marginTop: 1,
  },

  // Delete sheet
  deleteIconWrapper: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(255, 77, 79, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 16,
  },
  sheetTitleCenter: {
    fontSize: 20,
    fontFamily: 'Poppins-Bold',
    color: '#1a1a1a',
    textAlign: 'center',
    marginBottom: 8,
  },
  sheetTextCenter: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: '#7a7a7a',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 28,
  },
  deleteConfirmBtn: {
    backgroundColor: '#ff4d4f',
    height: 52,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  deleteConfirmBtnText: {
    fontSize: 16,
    fontFamily: 'Poppins-Bold',
    color: '#ffffff',
  },
  sheetCancelBtn: {
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sheetCancelBtnText: {
    fontSize: 15,
    fontFamily: 'Poppins-Medium',
    color: '#7a7a7a',
  },
});

export default SettingsScreen;