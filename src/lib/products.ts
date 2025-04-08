import { supabase, isSupabaseAvailable } from '@/lib/supabase';
import { Product, convertSupabaseProduct } from '@/types/product';
import { products as localProducts } from '@/data/products';

// Supabaseから商品データを取得する関数
export async function fetchProductsFromSupabase(): Promise<Product[]> {
  // Supabaseが利用可能かチェック
  if (!isSupabaseAvailable() || !supabase) {
    console.warn('Supabaseが利用できないため、ローカルデータを使用します');
    return localProducts;
  }

  try {
    console.log('Supabaseから商品データを取得中...');
    const { data, error } = await supabase
      .from('products')
      .select('*');

    if (error) {
      console.error('商品データの取得に失敗しました:', error.message);
      return localProducts;
    }

    if (!data || data.length === 0) {
      console.warn('商品データが見つかりません。ローカルデータを使用します');
      return localProducts;
    }

    console.log(`Supabaseから${data.length}件の商品データを取得しました`);
    // スネークケースからキャメルケースに変換
    return data.map(item => convertSupabaseProduct(item));
  } catch (error) {
    console.error('Supabaseからの商品データ取得中にエラーが発生しました:', error);
    return localProducts;
  }
}

// 特定の商品IDに基づいて商品データを取得する関数
export async function fetchProductById(id: string): Promise<Product | null> {
  // Supabaseが利用可能かチェック
  if (!isSupabaseAvailable() || !supabase) {
    console.warn('Supabaseが利用できないため、ローカルデータを使用します');
    const product = localProducts.find(p => p.id === id);
    return product || null;
  }

  try {
    console.log(`商品ID ${id} のデータを取得中...`);
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error(`商品ID ${id} の取得に失敗しました:`, error.message);
      // ローカルデータからフォールバック
      const product = localProducts.find(p => p.id === id);
      return product || null;
    }

    if (!data) {
      console.warn(`商品ID ${id} が見つかりません。ローカルデータを使用します`);
      const product = localProducts.find(p => p.id === id);
      return product || null;
    }

    console.log(`商品ID ${id} のデータを取得しました:`, data.name);
    // スネークケースからキャメルケースに変換
    return convertSupabaseProduct(data);
  } catch (error) {
    console.error('Supabaseからの商品データ取得中にエラーが発生しました:', error);
    // ローカルデータからフォールバック
    const product = localProducts.find(p => p.id === id);
    return product || null;
  }
} 