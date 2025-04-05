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
  },
  poweredByHeader: false, // X-Powered-By ヘッダーを無効化
  productionBrowserSourceMaps: false, // 本番環境でのソースマップを無効化
};

module.exports = nextConfig; 