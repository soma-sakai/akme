'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { products as localProducts } from '@/data/products';
import { fetchProductById } from '@/lib/products';
import { getStripe, checkStripeConfig } from '@/lib/stripe';
import { useAuthContext } from '@/contexts/AuthContext';
import { useParams } from 'next/navigation';
import { Product } from '@/types/product';

export default function ProductDetail() {
  const params = useParams();
  const id = params.id as string;
  const router = useRouter();
  const { user } = useAuthContext();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [purchaseType, setPurchaseType] = useState<'one-time' | 'subscription'>('one-time');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [stripeAvailable, setStripeAvailable] = useState(false);
  
  // IDが変更されたときのデバッグログ
  useEffect(() => {
    console.log('商品詳細ページ: 製品ID=', id);
  }, [id]);
  
  // 商品データを取得
  useEffect(() => {
    const getProduct = async () => {
      try {
        setLoading(true);
        setError('');
        
        console.log(`商品ID:${id}の詳細を取得中...`);
        const fetchedProduct = await fetchProductById(id);
        
        if (fetchedProduct) {
          console.log('商品詳細を取得しました:', fetchedProduct);
          setProduct(fetchedProduct);
        } else {
          console.error('商品が見つかりません。404ページに遷移します');
          // 商品が見つからなかった場合、ローカルデータからフォールバックを試みる
          const fallback = localProducts.find(p => p.id === id);
          if (fallback) {
            console.log('ローカルデータから商品を見つけました:', fallback);
            setProduct(fallback);
          } else {
            router.push('/not-found');
          }
        }
      } catch (error) {
        console.error('商品データの取得に失敗しました:', error);
        setError('商品データの取得に失敗しました。再度お試しください。');
        // ローカルデータをフォールバックとして使用
        const fallbackProduct = localProducts.find(p => p.id === id);
        if (fallbackProduct) {
          console.log('エラー発生時のフォールバック: ローカルデータから商品を使用します');
          setProduct(fallbackProduct);
        } else {
          router.push('/not-found');
        }
      } finally {
        setLoading(false);
      }
    };
    
    if (id) {
      getProduct();
    } else {
      console.error('商品IDが指定されていません');
      router.push('/products');
    }
  }, [id, router]);

  // 環境変数チェックをクライアントサイドで行う
  useEffect(() => {
    // Stripe設定が利用可能かチェック
    const checkStripe = () => {
      try {
        const isAvailable = checkStripeConfig();
        if (isAvailable) {
          console.log('Stripe設定を検出しました');
          setStripeAvailable(true);
        } else {
          console.warn('Stripe公開鍵が設定されていません');
          setStripeAvailable(false);
        }
      } catch (err) {
        console.error('環境変数チェックエラー:', err);
        setStripeAvailable(false);
      }
    };
    
    checkStripe();
  }, []);
  
  // 価格を日本円表示にフォーマット
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ja-JP', {
      style: 'currency',
      currency: 'JPY',
      minimumFractionDigits: 0
    }).format(price);
  };
  
  // Stripeの決済セッションを作成
  const handleCheckout = async () => {
    if (!product) return;
    
    try {
      setIsLoading(true);
      setError('');
      
      if (!stripeAvailable) {
        setError('決済システムが利用できません。管理者にお問い合わせください。');
        return;
      }
      
      console.log('Stripe初期化中...');
      const stripe = await getStripe();
      
      if (!stripe) {
        setError('決済システムの初期化に失敗しました。');
        return;
      }
      
      console.log('Stripe初期化完了。チェックアウトセッション作成を開始します...');
      
      // 選択された価格を決定
      const selectedPrice = purchaseType === 'subscription' && product.isSubscription 
        ? product.subscriptionPrice || product.price
        : product.price;
      
      console.log('選択された価格:', selectedPrice);
      console.log('購入タイプ:', purchaseType);
      
      // 商品画像URLを取得
      const imageUrl = product.images && product.images.length > 0 
        ? product.images[0] 
        : undefined;
      
      // リクエストデータを準備
      const requestData = {
        productId: product.id,
        productName: product.name,
        productImage: imageUrl,
        price: selectedPrice,
        isSubscription: purchaseType === 'subscription' && product.isSubscription,
        userId: user?.id || 'anonymous',
      };
      
      console.log('APIリクエストデータ:', requestData);
      
      // サーバーサイドのAPIを呼び出してCheckoutセッションを作成
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });
      
      console.log('APIレスポンスステータス:', response.status);
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error('APIエラーレスポンス:', errorData);
        throw new Error(errorData.error || '決済セッションの作成に失敗しました');
      }
      
      const session = await response.json();
      console.log('セッション作成成功:', session);
      
      if (!session || (!session.id && !session.sessionId)) {
        throw new Error('有効なセッションIDが返されませんでした');
      }
      
      // セッションIDを取得（APIレスポンスの互換性を考慮）
      const sessionId = session.id || session.sessionId;
      console.log('チェックアウトにリダイレクト: セッションID =', sessionId);
      
      // Stripeにリダイレクト
      const result = await stripe.redirectToCheckout({
        sessionId: sessionId,
      });
      
      if (result.error) {
        console.error('StripeリダイレクトエラーError:', result.error);
        setError(result.error.message || '決済処理中にエラーが発生しました');
      }
    } catch (error) {
      console.error('チェックアウトエラー:', error);
      setError(error instanceof Error ? error.message : '決済処理中に問題が発生しました');
    } finally {
      setIsLoading(false);
    }
  };
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="bg-white p-10 rounded-lg shadow text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">商品が見つかりません</h1>
          <p className="text-gray-600 mb-6">お探しの商品は存在しないか、削除された可能性があります。</p>
          <button
            onClick={() => router.push('/products')}
            className="bg-primary text-white px-6 py-2 rounded-md hover:bg-indigo-700 transition-colors"
          >
            商品一覧に戻る
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="flex flex-col md:flex-row">
            {/* 商品画像 */}
            <div className="md:w-1/2">
              <div className="relative h-96 w-full">
                <Image
                  src={product.images[0] || 'https://via.placeholder.com/400x400?text=No+Image'}
                  alt={product.name}
                  fill
                  className="object-contain"
                />
              </div>
              
              {/* サムネイル画像選択 */}
              {product.images && product.images.length > 1 && (
                <div className="flex justify-center mt-4 space-x-4 px-4">
                  {product.images.map((image, index) => (
                    <div
                      key={index}
                      className={`h-16 w-16 cursor-pointer border-2 ${
                        index === activeImageIndex ? 'border-primary' : 'border-gray-200'
                      }`}
                      onClick={() => setActiveImageIndex(index)}
                    >
                      <div className="relative h-full w-full">
                        <Image
                          src={image}
                          alt={`${product.name} - 画像 ${index + 1}`}
                          fill
                          className="object-cover"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            {/* 商品情報 */}
            <div className="md:w-1/2 p-6">
              <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
              
              <div className="mb-6">
                <span className="text-2xl font-bold text-primary">{formatPrice(product.price)}</span>
                {product.isSubscription && purchaseType === 'subscription' && (
                  <span className="text-lg ml-2 text-gray-600">
                    {formatPrice(product.subscriptionPrice || 0)}/月
                  </span>
                )}
              </div>
              
              <p className="text-gray-600 mb-6">{product.description}</p>
              
              {product.features && product.features.length > 0 && (
                <div className="mb-6">
                  <h2 className="text-xl font-bold mb-2">特徴</h2>
                  <ul className="list-disc list-inside space-y-1">
                    {product.features.map((feature, index) => (
                      <li key={index} className="text-gray-600">{feature}</li>
                    ))}
                  </ul>
                </div>
              )}
              
              <div className="mb-6">
                <h2 className="text-xl font-bold mb-2">カテゴリー</h2>
                <p className="text-gray-600">{product.category}</p>
              </div>
              
              <div className="mb-6">
                <h2 className="text-xl font-bold mb-2">在庫状況</h2>
                <p className={`${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {product.stock > 0 ? `在庫あり（残り${product.stock}個）` : '在庫切れ'}
                </p>
              </div>
              
              {/* 購入タイプ選択（サブスクリプション or 一括購入） */}
              {product.isSubscription && (
                <div className="mb-6">
                  <h2 className="text-xl font-bold mb-2">購入タイプ</h2>
                  <div className="flex space-x-4">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="purchase-type"
                        checked={purchaseType === 'one-time'}
                        onChange={() => setPurchaseType('one-time')}
                        className="h-4 w-4 text-primary focus:ring-primary border-gray-300"
                      />
                      <span className="ml-2 text-gray-700">一回購入</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="purchase-type"
                        checked={purchaseType === 'subscription'}
                        onChange={() => setPurchaseType('subscription')}
                        className="h-4 w-4 text-primary focus:ring-primary border-gray-300"
                      />
                      <span className="ml-2 text-gray-700">定期購入</span>
                    </label>
                  </div>
                </div>
              )}
              
              {/* エラーメッセージ */}
              {error && (
                <div className="mb-6 p-4 bg-red-50 text-red-800 rounded-md">
                  {error}
                </div>
              )}
              
              {/* 購入ボタン */}
              <button
                onClick={handleCheckout}
                disabled={isLoading || product.stock <= 0}
                className={`w-full py-3 px-6 text-white font-semibold rounded-md transition-colors ${
                  product.stock <= 0
                    ? 'bg-gray-400 cursor-not-allowed'
                    : isLoading
                    ? 'bg-indigo-300 cursor-wait'
                    : 'bg-primary hover:bg-indigo-700'
                }`}
              >
                {isLoading
                  ? '処理中...'
                  : product.stock <= 0
                  ? '在庫切れ'
                  : '購入する'}
              </button>
              
              {/* サインインプロンプト */}
              {!user && (
                <p className="mt-4 text-sm text-gray-600">
                  注文履歴を確認するには、
                  <button
                    onClick={() => router.push('/login')}
                    className="text-primary hover:underline"
                  >
                    ログイン
                  </button>
                  または
                  <button
                    onClick={() => router.push('/register')}
                    className="text-primary hover:underline"
                  >
                    会員登録
                  </button>
                  してください。
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 