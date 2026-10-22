require('dotenv').config({ path: require('node:path').join(__dirname, '../.env') });

const Razorpay = require('razorpay');
const { createApp } = require('./app');

const { PORT = '4001', RAZORPAY_KEY_ID: keyId, RAZORPAY_KEY_SECRET: keySecret } = process.env;

if (!keyId || !keySecret) {
  throw new Error(
    'Set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in server/.env. Use Razorpay test-mode credentials.',
  );
}
if (!keyId.startsWith('rzp_test_')) {
  throw new Error('This demo backend only permits Razorpay test-mode keys (rzp_test_).');
}

const razorpay = new Razorpay({ key_id: keyId, key_secret: keySecret });
const app = createApp({ razorpay, keyId, keySecret });

app.listen(Number(PORT), '0.0.0.0', () => {
  console.log(`Smart Mart test payment server listening on port ${PORT}.`);
});
