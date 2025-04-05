import { loadStripe, Stripe } from '@stripe/stripe-js';

// 環境変数からStripeの公開鍵を取得
const stripePublicKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;

// Stripe Promise インスタンスをキャッシュ
let stripePromise: Promise<Stripe | null> | null = null;

// Stripeインスタンスを取得するための関数
export const getStripe = async () => {
  if (!stripePromise && stripePublicKey) {
    stripePromise = loadStripe(stripePublicKey);
  }
  return stripePromise;
}; 