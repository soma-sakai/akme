'use client';

import { useState, Suspense, useEffect } from 'react';
import { useAuthContext } from '@/contexts/AuthContext';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { getSupabaseStatusMessage, isSupabaseAvailable } from '@/lib/supabase';

// SearchParamsを使用するコンポーネント
function LoginContent() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [supabaseAvailable, setSupabaseAvailable] = useState(true);
  
  const { signIn } = useAuthContext();
  const router = useRouter();
  const searchParams = useSearchParams();
  const registrationSuccess = searchParams.get('registration') === 'success';
  const returnUrl = searchParams.get('returnUrl') || '/profile';
  const errorCode = searchParams.get('error');
  
  // エラーコードに基づいたメッセージを表示
  useEffect(() => {
    if (errorCode) {
      switch (errorCode) {
        case 'auth_init_failed':
          setError('認証サービスの初期化に失敗しました。');
          break;
        case 'callback_no_code':
          setError('認証コードが見つかりませんでした。');
          break;
        case 'callback_failed':
          setError('認証処理中にエラーが発生しました。もう一度お試しください。');
          break;
        default:
          setError(`ログイン処理中にエラーが発生しました (${errorCode})`);
      }
    }
  }, [errorCode]);
  
  // Supabaseの可用性をチェック
  useEffect(() => {
    const available = isSupabaseAvailable();
    setSupabaseAvailable(available);
    
    if (!available) {
      setError(`認証サービスが利用できません。環境設定を確認してください。詳細: ${getSupabaseStatusMessage()}`);
    }
  }, []);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!supabaseAvailable) {
      setError('認証サービスが利用できません。ブラウザのコンソールを確認してください。');
      return;
    }
    
    setLoading(true);
    
    try {
      const result = await signIn(email, password);
      
      if (!result.success) {
        setError(result.error || 'ログインに失敗しました。');
      } else {
        // ログイン成功時、returnUrlにリダイレクト
        console.log(`ログイン成功: ${returnUrl}にリダイレクト`);
        router.push(returnUrl);
      }
    } catch (error) {
      setError('ログイン処理中にエラーが発生しました。');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="min-h-[500px] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-lg shadow-md">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            アカウントにログイン
          </h2>
          {registrationSuccess && (
            <div className="mt-3 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">
              会員登録が完了しました。登録したメールアドレスとパスワードでログインしてください。
            </div>
          )}
          {returnUrl && returnUrl !== '/profile' && (
            <div className="mt-3 bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded">
              購入を続けるにはログインが必要です。
            </div>
          )}
          {error && (
            <div className="mt-3 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email-address" className="sr-only">
                メールアドレス
              </label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
                placeholder="メールアドレス"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                パスワード
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
                placeholder="パスワード"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="text-sm">
              <Link
                href={`/register${returnUrl && returnUrl !== '/profile' ? `?returnUrl=${encodeURIComponent(returnUrl)}` : ''}`}
                className="font-medium text-primary hover:text-indigo-500"
              >
                アカウントをお持ちでない方はこちら
              </Link>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading || !supabaseAvailable}
              className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
                (loading || !supabaseAvailable) ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              {loading ? 'ログイン中...' : 'ログイン'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// メインのページコンポーネント
export default function Login() {
  return (
    <Suspense fallback={<div className="min-h-[500px] flex items-center justify-center bg-gray-50">読み込み中...</div>}>
      <LoginContent />
    </Suspense>
  );
} 