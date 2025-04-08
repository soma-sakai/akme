export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  features?: string[];
  category: string;
  stock: number;
  isSubscription?: boolean;
  subscriptionPrice?: number;
  subscriptionInterval?: 'month' | 'year';
  createdAt: string;
};

// Supabaseからのデータをフロントエンド用に変換する関数
export function convertSupabaseProduct(data: any): Product {
  console.log('スネークケース→キャメルケース変換中のデータ:', data);
  
  if (!data || typeof data !== 'object') {
    console.error('変換対象のデータが不正です:', data);
    // 安全なデフォルト値を返す
    return {
      id: 'unknown',
      name: 'Unknown Product',
      description: 'No description available',
      price: 0,
      images: [],
      category: 'Unknown',
      stock: 0,
      createdAt: new Date().toISOString()
    };
  }
  
  // 画像フィールドの特別処理（配列でない場合は配列に変換）
  let images = data.images;
  if (!Array.isArray(images)) {
    if (typeof images === 'string') {
      try {
        // JSON文字列の場合はパースを試みる
        images = JSON.parse(images);
      } catch (e) {
        // パースに失敗した場合は単一の文字列として配列にする
        images = [images];
      }
    } else {
      // nullやundefinedの場合は空配列にする
      images = [];
    }
  }
  
  // 文字列に対してデフォルト値を使用するヘルパー関数
  const stringOrDefault = (value: any, defaultValue: string = ''): string => {
    return typeof value === 'string' ? value : defaultValue;
  };
  
  // 数値に対してデフォルト値を使用するヘルパー関数
  const numberOrDefault = (value: any, defaultValue: number = 0): number => {
    return typeof value === 'number' ? value : defaultValue;
  };
  
  // ブール値に対してデフォルト値を使用するヘルパー関数
  const boolOrDefault = (value: any, defaultValue: boolean = false): boolean => {
    return typeof value === 'boolean' ? value : defaultValue;
  };
  
  const product: Product = {
    id: stringOrDefault(data.id),
    name: stringOrDefault(data.name),
    description: stringOrDefault(data.description),
    price: numberOrDefault(data.price),
    images: images,
    features: Array.isArray(data.features) ? data.features : [],
    category: stringOrDefault(data.category),
    stock: numberOrDefault(data.stock),
    isSubscription: boolOrDefault(data.is_subscription),
    subscriptionPrice: numberOrDefault(data.subscription_price),
    subscriptionInterval: data.subscription_interval === 'month' || data.subscription_interval === 'year' ? 
      data.subscription_interval : undefined,
    createdAt: stringOrDefault(data.created_at, new Date().toISOString())
  };
  
  console.log('変換後の商品データ:', product);
  return product;
} 