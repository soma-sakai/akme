import { loadStripe, Stripe } from '@stripe/stripe-js';

// クライアントサイドでのみ実行されるように修正
// Stripe Promise インスタンスをキャッシュ
let stripePromise: Promise<Stripe | null> | null = null;

// Stripeインスタンスを取得するための関数
export const getStripe = async () => {
  if (typeof window === 'undefined') {
    // サーバーサイドでは実行しない
    console.warn('getStripe was called on the server side');
    return null;
  }

  const stripePublicKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
  
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

// Stripe公開鍵が設定されているかどうかをチェック (クライアントサイドのみ)
export const hasStripeConfig = typeof window !== 'undefined' ? 
  !!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY : false; 