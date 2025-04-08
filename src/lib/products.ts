import { supabase, isSupabaseAvailable } from '@/lib/supabase';
import { Product, convertSupabaseProduct } from '@/types/product';
import { products as localProducts } from '@/data/products';

// Supabaseのテーブル一覧を取得する関数
export async function listSupabaseTables(): Promise<string[]> {
  if (!isSupabaseAvailable() || !supabase) {
    console.warn('Supabaseが利用できないため、テーブル一覧を取得できません');
    return [];
  }

  try {
    console.log('Supabaseテーブル一覧を取得中...');
    
    // information_schemaからテーブル一覧を取得する
    const { data, error } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public');
      
    if (error) {
      console.error('テーブル一覧の取得に失敗しました:', error.message);
      return [];
    }

    if (!data || data.length === 0) {
      console.warn('テーブルが見つかりません');
      return [];
    }

    const tableNames = data.map(row => row.table_name);
    console.log('使用可能なテーブル:', tableNames);
    return tableNames;
  } catch (error) {
    console.error('テーブル一覧取得中にエラーが発生しました:', error);
    return [];
  }
}

// Supabaseから商品データを取得する関数
export async function fetchProductsFromSupabase(): Promise<Product[]> {
  // Supabaseが利用可能かチェック
  if (!isSupabaseAvailable() || !supabase) {
    console.warn('Supabaseが利用できないため、ローカルデータを使用します');
    return localProducts;
  }

  // いくつかのテーブル名を試してみる
  const tablesToTry = ['products', 'product', 'Products', 'Product'];
  
  try {
    console.log('Supabaseから商品データを取得を試みます...');
    
    // 複数のテーブル名を順番に試す
    for (const tableName of tablesToTry) {
      console.log(`テーブル "${tableName}" からデータ取得を試みます...`);
      const { data, error } = await supabase
        .from(tableName)
        .select('*');
      
      // エラーがなく、データがある場合は成功
      if (!error && data && data.length > 0) {
        console.log(`テーブル "${tableName}" からデータを正常に取得しました:`, data);
        
        // スネークケースからキャメルケースに変換
        const convertedProducts = data.map(item => {
          console.log('変換前のデータ:', item);
          const converted = convertSupabaseProduct(item);
          console.log('変換後のデータ:', converted);
          return converted;
        });
        
        return convertedProducts;
      }
    }
    
    // 利用可能なテーブルの一覧を取得してログに出力
    console.log('登録されている商品データが見つかりません。テーブル一覧を取得します...');
    await listSupabaseTables();
    
    // すべて失敗した場合はローカルデータを返す
    console.warn('商品データが見つかりません。ローカルデータを使用します');
    return localProducts;
  } catch (error) {
    console.error('Supabaseからの商品データ取得中にエラーが発生しました:', error);
    return localProducts;
  }
}

// 特定の商品IDに基づいて商品データを取得する関数
export async function fetchProductById(id: string): Promise<Product | null> {
  console.log(`商品ID ${id} の取得を試みます`);
  
  // Supabaseが利用可能かチェック
  if (!isSupabaseAvailable() || !supabase) {
    console.warn('Supabaseが利用できないため、ローカルデータを使用します');
    const product = localProducts.find(p => p.id === id);
    return product || null;
  }

  // いくつかのテーブル名を試してみる
  const tablesToTry = ['products', 'product', 'Products', 'Product'];
  
  try {
    // 複数のテーブル名を順番に試す
    for (const tableName of tablesToTry) {
      console.log(`テーブル "${tableName}" から商品ID ${id} の取得を試みます...`);
      const { data, error } = await supabase
        .from(tableName)
        .select('*')
        .eq('id', id)
        .single();
      
      // エラーがなく、データがある場合は成功
      if (!error && data) {
        console.log(`テーブル "${tableName}" から商品ID ${id} のデータを正常に取得しました:`, data);
        
        // スネークケースからキャメルケースに変換
        const convertedProduct = convertSupabaseProduct(data);
        console.log('変換後の商品データ:', convertedProduct);
        return convertedProduct;
      }
    }

    // 商品が見つからなかった場合は、特定のIDでローカルデータから検索
    console.warn(`商品ID ${id} が見つかりません。ローカルデータを使用します`);
    const product = localProducts.find(p => p.id === id);
    return product || null;
  } catch (error) {
    console.error('Supabaseからの商品データ取得中にエラーが発生しました:', error);
    // ローカルデータからフォールバック
    const product = localProducts.find(p => p.id === id);
    return product || null;
  }
} 