export interface ProductReview {
  id: string;
  name: string;
  date: string;
  rating: number;
  text: string;
  images: string[];
}

export const PRODUCT_REVIEWS: ProductReview[] = [
  {
    id: 'review-1',
    name: 'Johnson Smith',
    date: 'April 10, 2026',
    rating: 5,
    text: 'Recently purchased this product and the quality is excellent. It arrived fresh, was packed carefully, and is great value for the price.',
    images: [
      'https://images.unsplash.com/photo-1542838132-92c53300491e?w=700&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=700&auto=format&fit=crop',
    ],
  },
  {
    id: 'review-2',
    name: 'Priya Sharma',
    date: 'April 6, 2026',
    rating: 5,
    text: 'Good quality and exactly as described. I will be ordering this again for my family.',
    images: ['https://images.unsplash.com/photo-1579113800032-c38bd7635818?w=700&auto=format&fit=crop'],
  },
  {
    id: 'review-3',
    name: 'Michael Brown',
    date: 'March 29, 2026',
    rating: 4,
    text: 'Fresh and well packaged. Delivery was quick, and the product was in great condition.',
    images: [],
  },
  {
    id: 'review-4',
    name: 'Aisha Khan',
    date: 'March 22, 2026',
    rating: 5,
    text: 'Really happy with this purchase. The quality is consistent and it arrived right on time.',
    images: [
      'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=700&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1547592180-85f173990554?w=700&auto=format&fit=crop',
    ],
  },
  {
    id: 'review-5',
    name: 'Daniel Wilson',
    date: 'March 18, 2026',
    rating: 4,
    text: 'A reliable everyday product. Good freshness and a smooth shopping experience.',
    images: [],
  },
  {
    id: 'review-6',
    name: 'Neha Patel',
    date: 'March 12, 2026',
    rating: 5,
    text: 'Excellent quality for the price. Everything was carefully packed and looked fresh.',
    images: ['https://images.unsplash.com/photo-1542838132-92c53300491e?w=700&auto=format&fit=crop'],
  },
];

export const SHOP_REVIEWS: ProductReview[] = [
  {
    id: 'shop-review-1',
    name: 'Emily Johnson',
    date: 'October 8, 2026',
    rating: 5,
    text: 'Friendly service, fresh groceries, and my order was packed with care. Delivery arrived earlier than expected.',
    images: [
      'https://images.unsplash.com/photo-1542838132-92c53300491e?w=700&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=700&auto=format&fit=crop',
    ],
  },
  {
    id: 'shop-review-2',
    name: 'Arjun Mehta',
    date: 'October 4, 2026',
    rating: 5,
    text: 'Great selection and excellent quality. The shop team quickly helped me find everything I needed.',
    images: ['https://images.unsplash.com/photo-1579113800032-c38bd7635818?w=700&auto=format&fit=crop'],
  },
  {
    id: 'shop-review-3',
    name: 'Olivia Davis',
    date: 'September 30, 2026',
    rating: 4,
    text: 'Reliable neighborhood shop with fresh produce and quick delivery. I will shop here again.',
    images: [],
  },
  {
    id: 'shop-review-4',
    name: 'Rohan Kapoor',
    date: 'September 24, 2026',
    rating: 5,
    text: 'Everything was fresh and carefully packed. The service was smooth from order to delivery.',
    images: [
      'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=700&auto=format&fit=crop',
    ],
  },
  {
    id: 'shop-review-5',
    name: 'Sophia Wilson',
    date: 'September 18, 2026',
    rating: 4,
    text: 'A good range of everyday groceries and helpful staff. My order arrived in great condition.',
    images: [],
  },
];

export const getProductReviews = (product?: {
  id?: string | number;
  name?: string;
  reviews?: ProductReview[];
}): ProductReview[] => {
  if (product?.reviews?.length) {
    return product.reviews;
  }

  const productKey =
    [product?.id, product?.name].filter(Boolean).join('-') || 'product';
  const offset = Array.from(productKey).reduce(
    (total, character) => total + character.charCodeAt(0),
    0,
  ) % PRODUCT_REVIEWS.length;

  return PRODUCT_REVIEWS.map((_, index) => {
    const review = PRODUCT_REVIEWS[(index + offset) % PRODUCT_REVIEWS.length];
    return {
      ...review,
      id: `${productKey}-${review.id}`,
    };
  });
};
