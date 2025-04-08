'use client';

import Link from 'next/link';
import { useEffect } from 'react';

export default function NotFound() {
  // クライアントサイド専用のエラー追跡
  useEffect(() => {
    console.error('404ページにアクセスしました。URLが正しいか確認してください。');
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="mt-6 text-3xl font-extrabold text-gray-900">404</h1>
          <h2 className="mt-2 text-xl font-bold text-gray-900">ページが見つかりません</h2>
          <p className="mt-2 text-sm text-gray-600">
            お探しのページは存在しないか、移動した可能性があります。
          </p>
        </div>
        <div className="mt-8">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">選択肢</span>
            </div>
          </div>
          <div className="mt-6">
            <Link
              href="/"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              ホームに戻る
            </Link>
          </div>
          <div className="mt-3">
            <Link
              href="/products"
              className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              商品一覧を見る
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 