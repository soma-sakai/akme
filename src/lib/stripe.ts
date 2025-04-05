import { loadStripe } from '@stripe/stripe-js';

// 環境変数からStripeの公開鍵を取得
const stripePublicKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!;

// Stripeインスタンスを取得するための関数
export const getStripe = async () => {
  const stripePromise = loadStripe(stripePublicKey);
  return stripePromise;
}; 