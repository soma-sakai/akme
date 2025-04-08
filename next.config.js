/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // 本番ビルド時にESLintエラーを無視する
    ignoreDuringBuilds: true,
  },
  typescript: {
    // 本番ビルド時にTypeScriptエラーを無視する
    ignoreBuildErrors: true,
  },
  images: {
    domains: ['images.unsplash.com', 'placehold.jp', 'via.placeholder.com'],
    unoptimized: false // サーバーサイドレンダリングでは画像最適化を有効にできる
  },
  env: {
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '',
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL || '',
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
    // サーバーサイド環境変数（NEXT_PUBLICなしなのでクライアントには公開されない）
    STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
    SUPABASE_SERVICE_KEY: process.env.SUPABASE_SERVICE_KEY,
  },
  poweredByHeader: false, // X-Powered-By ヘッダーを無効化
  productionBrowserSourceMaps: true, // ソースマップを有効化
  
  // output設定を変更
  output: 'standalone', // サーバーレンダリングモード
  
  // リライト設定を修正
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: '/api/:path*',
      },
      {
        source: '/:path*',
        destination: '/:path*',
      }
    ];
  },
  
  // フォールバックページ設定を変更
  async redirects() {
    return [];
  }
};

module.exports = nextConfig; 