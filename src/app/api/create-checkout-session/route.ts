import { NextResponse } from 'next/server';
import Stripe from 'stripe';

// Stripe APIの初期化
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16', // 最新のAPIバージョンを使用
});

export async function POST(req: Request) {
  try {
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
          description: item.description,
          images: item.images ? [item.images[0]] : [],
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
      success_url: `${req.headers.get('origin')}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.get('origin')}/checkout/cancel`,
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