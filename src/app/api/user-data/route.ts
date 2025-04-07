import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// ユーザー認証が必要なAPI（サンプル）
export async function GET(req: Request) {
  // Supabaseクライアントの初期化
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY; // サービスキー（非公開、サーバーサイドのみ）
  
  // サービスキーが設定されていない場合はエラー
  if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Supabase環境変数が設定されていません');
    return NextResponse.json({ error: '認証サービスの設定エラー' }, { status: 500 });
  }
  
  // サーバーサイド用のSupabaseクライアント（管理者権限）
  const adminSupabase = createClient(supabaseUrl, supabaseServiceKey);
  
  try {
    // リファラーとオリジンのチェック（外部からのアクセスを制限）
    const origin = req.headers.get('origin');
    const referer = req.headers.get('referer');
    const allowedOrigins = [
      process.env.NEXT_PUBLIC_SITE_URL,
      'http://localhost:3000',
      'https://akamee-thrgdb47e-gradation.vercel.app'
    ].filter(Boolean) as string[];
    
    // リファラーが許可されたオリジンから来ているか確認
    const isValidOrigin = origin && allowedOrigins.some(allowed => origin.startsWith(allowed));
    const isValidReferer = referer && allowedOrigins.some(allowed => referer.startsWith(allowed));
    
    if (!isValidOrigin && !isValidReferer) {
      console.warn(`[API] 不正なオリジンからのリクエスト: origin=${origin}, referer=${referer}`);
      return NextResponse.json(
        { error: '不正なリクエスト元からのアクセスです' },
        { status: 403 }
      );
    }
    
    // 認証トークンの取得
    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: '認証が必要です' }, { status: 401 });
    }
    
    const token = authHeader.substring(7); // 'Bearer ' の後の部分を取得
    
    // トークンを検証して、ユーザー情報を取得
    const { data: { user }, error } = await adminSupabase.auth.getUser(token);
    
    if (error || !user) {
      console.error('ユーザー認証エラー:', error);
      return NextResponse.json({ error: '無効な認証トークンです' }, { status: 401 });
    }
    
    // ここからは認証済みユーザーのみ実行される処理
    console.log(`認証済みユーザー ${user.id} がAPIにアクセスしました`);
    
    // ユーザー固有のデータを取得（例：プロフィール情報）
    const { data: userProfile, error: profileError } = await adminSupabase
      .from('profiles')
      .select('*')
      .eq('user_id', user.id)
      .single();
    
    if (profileError) {
      console.error('プロフィール取得エラー:', profileError);
      return NextResponse.json({ error: 'ユーザーデータの取得に失敗しました' }, { status: 500 });
    }
    
    // センシティブな情報を除外して返す
    const safeUserData = {
      id: user.id,
      email: user.email,
      name: userProfile?.name,
      avatar_url: userProfile?.avatar_url,
      created_at: user.created_at,
      // 機密情報は含めない
    };
    
    return NextResponse.json({ user: safeUserData });
    
  } catch (error: any) {
    console.error('APIエラー:', error);
    return NextResponse.json(
      { error: '予期せぬエラーが発生しました' },
      { status: 500 }
    );
  }
} 