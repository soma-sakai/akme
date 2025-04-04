'use client';

import { useState } from 'react';
import { products } from '@/data/products';
import ProductCard from '@/components/ProductCard';

export default function ProductsPage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [sortOption, setSortOption] = useState<string>('default');
  
  // カテゴリー一覧を取得
  const categories = [...new Set(products.map(product => product.category))];
  
  // 表示する商品をフィルタリングとソート
  const filteredProducts = products.filter(product => {
    if (!selectedCategory) return true;
    return product.category === selectedCategory;
  }).sort((a, b) => {
    switch (sortOption) {
      case 'price-low-high':
        return a.price - b.price;
      case 'price-high-low':
        return b.price - a.price;
      case 'newest':
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      default:
        return 0;
    }
  });
  
  return (
    <div className="bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-10 text-center">商品一覧</h1>
        
        <div className="flex flex-col md:flex-row gap-8">
          {/* フィルターとソートオプション */}
          <div className="md:w-1/4">
            <div className="bg-white p-6 rounded-lg shadow-md mb-6">
              <h2 className="text-xl font-bold mb-4">カテゴリー</h2>
              <div className="space-y-2">
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="all-categories"
                    name="category"
                    checked={selectedCategory === null}
                    onChange={() => setSelectedCategory(null)}
                    className="h-4 w-4 text-primary focus:ring-primary border-gray-300"
                  />
                  <label htmlFor="all-categories" className="ml-2 block text-sm text-gray-700">
                    全てのカテゴリー
                  </label>
                </div>
                
                {categories.map(category => (
                  <div key={category} className="flex items-center">
                    <input
                      type="radio"
                      id={`category-${category}`}
                      name="category"
                      checked={selectedCategory === category}
                      onChange={() => setSelectedCategory(category)}
                      className="h-4 w-4 text-primary focus:ring-primary border-gray-300"
                    />
                    <label htmlFor={`category-${category}`} className="ml-2 block text-sm text-gray-700">
                      {category}
                    </label>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-bold mb-4">並び替え</h2>
              <select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
              >
                <option value="default">おすすめ順</option>
                <option value="price-low-high">価格：安い順</option>
                <option value="price-high-low">価格：高い順</option>
                <option value="newest">新着順</option>
              </select>
            </div>
          </div>
          
          {/* 商品リスト */}
          <div className="md:w-3/4">
            {filteredProducts.length === 0 ? (
              <div className="bg-white p-10 rounded-lg shadow text-center">
                <p className="text-gray-600">商品が見つかりませんでした。別のカテゴリーをお試しください。</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 