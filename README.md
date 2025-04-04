# Akamee - ECサイト

## 概要

Akameeは、高品質な商品を提供するECサイトです。Next.js 15とTailwind CSSを使用して構築されており、モダンなUIとUXを備えています。

## 機能

- 商品表示・詳細閲覧
- 会員登録・ログイン機能（Supabase認証）
- 商品検索・カテゴリー別表示
- プロフィール管理
- （開発中）カート・決済システム

## 技術スタック

- Next.js 15
- TypeScript
- Tailwind CSS
- Supabase（認証・データベース）
- Stripe（決済システム）

## 開発環境のセットアップ

```bash
# パッケージインストール
npm install

# 開発サーバー起動
npm run dev
```

## ディレクトリ構成

- `/src/app` - ページコンポーネント
- `/src/components` - 共通コンポーネント
- `/src/contexts` - コンテキストプロバイダー
- `/src/hooks` - カスタムフック
- `/src/lib` - 外部サービス連携
- `/src/data` - モックデータ
- `/src/types` - 型定義

## デプロイ

このプロジェクトはVercelにデプロイされています。デプロイには以下の手順に従ってください：

```bash
# ビルド
npm run build

# 本番環境での実行
npm start
```

### Vercelデプロイ時の注意点

- `next.config.js`でESLintとTypeScriptのエラーを無視する設定を追加しています
- `vercel.json`にはデプロイ設定が含まれています
- 未使用のインポート（useEffect, useStateなど）はすべて削除済みです

## トラブルシューティング

ビルドエラーが発生した場合は、以下を確認してください：

1. 未使用のインポートや変数がないか
2. TypeScriptの型エラーがないか
3. ESLintの警告がビルドを中断していないか
