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

  if (stripePromise) {
    return stripePromise;
  }

  const stripePublicKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
  
  if (!stripePublicKey) {
    console.error('Stripe公開鍵が設定されていません。環境変数を確認してください。');
    return null;
  }
  
  try {
    console.log('Stripe初期化開始: 鍵の先頭4文字 = ' + stripePublicKey.substring(0, 4) + '...');
    stripePromise = loadStripe(stripePublicKey);
    
    // インスタンスを実際に解決して確認
    const stripeInstance = await stripePromise;
    if (stripeInstance) {
      console.log('Stripe初期化完了: インスタンスが正常に作成されました');
      return stripeInstance;
    } else {
      console.error('Stripe初期化失敗: インスタンスがnullです');
      stripePromise = null;
      return null;
    }
  } catch (error) {
    console.error('Stripe初期化エラー:', error);
    stripePromise = null;
    return null;
  }
};

// Stripe公開鍵が設定されているかどうかをチェック (クライアントサイドのみ)
export const checkStripeConfig = (): boolean => {
  if (typeof window === 'undefined') return false;
  
  try {
    const key = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
    return !!key && key.length > 0;
  } catch (e) {
    console.error('環境変数チェックエラー:', e);
    return false;
  }
}; 