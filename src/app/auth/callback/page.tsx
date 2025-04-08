'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';

// 認証コールバック処理ページ
export default function AuthCallback() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  useEffect(() => {
    // URLパラメータからコードを取得
    const code = searchParams.get('code');
    
    const handleCallback = async () => {
      try {
        if (code) {
          if (!supabase) {
            console.error('Supabaseクライアントが初期化されていません');
            router.push('/login?error=auth_init_failed');
            return;
          }
          
          // Supabaseのセッションの設定
          await supabase.auth.exchangeCodeForSession(code);
          
          // 認証が成功したらプロフィールページへリダイレクト
          router.push('/profile');
        } else {
          // コードがない場合はエラーページへ
          router.push('/login?error=callback_no_code');
        }
      } catch (error) {
        console.error('認証コールバックエラー:', error);
        router.push('/login?error=callback_failed');
      }
    };
    
    handleCallback();
  }, [router, searchParams]);
  
  return (
    <div className="min-h-[300px] flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4">認証処理中...</h2>
        <p className="text-gray-600">ページが自動的に遷移しない場合は、<button onClick={() => router.push('/login')} className="text-primary hover:underline">こちら</button>をクリックしてください。</p>
      </div>
    </div>
  );
} 