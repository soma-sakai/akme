/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // 本番ビルド時にESLintエラーを無視する
    ignoreDuringBuilds: true,
  },
  images: {
    domains: ['images.unsplash.com'],
  },
};

module.exports = nextConfig; 