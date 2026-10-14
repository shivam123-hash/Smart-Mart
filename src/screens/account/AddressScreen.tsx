import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Animated,
  Platform,
  Easing,
  Modal,
  TouchableWithoutFeedback,
  Dimensions,
} from 'react-native';
import Icon from '@react-native-vector-icons/feather';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

const INITIAL_ADDRESSES = [
  {
    id: '1',
    type: 'Home',
    name: 'John Doe',
    phone: '+1 202 555 0147',
    address: '6391 Elgin St. Celina, Delaware 10299',
    isDefault: true,
  },
  {
    id: '2',
    type: 'Work',
    name: 'John Doe',
    phone: '+1 202 555 0147',
    address: '1901 Thornridge Cir. Shiloh, Hawaii 81063',
    isDefault: false,
  },
  {
    id: '3',
    type: 'Other',
    name: 'John Doe',
    phone: '+1 202 555 0198',
    address: '2464 Royal Ln. Mesa, New Jersey 45463',
    isDefault: false,
  },
];

const AddressScreen = ({ navigation }: any) => {
  const insets = useSafeAreaInsets();
  const [addresses, setAddresses] = useState(INITIAL_ADDRESSES);
  const [selectedId, setSelectedId] = useState(
    INITIAL_ADDRESSES.find((a) => a.isDefault)?.id || '1'
  );

  // Sheets state
  const [showCurrentLocation, setShowCurrentLocation] = useState(false);
  const [showDeleteSheet, setShowDeleteSheet] = useState(false);
  const [addressToDelete, setAddressToDelete] = useState<any>(null);

  // Animation values
  const headerAnim = useRef(new Animated.Value(0)).current;
  const currentLocationAnim = useRef(new Animated.Value(0)).current;
  const sectionTitleAnim = useRef(new Animated.Value(0)).current;
  const addButtonAnim = useRef(new Animated.Value(0)).current;
  const bottomBarAnim = useRef(new Animated.Value(0)).current;

  const itemAnims = useRef(
    INITIAL_ADDRESSES.map(() => ({
      opacity: new Animated.Value(0),
      translateY: new Animated.Value(30),
      scale: new Animated.Value(0.94),
    }))
  ).current;

  const selectionScales = useRef<{ [key: string]: Animated.Value }>({}).current;

  // Sheet animations
  const currentLocSlide = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
  const currentLocBackdrop = useRef(new Animated.Value(0)).current;
  const deleteSlide = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
  const deleteBackdrop = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    addresses.forEach((addr) => {
      if (!selectionScales[addr.id]) {
        selectionScales[addr.id] = new Animated.Value(1);
      }
    });

    Animated.sequence([
      Animated.timing(headerAnim, {
        toValue: 1,
        duration: 380,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.parallel([
        Animated.timing(currentLocationAnim, {
          toValue: 1,
          duration: 420,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(sectionTitleAnim, {
          toValue: 1,
          duration: 400,
          delay: 60,
          useNativeDriver: true,
        }),
      ]),
    ]).start();

    const cardAnims = itemAnims.map((anim, index) =>
      Animated.parallel([
        Animated.timing(anim.opacity, {
          toValue: 1,
          duration: 400,
          delay: 180 + index * 80,
          useNativeDriver: true,
        }),
        Animated.timing(anim.translateY, {
          toValue: 0,
          duration: 450,
          delay: 180 + index * 80,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.spring(anim.scale, {
          toValue: 1,
          friction: 7,
          tension: 50,
          delay: 180 + index * 80,
          useNativeDriver: true,
        }),
      ])
    );
    Animated.stagger(40, cardAnims).start();

    Animated.timing(addButtonAnim, {
      toValue: 1,
      duration: 400,
      delay: 450,
      useNativeDriver: true,
    }).start();

    Animated.spring(bottomBarAnim, {
      toValue: 1,
      friction: 8,
      tension: 45,
      delay: 280,
      useNativeDriver: true,
    }).start();
  }, []);

  // Current Location Sheet animation
  useEffect(() => {
    if (showCurrentLocation) {
      Animated.parallel([
        Animated.spring(currentLocSlide, {
          toValue: 0,
          friction: 9,
          tension: 65,
          useNativeDriver: true,
        }),
        Animated.timing(currentLocBackdrop, {
          toValue: 1,
          duration: 280,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(currentLocSlide, {
          toValue: SCREEN_HEIGHT,
          duration: 280,
          useNativeDriver: true,
        }),
        Animated.timing(currentLocBackdrop, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [showCurrentLocation]);

  // Delete Sheet animation
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
    if (selectionScales[id]) {
      Animated.sequence([
        Animated.timing(selectionScales[id], {
          toValue: 0.97,
          duration: 80,
          useNativeDriver: true,
        }),
        Animated.spring(selectionScales[id], {
          toValue: 1,
          friction: 5,
          tension: 80,
          useNativeDriver: true,
        }),
      ]).start();
    }
    setSelectedId(id);
  };

  const handleSetDefault = (id: string) => {
    setAddresses((prev) =>
      prev.map((addr) => ({
        ...addr,
        isDefault: addr.id === id,
      }))
    );
    setSelectedId(id);
  };

  const openDeleteSheet = (item: any) => {
    setAddressToDelete(item);
    setShowDeleteSheet(true);
  };

  const confirmDelete = () => {
    if (!addressToDelete) return;
    const id = addressToDelete.id;
    const index = addresses.findIndex((a) => a.id === id);
    if (index === -1) return;

    setShowDeleteSheet(false);

    Animated.parallel([
      Animated.timing(itemAnims[index].opacity, {
        toValue: 0,
        duration: 280,
        useNativeDriver: true,
      }),
      Animated.timing(itemAnims[index].translateY, {
        toValue: -20,
        duration: 280,
        useNativeDriver: true,
      }),
      Animated.timing(itemAnims[index].scale, {
        toValue: 0.9,
        duration: 280,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setAddresses((prev) => prev.filter((addr) => addr.id !== id));
      if (selectedId === id) {
        const remaining = addresses.filter((a) => a.id !== id);
        if (remaining.length > 0) setSelectedId(remaining[0].id);
      }
      setAddressToDelete(null);
    });
  };

  const getTypeIcon = (type: string) => {
    if (type === 'Home') return 'home';
    if (type === 'Work') return 'briefcase';
    return 'map-pin';
  };

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
                  outputRange: [-20, 0],
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

        <Text style={styles.headerTitle}>Select Address</Text>
        <View style={{ width: 40 }} />
      </Animated.View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + 110 },
        ]}
      >
        {/* Current Location Card */}
        <Animated.View
          style={[
            styles.currentLocationCard,
            {
              opacity: currentLocationAnim,
              transform: [
                {
                  translateY: currentLocationAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [24, 0],
                  }),
                },
                {
                  scale: currentLocationAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.96, 1],
                  }),
                },
              ],
            },
          ]}
        >
          <TouchableOpacity
            style={styles.currentLocationTouchable}
            activeOpacity={0.85}
            onPress={() => setShowCurrentLocation(true)}
          >
            <View style={styles.currentLocationLeft}>
              <View style={styles.currentLocationIcon}>
                <Icon name="navigation" size={18} color="#55cc70" />
              </View>
              <View>
                <Text style={styles.currentLocationTitle}>Use Current Location</Text>
                <Text style={styles.currentLocationSubtitle}>
                  Fetching your location...
                </Text>
              </View>
            </View>
            <Icon name="chevron-right" size={20} color="#9e9e9e" />
          </TouchableOpacity>
        </Animated.View>

        {/* Section Title */}
        <Animated.Text
          style={[
            styles.sectionTitle,
            {
              opacity: sectionTitleAnim,
              transform: [
                {
                  translateY: sectionTitleAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [12, 0],
                  }),
                },
              ],
            },
          ]}
        >
          Saved Addresses
        </Animated.Text>

        {/* Address Cards */}
        {addresses.map((item, index) => {
          const isSelected = selectedId === item.id;
          const anim = itemAnims[index] || {
            opacity: new Animated.Value(1),
            translateY: new Animated.Value(0),
            scale: new Animated.Value(1),
          };
          const scaleAnim = selectionScales[item.id] || new Animated.Value(1);

          return (
            <Animated.View
              key={item.id}
              style={{
                opacity: anim.opacity,
                transform: [
                  { translateY: anim.translateY },
                  { scale: Animated.multiply(anim.scale, scaleAnim) },
                ],
              }}
            >
              <TouchableOpacity
                style={[
                  styles.addressCard,
                  isSelected && styles.addressCardSelected,
                ]}
                activeOpacity={0.9}
                onPress={() => handleSelect(item.id)}
              >
                <View style={styles.cardTop}>
                  <View style={styles.typeRow}>
                    <View
                      style={[
                        styles.radioOuter,
                        isSelected && styles.radioOuterSelected,
                      ]}
                    >
                      {isSelected && <View style={styles.radioInner} />}
                    </View>

                    <View style={styles.typeBadge}>
                      <Icon
                        name={getTypeIcon(item.type) as any}
                        size={13}
                        color="#55cc70"
                        style={{ marginRight: 5 }}
                      />
                      <Text style={styles.typeText}>{item.type}</Text>
                    </View>

                    {item.isDefault && (
                      <View style={styles.defaultBadge}>
                        <Text style={styles.defaultBadgeText}>Default</Text>
                      </View>
                    )}
                  </View>

                  <View style={styles.cardActions}>
                    {/* Edit */}
                    <TouchableOpacity
                      onPress={() =>
                        navigation.navigate('AddEditAddressScreen', {
                          mode: 'edit',
                          address: item,
                        })
                      }
                      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                      style={{ marginRight: 14 }}
                    >
                      <Icon name="edit-2" size={15} color="#55cc70" />
                    </TouchableOpacity>

                    {!item.isDefault && (
                      <TouchableOpacity
                        onPress={() => handleSetDefault(item.id)}
                        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                      >
                        <Text style={styles.setDefaultText}>Set Default</Text>
                      </TouchableOpacity>
                    )}

                    {/* Delete */}
                    <TouchableOpacity
                      onPress={() => openDeleteSheet(item)}
                      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                      style={{ marginLeft: 14 }}
                    >
                      <Icon name="trash-2" size={16} color="#ff4d4f" />
                    </TouchableOpacity>
                  </View>
                </View>

                <View style={styles.addressDetails}>
                  <Text style={styles.addressName}>{item.name}</Text>
                  <Text style={styles.addressPhone}>{item.phone}</Text>
                  <Text style={styles.addressText}>{item.address}</Text>
                </View>
              </TouchableOpacity>
            </Animated.View>
          );
        })}

        {/* Add New Address */}
        <Animated.View
          style={{
            opacity: addButtonAnim,
            transform: [
              {
                translateY: addButtonAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [20, 0],
                }),
              },
            ],
          }}
        >
          <TouchableOpacity
            style={styles.addAddressBtn}
            activeOpacity={0.85}
            onPress={() =>
              navigation.navigate('AddEditAddressScreen', { mode: 'add' })
            }
          >
            <View style={styles.addIconWrapper}>
              <Icon name="plus" size={20} color="#55cc70" />
            </View>
            <Text style={styles.addAddressText}>Add New Address</Text>
          </TouchableOpacity>
        </Animated.View>
      </ScrollView>

      {/* Bottom Confirm Button */}
      <Animated.View
        style={[
          styles.bottomBar,
          {
            paddingBottom: Platform.OS === 'ios' ? insets.bottom || 20 : 16,
            opacity: bottomBarAnim,
            transform: [
              {
                translateY: bottomBarAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [90, 0],
                }),
              },
            ],
          },
        ]}
      >
        <TouchableOpacity
          style={styles.confirmBtn}
          activeOpacity={0.85}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.confirmBtnText}>Confirm Location</Text>
        </TouchableOpacity>
      </Animated.View>

      {/* ==================== CURRENT LOCATION SHEET ==================== */}
      <Modal
        transparent
        visible={showCurrentLocation}
        animationType="none"
        statusBarTranslucent
      >
        <View style={styles.sheetContainer}>
          <TouchableWithoutFeedback onPress={() => setShowCurrentLocation(false)}>
            <Animated.View
              style={[
                styles.sheetBackdrop,
                {
                  opacity: currentLocBackdrop.interpolate({
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
                transform: [{ translateY: currentLocSlide }],
              },
            ]}
          >
            <View style={styles.sheetHandle} />

            <View style={styles.sheetIconWrapper}>
              <Icon name="navigation" size={28} color="#55cc70" />
            </View>

            <Text style={styles.sheetTitle}>Use Current Location?</Text>
            <Text style={styles.sheetSubtitle}>
              We will use your device’s GPS to detect the nearest delivery address.
            </Text>

            <View style={styles.locationPreview}>
              <Icon name="map-pin" size={18} color="#55cc70" style={{ marginRight: 10 }} />
              <Text style={styles.locationPreviewText} numberOfLines={2}>
                Detecting precise location...
              </Text>
            </View>

            <TouchableOpacity
              style={styles.sheetConfirmBtn}
              activeOpacity={0.85}
              onPress={() => {
                setShowCurrentLocation(false);
                // You can update selected address here
              }}
            >
              <Text style={styles.sheetConfirmBtnText}>Confirm & Continue</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.sheetCancelBtn}
              activeOpacity={0.8}
              onPress={() => setShowCurrentLocation(false)}
            >
              <Text style={styles.sheetCancelBtnText}>Cancel</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </Modal>

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

            <View style={[styles.sheetIconWrapper, styles.deleteIconWrapper]}>
              <Icon name="trash-2" size={28} color="#ff4d4f" />
            </View>

            <Text style={styles.sheetTitle}>Delete Address?</Text>
            <Text style={styles.sheetSubtitle}>
              {addressToDelete
                ? `Are you sure you want to delete “${addressToDelete.type}”? This action cannot be undone.`
                : 'Are you sure you want to delete this address?'}
            </Text>

            <TouchableOpacity
              style={styles.deleteConfirmBtn}
              activeOpacity={0.85}
              onPress={confirmDelete}
            >
              <Text style={styles.deleteConfirmBtnText}>Yes, Delete</Text>
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
  currentLocationCard: {
    backgroundColor: '#f0faf3',
    borderRadius: 16,
    marginBottom: 28,
    borderWidth: 1,
    borderColor: '#d4f0dc',
    overflow: 'hidden',
  },
  currentLocationTouchable: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  currentLocationLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  currentLocationIcon: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  currentLocationTitle: {
    fontSize: 15,
    fontFamily: 'Poppins-SemiBold',
    color: '#1a1a1a',
  },
  currentLocationSubtitle: {
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    color: '#7a7a7a',
    marginTop: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: 'Poppins-Bold',
    color: '#1a1a1a',
    marginBottom: 14,
  },
  addressCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1.5,
    borderColor: '#f0f2f5',
  },
  addressCardSelected: {
    borderColor: '#55cc70',
    backgroundColor: '#f9fdf9',
  },
  cardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  typeRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  radioOuter: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#c8c8c8',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
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
  typeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(85, 204, 112, 0.12)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  typeText: {
    fontSize: 12,
    fontFamily: 'Poppins-SemiBold',
    color: '#55cc70',
  },
  defaultBadge: {
    backgroundColor: '#55cc70',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    marginLeft: 8,
  },
  defaultBadgeText: {
    fontSize: 10,
    fontFamily: 'Poppins-Bold',
    color: '#ffffff',
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
  addressDetails: {
    paddingLeft: 30,
  },
  addressName: {
    fontSize: 15,
    fontFamily: 'Poppins-SemiBold',
    color: '#1a1a1a',
    marginBottom: 2,
  },
  addressPhone: {
    fontSize: 13,
    fontFamily: 'Poppins-Regular',
    color: '#7a7a7a',
    marginBottom: 4,
  },
  addressText: {
    fontSize: 13,
    fontFamily: 'Poppins-Regular',
    color: '#4a4a4a',
    lineHeight: 20,
  },
  addAddressBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#55cc70',
    borderStyle: 'dashed',
    borderRadius: 16,
    paddingVertical: 18,
    marginTop: 8,
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
  addAddressText: {
    fontSize: 15,
    fontFamily: 'Poppins-SemiBold',
    color: '#55cc70',
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#ffffff',
    paddingHorizontal: 20,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 12,
  },
  confirmBtn: {
    backgroundColor: '#55cc70',
    height: 52,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#55cc70',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  confirmBtnText: {
    fontSize: 16,
    fontFamily: 'Poppins-Bold',
    color: '#ffffff',
  },

  // ===== Sheets =====
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
  sheetIconWrapper: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(85, 204, 112, 0.12)',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 16,
  },
  deleteIconWrapper: {
    backgroundColor: 'rgba(255, 77, 79, 0.1)',
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
    marginBottom: 24,
  },
  locationPreview: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0faf3',
    borderRadius: 14,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#d4f0dc',
  },
  locationPreviewText: {
    flex: 1,
    fontSize: 14,
    fontFamily: 'Poppins-Medium',
    color: '#1a1a1a',
  },
  sheetConfirmBtn: {
    backgroundColor: '#55cc70',
    height: 52,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  sheetConfirmBtnText: {
    fontSize: 16,
    fontFamily: 'Poppins-Bold',
    color: '#ffffff',
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

export default AddressScreen;