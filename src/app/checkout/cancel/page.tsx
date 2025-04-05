'use client';

import Link from 'next/link';

export default function CheckoutCancel() {
  return (
    <div className="min-h-[500px] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-lg shadow-md">
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
            <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            お支払いがキャンセルされました
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            お支払いプロセスがキャンセルされました。商品はカートに保存されています。
          </p>
          
          <div className="mt-6 flex flex-col space-y-4">
            <Link 
              href="/products" 
              className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              ショッピングを続ける
            </Link>
            
            <button 
              onClick={() => window.history.back()}
              className="px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              前のページに戻る
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 