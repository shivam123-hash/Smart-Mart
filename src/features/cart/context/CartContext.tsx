import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import type { ProductItem } from '../../../shared/components/sharedTransition/SharedProductCard';
import { useFeedback } from '../../../shared/components/feedback/FeedbackProvider';

export interface CartItem {
  key: string;
  productId: string;
  name: string;
  size: string;
  price: number;
  originalPrice: number;
  image: string;
  quantity: number;
}

interface CartContextValue {
  items: CartItem[];
  itemCount: number;
  addProduct: (product: ProductItem) => void;
  addProducts: (products: ProductItem[]) => void;
  updateQuantity: (id: string, delta: number) => void;
  removeProduct: (id: string) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

const parsePrice = (value: string | undefined): number => {
  const price = Number.parseFloat((value ?? '').replace(/[^0-9.]/g, ''));
  return Number.isFinite(price) && price > 0 ? price : 0;
};

export const CartProvider = ({ children }: React.PropsWithChildren) => {
  const { showDialog, showToast } = useFeedback();
  const [items, setItems] = useState<CartItem[]>([]);

  const addProducts = useCallback((products: ProductItem[]) => {
    const validProducts = products
      .map((product) => ({
        ...product,
        price: parsePrice(product.price),
        originalPrice: parsePrice(product.originalPrice),
      }))
      .filter((product) => product.price > 0 && product.id && product.name && product.image);

    if (validProducts.length !== products.length) {
      showDialog('Unable to add items', 'One or more products are missing a valid name, price, or image.');
      return;
    }
    if (validProducts.length === 0) {
      return;
    }

    setItems((current) => {
      const next = [...current];
      validProducts.forEach((product) => {
        const key = `${product.id}:${product.name}`;
        const existingIndex = next.findIndex((item) => item.key === key);
        if (existingIndex !== -1) {
          next[existingIndex] = {
            ...next[existingIndex],
            quantity: next[existingIndex].quantity + 1,
          };
        } else {
          next.push({
            key,
            productId: product.id,
            name: product.name,
            size: product.size ?? '',
            price: product.price,
            originalPrice: product.originalPrice,
            image: product.image,
            quantity: 1,
          });
        }
      });
      return next;
    });
    showToast(validProducts.length === 1 ? 'Added to cart.' : 'Items added to cart.', 'success');
  }, [showDialog, showToast]);

  const addProduct = useCallback((product: ProductItem) => {
    addProducts([product]);
  }, [addProducts]);

  const updateQuantity = useCallback((id: string, delta: number) => {
    setItems((current) =>
      current
        .map((item) =>
          item.key === id ? { ...item, quantity: Math.max(0, item.quantity + delta) } : item,
        )
        .filter((item) => item.quantity > 0),
    );
  }, []);

  const removeProduct = useCallback((id: string) => {
    setItems((current) => current.filter((item) => item.key !== id));
  }, []);

  const clearCart = useCallback(() => setItems([]), []);
  const itemCount = items.reduce((total, item) => total + item.quantity, 0);
  const value = useMemo(
    () => ({ items, itemCount, addProduct, addProducts, updateQuantity, removeProduct, clearCart }),
    [items, itemCount, addProduct, addProducts, updateQuantity, removeProduct, clearCart],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = (): CartContextValue => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider.');
  }
  return context;
};
