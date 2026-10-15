import React, { useState, useEffect, useRef } from 'react';
import LocalizedText from '../../../shared/i18n/LocalizedText';
import { View, StyleSheet, Animated, Dimensions, Modal, TouchableWithoutFeedback, Image, ScrollView } from 'react-native';
import TouchableOpacity from '../../../shared/components/AnimatedTouchableOpacity';
import Icon from '@react-native-vector-icons/feather';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ProductDetailPressable } from '../../../shared/components/sharedTransition';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

interface OrderItem {
  id: string;
  name: string;
  size: string;
  qty: number;
  price: string;
  image: string;
}

interface Props {
  visible: boolean;
  onClose: () => void;
  orderId?: string;
  items?: OrderItem[];
  onConfirm: (items: OrderItem[]) => void;
}

const DEFAULT_ITEMS: OrderItem[] = [
  {
    id: '1',
    name: 'Surf Excel Easy Wash',
    size: '1 kg',
    qty: 1,
    price: '$12',
    image: 'https://cdn-icons-png.flaticon.com/512/2553/2553691.png',
  },
  {
    id: '2',
    name: 'Fortune Arhar Dal',
    size: '1 kg',
    qty: 2,
    price: '$10',
    image: 'https://cdn-icons-png.flaticon.com/512/2553/2553609.png',
  },
  {
    id: '3',
    name: 'Fresh Apples (Fuji)',
    size: '1 kg',
    qty: 1,
    price: '$4',
    image: 'https://cdn-icons-png.flaticon.com/512/3194/3194591.png',
  },
];

const ReorderSheet = ({
  visible,
  onClose,
  orderId = 'ORD-78421',
  items = DEFAULT_ITEMS,
  onConfirm,
}: Props) => {
  const insets = useSafeAreaInsets();
  const [cartItems, setCartItems] = useState<OrderItem[]>(items);

  const slideAnim = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
  const backdropAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      setCartItems(items.map((item) => ({ ...item })));
      Animated.parallel([
        Animated.spring(slideAnim, {
          toValue: 0,
          friction: 9,
          tension: 65,
          useNativeDriver: true,
        }),
        Animated.timing(backdropAnim, {
          toValue: 1,
          duration: 280,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: SCREEN_HEIGHT,
          duration: 280,
          useNativeDriver: true,
        }),
        Animated.timing(backdropAnim, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  const updateQty = (id: string, delta: number) => {
    setCartItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const newQty = Math.max(0, item.qty + delta);
          return { ...item, qty: newQty };
        }
        return item;
      })
    );
  };

  const removeItem = (id: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  const totalItems = cartItems.reduce((sum, item) => sum + item.qty, 0);

  const calculateTotal = () => {
    return cartItems
      .reduce((sum, item) => {
        const price = parseFloat(item.price.replace('$', '')) || 0;
        return sum + price * item.qty;
      }, 0)
      .toFixed(2);
  };

  const handleConfirm = () => {
    const itemsToAdd = cartItems.filter((item) => item.qty > 0);
    onConfirm(itemsToAdd);
    onClose();
  };

  return (
    <Modal transparent visible={visible} animationType="none" statusBarTranslucent>
      <View style={styles.container}>
        <TouchableWithoutFeedback onPress={onClose}>
          <Animated.View
            style={[
              styles.backdrop,
              {
                opacity: backdropAnim.interpolate({
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
              paddingBottom: insets.bottom + 16,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          {/* Handle */}
          <View style={styles.handle} />

          {/* Header */}
          <View style={styles.header}>
            <LocalizedText style={styles.title}>Reorder Items</LocalizedText>
            <LocalizedText style={styles.subtitle}>from {orderId}</LocalizedText>
          </View>

          {/* Items List */}
          <ScrollView
            style={styles.itemsList}
            showsVerticalScrollIndicator={false}
            bounces={false}
          >
            {cartItems.map((item) => (
              <View key={item.id} style={styles.itemRow}>
                <ProductDetailPressable
                  item={item}
                  style={styles.reorderProduct}
                  onOpen={(openProduct) => {
                    onClose();
                    setTimeout(openProduct, 300);
                  }}
                >
                  <View style={styles.itemImageWrapper}>
                    <Image
                      source={{ uri: item.image }}
                      style={styles.itemImage}
                      resizeMode="contain"
                    />
                  </View>

                  <View style={styles.itemInfo}>
                    <LocalizedText style={styles.itemName} numberOfLines={1}>
                      {item.name}
                    </LocalizedText>
                    <LocalizedText style={styles.itemSize}>{item.size}</LocalizedText>
                    <LocalizedText style={styles.itemPrice}>{item.price}</LocalizedText>
                  </View>
                </ProductDetailPressable>

                {/* Qty Control */}
                <View style={styles.qtyControl}>
                  {item.qty === 0 ? (
                    <TouchableOpacity
                      style={styles.addBtn}
                      onPress={() => updateQty(item.id, 1)}
                      activeOpacity={0.8}
                    >
                      <LocalizedText style={styles.addBtnText}>ADD</LocalizedText>
                    </TouchableOpacity>
                  ) : (
                    <View style={styles.qtyRow}>
                      <TouchableOpacity
                        style={styles.qtyBtn}
                        onPress={() => updateQty(item.id, -1)}
                        activeOpacity={0.7}
                      >
                        <Icon name="minus" size={16} color="#55cc70" />
                      </TouchableOpacity>
                      <LocalizedText style={styles.qtyText}>{item.qty}</LocalizedText>
                      <TouchableOpacity
                        style={styles.qtyBtn}
                        onPress={() => updateQty(item.id, 1)}
                        activeOpacity={0.7}
                      >
                        <Icon name="plus" size={16} color="#55cc70" />
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
              </View>
            ))}
          </ScrollView>

          {/* Footer */}
          <View style={styles.footer}>
            <View style={styles.totalRow}>
              <LocalizedText style={styles.totalLabel}>
                {totalItems} {totalItems === 1 ? 'item' : 'items'}
              </LocalizedText>
              <LocalizedText style={styles.totalValue}>${calculateTotal()}</LocalizedText>
            </View>

            <TouchableOpacity
              style={[styles.confirmBtn, totalItems === 0 && styles.confirmBtnDisabled]}
              activeOpacity={0.85}
              disabled={totalItems === 0}
              onPress={handleConfirm}
            >
              <LocalizedText style={styles.confirmBtnText}>
                {totalItems === 0 ? 'No items selected' : 'Add to Cart'}
              </LocalizedText>
              {totalItems > 0 && (
                <Icon name="shopping-bag" size={18} color="#ffffff" style={{ marginLeft: 8 }} />
              )}
            </TouchableOpacity>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFill,
    backgroundColor: '#000',
  },
  sheet: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingTop: 12,
    maxHeight: SCREEN_HEIGHT * 0.75,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#e0e0e0',
    alignSelf: 'center',
    marginBottom: 16,
  },
  header: {
    paddingHorizontal: 24,
    marginBottom: 12,
  },
  title: {
    fontSize: 20,
    fontFamily: 'Poppins-Bold',
    color: '#1a1a1a',
  },
  subtitle: {
    fontSize: 13,
    fontFamily: 'Poppins-Regular',
    color: '#9e9e9e',
    marginTop: 2,
  },
  itemsList: {
    paddingHorizontal: 20,
    maxHeight: 320,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#f0f0f0',
  },
  reorderProduct: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemImageWrapper: {
    width: 56,
    height: 56,
    borderRadius: 14,
    backgroundColor: '#f5f6f8',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  itemImage: {
    width: 36,
    height: 36,
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 14,
    fontFamily: 'Poppins-SemiBold',
    color: '#1a1a1a',
  },
  itemSize: {
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    color: '#9e9e9e',
    marginTop: 2,
  },
  itemPrice: {
    fontSize: 14,
    fontFamily: 'Poppins-Bold',
    color: '#1a1a1a',
    marginTop: 4,
  },
  qtyControl: {
    marginLeft: 10,
  },
  addBtn: {
    backgroundColor: '#55cc70',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 10,
  },
  addBtnText: {
    fontSize: 13,
    fontFamily: 'Poppins-Bold',
    color: '#ffffff',
  },
  qtyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0faf3',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#d4f0dc',
  },
  qtyBtn: {
    width: 34,
    height: 34,
    justifyContent: 'center',
    alignItems: 'center',
  },
  qtyText: {
    fontSize: 15,
    fontFamily: 'Poppins-Bold',
    color: '#1a1a1a',
    minWidth: 28,
    textAlign: 'center',
  },
  footer: {
    paddingHorizontal: 20,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  totalLabel: {
    fontSize: 14,
    fontFamily: 'Poppins-Medium',
    color: '#7a7a7a',
  },
  totalValue: {
    fontSize: 20,
    fontFamily: 'Poppins-Bold',
    color: '#1a1a1a',
  },
  confirmBtn: {
    backgroundColor: '#55cc70',
    height: 54,
    borderRadius: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#55cc70',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  confirmBtnDisabled: {
    backgroundColor: '#c8e6d0',
    shadowOpacity: 0,
    elevation: 0,
  },
  confirmBtnText: {
    fontSize: 16,
    fontFamily: 'Poppins-Bold',
    color: '#ffffff',
  },
});

export default ReorderSheet;