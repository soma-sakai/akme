export type Product = {
  id: string;
  name: string;
  description: string;
  longDescription?: string;
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
  return {
    id: data.id,
    name: data.name,
    description: data.description,
    longDescription: data.long_description,
    price: data.price,
    images: data.images,
    features: data.features,
    category: data.category,
    stock: data.stock,
    isSubscription: data.is_subscription,
    subscriptionPrice: data.subscription_price,
    subscriptionInterval: data.subscription_interval,
    createdAt: data.created_at
  };
} 