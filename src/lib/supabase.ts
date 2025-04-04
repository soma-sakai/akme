// モック用のSupabaseクライアント
// 注：このモックは開発環境でのテスト用です。実際の環境では本物のSupabaseクライアントを使用してください。

import { createClient } from '@supabase/supabase-js';

// Supabase設定
const supabaseUrl = 'https://qsobqueatozrxjjgrrfx.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFzb2JxdWVhdG96cnhqamdycmZ4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM2ODY1MzEsImV4cCI6MjA1OTI2MjUzMX0.cTdfnqPsD1F-0Aht0uuZlJEA6GPzWf7eyqh3oE5gcVo';

// 初期化オプション
// persistSession: セッション維持
// autoRefreshToken: トークンを自動更新
// detectSessionInUrl: URLからセッション検出
const options = {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  }
};

// Supabaseクライアントの初期化
export const supabase = createClient(supabaseUrl, supabaseKey, options); 