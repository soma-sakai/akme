'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function AuthCallback() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);
  const [processing, setProcessing] = useState(true);

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // URLパラメータからコードを取得
        const code = searchParams.get('code');
        const errorParam = searchParams.get('error');
        const errorDescription = searchParams.get('error_description');

        if (errorParam) {
          console.error('認証エラー:', errorParam, errorDescription);
          setError(errorDescription || 'エラーが発生しました');
          setProcessing(false);
          return;
        }

        if (!code) {
          // コードがない場合はエラー
          setError('認証コードがありません');
          setProcessing(false);
          return;
        }

        if (!supabase) {
          setError('認証サービスが初期化されていません');
          setProcessing(false);
          return;
        }

        // codeパラメータでセッションを交換
        const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);

        if (exchangeError) {
          console.error('セッション交換エラー:', exchangeError);
          setError('認証に失敗しました: ' + exchangeError.message);
          setProcessing(false);
          return;
        }

        // 認証成功
        console.log('認証成功');
        
        // プロフィールページにリダイレクト
        router.push('/profile');
      } catch (e) {
        console.error('認証処理エラー:', e);
        setError('認証処理中にエラーが発生しました');
        setProcessing(false);
      }
    };

    handleCallback();
  }, [router, searchParams]);

  // エラーメッセージ表示
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              認証エラー
            </h2>
            <p className="mt-2 text-center text-sm text-red-600">
              {error}
            </p>
          </div>
          <div className="text-center">
            <button
              onClick={() => router.push('/login')}
              className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              ログインページに戻る
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 処理中の表示
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            認証処理中
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            お待ちください...
          </p>
        </div>
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </div>
    </div>
  );
} 