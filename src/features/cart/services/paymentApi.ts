export interface CheckoutItem {
  productName: string;
  quantity: number;
}

export interface RazorpayPaymentResponse {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

export interface RazorpayOrder {
  orderId: string;
  amount: number;
  currency: 'INR';
  keyId: string;
}

const PAYMENT_API_BASE_URL = 'http://localhost:4001';

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null;

const postJson = async (path: string, body: unknown): Promise<unknown> => {
  let response: Response;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);
  try {
    response = await fetch(`${PAYMENT_API_BASE_URL}${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      signal: controller.signal,
    });
  } catch {
    if (controller.signal.aborted) {
      throw new Error('The payment server did not respond within 15 seconds. Check the server and Android port forwarding.');
    }
    throw new Error(
      'Cannot reach the payment server. Start it and, on Android, run “adb reverse tcp:4001 tcp:4001.',
    );
  } finally {
    clearTimeout(timeout);
  }

  let payload: unknown;
  try {
    payload = await response.json();
  } catch {
    throw new Error('The payment server returned an invalid response.');
  }

  if (!response.ok) {
    const message =
      isRecord(payload) && typeof payload.error === 'string'
        ? payload.error
        : 'The payment server could not process this request.';
    throw new Error(message);
  }
  return payload;
};

export const createPaymentOrder = async (
  items: CheckoutItem[],
  couponCode?: string,
): Promise<RazorpayOrder> => {
  const payload = await postJson('/api/payments/orders', { items, couponCode });
  if (
    !isRecord(payload) ||
    typeof payload.orderId !== 'string' ||
    typeof payload.amount !== 'number' ||
    !Number.isInteger(payload.amount) ||
    payload.amount <= 0 ||
    payload.currency !== 'INR' ||
    typeof payload.keyId !== 'string' ||
    !payload.keyId.startsWith('rzp_test_')
  ) {
    throw new Error('The payment server returned invalid order details.');
  }
  return {
    orderId: payload.orderId,
    amount: payload.amount,
    currency: 'INR',
    keyId: payload.keyId,
  };
};

export const verifyPayment = async (
  payment: RazorpayPaymentResponse,
): Promise<void> => {
  const payload = await postJson('/api/payments/verify', {
    orderId: payment.razorpay_order_id,
    paymentId: payment.razorpay_payment_id,
    signature: payment.razorpay_signature,
  });
  if (!isRecord(payload) || payload.verified !== true) {
    throw new Error('The payment server did not verify this payment.');
  }
};
