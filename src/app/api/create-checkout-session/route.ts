import { NextResponse } from 'next/server';
import Stripe from 'stripe';

// Stripe APIの初期化（環境変数がある場合のみ）
const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
let stripe: Stripe | null = null;

if (stripeSecretKey) {
  stripe = new Stripe(stripeSecretKey, {
    apiVersion: '2023-10-16' as Stripe.LatestApiVersion,
  });
}

export async function POST(req: Request) {
  try {
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
    const lineItems = items.map((item: any) => ({
      price_data: {
        currency: 'jpy',
        product_data: {
          name: item.name,
          description: item.description || '',
          images: item.images && item.images.length > 0 ? [item.images[0]] : [],
        },
        unit_amount: item.price,
      },
      quantity: item.quantity || 1,
    }));

    // チェックアウトセッションの作成
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: purchaseType === 'subscription' ? 'subscription' : 'payment',
      success_url: `${req.headers.get('origin') || 'http://localhost:3000'}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.get('origin') || 'http://localhost:3000'}/checkout/cancel`,
    });

    return NextResponse.json({ sessionId: session.id });
  } catch (error) {
    console.error('Stripe API error:', error);
    return NextResponse.json(
      { error: '決済処理中にエラーが発生しました' },
      { status: 500 }
    );
  }
} 