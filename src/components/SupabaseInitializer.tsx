'use client';

import { useEffect } from 'react';

// 環境変数をクライアントサイドで利用可能にするコンポーネント
export default function SupabaseInitializer() {
  useEffect(() => {
    // Supabase設定をグローバル変数にセット
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    
    if (supabaseUrl && supabaseKey) {
      window.__SUPABASE_CONFIG__ = {
        url: supabaseUrl,
        key: supabaseKey
      };
      console.log('Supabase config initialized in browser');
    } else {
      console.warn('Supabase環境変数が設定されていません');
    }
  }, []);

  // このコンポーネントは何も表示しない
  return null;
} 