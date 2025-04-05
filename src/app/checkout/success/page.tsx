'use client';

import { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

// SearchParamsを使用するコンポーネントを分離
function SuccessContent() {
  const [loading, setLoading] = useState(true);
  const [orderDetails, setOrderDetails] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const sessionId = searchParams ? searchParams.get('session_id') : null;

  useEffect(() => {
    const getOrderDetails = async () => {
      try {
        // セッションIDが存在する場合は注文詳細を取得
        if (sessionId) {
          console.log('セッションID:', sessionId);
          
          // 実際のプロジェクトでは、ここでAPIを呼び出して注文詳細を取得することもできます
          // 例: APIエンドポイントから注文詳細を取得
          // const response = await fetch(`/api/orders/session/${sessionId}`);
          // const data = await response.json();
          
          // デモ用の注文詳細
          setOrderDetails({
            id: sessionId.slice(-6), // セッションIDの最後の6文字を注文番号として使用
            date: new Date().toLocaleDateString('ja-JP'),
            total: '¥2,500', // 実際には計算された値を使用
          });
          
          setLoading(false);
        } else {
          console.warn('セッションIDが見つかりません');
          setError('注文情報が見つかりませんでした。');
          setLoading(false);
        }
      } catch (err) {
        console.error('注文詳細取得エラー:', err);
        setError('注文情報の取得中にエラーが発生しました。');
        setLoading(false);
      }
    };

    getOrderDetails();
  }, [sessionId]);

  if (error) {
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
              エラーが発生しました
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              {error}
            </p>
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
              {orderDetails.total && (
                <p className="mt-1 text-sm text-gray-600">
                  合計: {orderDetails.total}
                </p>
              )}
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