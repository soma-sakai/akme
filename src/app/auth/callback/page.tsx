'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

export default function AuthCallback() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);
  const [processing, setProcessing] = useState(true);

  useEffect(() => {
    // エラーパラメータがある場合はエラーを表示
    const errorParam = searchParams.get('error');
    const errorDescription = searchParams.get('error_description');
    
    if (errorParam) {
      console.error('認証エラー:', errorParam, errorDescription);
      setError(errorDescription || 'メール認証中にエラーが発生しました。');
      setProcessing(false);
      return;
    }

    // Supabaseセッションの確立を処理
    const handleAuthCallback = async () => {
      try {
        setProcessing(true);
        
        if (!supabase) {
          throw new Error('Supabaseクライアントが初期化されていません');
        }

        // URLからセッション情報を取得
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          throw error;
        }

        if (data?.session) {
          // 認証成功: プロフィールページにリダイレクト
          router.push('/profile');
        } else {
          // セッションがない場合はログインページへ
          router.push('/login');
        }
      } catch (err) {
        console.error('認証コールバック処理エラー:', err);
        setError('認証処理中にエラーが発生しました。再度お試しください。');
      } finally {
        setProcessing(false);
      }
    };

    handleAuthCallback();
  }, [router, searchParams]);

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
              認証エラー
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              {error}
            </p>
            <div className="mt-6">
              <Link href="/login" className="font-medium text-primary hover:text-indigo-500">
                ログインページに戻る
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
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-indigo-100">
            <svg className="h-6 w-6 text-indigo-600 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            認証処理中...
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            ログイン情報を確認しています。しばらくお待ちください。
          </p>
        </div>
      </div>
    </div>
  );
} 