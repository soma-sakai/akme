import { NextResponse } from 'next/server';
import Stripe from 'stripe';

// Stripe APIの初期化（環境変数がある場合のみ）
const getStripeInstance = () => {
  const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

  if (!stripeSecretKey) {
    console.error('Stripe Secret Key is not configured');
    return null;
  }

  return new Stripe(stripeSecretKey, {
    apiVersion: '2023-10-16' as Stripe.LatestApiVersion,
  });
};

export async function POST(req: Request) {
  try {
    // リクエストごとに新しいStripeインスタンスを作成
    const stripe = getStripeInstance();
    
    // Stripeが初期化されていない場合はエラーを返す
    if (!stripe) {
      return NextResponse.json(
        { error: 'Stripe APIキーが設定されていません。環境変数を確認してください。' },
        { status: 500 }
      );
    }

    const { items, purchaseType } = await req.json();
    
    if (!items || items.length === 0) {
      return NextResponse.json(
        { error: '商品情報が提供されていません' },
        { status: 400 }
      );
    }

    // 商品情報からStripeのline_itemsを作成
    const lineItems = items.map((item: any) => {
      // 画像URLが絶対URLであることを確認
      const imageUrls: string[] = [];
      if (item.images && item.images.length > 0) {
        // 画像URLが有効かチェック
        const firstImage = item.images[0];
        if (typeof firstImage === 'string' && firstImage.trim() !== '') {
          // URLが相対パスの場合は絶対URLに変換
          if (firstImage.startsWith('/')) {
            const origin = req.headers.get('origin') || 'http://localhost:3000';
            imageUrls.push(`${origin}${firstImage}`);
          } else if (firstImage.startsWith('http')) {
            imageUrls.push(firstImage);
          }
        }
      }

      return {
        price_data: {
          currency: 'jpy',
          product_data: {
            name: item.name,
            description: item.description || '',
            images: imageUrls.length > 0 ? imageUrls : [],
          },
          unit_amount: item.price,
        },
        quantity: item.quantity || 1,
      };
    });

    // オリジンURLを取得
    let origin = req.headers.get('origin');
    if (!origin) {
      // Vercelのデプロイでリクエストヘッダーからoriginを取得できない場合の対策
      const referer = req.headers.get('referer');
      if (referer) {
        try {
          const url = new URL(referer);
          origin = `${url.protocol}//${url.host}`;
        } catch (e) {
          origin = 'http://localhost:3000';
        }
      } else {
        origin = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
      }
    }

    console.log('Origin for redirect URLs:', origin);

    // チェックアウトセッションの作成
    const sessionConfig: Stripe.Checkout.SessionCreateParams = {
      payment_method_types: ['card'],
      line_items: lineItems as Stripe.Checkout.SessionCreateParams.LineItem[],
      mode: (purchaseType === 'subscription' ? 'subscription' : 'payment') as Stripe.Checkout.SessionCreateParams.Mode,
      success_url: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/checkout/cancel`,
      billing_address_collection: 'auto',
      shipping_address_collection: {
        allowed_countries: ['JP'],
      },
      locale: 'ja',
    };

    console.log('Creating checkout session with config:', JSON.stringify(sessionConfig, null, 2));
    
    const session = await stripe.checkout.sessions.create(sessionConfig);

    console.log('Session created:', session.id);
    
    return NextResponse.json({ sessionId: session.id });
  } catch (error: any) {
    console.error('Stripe API error:', error);
    
    // エラーメッセージをより具体的に
    const errorMessage = error.message || '決済処理中にエラーが発生しました';
    
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
} 