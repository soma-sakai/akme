import { NextResponse } from 'next/server';
import type { Stripe } from 'stripe';

// APIハンドラー
export async function POST(req: Request) {
  try {
    // リファラーとオリジンのチェック
    const origin = req.headers.get('origin');
    const referer = req.headers.get('referer');
    
    // デプロイ環境に応じたサイトURL
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 
                   (typeof self !== 'undefined' && self.location?.origin) || 
                   'http://localhost:3000';
                   
    const baseUrl = new URL(siteUrl).origin;
    
    const allowedOrigins = [
      siteUrl,
      baseUrl,
      'http://localhost:3000',
      'https://akamee-thrgdb47e-gradation.vercel.app',
      'https://akme.vercel.app',
      'https://akme-git-main-soma-sakais-projects.vercel.app',
      'https://akamee-six.vercel.app'
    ].filter(Boolean) as string[];
    
    console.log(`[API] サイトURL: ${siteUrl}, ベースURL: ${baseUrl}`);
    console.log(`[API] リクエスト元: origin=${origin}, referer=${referer}`);
    
    // リファラーが許可されたオリジンから来ているか確認
    // 開発環境では検証をスキップ（より寛容に）
    const isDevMode = process.env.NODE_ENV === 'development';
    const isValidOrigin = isDevMode || !origin || allowedOrigins.some(allowed => origin.includes(allowed));
    const isValidReferer = isDevMode || !referer || allowedOrigins.some(allowed => referer.includes(allowed));
    
    if (!isValidOrigin && !isValidReferer) {
      console.warn(`[API] 不正なオリジンからのリクエスト: origin=${origin}, referer=${referer}`);
      return NextResponse.json(
        { error: '不正なリクエスト元からのアクセスです' },
        { status: 403 }
      );
    }

    // 遅延インポートでStripeモジュールを読み込む (Vercelデプロイでの問題回避策)
    let StripeSDK;
    try {
      const stripeModule = await import('stripe');
      StripeSDK = stripeModule.default;
    } catch (importError) {
      console.error('[API] Stripeモジュールのインポートに失敗:', importError);
      return NextResponse.json(
        { error: 'サーバー側でStripeモジュールのロードに失敗しました' },
        { status: 500 }
      );
    }
    
    // Stripeの初期化
    const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
    if (!stripeSecretKey) {
      console.error('[API] Stripe Secret Key is not configured');
      return NextResponse.json(
        { error: 'Stripe APIキーが設定されていません。環境変数を確認してください。' },
        { status: 500 }
      );
    }

    // APIバージョンを動的に扱うことでエラーを避ける
    let stripe;
    try {
      stripe = new StripeSDK(stripeSecretKey, {
        apiVersion: '2023-10-16' as any,
      });
    } catch (stripeInitError) {
      console.error('[API] Stripeの初期化に失敗:', stripeInitError);
      return NextResponse.json(
        { error: 'Stripe連携の初期化に失敗しました' },
        { status: 500 }
      );
    }

    // リクエストボディの解析
    let body;
    let productId, productName, productImage, price, isSubscription, userId, description;
    
    try {
      body = await req.json();
      console.log('[API] リクエストボディ:', body);
      
      // 新しい形式のリクエスト（単一商品）
      if (body.productId && body.productName && typeof body.price === 'number') {
        productId = body.productId;
        productName = body.productName;
        productImage = body.productImage;
        price = body.price;
        isSubscription = body.isSubscription;
        userId = body.userId;
        description = body.description;
      } 
      // 従来の形式のリクエスト（items配列）
      else if (body.items && Array.isArray(body.items) && body.items.length > 0) {
        const item = body.items[0];
        productId = item.id || 'unknown';
        productName = item.name || '商品';
        productImage = item.images && item.images.length > 0 ? item.images[0] : null;
        price = item.price || 0;
        isSubscription = body.purchaseType === 'subscription';
        userId = 'anonymous';
        description = item.description;
      }
      else {
        return NextResponse.json(
          { error: '商品情報が提供されていないか、無効なフォーマットです' },
          { status: 400 }
        );
      }
      
      // 必須項目の検証
      if (!productName || typeof price !== 'number' || price <= 0) {
        return NextResponse.json(
          { error: '無効な商品データです。商品名と価格は必須です。' },
          { status: 400 }
        );
      }
    } catch (error) {
      console.error('[API] JSON parsing error:', error);
      return NextResponse.json(
        { error: 'リクエストの解析に失敗しました' },
        { status: 400 }
      );
    }

    // 画像URLの処理
    const imageUrls: string[] = [];
    if (productImage) {
      // URLが相対パスの場合は絶対URLに変換
      if (typeof productImage === 'string' && productImage.trim() !== '') {
        if (productImage.startsWith('/')) {
          imageUrls.push(`${baseUrl}${productImage}`);
        } else if (productImage.startsWith('http')) {
          imageUrls.push(productImage);
        }
      }
    }

    // 商品データオブジェクトの作成（descriptionが空文字列の場合は含めない）
    const productData: any = {
      name: productName,
    };
    
    // 説明文が有効な場合のみ追加（空文字列は無効）
    if (description && typeof description === 'string' && description.trim() !== '') {
      productData.description = description;
    }
    
    // 画像が存在する場合のみ追加
    if (imageUrls.length > 0) {
      productData.images = imageUrls;
    }

    // ラインアイテムの作成
    const lineItems = [
      {
        price_data: {
          currency: 'jpy',
          product_data: productData,
          unit_amount: price,
          recurring: isSubscription ? {
            interval: 'month',
            interval_count: 1
          } : undefined,
        },
        quantity: 1,
      },
    ];

    // サイトのベースURLを取得
    console.log('[API] サイトベースURL:', baseUrl);
    console.log('[API] ライン項目:', lineItems);

    // チェックアウトセッションの作成
    const sessionConfig: any = {
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: isSubscription ? 'subscription' : 'payment',
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL || baseUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL || baseUrl}/checkout/cancel`,
      billing_address_collection: 'auto',
      shipping_address_collection: {
        allowed_countries: ['JP'],
      },
      locale: 'ja',
      metadata: {
        productId: productId,
        userId: userId
      }
    };

    try {
      console.log('[API] セッション作成設定:', sessionConfig);
      const session = await stripe.checkout.sessions.create(sessionConfig);
      console.log('[API] Session created:', session.id);
      
      return NextResponse.json({ id: session.id, sessionId: session.id }); // 互換性のために両方のプロパティを返す
    } catch (stripeError: any) {
      console.error('[API] Stripe session creation error:', stripeError);
      return NextResponse.json(
        { error: `Stripeセッション作成エラー: ${stripeError.message || ''}` },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error('[API] Unhandled error:', error);
    
    return NextResponse.json(
      { error: '決済処理中に予期せぬエラーが発生しました' },
      { status: 500 }
    );
  }
} 