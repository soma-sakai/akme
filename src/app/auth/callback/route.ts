import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// コールバックURLパラメーターを処理するサーバーサイドルート
export async function GET(request: NextRequest) {
  try {
    // URLパラメーターを取得
    const requestUrl = new URL(request.url);
    const code = requestUrl.searchParams.get('code');
    const error = requestUrl.searchParams.get('error');
    const errorDescription = requestUrl.searchParams.get('error_description');
    
    // エラーチェック
    if (error) {
      console.error('認証エラー:', error, errorDescription);
      
      // ログインページにリダイレクト（エラーメッセージ付き）
      const redirectUrl = new URL('/login', requestUrl.origin);
      redirectUrl.searchParams.set('error', error);
      if (errorDescription) {
        redirectUrl.searchParams.set('error_description', errorDescription);
      }
      
      return NextResponse.redirect(redirectUrl);
    }
    
    // 認証コードがない場合、ホームページにリダイレクト
    if (!code) {
      console.warn('認証コードがありません');
      return NextResponse.redirect(new URL('/', requestUrl.origin));
    }
    
    // codeパラメーターを使用して認証処理を完了
    if (supabase) {
      const { error } = await supabase.auth.exchangeCodeForSession(code);
      
      if (error) {
        console.error('セッション取得エラー:', error);
        
        // エラーがあればログインページにリダイレクト
        const redirectUrl = new URL('/login', requestUrl.origin);
        redirectUrl.searchParams.set('error', 'session_error');
        redirectUrl.searchParams.set('error_description', error.message);
        
        return NextResponse.redirect(redirectUrl);
      }
    } else {
      console.error('Supabaseクライアントが初期化されていません');
      return NextResponse.redirect(new URL('/login?error=init_failed', requestUrl.origin));
    }
    
    // 認証成功後はプロフィールページにリダイレクト
    return NextResponse.redirect(new URL('/profile', requestUrl.origin));
  } catch (error) {
    console.error('認証コールバック処理エラー:', error);
    return NextResponse.redirect(new URL('/login?error=unknown', request.url));
  }
} 