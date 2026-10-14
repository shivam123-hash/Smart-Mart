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
} from 'react-native';
import Icon from '@react-native-vector-icons/feather';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

const INITIAL_METHODS = [
  {
    id: '1',
    type: 'card',
    brand: 'Visa',
    last4: '4242',
    expiry: '12/27',
    isDefault: true,
    icon: 'credit-card',
    color: '#1A1F71',
  },
  {
    id: '2',
    type: 'card',
    brand: 'Mastercard',
    last4: '8888',
    expiry: '08/26',
    isDefault: false,
    icon: 'credit-card',
    color: '#EB001B',
  },
  {
    id: '3',
    type: 'upi',
    brand: 'Google Pay',
    last4: 'john@oksbi',
    expiry: '',
    isDefault: false,
    icon: 'smartphone',
    color: '#4285F4',
  },
  {
    id: '4',
    type: 'wallet',
    brand: 'Paytm Wallet',
    last4: '₹1,250.00',
    expiry: '',
    isDefault: false,
    icon: 'wallet',
    color: '#00BAF2',
  },
];

const PaymentMethodsScreen = ({ navigation }: any) => {
  const insets = useSafeAreaInsets();
  const [methods, setMethods] = useState(INITIAL_METHODS);
  const [selectedId, setSelectedId] = useState(
    INITIAL_METHODS.find((m) => m.isDefault)?.id || '1'
  );
  const [showDeleteSheet, setShowDeleteSheet] = useState(false);
  const [methodToDelete, setMethodToDelete] = useState<any>(null);

  // Animations
  const headerAnim = useRef(new Animated.Value(0)).current;
  const listAnim = useRef(new Animated.Value(0)).current;
  const addBtnAnim = useRef(new Animated.Value(0)).current;
  const itemAnims = useRef(
    INITIAL_METHODS.map(() => new Animated.Value(0))
  ).current;

  // Delete sheet
  const deleteSlide = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
  const deleteBackdrop = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.stagger(70, [
      Animated.timing(headerAnim, {
        toValue: 1,
        duration: 380,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(listAnim, {
        toValue: 1,
        duration: 420,
        useNativeDriver: true,
      }),
    ]).start();

    const anims = itemAnims.map((anim, index) =>
      Animated.timing(anim, {
        toValue: 1,
        duration: 400,
        delay: 160 + index * 70,
        useNativeDriver: true,
      })
    );
    Animated.stagger(40, anims).start();

    Animated.timing(addBtnAnim, {
      toValue: 1,
      duration: 400,
      delay: 450,
      useNativeDriver: true,
    }).start();
  }, []);

  useEffect(() => {
    if (showDeleteSheet) {
      Animated.parallel([
        Animated.spring(deleteSlide, {
          toValue: 0,
          friction: 9,
          tension: 65,
          useNativeDriver: true,
        }),
        Animated.timing(deleteBackdrop, {
          toValue: 1,
          duration: 280,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(deleteSlide, {
          toValue: SCREEN_HEIGHT,
          duration: 260,
          useNativeDriver: true,
        }),
        Animated.timing(deleteBackdrop, {
          toValue: 0,
          duration: 240,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [showDeleteSheet]);

  const handleSelect = (id: string) => {
    setSelectedId(id);
  };

  const handleSetDefault = (id: string) => {
    setMethods((prev) =>
      prev.map((m) => ({
        ...m,
        isDefault: m.id === id,
      }))
    );
    setSelectedId(id);
  };

  const openDeleteSheet = (method: any) => {
    setMethodToDelete(method);
    setShowDeleteSheet(true);
  };

  const confirmDelete = () => {
    if (!methodToDelete) return;
    setMethods((prev) => prev.filter((m) => m.id !== methodToDelete.id));
    if (selectedId === methodToDelete.id && methods.length > 1) {
      const remaining = methods.filter((m) => m.id !== methodToDelete.id);
      setSelectedId(remaining[0]?.id);
    }
    setShowDeleteSheet(false);
    setMethodToDelete(null);
  };

  const getBrandLabel = (method: any) => {
    if (method.type === 'card') return `${method.brand} •••• ${method.last4}`;
    if (method.type === 'upi') return method.last4;
    return method.last4;
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
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
        >
          <Icon name="chevron-left" size={26} color="#1a1a1a" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Payment Methods</Text>
        <View style={{ width: 40 }} />
      </Animated.View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + 30 },
        ]}
      >
        <Animated.Text
          style={[
            styles.sectionTitle,
            {
              opacity: listAnim,
              transform: [
                {
                  translateY: listAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [12, 0],
                  }),
                },
              ],
            },
          ]}
        >
          Saved Methods
        </Animated.Text>

        {methods.map((method, index) => {
          const isSelected = selectedId === method.id;
          const anim = itemAnims[index] || new Animated.Value(1);

          return (
            <Animated.View
              key={method.id}
              style={{
                opacity: anim,
                transform: [
                  {
                    translateY: anim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [24, 0],
                    }),
                  },
                ],
              }}
            >
              <TouchableOpacity
                style={[
                  styles.methodCard,
                  isSelected && styles.methodCardSelected,
                ]}
                activeOpacity={0.85}
                onPress={() => handleSelect(method.id)}
              >
                <View style={styles.cardTop}>
                  <View style={styles.leftRow}>
                    {/* Radio */}
                    <View
                      style={[
                        styles.radioOuter,
                        isSelected && styles.radioOuterSelected,
                      ]}
                    >
                      {isSelected && <View style={styles.radioInner} />}
                    </View>

                    {/* Icon */}
                    <View
                      style={[
                        styles.brandIcon,
                        { backgroundColor: `${method.color}15` },
                      ]}
                    >
                      <Icon
                        name={method.icon as any}
                        size={20}
                        color={method.color}
                      />
                    </View>

                    {/* Info */}
                    <View style={styles.methodInfo}>
                      <View style={styles.brandRow}>
                        <Text style={styles.brandName}>{method.brand}</Text>
                        {method.isDefault && (
                          <View style={styles.defaultBadge}>
                            <Text style={styles.defaultBadgeText}>Default</Text>
                          </View>
                        )}
                      </View>
                      <Text style={styles.methodDetail}>
                        {getBrandLabel(method)}
                      </Text>
                      {method.expiry ? (
                        <Text style={styles.expiryText}>Expires {method.expiry}</Text>
                      ) : null}
                    </View>
                  </View>

                  {/* Actions */}
                  <View style={styles.cardActions}>
                    {!method.isDefault && (
                      <TouchableOpacity
                        onPress={() => handleSetDefault(method.id)}
                        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                      >
                        <Text style={styles.setDefaultText}>Set Default</Text>
                      </TouchableOpacity>
                    )}
                    <TouchableOpacity
                      onPress={() => openDeleteSheet(method)}
                      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                      style={{ marginLeft: 14 }}
                    >
                      <Icon name="trash-2" size={16} color="#ff4d4f" />
                    </TouchableOpacity>
                  </View>
                </View>
              </TouchableOpacity>
            </Animated.View>
          );
        })}

        {/* Add New Method */}
        <Animated.View
          style={{
            opacity: addBtnAnim,
            transform: [
              {
                translateY: addBtnAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [20, 0],
                }),
              },
            ],
          }}
        >
          <TouchableOpacity
            style={styles.addMethodBtn}
            activeOpacity={0.85}
            onPress={() => {
              navigation.navigate('AddPaymentMethodScreen');
            }}
          >
            <View style={styles.addIconWrapper}>
              <Icon name="plus" size={20} color="#55cc70" />
            </View>
            <Text style={styles.addMethodText}>Add Payment Method</Text>
          </TouchableOpacity>
        </Animated.View>

        {/* Info note */}
        <View style={styles.infoNote}>
          <Icon name="shield" size={16} color="#55cc70" style={{ marginRight: 10 }} />
          <Text style={styles.infoNoteText}>
            Your payment information is encrypted and securely stored.
          </Text>
        </View>
      </ScrollView>

      {/* ==================== DELETE CONFIRM SHEET ==================== */}
      <Modal
        transparent
        visible={showDeleteSheet}
        animationType="none"
        statusBarTranslucent
      >
        <View style={styles.sheetContainer}>
          <TouchableWithoutFeedback onPress={() => setShowDeleteSheet(false)}>
            <Animated.View
              style={[
                styles.sheetBackdrop,
                {
                  opacity: deleteBackdrop.interpolate({
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
                transform: [{ translateY: deleteSlide }],
              },
            ]}
          >
            <View style={styles.sheetHandle} />

            <View style={styles.deleteIconWrapper}>
              <Icon name="trash-2" size={28} color="#ff4d4f" />
            </View>

            <Text style={styles.sheetTitle}>Remove Payment Method?</Text>
            <Text style={styles.sheetSubtitle}>
              {methodToDelete
                ? `Are you sure you want to remove ${methodToDelete.brand}${
                    methodToDelete.type === 'card' ? ` •••• ${methodToDelete.last4}` : ''
                  }?`
                : 'Are you sure you want to remove this payment method?'}
            </Text>

            <TouchableOpacity
              style={styles.deleteConfirmBtn}
              activeOpacity={0.85}
              onPress={confirmDelete}
            >
              <Text style={styles.deleteConfirmBtnText}>Yes, Remove</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.sheetCancelBtn}
              activeOpacity={0.8}
              onPress={() => setShowDeleteSheet(false)}
            >
              <Text style={styles.sheetCancelBtnText}>Cancel</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </Modal>
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

  // Method Card
  methodCard: {
    backgroundColor: '#ffffff',
    borderRadius: 18,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1.5,
    borderColor: '#f0f2f5',
  },
  methodCardSelected: {
    borderColor: '#55cc70',
    backgroundColor: '#f9fdf9',
  },
  cardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  leftRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  radioOuter: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#c8c8c8',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
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
  brandIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  methodInfo: {
    flex: 1,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  brandName: {
    fontSize: 15,
    fontFamily: 'Poppins-SemiBold',
    color: '#1a1a1a',
  },
  defaultBadge: {
    backgroundColor: '#55cc70',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    marginLeft: 8,
  },
  defaultBadgeText: {
    fontSize: 10,
    fontFamily: 'Poppins-Bold',
    color: '#ffffff',
  },
  methodDetail: {
    fontSize: 13,
    fontFamily: 'Poppins-Regular',
    color: '#7a7a7a',
  },
  expiryText: {
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    color: '#9e9e9e',
    marginTop: 2,
  },
  cardActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  setDefaultText: {
    fontSize: 12,
    fontFamily: 'Poppins-Medium',
    color: '#55cc70',
  },

  // Add Method
  addMethodBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#55cc70',
    borderStyle: 'dashed',
    borderRadius: 16,
    paddingVertical: 18,
    marginTop: 8,
    marginBottom: 24,
  },
  addIconWrapper: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(85, 204, 112, 0.12)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  addMethodText: {
    fontSize: 15,
    fontFamily: 'Poppins-SemiBold',
    color: '#55cc70',
  },

  // Info note
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

  // Delete Sheet
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
  sheetTitle: {
    fontSize: 20,
    fontFamily: 'Poppins-Bold',
    color: '#1a1a1a',
    textAlign: 'center',
    marginBottom: 8,
  },
  sheetSubtitle: {
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

export default PaymentMethodsScreen;