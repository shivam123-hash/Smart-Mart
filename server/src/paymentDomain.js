const crypto = require('node:crypto');

const CURRENCY = 'INR';
const DELIVERY_FEE_PAISE = 250;
const MAX_ITEM_QUANTITY = 20;
const COUPONS = Object.freeze({
  SAVE10: { type: 'fixed', value: 1000, minimumSubtotal: 3000 },
  FRESH15: { type: 'percentage', value: 15, maximumDiscount: 1500, minimumSubtotal: 4000 },
});

const PRODUCTS = Object.freeze({
  'Surf Excel Easy Wash Detergent Powder': { unitPricePaise: 1200 },
  'Fortune Arhar Dal (Toor Dal)': { unitPricePaise: 1000 },
  'Fresh Apples (Fuji)': { unitPricePaise: 400 },
  'Aashirvaad Shudh Chakki Atta': { unitPricePaise: 1800 },
  'Amul Taaza Toned Milk': { unitPricePaise: 180 },
  'Tropicana Orange Juice': { unitPricePaise: 450 },
  'Tata Tea Premium': { unitPricePaise: 700 },
  'Maggi 2-Minute Noodles': { unitPricePaise: 500 },
  'Fortune Sunlite Refined Oil': { unitPricePaise: 2200 },
  'Fresh Farm Chicken Breast': { unitPricePaise: 550 },
  'Britannia Good Day Cookies': { unitPricePaise: 400 },
  "Lay's Classic Salted Chips": { unitPricePaise: 250 },
  'Fresh Dairy Milk 1L': { unitPricePaise: 200 },
  'Orange Juice Premium': { unitPricePaise: 500 },
  'Organic Bananas': { unitPricePaise: 300 },
  'Mother Dairy Curd': { unitPricePaise: 150 },
  'Real Fruit Juice Mixed': { unitPricePaise: 350 },
  'India Gate Basmati Rice': { unitPricePaise: 2800 },
  'Fresh Tomatoes': { unitPricePaise: 180 },
  'Amul Butter': { unitPricePaise: 600 },
  'Fresh Coriander Leaves': { unitPricePaise: 80 },
  'Lipton Green Tea Bags': { unitPricePaise: 800 },
  'Frozen Green Peas': { unitPricePaise: 300 },
  'Fresh Chicken Breast': { unitPricePaise: 600 },
  'Nescafe Classic Coffee': { unitPricePaise: 900 },
  'McCain French Fries': { unitPricePaise: 700 },
  'Fresh Rohu Fish': { unitPricePaise: 800 },
  'Tata Salt': { unitPricePaise: 120 },
  'Britannia Bread': { unitPricePaise: 150 },
  'Eggs (Farm Fresh)': { unitPricePaise: 300 },
  'Frozen Mixed Vegetables': { unitPricePaise: 400 },
  'Fortune Soyabean Refined Oil': { unitPricePaise: 1000 },
  'Fortune Rice Bran Refined Oil': { unitPricePaise: 1500 },
});

class PaymentInputError extends Error {}

const calculateOrder = (items, couponCode) => {
  if (couponCode !== undefined && (typeof couponCode !== 'string' || couponCode.length > 32)) {
    throw new PaymentInputError('The coupon code is invalid.');
  }
  if (!Array.isArray(items) || items.length === 0 || items.length > 20) {
    throw new PaymentInputError('Cart items must contain between 1 and 20 products.');
  }

  const quantitiesByProduct = new Map();
  items.forEach((item) => {
    if (
      item === null ||
      typeof item !== 'object' ||
      typeof item.productName !== 'string' ||
      !Number.isInteger(item.quantity) ||
      item.quantity < 1 ||
      item.quantity > MAX_ITEM_QUANTITY
    ) {
      throw new PaymentInputError('Each cart item must have a valid product name and quantity.');
    }

    if (!Object.hasOwn(PRODUCTS, item.productName)) {
      throw new PaymentInputError('The cart contains an unknown product.');
    }
    const quantity = (quantitiesByProduct.get(item.productName) ?? 0) + item.quantity;
    if (quantity > MAX_ITEM_QUANTITY) {
      throw new PaymentInputError('Product quantities cannot exceed 20 per product.');
    }
    quantitiesByProduct.set(item.productName, quantity);
  });

  const pricedItems = [...quantitiesByProduct].map(([name, quantity]) => {
    return {
      quantity,
      unitPricePaise: PRODUCTS[name].unitPricePaise,
      name,
    };
  });

  const subtotal = pricedItems.reduce(
    (sum, item) => sum + item.unitPricePaise * item.quantity,
    0,
  );
  const coupon = couponCode ? COUPONS[couponCode] : undefined;
  if (couponCode && !coupon) {
    throw new PaymentInputError('The coupon code is invalid.');
  }
  if (coupon && subtotal < coupon.minimumSubtotal) {
    throw new PaymentInputError('The cart does not meet this coupon’s minimum spend.');
  }
  const discount = coupon
    ? coupon.type === 'fixed'
      ? coupon.value
      : Math.min(Math.floor((subtotal * coupon.value) / 100), coupon.maximumDiscount)
    : 0;
  const amount = Math.max(0, subtotal + DELIVERY_FEE_PAISE - discount);
  if (!Number.isSafeInteger(amount) || amount <= 0) {
    throw new PaymentInputError('The calculated order amount is invalid.');
  }

  return { amount, currency: CURRENCY, items: pricedItems, subtotal, discount };
};

const isValidPaymentSignature = ({ orderId, paymentId, signature, secret }) => {
  if (
    typeof orderId !== 'string' ||
    typeof paymentId !== 'string' ||
    typeof signature !== 'string' ||
    !/^[a-f0-9]{64}$/i.test(signature)
  ) {
    return false;
  }

  const expected = crypto
    .createHmac('sha256', secret)
    .update(`${orderId}|${paymentId}`)
    .digest();
  const actual = Buffer.from(signature, 'hex');
  return actual.length === expected.length && crypto.timingSafeEqual(actual, expected);
};

module.exports = {
  CURRENCY,
  COUPONS,
  DELIVERY_FEE_PAISE,
  PaymentInputError,
  PRODUCTS,
  calculateOrder,
  isValidPaymentSignature,
};
