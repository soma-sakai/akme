'use client';

import { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useAuthContext } from '@/contexts/AuthContext';

// SearchParamsを使用するコンポーネントを分離
function SuccessContent() {
  const [loading, setLoading] = useState(true);
  const [orderDetails, setOrderDetails] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const sessionId = searchParams ? searchParams.get('session_id') : null;
  const { user, getOrderHistory } = useAuthContext();

  useEffect(() => {
    const getOrderDetails = async () => {
      try {
        // ログインしているユーザーなら注文履歴を更新
        if (user) {
          await getOrderHistory();
        }
        
        // セッションIDが存在する場合は注文詳細を取得
        if (sessionId) {
          console.log('セッションID:', sessionId);
          
          // セッションIDをローカルストレージに一時的に保存（ページ再読み込み対策）
          if (typeof window !== 'undefined') {
            localStorage.setItem('lastSessionId', sessionId);
            localStorage.setItem('lastOrderDate', new Date().toISOString());
          }
          
          // デモ用の注文詳細
          setOrderDetails({
            id: sessionId.slice(-6), // セッションIDの最後の6文字を注文番号として使用
            date: new Date().toLocaleDateString('ja-JP'),
            total: '¥2,500', // 実際には計算された値を使用
          });
          
          setLoading(false);
        } else {
          // ページが再読み込みされた場合、ローカルストレージからセッションIDを取得
          if (typeof window !== 'undefined') {
            const lastSessionId = localStorage.getItem('lastSessionId');
            const lastOrderDate = localStorage.getItem('lastOrderDate');
            
            if (lastSessionId) {
              console.log('ローカルストレージからセッションIDを復元:', lastSessionId);
              
              // 最後の注文日時を取得（存在すれば）
              let orderDate = new Date().toLocaleDateString('ja-JP');
              if (lastOrderDate) {
                try {
                  orderDate = new Date(lastOrderDate).toLocaleDateString('ja-JP');
                } catch (e) {
                  console.error('日付の変換に失敗:', e);
                }
              }
              
              // デモ用の注文詳細
              setOrderDetails({
                id: lastSessionId.slice(-6),
                date: orderDate,
                total: '¥2,500',
                note: '※ページが再読み込みされました。'
              });
              setLoading(false);
              return;
            } else {
              // セッションIDもローカルストレージも存在しない場合は、一般的な成功メッセージを表示
              setOrderDetails({
                date: new Date().toLocaleDateString('ja-JP'),
                note: '購入が完了しました。'
              });
              setLoading(false);
              return;
            }
          }
          
          console.warn('セッションIDが見つかりません');
          // エラーではなく一般的な成功メッセージを表示
          setOrderDetails({
            date: new Date().toLocaleDateString('ja-JP'),
            note: '購入が完了しました。'
          });
          setLoading(false);
        }
      } catch (err) {
        console.error('注文詳細取得エラー:', err);
        setError('注文情報の取得中にエラーが発生しました。');
        setLoading(false);
      }
    };

    getOrderDetails();
  }, [sessionId, user, getOrderHistory]);

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
              {orderDetails.id && (
                <p className="mt-2 text-sm text-gray-600">
                  注文番号: {orderDetails.id}
                </p>
              )}
              <p className="mt-1 text-sm text-gray-600">
                日付: {orderDetails.date}
              </p>
              {orderDetails.total && (
                <p className="mt-1 text-sm text-gray-600">
                  合計: {orderDetails.total}
                </p>
              )}
              {orderDetails.note && (
                <p className="mt-3 text-xs text-gray-500 italic">
                  {orderDetails.note}
                </p>
              )}
              {user && (
                <p className="mt-3 text-sm text-gray-600">
                  注文詳細はマイページの<Link href="/profile" className="text-primary hover:underline">注文履歴</Link>でも確認できます。
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