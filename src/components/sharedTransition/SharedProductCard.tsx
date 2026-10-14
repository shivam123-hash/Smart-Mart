import React, { useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Dimensions, ViewStyle } from 'react-native';
import Icon from '@react-native-vector-icons/feather';
import { useSharedTransition } from './SharedTransitionContext';
import { getProductReviews } from '../../data/productReviews';

const { width } = Dimensions.get('window');

export interface ProductItem {
  id: string;
  name: string;
  size?: string;
  price: string;
  originalPrice?: string;
  image: string;
  images?: string[];
  [key: string]: any;
}

interface SharedProductCardProps {
  item: ProductItem;
  style?: ViewStyle;
  onPress?: () => void;
  onAdd?: (item: ProductItem) => void;
  onFavorite?: (item: ProductItem) => void;
}

export const SharedProductCard: React.FC<SharedProductCardProps> = ({
  item,
  style,
  onPress,
  onAdd,
  onFavorite,
}) => {
  const cardRef = useRef<any>(null);
  const { openProduct } = useSharedTransition();

  const handleCardPress = () => {
    if (onPress) {
      onPress();
      return;
    }

    // Measure exact screen coordinates in window
    cardRef.current?.measureInWindow((x: number, y: number, cardWidth: number, cardHeight: number) => {
      openProduct({ ...item, reviews: getProductReviews(item) }, {
        x,
        y,
        width: cardWidth,
        height: cardHeight,
      });
    });
  };

  return (
    <View ref={cardRef} collapsable={false}>
      <TouchableOpacity
        style={[styles.productCard, style]}
        onPress={handleCardPress}
        activeOpacity={0.88}
      >
        <TouchableOpacity
          style={styles.favoriteIcon}
          onPress={() => onFavorite && onFavorite(item)}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Icon name="heart" size={18} color="#1a1a1a" />
        </TouchableOpacity>

        <View style={styles.productImageContainer}>
          <Image
            source={{ uri: item.image }}
            style={styles.productImage}
            resizeMode="contain"
          />
        </View>

        <Text style={styles.productName} numberOfLines={2}>
          {item.name}
        </Text>
        {item.size ? <Text style={styles.productSize}>{item.size}</Text> : null}

        <View style={styles.priceRow}>
          <View style={styles.priceContainer}>
            <Text style={styles.currentPrice}>{item.price}</Text>
            {item.originalPrice ? (
              <Text style={styles.originalPrice}>{item.originalPrice}</Text>
            ) : null}
          </View>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => onAdd && onAdd(item)}
            activeOpacity={0.8}
          >
            <Text style={styles.addButtonText}>Add</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  productCard: {
    width: (width - 55) / 2,
    backgroundColor: '#f8f8f8',
    borderRadius: 20,
    padding: 15,
    marginRight: 15,
  },
  favoriteIcon: {
    position: 'absolute',
    top: 15,
    right: 15,
    zIndex: 1,
  },
  productImageContainer: {
    height: 110,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  productImage: {
    width: '100%',
    height: '100%',
  },
  productName: {
    fontSize: 14,
    fontFamily: 'Poppins-Medium',
    color: '#1a1a1a',
    height: 40,
    marginBottom: 5,
  },
  productSize: {
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    color: '#9e9e9e',
    marginBottom: 10,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  currentPrice: {
    fontSize: 16,
    fontFamily: 'Poppins-Bold',
    color: '#1a1a1a',
    marginRight: 8,
  },
  originalPrice: {
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    color: '#9e9e9e',
    textDecorationLine: 'line-through',
  },
  addButton: {
    backgroundColor: '#55cc70',
    paddingHorizontal: 15,
    paddingVertical: 6,
    borderRadius: 8,
  },
  addButtonText: {
    color: '#ffffff',
    fontSize: 12,
    fontFamily: 'Poppins-Medium',
  },
});

export default SharedProductCard;
