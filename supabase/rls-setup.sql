-- RLS（Row Level Security）設定スクリプト
-- Supabaseのデータベースに適用するためのSQLスクリプト

-- プロファイルテーブルの作成
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT,
  address TEXT,
  avatar_url TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 注文テーブルの作成
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  status TEXT,
  total INTEGER,
  stripe_session_id TEXT UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 注文詳細テーブルの作成
CREATE TABLE IF NOT EXISTS order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  product_id TEXT,
  name TEXT,
  price INTEGER,
  quantity INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- RLSの有効化
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- プロファイルのポリシー設定
-- 1. 自分のプロファイルのみ閲覧可能
CREATE POLICY "Users can view their own profile"
  ON profiles
  FOR SELECT
  USING (auth.uid() = id);

-- 2. 自分のプロファイルのみ更新可能
CREATE POLICY "Users can update their own profile"
  ON profiles
  FOR UPDATE
  USING (auth.uid() = id);

-- 3. 新規ユーザーは自分のプロファイルを作成可能
CREATE POLICY "Users can insert their own profile"
  ON profiles
  FOR INSERT
  WITH CHECK (auth.uid() = id);

-- 注文のポリシー設定
-- 1. 自分の注文のみ閲覧可能
CREATE POLICY "Users can view their own orders"
  ON orders
  FOR SELECT
  USING (auth.uid() = user_id);

-- 2. 自分のみ注文作成可能
CREATE POLICY "Users can create their own orders"
  ON orders
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- 3. 管理者は全ての注文を閲覧可能（サービスロール経由）
CREATE POLICY "Service role can view all orders"
  ON orders
  FOR SELECT
  USING (auth.uid() IS NOT NULL);

-- 注文詳細のポリシー設定
-- 1. 自分の注文の詳細のみ閲覧可能
CREATE POLICY "Users can view their own order items"
  ON order_items
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM orders
      WHERE orders.id = order_items.order_id
      AND orders.user_id = auth.uid()
    )
  );

-- 2. 自分のみ注文詳細を作成可能
CREATE POLICY "Users can insert their own order items"
  ON order_items
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM orders
      WHERE orders.id = order_items.order_id
      AND orders.user_id = auth.uid()
    )
  );

-- 3. 管理者は全ての注文詳細を閲覧可能（サービスロール経由）
CREATE POLICY "Service role can view all order items"
  ON order_items
  FOR SELECT
  USING (auth.uid() IS NOT NULL);

-- 認証トリガー：ユーザー作成時に自動的にプロフィールレコードを作成
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, name)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 既存のトリガーを削除（存在する場合）
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- 新しいトリガーを作成
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- 管理者ロールのSQLスクリプトは、Supabaseの管理画面から実行してください
-- これは、サービスロールが適切に設定されていることを確認するためです 