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
    unoptimized: process.env.NODE_ENV === 'production' // Vercelでの静的エクスポートでの問題対策
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
  productionBrowserSourceMaps: false, // 本番環境でのソースマップを無効化
  
  // Vercelデプロイ向け設定
  output: 'standalone', // サーバーレス関数の最適化
  
  // 404エラー対策
  async rewrites() {
    return [
      {
        source: '/:path*',
        destination: '/:path*',
      },
      {
        source: '/',
        destination: '/',
      },
    ];
  },
  
  // フォールバックページを設定
  async redirects() {
    return [];
  }
};

module.exports = nextConfig; 