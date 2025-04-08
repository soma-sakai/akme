import { supabase, isSupabaseAvailable } from '@/lib/supabase';
import { Product, convertSupabaseProduct } from '@/types/product';
import { products as localProducts } from '@/data/products';

// Supabaseから商品データを取得する関数
export async function fetchProductsFromSupabase(): Promise<Product[]> {
  if (!isSupabaseAvailable() || !supabase) {
    console.warn('Supabase unavailable, falling back to local data');
    return localProducts;
  }

  try {
    console.log('Fetching products from Supabase...');
    const { data, error, status } = await supabase
      .from('products')
      .select('*');

    if (error && status !== 406) { // 406はRLS関連のエラーの可能性があるため一旦無視
      console.error('Error fetching products:', error.message, 'Status:', status);
      return localProducts;
    }

    if (!data || data.length === 0) {
      console.warn('No products found in Supabase or empty data returned. Falling back to local data.');
      return localProducts;
    }

    console.log(`Fetched ${data.length} products from Supabase. First item ID: ${data[0]?.id}`);
    // データ変換とログ出力
    return data.map(item => {
      const converted = convertSupabaseProduct(item);
      // console.log('Converted product:', converted); // 必要に応じて有効化
      return converted;
    });
  } catch (error) {
    console.error('Error during Supabase product fetch process:', error);
    return localProducts;
  }
}

// 特定の商品IDに基づいて商品データを取得する関数
export async function fetchProductById(id: string): Promise<Product | null> {
  if (!isSupabaseAvailable() || !supabase) {
    console.warn(`Supabase unavailable when fetching ID ${id}, falling back to local data`);
    const product = localProducts.find(p => p.id === id);
    return product || null;
  }

  try {
    console.log(`Fetching product with ID: ${id} from Supabase...`);
    // idがUUID形式であることを確認（形式が違う場合はエラーの可能性がある）
    if (!/^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(id)) {
      console.warn(`Invalid UUID format for ID: ${id}. Falling back to local data.`);
      const product = localProducts.find(p => p.id === id);
      return product || null;
    }

    const { data, error, status } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single();

    if (error && status !== 406) {
      console.error(`Error fetching product ID ${id}:`, error.message, 'Status:', status);
      const product = localProducts.find(p => p.id === id);
      return product || null;
    }

    if (!data) {
      console.warn(`Product with ID ${id} not found in Supabase. Falling back to local data.`);
      const product = localProducts.find(p => p.id === id);
      return product || null;
    }

    console.log(`Fetched product ID ${id}:`, data.name);
    const converted = convertSupabaseProduct(data);
    // console.log('Converted single product:', converted); // 必要に応じて有効化
    return converted;
  } catch (error) {
    console.error(`Error during Supabase fetch process for ID ${id}:`, error);
    const product = localProducts.find(p => p.id === id);
    return product || null;
  }
} 