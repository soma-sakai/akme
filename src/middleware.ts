import { NextResponse, NextRequest } from 'next/server';

// すべてのリクエストに対して実行されるミドルウェア
export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();
  const { pathname } = url;

  // 静的アセットのリクエストはスキップ
  if (
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/api/') ||
    pathname.includes('.') // 静的ファイル
  ) {
    return NextResponse.next();
  }

  // ルートパスやその他の有効なパスの場合は通常通り処理
  if (
    pathname === '/' ||
    pathname === '/products' ||
    pathname === '/login' ||
    pathname === '/register' ||
    pathname === '/profile' ||
    pathname === '/checkout/success' ||
    pathname === '/checkout/cancel' ||
    pathname.startsWith('/products/')
  ) {
    return NextResponse.next();
  }

  // 不明なパスの場合、ログを残す（デバッグ用）
  console.warn(`不明なパスへのアクセスがありました: ${pathname}`);

  // リクエストを続行（404ページが自動的に表示される）
  return NextResponse.next();
}

// ミドルウェアが動作するパスを指定
export const config = {
  matcher: [
    // 静的ファイルやAPIルートを除外
    '/((?!_next/|_vercel|api/|.*\\..*).*)',
  ],
}; 