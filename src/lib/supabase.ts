// モック用のSupabaseクライアント
// 注：このモックは開発環境でのテスト用です。実際の環境では本物のSupabaseクライアントを使用してください。

import { createClient } from '@supabase/supabase-js';

// Supabase設定 - 環境変数から取得
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// 開発環境用のフォールバック値
const devFallbackUrl = 'https://qsobqueatozrxjjgrrfx.supabase.co';
const devFallbackKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFzb2JxdWVhdG96cnhqamdycmZ4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM2ODY1MzEsImV4cCI6MjA1OTI2MjUzMX0.cTdfnqPsD1F-0Aht0uuZlJEA6GPzWf7eyqh3oE5gcVo';

// 環境チェック
const isDevelopment = process.env.NODE_ENV === 'development';
const isClient = typeof window !== 'undefined';

// サイトURLの取得 (リダイレクト用)
const getSiteUrl = () => {
  // 優先順位: 環境変数 > window.location.origin > デフォルト値
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL;
  }
  
  // クライアントサイドでは現在のオリジンを使用
  if (isClient && window.location.origin) {
    return window.location.origin;
  }
  
  // デフォルト値
  return isDevelopment ? 'http://localhost:3000' : 'https://akamee-six.vercel.app';
};

// サイトURL
const siteUrl = getSiteUrl();

// ブラウザ環境でのフォールバック（window.__SUPABASE_CONFIG__経由で設定される可能性がある）
const getBrowserEnv = () => {
  if (isClient && window.__SUPABASE_CONFIG__) {
    return {
      url: window.__SUPABASE_CONFIG__.url,
      key: window.__SUPABASE_CONFIG__.key
    };
  }
  return null;
};

// 実際に使用するURL・キー（優先順位: 環境変数 > ブラウザ変数 > 開発フォールバック）
const browserEnv = getBrowserEnv();
const url = supabaseUrl || (browserEnv?.url) || (isDevelopment ? devFallbackUrl : '');
const key = supabaseKey || (browserEnv?.key) || (isDevelopment ? devFallbackKey : '');

// 初期化前にキーが設定されているかチェック
if (!url || !key) {
  console.error('Supabase環境変数が設定されていません。');
  
  // クライアントサイドでは警告を表示
  if (isClient) {
    console.warn('Supabase接続が利用できないため、一部の機能が動作しない可能性があります。');
  }
}

// ログ出力 (開発環境のみ)
if (isDevelopment) {
  console.log(`環境: ${process.env.NODE_ENV}, クライアント: ${isClient}`);
  console.log(`サイトURL: ${siteUrl}`);
  console.log(`Supabase URL: ${url ? url.substring(0, 15) + '...' : 'not set'}`);
  console.log(`Supabase Key: ${key ? key.substring(0, 15) + '...' : 'not set'}`);
}

// 初期化オプション
const options = {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    // 環境に応じたリダイレクトURLを設定
    redirectTo: `${siteUrl}/auth/callback`
  }
};

// グローバル変数にSupabase設定を追加（クライアントサイドで使用）
if (isClient && url && key) {
  window.__SUPABASE_CONFIG__ = { url, key, siteUrl };
}

// Supabaseクライアントの初期化
export const supabase = (url && key)
  ? createClient(url, key, options)
  : null;

// Supabaseクライアントが利用可能かどうかを確認する関数
export const isSupabaseAvailable = () => {
  return !!supabase;
};

// データベースからユーザープロファイルを取得する関数
export const fetchUserProfile = async (userId: string) => {
  if (!supabase) return null;
  
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
      
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('プロファイル取得エラー:', error);
    return null;
  }
};

// 注文履歴を取得する関数
export const fetchOrderHistory = async (userId: string) => {
  if (!supabase) return [];
  
  try {
    const { data: orders, error: ordersError } = await supabase
      .from('orders')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
      
    if (ordersError) throw ordersError;
    
    // 各注文の詳細情報を取得
    const ordersWithItems = await Promise.all(
      orders.map(async (order) => {
        const { data: items, error: itemsError } = await supabase
          .from('order_items')
          .select('*')
          .eq('order_id', order.id);
          
        if (itemsError) throw itemsError;
        
        return {
          ...order,
          items: items || []
        };
      })
    );
    
    return ordersWithItems;
  } catch (error) {
    console.error('注文履歴取得エラー:', error);
    return [];
  }
};

// TypeScript用の型定義
declare global {
  interface Window {
    __SUPABASE_CONFIG__?: {
      url: string;
      key: string;
      siteUrl?: string;
    };
  }
} 