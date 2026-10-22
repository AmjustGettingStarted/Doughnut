import type {CartLine} from '@/store/cartStore';

export interface OrderPayload {
  customer: {name: string; phone: string; email?: string};
  fulfilment:
    | {method: 'delivery'; address: string; zone: string; pincode: string; note?: string}
    | {method: 'pickup'; slot: string; note?: string};
  payment: 'upi' | 'card' | 'cod';
  lines: CartLine[];
  totals: {subtotal: number; delivery: number; total: number};
}

export interface OrderResult {
  orderId: string;
  eta: string;
}

/**
 * TODO(payments): replace this mock with the real flow —
 *   1. POST /api/orders with `payload` to create a pending order,
 *   2. open the payment provider (Razorpay / Stripe) with the returned order id,
 *   3. confirm on the provider's success callback and return the server's order id.
 * The UI only depends on the resolved `OrderResult` shape.
 */
export function submitOrder(payload: OrderPayload): Promise<OrderResult> {
  return new Promise((resolve) => {
    window.setTimeout(() => {
      const suffix = Math.random().toString(36).slice(2, 6).toUpperCase();
      resolve({
        orderId: `RT-${suffix}`,
        eta: payload.fulfilment.method === 'pickup' ? `Ready at ${payload.fulfilment.slot}` : '35–45 min',
      });
    }, 1400);
  });
}
