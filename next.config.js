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
    domains: ['images.unsplash.com', 'placehold.jp'],
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
  
  // 出力ディレクトリを明示的に設定
  distDir: '.next',
  
  // エラー処理の設定
  onDemandEntries: {
    // サーバーサイドのページがメモリに保持される時間（ミリ秒）
    maxInactiveAge: 60 * 1000,
    // メモリに同時に保持されるページ数
    pagesBufferLength: 5,
  },
};

module.exports = nextConfig; 