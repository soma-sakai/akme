'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Product } from '@/types/product';
import { fetchProductsFromSupabase } from '@/lib/products';

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // 商品データを取得
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const products = await fetchProductsFromSupabase();
        // 人気商品を3つ選択（ここでは単純に最初の3つを表示）
        setFeaturedProducts(products.slice(0, 3));
      } catch (error) {
        console.error('商品データの取得に失敗しました:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // 価格をフォーマットする関数
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ja-JP', {
      style: 'currency',
      currency: 'JPY',
      minimumFractionDigits: 0
    }).format(price);
  };

  return (
    <main>
      {/* ヒーローセクション */}
      <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white">
        <div className="container mx-auto px-4 py-20">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-10 md:mb-0">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">高品質な商品を<br className="hidden md:block" />あなたのもとへ</h1>
              <p className="text-lg mb-6">厳選された商品で、あなたの生活をより豊かに。<br />シンプルでありながら機能的なアイテムをお届けします。</p>
              <Link 
                href="/products" 
                className="bg-white text-indigo-600 px-6 py-3 rounded-md font-medium hover:bg-opacity-90 transition-colors"
              >
                商品を見る
              </Link>
            </div>
            <div className="md:w-1/2">
              <div className="relative h-64 md:h-96 w-full">
                <Image
                  src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
                  alt="Akamee製品イメージ"
                  fill
                  className="object-cover rounded-lg"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 人気商品セクション */}
      <div className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">人気商品</h2>
          
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : (
            <>
              {featuredProducts.length === 0 ? (
                <p className="text-center text-gray-500">商品の読み込みに失敗しました。</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {featuredProducts.map(product => (
                    <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                      <Link href={`/products/${product.id}`}>
                        <div className="relative h-64 w-full">
                          <Image
                            src={product.images[0]}
                            alt={product.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                      </Link>
                      <div className="p-6">
                        <h3 className="text-xl font-bold mb-2">{product.name}</h3>
                        <p className="text-gray-600 mb-4 line-clamp-2">{product.description}</p>
                        <div className="flex justify-between items-center">
                          <span className="text-xl font-bold text-primary">{formatPrice(product.price)}</span>
                          <Link 
                            href={`/products/${product.id}`} 
                            className="bg-primary text-white py-2 px-4 rounded hover:bg-opacity-90 transition"
                          >
                            詳細を見る
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
              <div className="text-center mt-12">
                <Link 
                  href="/products" 
                  className="bg-primary text-white px-6 py-3 rounded-md font-medium hover:bg-opacity-90 transition-colors"
                >
                  全ての商品を見る
                </Link>
              </div>
            </>
          )}
        </div>
      </div>

      {/* 特徴セクション */}
      <div className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Akameeの特徴</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="bg-primary bg-opacity-10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">厳選された商品</h3>
              <p className="text-gray-600">品質と機能性にこだわった商品のみを取り揃えています。</p>
            </div>
            <div className="text-center p-6">
              <div className="bg-primary bg-opacity-10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">リーズナブルな価格</h3>
              <p className="text-gray-600">中間マージンを省き、高品質な商品を適正価格でご提供します。</p>
            </div>
            <div className="text-center p-6">
              <div className="bg-primary bg-opacity-10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">安心の配送</h3>
              <p className="text-gray-600">丁寧な梱包と迅速な配送で、商品を安全にお届けします。</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
