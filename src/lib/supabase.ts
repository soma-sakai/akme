// モック用のSupabaseクライアント
// 注：このモックは開発環境でのテスト用です。実際の環境では本物のSupabaseクライアントを使用してください。

import { createClient } from '@supabase/supabase-js';

// Supabase設定 - 環境変数から取得
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// 開発環境用のフォールバック値（本番環境では絶対に使用しないでください）
const devFallbackUrl = 'https://qsobqueatozrxjjgrrfx.supabase.co';
const devFallbackKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFzb2JxdWVhdG96cnhqamdycmZ4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM2ODY1MzEsImV4cCI6MjA1OTI2MjUzMX0.cTdfnqPsD1F-0Aht0uuZlJEA6GPzWf7eyqh3oE5gcVo';

// 環境チェック
const isDevelopment = process.env.NODE_ENV === 'development';
const isClient = typeof window !== 'undefined';

// 実際に使用するURL・キー
const url = supabaseUrl || (isDevelopment ? devFallbackUrl : '');
const key = supabaseKey || (isDevelopment ? devFallbackKey : '');

// 初期化前にキーが設定されているかチェック
if (!url || !key) {
  const errorMessage = 'Supabase環境変数が設定されていません。';
  console.error(errorMessage);
  
  // クライアントサイドでは警告を表示
  if (isClient) {
    console.warn('Supabase接続が利用できないため、一部の機能が動作しない可能性があります。');
  }
}

// ログ出力 (開発環境のみ)
if (isDevelopment) {
  console.log(`Supabase URL: ${url ? url.substring(0, 10) + '...' : 'not set'}`);
  console.log(`Supabase Key: ${key ? key.substring(0, 10) + '...' : 'not set'}`);
}

// 初期化オプション
const options = {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  }
};

// Supabaseクライアントの初期化
// 環境変数が設定されていない場合でもエラーにならないようにする
export const supabase = url && key 
  ? createClient(url, key, options)
  : null;

// Supabaseクライアントが利用可能かどうかを確認する関数
export const isSupabaseAvailable = () => {
  return !!supabase;
}; 