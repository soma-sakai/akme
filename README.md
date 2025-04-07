# Akamee - ECサイト

## 概要

Akameeは、高品質な商品を提供するECサイトです。Next.js 15とTailwind CSSを使用して構築されており、モダンなUIとUXを備えています。

## 機能

- 商品表示・詳細閲覧
- 会員登録・ログイン機能（Supabase認証）
- 商品検索・カテゴリー別表示
- プロフィール管理
- Stripe決済システム（テスト環境）

## 技術スタック

- Next.js 15
- TypeScript
- Tailwind CSS
- Supabase（認証・データベース）
- Stripe（決済システム）

## セキュリティ対策

- **環境変数の管理**: 
  - `NEXT_PUBLIC_`プレフィックスはクライアントサイドで公開される変数のみに使用
  - シークレットキー（Stripe、Supabaseサービスキー）はサーバーサイドのみで使用

- **APIセキュリティ**:
  - リファラーチェックにより不正なオリジンからのリクエストを防止
  - 必要に応じたユーザー認証
  - リクエストデータの検証

- **データベースセキュリティ**:
  - Supabase RLS（Row Level Security）の適用
  - ユーザーごとのデータアクセス制限
  - SQL Injection対策

- **フロントエンドセキュリティ**:
  - 環境変数の適切な利用
  - クライアントサイドでの状態管理の検証

## 開発環境のセットアップ

```bash
# パッケージインストール
npm install

# 開発サーバー起動
npm run dev
```

### 環境変数の設定

開発環境では `.env.local` ファイルを作成し、以下の変数を設定してください：

```
# サイトURL
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Supabase設定
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_KEY=your_supabase_service_key

# Stripe設定
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
STRIPE_SECRET_KEY=your_stripe_secret_key
```

## ディレクトリ構成

- `/src/app` - ページコンポーネント
- `/src/components` - 共通コンポーネント
- `/src/contexts` - コンテキストプロバイダー
- `/src/hooks` - カスタムフック
- `/src/lib` - 外部サービス連携
- `/src/data` - モックデータ
- `/src/types` - 型定義
- `/supabase` - Supabaseの設定・マイグレーションスクリプト

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
- 本番環境では必ず環境変数を正しく設定してください
- 未使用のインポート（useEffect, useStateなど）はすべて削除済みです

## トラブルシューティング

ビルドエラーが発生した場合は、以下を確認してください：

1. 未使用のインポートや変数がないか
2. TypeScriptの型エラーがないか
3. ESLintの警告がビルドを中断していないか
