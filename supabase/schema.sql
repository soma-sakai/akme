-- Supabaseのデータベーススキーマ定義

-- 商品テーブルの作成
CREATE TABLE IF NOT EXISTS products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  price INTEGER NOT NULL,
  images TEXT[] NOT NULL,
  features TEXT[],
  category TEXT NOT NULL,
  stock INTEGER NOT NULL DEFAULT 0,
  is_subscription BOOLEAN DEFAULT false,
  subscription_price INTEGER,
  subscription_interval TEXT CHECK (subscription_interval IN ('month', 'year')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 認証済みユーザーのプロファイルテーブル
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT,
  address TEXT,
  phone TEXT,
  avatar_url TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 注文テーブル
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  status TEXT NOT NULL,
  total INTEGER NOT NULL,
  stripe_session_id TEXT UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 注文詳細テーブル
CREATE TABLE IF NOT EXISTS order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  product_id TEXT REFERENCES products(id) ON DELETE SET NULL,
  price INTEGER NOT NULL,
  quantity INTEGER NOT NULL,
  is_subscription BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- サンプル商品データの挿入
INSERT INTO products (id, name, description, price, images, features, category, stock, is_subscription, subscription_price, subscription_interval, created_at)
VALUES
  ('1', 'プレミアム・オーガニックティー', '厳選された茶葉から作られた高品質なオーガニックティー。豊かな香りと深い味わいが特徴です。毎日の生活に贅沢なリラックスタイムをお届けします。', 2800, 
   ARRAY['https://images.unsplash.com/photo-1523920290228-4f321a939b4c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80', 'https://images.unsplash.com/photo-1594631252845-29fc4cc8cde9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80'], 
   ARRAY['100%オーガニック', '抗酸化物質が豊富', '環境に優しいパッケージ', '自然な甘みがあり、砂糖不要'], 
   '食品・飲料', 50, true, 2520, 'month', '2023-01-15T09:00:00Z'),
   
  ('2', 'ミニマリスト財布', '上質な本革を使用したミニマリストのための財布。薄型でありながら、必要なカードやお札をすっきりと収納できます。シンプルで洗練されたデザインは、どんなスタイルにもマッチします。', 8500, 
   ARRAY['https://images.unsplash.com/photo-1627123424574-724758594e93?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80', 'https://images.unsplash.com/photo-1556740738-b6a63e27c4df?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80'], 
   ARRAY['本革使用', 'スリムデザイン', 'RFID保護機能', '手作りの高品質'], 
   'ファッション・アクセサリー', 25, false, null, null, '2023-02-21T10:30:00Z'),
   
  ('3', 'ポータブル空気清浄機', '持ち運び可能なコンパクトサイズの空気清浄機。高性能HEPAフィルターを搭載し、PM2.5、花粉、ホコリなどを99.97%除去します。USBで充電可能で、自宅やオフィス、車内など様々な場所で使用できます。', 12800, 
   ARRAY['https://images.unsplash.com/photo-1605374005291-2357180246c2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80', 'https://images.unsplash.com/photo-1593032580308-d4bafafc4ae1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80'], 
   ARRAY['HEPAフィルター搭載', '静音設計', 'USB充電対応', '3段階風量調整', 'コンパクトサイズ'], 
   '家電・ガジェット', 30, true, 1000, 'month', '2023-03-10T15:45:00Z'),
   
  ('4', 'オーガニックスキンケアセット', '100%天然由来の成分を使ったスキンケアセット。洗顔料、化粧水、美容液、保湿クリームのフルセットで、肌に優しく効果的なケアを提供します。パラベン、合成香料、アルコールフリーで敏感肌の方にも安心してご使用いただけます。', 9800, 
   ARRAY['https://images.unsplash.com/photo-1601049541289-9b1b7bfc9c3a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80', 'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80'], 
   ARRAY['100%オーガニック成分', 'パラベンフリー', '動物実験なし', '敏感肌対応'], 
   '美容・健康', 20, true, 8820, 'month', '2023-04-15T08:30:00Z'),
  
  ('5', 'スマートヨガマット', '最新テクノロジーを搭載したスマートヨガマット。内蔵センサーが姿勢を検知し、スマートフォンアプリと連携してリアルタイムでフィードバックを提供します。快適な厚みと滑り止め機能を備え、初心者から上級者まで幅広くサポートします。', 15800, 
   ARRAY['https://images.unsplash.com/photo-1599447292180-45fd84092ef4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80', 'https://images.unsplash.com/photo-1616699002805-0741e1e4a9c5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80'], 
   ARRAY['ポーズ検知センサー搭載', 'スマートフォンアプリ連携', '高密度クッション', '滑り止め加工', '簡単なロールアップ設計'], 
   'スポーツ・アウトドア', 15, false, null, null, '2023-05-20T12:00:00Z'),
   
  ('6', 'ミニマルデスクランプ', 'シンプルでスタイリッシュなデザインのLEDデスクランプ。目に優しい自然光に近い光源と、タッチセンサー式の明るさ調整機能を備えています。省スペースで設置でき、あらゆるデスク環境に調和します。', 6500, 
   ARRAY['https://images.unsplash.com/photo-1507473885765-e6ed057f782c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80', 'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80'], 
   ARRAY['タッチセンサー調光', '目に優しいLED光源', '省エネ設計', 'USBポート搭載', 'コンパクトサイズ'], 
   '家具・インテリア', 35, false, null, null, '2023-06-15T14:30:00Z')
ON CONFLICT (id) DO NOTHING;

-- Row Level Security (RLS) 設定
-- RLS を有効化
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- 商品テーブルのポリシー: 誰でも読み取り可能
CREATE POLICY "商品の閲覧は全員可能" ON products
  FOR SELECT USING (true);

-- プロファイルのポリシー: 自分のプロファイルのみ読み書き可能
CREATE POLICY "自分のプロファイルのみ閲覧可能" ON profiles
  FOR SELECT USING (auth.uid() = id);
  
CREATE POLICY "自分のプロファイルのみ更新可能" ON profiles
  FOR UPDATE USING (auth.uid() = id);
  
CREATE POLICY "自分のプロファイルのみ作成可能" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- 注文のポリシー: 自分の注文のみ閲覧可能
CREATE POLICY "自分の注文のみ閲覧可能" ON orders
  FOR SELECT USING (auth.uid() = user_id);
  
CREATE POLICY "自分の注文のみ作成可能" ON orders
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 注文詳細のポリシー: 自分の注文の詳細のみ閲覧可能
CREATE POLICY "自分の注文詳細のみ閲覧可能" ON order_items
  FOR SELECT USING (
    order_id IN (
      SELECT id FROM orders WHERE user_id = auth.uid()
    )
  );

-- 管理ユーザー向けの追加ポリシー
-- 注: 管理者ロールの設定は別途必要 