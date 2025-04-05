'use client';

import { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

// SearchParamsを使用するコンポーネントを分離
function SuccessContent() {
  const [loading, setLoading] = useState(true);
  const [orderDetails, setOrderDetails] = useState<any>(null);
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    // セッションIDが存在する場合は注文詳細を取得
    if (sessionId) {
      setLoading(false);
      // 実際のプロジェクトでは、ここでAPIを呼び出して注文詳細を取得することもできます
      setOrderDetails({
        id: Math.floor(Math.random() * 1000000),
        date: new Date().toLocaleDateString('ja-JP')
      });
    } else {
      setLoading(false);
    }
  }, [sessionId]);

  return (
    <div className="min-h-[500px] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-lg shadow-md">
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
            <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            ご購入ありがとうございます！
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            お支払いが正常に完了しました。
          </p>
          
          {loading ? (
            <p className="mt-4 text-center text-sm text-gray-500">
              注文情報を読み込んでいます...
            </p>
          ) : orderDetails ? (
            <div className="mt-6 border-t border-gray-200 pt-6">
              <h3 className="text-lg font-medium text-gray-900">注文情報</h3>
              <p className="mt-2 text-sm text-gray-600">
                注文番号: {orderDetails.id}
              </p>
              <p className="mt-1 text-sm text-gray-600">
                日付: {orderDetails.date}
              </p>
            </div>
          ) : null}
          
          <div className="mt-6">
            <Link href="/products" className="font-medium text-primary hover:text-indigo-500">
              ショッピングを続ける
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

// Suspenseでラップした親コンポーネント
export default function CheckoutSuccess() {
  return (
    <Suspense fallback={
      <div className="min-h-[500px] flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg">読み込み中...</p>
        </div>
      </div>
    }>
      <SuccessContent />
    </Suspense>
  );
} 