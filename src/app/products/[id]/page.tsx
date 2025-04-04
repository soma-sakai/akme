'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { products } from '@/data/products';
import { getStripe } from '@/lib/stripe';
import { useAuthContext } from '@/contexts/AuthContext';
import { useParams } from 'next/navigation';

export default function ProductDetail() {
  const params = useParams();
  const id = params.id as string;
  const router = useRouter();
  const { user } = useAuthContext();
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [purchaseType, setPurchaseType] = useState<'one-time' | 'subscription'>('one-time');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  // 商品情報を取得
  const product = products.find(p => p.id === id);
  
  if (!product) {
    return (
      <div className="min-h-[500px] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">商品が見つかりませんでした</h1>
          <button 
            onClick={() => router.back()}
            className="bg-primary text-white px-4 py-2 rounded hover:bg-opacity-90 transition"
          >
            前のページに戻る
          </button>
        </div>
      </div>
    );
  }
  
  // 価格をフォーマットする関数
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ja-JP', {
      style: 'currency',
      currency: 'JPY'
    }).format(price);
  };
  
  // Stripeチェックアウト処理
  const handleCheckout = async () => {
    if (!user) {
      router.push('/login?redirect=' + encodeURIComponent(`/products/${id}`));
      return;
    }
    
    setIsLoading(true);
    setError('');
    
    try {
      // ここでは簡易的にフロントエンドでStripeの初期化をしていますが
      // 実際のプロジェクトではバックエンドAPIを使用して
      // セキュアにチェックアウトセッションを作成する必要があります
      const stripe = await getStripe();
      
      if (!stripe) {
        throw new Error('Stripeの初期化に失敗しました。');
      }
      
      // モックのチェックアウト処理
      // 実際には、バックエンドAPIを呼び出してチェックアウトセッションIDを取得します
      // const { error } = await stripe.redirectToCheckout({
      //   lineItems: [{ price: 'price_id_here', quantity: 1 }],
      //   mode: purchaseType === 'one-time' ? 'payment' : 'subscription',
      //   successUrl: window.location.origin + '/checkout/success',
      //   cancelUrl: window.location.origin + '/checkout/cancel',
      // });
      
      // if (error) {
      //   throw error;
      // }
      
      // モック用にエラーステートなしでローディングだけ表示
      setTimeout(() => {
        alert('実際のStripe連携時は、ここでStripeの支払いページに遷移します。');
        setIsLoading(false);
      }, 1000);
      
    } catch (error) {
      setError('決済処理中にエラーが発生しました。');
      console.error('Checkout error:', error);
      setIsLoading(false);
    }
  };
  
  return (
    <div className="bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="flex flex-col md:flex-row">
            {/* 画像ギャラリー */}
            <div className="md:w-1/2 p-6">
              <div className="relative h-96 w-full mb-4">
                <Image
                  src={product.images[activeImageIndex]}
                  alt={product.name}
                  fill
                  style={{ objectFit: 'cover' }}
                  className="rounded-lg"
                />
              </div>
              
              {product.images.length > 1 && (
                <div className="flex space-x-2">
                  {product.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setActiveImageIndex(index)}
                      className={`relative h-20 w-20 rounded-md overflow-hidden border-2 ${
                        activeImageIndex === index ? 'border-primary' : 'border-transparent'
                      }`}
                    >
                      <Image
                        src={image}
                        alt={`${product.name} - イメージ ${index + 1}`}
                        fill
                        style={{ objectFit: 'cover' }}
                      />
                    </button>
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
              
              {product.isSubscription && (
                <div className="mb-6">
                  <h2 className="text-xl font-bold mb-2">購入タイプ</h2>
                  <div className="flex space-x-4">
                    <button
                      onClick={() => setPurchaseType('one-time')}
                      className={`px-4 py-2 border rounded-md ${
                        purchaseType === 'one-time'
                          ? 'bg-primary text-white border-primary'
                          : 'bg-white text-gray-700 border-gray-300 hover:border-primary'
                      }`}
                    >
                      単品購入
                    </button>
                    <button
                      onClick={() => setPurchaseType('subscription')}
                      className={`px-4 py-2 border rounded-md ${
                        purchaseType === 'subscription'
                          ? 'bg-primary text-white border-primary'
                          : 'bg-white text-gray-700 border-gray-300 hover:border-primary'
                      }`}
                    >
                      定期購入
                    </button>
                  </div>
                </div>
              )}
              
              {error && (
                <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                  {error}
                </div>
              )}
              
              <button
                onClick={handleCheckout}
                disabled={isLoading || product.stock <= 0}
                className={`w-full bg-primary text-white py-3 px-6 rounded-md shadow hover:bg-opacity-90 transition ${
                  isLoading ? 'opacity-70 cursor-not-allowed' : ''
                } ${product.stock <= 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {isLoading ? '処理中...' : product.stock <= 0 ? '在庫切れ' : '購入する'}
              </button>
              
              {!user && (
                <p className="text-sm text-gray-600 mt-2 text-center">
                  購入するには、まずログインしてください。
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 