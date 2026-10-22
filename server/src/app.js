const crypto = require('node:crypto');
const express = require('express');
const helmet = require('helmet');
const { rateLimit } = require('express-rate-limit');
const {
  CURRENCY,
  PaymentInputError,
  calculateOrder,
  isValidPaymentSignature,
} = require('./paymentDomain');

const createApp = ({ razorpay, keyId, keySecret }) => {
  const app = express();
  const paymentRateLimit = rateLimit({
    windowMs: 60 * 1000,
    limit: 20,
    standardHeaders: 'draft-8',
    legacyHeaders: false,
  });

  app.disable('x-powered-by');
  app.use(helmet());
  app.use(express.json({ limit: '10kb' }));

  app.get('/health', (_request, response) => {
    response.json({ status: 'ok' });
  });

  app.post('/api/payments/orders', paymentRateLimit, async (request, response) => {
    try {
      const calculated = calculateOrder(request.body?.items, request.body?.couponCode);
      const receipt = crypto.randomUUID().replaceAll('-', '').slice(0, 32);
      const order = await razorpay.orders.create({
        amount: calculated.amount,
        currency: CURRENCY,
        receipt,
      });

      response.status(201).json({
        orderId: order.id,
        amount: order.amount,
        currency: order.currency,
        keyId,
      });
    } catch (error) {
      if (error instanceof PaymentInputError) {
        response.status(400).json({ error: error.message });
        return;
      }
      console.error('Razorpay order creation failed.');
      response.status(502).json({ error: 'Unable to create a Razorpay order.' });
    }
  });

  app.post('/api/payments/verify', paymentRateLimit, async (request, response) => {
    const { orderId, paymentId, signature } = request.body ?? {};
    if (
      !isValidPaymentSignature({
        orderId,
        paymentId,
        signature,
        secret: keySecret,
      })
    ) {
      response.status(400).json({ error: 'The payment signature is invalid.' });
      return;
    }

    try {
      const [order, payment] = await Promise.all([
        razorpay.orders.fetch(orderId),
        razorpay.payments.fetch(paymentId),
      ]);

      if (
        payment.order_id !== order.id ||
        payment.amount !== order.amount ||
        payment.currency !== CURRENCY ||
        !['authorized', 'captured'].includes(payment.status) ||
        order.currency !== CURRENCY
      ) {
        response.status(400).json({ error: 'Razorpay has not confirmed this payment.' });
        return;
      }

      const capturedPayment =
        payment.status === 'authorized'
          ? await razorpay.payments.capture(paymentId, order.amount, CURRENCY)
          : payment;
      const confirmedOrder = await razorpay.orders.fetch(orderId);
      if (
        capturedPayment.status !== 'captured' ||
        confirmedOrder.status !== 'paid' ||
        confirmedOrder.amount_paid < confirmedOrder.amount
      ) {
        response.status(400).json({ error: 'Razorpay has not confirmed this payment.' });
        return;
      }

      response.json({ verified: true, orderId: order.id, paymentId: payment.id });
    } catch {
      console.error('Razorpay payment verification failed.');
      response.status(502).json({ error: 'Unable to verify the Razorpay payment.' });
    }
  });

  return app;
};

module.exports = { createApp };
