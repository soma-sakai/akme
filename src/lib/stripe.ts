import { loadStripe, Stripe } from '@stripe/stripe-js';

// 環境変数からStripeの公開鍵を取得
const stripePublicKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;

// Stripe Promise インスタンスをキャッシュ
let stripePromise: Promise<Stripe | null> | null = null;

// Stripeインスタンスを取得するための関数
export const getStripe = async () => {
  if (!stripePromise && stripePublicKey) {
    try {
      console.log('Stripe初期化開始');
      stripePromise = loadStripe(stripePublicKey);
      console.log('Stripe初期化完了');
      return await stripePromise;
    } catch (error) {
      console.error('Stripe初期化エラー:', error);
      return null;
    }
  }
  return stripePromise;
};

// Stripe公開鍵が設定されているかどうかをチェック
export const hasStripeConfig = !!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY; 