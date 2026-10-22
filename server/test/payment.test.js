const { after, before, test } = require('node:test');
const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const { createApp } = require('../src/app');

const keySecret = 'test-server-secret';
const orderId = 'order_test_123';
const paymentId = 'pay_test_123';
const amount = 4390;
const signature = crypto
  .createHmac('sha256', keySecret)
  .update(`${orderId}|${paymentId}`)
  .digest('hex');

let server;
let baseUrl;
let paymentStatus = 'captured';
let captureCalls = 0;

before(async () => {
  const razorpay = {
    orders: {
      create: async ({ amount: orderAmount, currency }) => ({
        id: orderId,
        amount: orderAmount,
        currency,
      }),
      fetch: async (id) => ({
        id,
        amount,
        amount_paid: amount,
        currency: 'INR',
        status: 'paid',
      }),
    },
    payments: {
      fetch: async (id) => ({
        id,
        order_id: orderId,
        amount,
        currency: 'INR',
        status: paymentStatus,
      }),
      capture: async (id) => {
        captureCalls += 1;
        paymentStatus = 'captured';
        return { id, status: 'captured' };
      },
    },
  };
  server = createApp({ razorpay, keyId: 'rzp_test_example', keySecret }).listen(0);
  await new Promise((resolve) => server.once('listening', resolve));
  baseUrl = `http://127.0.0.1:${server.address().port}`;
});

after(async () => {
  await new Promise((resolve, reject) =>
    server.close((error) => (error ? reject(error) : resolve())),
  );
});

test('creates an INR order using server-side prices and delivery fee', async () => {
  const response = await fetch(`${baseUrl}/api/payments/orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      amount: 1,
      currency: 'USD',
      items: [
        { productName: 'Surf Excel Easy Wash Detergent Powder', quantity: 1 },
        { productName: 'Fortune Arhar Dal (Toor Dal)', quantity: 2 },
        { productName: 'Fresh Apples (Fuji)', quantity: 1 },
        { productName: 'Amul Taaza Toned Milk', quantity: 3 },
      ],
    }),
  });

  assert.equal(response.status, 201);
  assert.deepEqual(await response.json(), {
    orderId,
    amount,
    currency: 'INR',
    keyId: 'rzp_test_example',
  });
});

test('rejects unknown products before calling Razorpay', async () => {
  const response = await fetch(`${baseUrl}/api/payments/orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ items: [{ productName: 'Unknown product', quantity: 1 }] }),
  });

  assert.equal(response.status, 400);
  assert.deepEqual(await response.json(), { error: 'The cart contains an unknown product.' });
});

test('accepts products whose IDs are reused in another catalog section', async () => {
  const response = await fetch(`${baseUrl}/api/payments/orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      items: [{ productName: 'Fortune Soyabean Refined Oil', quantity: 1 }],
    }),
  });

  assert.equal(response.status, 201);
  assert.deepEqual(await response.json(), {
    orderId,
    amount: 1250,
    currency: 'INR',
    keyId: 'rzp_test_example',
  });
});

test('combines duplicate product names and enforces the quantity limit', async () => {
  const response = await fetch(`${baseUrl}/api/payments/orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      items: [
        { productName: 'Fresh Apples (Fuji)', quantity: 2 },
        { productName: 'Fresh Apples (Fuji)', quantity: 3 },
      ],
    }),
  });

  assert.equal(response.status, 201);
  assert.deepEqual(await response.json(), {
    orderId,
    amount: 2250,
    currency: 'INR',
    keyId: 'rzp_test_example',
  });

  const overLimitResponse = await fetch(`${baseUrl}/api/payments/orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      items: [
        { productName: 'Fresh Apples (Fuji)', quantity: 20 },
        { productName: 'Fresh Apples (Fuji)', quantity: 1 },
      ],
    }),
  });
  assert.equal(overLimitResponse.status, 400);
  assert.deepEqual(await overLimitResponse.json(), {
    error: 'Product quantities cannot exceed 20 per product.',
  });
});

test('applies coupon savings using server-calculated subtotal', async () => {
  const response = await fetch(`${baseUrl}/api/payments/orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      items: [
        { productName: 'Surf Excel Easy Wash Detergent Powder', quantity: 1 },
        { productName: 'Fortune Arhar Dal (Toor Dal)', quantity: 2 },
      ],
      couponCode: 'SAVE10',
    }),
  });

  assert.equal(response.status, 201);
  assert.deepEqual(await response.json(), {
    orderId,
    amount: 2450,
    currency: 'INR',
    keyId: 'rzp_test_example',
  });
});

test('caps percentage discounts on the server', async () => {
  const response = await fetch(`${baseUrl}/api/payments/orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      items: [{ productName: 'Surf Excel Easy Wash Detergent Powder', quantity: 10 }],
      couponCode: 'FRESH15',
    }),
  });

  assert.equal(response.status, 201);
  assert.deepEqual(await response.json(), {
    orderId,
    amount: 10750,
    currency: 'INR',
    keyId: 'rzp_test_example',
  });
});

test('rejects coupons that are unknown or below minimum spend', async () => {
  const invalidCouponResponse = await fetch(`${baseUrl}/api/payments/orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      items: [{ productName: 'Surf Excel Easy Wash Detergent Powder', quantity: 1 }],
      couponCode: 'NOPE',
    }),
  });
  assert.equal(invalidCouponResponse.status, 400);
  assert.deepEqual(await invalidCouponResponse.json(), { error: 'The coupon code is invalid.' });

  const minSpendResponse = await fetch(`${baseUrl}/api/payments/orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      items: [{ productName: 'Surf Excel Easy Wash Detergent Powder', quantity: 1 }],
      couponCode: 'SAVE10',
    }),
  });
  assert.equal(minSpendResponse.status, 400);
  assert.deepEqual(await minSpendResponse.json(), {
    error: 'The cart does not meet this coupon’s minimum spend.',
  });
});

test('rejects invalid payment signatures', async () => {
  const response = await fetch(`${baseUrl}/api/payments/verify`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ orderId, paymentId, signature: 'invalid' }),
  });

  assert.equal(response.status, 400);
  assert.deepEqual(await response.json(), { error: 'The payment signature is invalid.' });
});

test('verifies the signature and captured Razorpay order', async () => {
  const response = await fetch(`${baseUrl}/api/payments/verify`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ orderId, paymentId, signature }),
  });

  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { verified: true, orderId, paymentId });
});

test('captures an authorized payment before confirming checkout', async () => {
  paymentStatus = 'authorized';
  const response = await fetch(`${baseUrl}/api/payments/verify`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ orderId, paymentId, signature }),
  });

  assert.equal(response.status, 200);
  assert.equal(captureCalls, 1);
  paymentStatus = 'captured';
});
