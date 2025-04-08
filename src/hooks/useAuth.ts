'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase, isSupabaseAvailable, fetchUserProfile, fetchOrderHistory } from '@/lib/supabase';

// ユーザー情報の型定義
export type UserProfile = {
  id: string;
  email: string;
  name: string;
  address?: string;
  profile_image?: string;
  bio?: string;
};

// 注文履歴の型定義
export type OrderItem = {
  id: string;
  product_id: string;
  name: string;
  price: number;
  quantity: number;
};

export type Order = {
  id: string;
  status: string;
  total: number;
  created_at: string;
  items: OrderItem[];
};

// 認証ロジック
export const useAuth = () => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [supabaseAvailable, setSupabaseAvailable] = useState(false);
  const router = useRouter();

  // ユーザープロファイルを取得する関数
  const fetchProfile = async (userId: string) => {
    try {
      if (!supabase) return null;
      
      // プロファイルテーブルからデータを取得
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (error) {
        console.error('プロファイル取得エラー:', error);
        return null;
      }
      
      return data;
    } catch (error) {
      console.error('プロファイル取得中にエラーが発生しました:', error);
      return null;
    }
  };

  // 注文履歴を取得する関数
  const getOrderHistory = async () => {
    if (!user) return;
    
    setOrdersLoading(true);
    try {
      const orderHistory = await fetchOrderHistory(user.id);
      setOrders(orderHistory);
    } catch (error) {
      console.error('注文履歴の取得に失敗しました:', error);
    } finally {
      setOrdersLoading(false);
    }
  };

  useEffect(() => {
    // Supabaseが利用可能かチェック
    const available = isSupabaseAvailable();
    setSupabaseAvailable(available);
    
    if (!available) {
      console.error('Supabaseクライアントが初期化されていません。環境変数を確認してください。');
      setLoading(false);
      return;
    }

    // Supabaseからセッション情報を取得
    const getSession = async () => {
      setLoading(true);
      
      try {
        if (!supabase) {
          throw new Error('Supabaseクライアントが利用できません');
        }
        
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          // プロファイル情報を取得
          const profile = await fetchProfile(session.user.id);
          
          // ユーザー基本情報をセット
          setUser({
            id: session.user.id,
            email: session.user.email || '',
            name: profile?.name || session.user.user_metadata?.name || '',
            address: profile?.address || session.user.user_metadata?.address || '',
            profile_image: profile?.avatar_url,
          });
          
          // 注文履歴を取得
          const orderHistory = await fetchOrderHistory(session.user.id);
          setOrders(orderHistory);
        }
      } catch (error) {
        console.error('セッション取得エラー:', error);
      }
      
      setLoading(false);
    };

    getSession();

    // Supabaseが利用できない場合は監視設定をスキップ
    if (!supabase) return;

    // 認証状態変更監視
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session) {
          // プロファイル情報を取得
          const profile = await fetchProfile(session.user.id);
          
          // サインイン時にユーザー情報をセット
          setUser({
            id: session.user.id,
            email: session.user.email || '',
            name: profile?.name || session.user.user_metadata?.name || '',
            address: profile?.address || session.user.user_metadata?.address || '',
            profile_image: profile?.avatar_url,
          });
          
          // 注文履歴を取得
          const orderHistory = await fetchOrderHistory(session.user.id);
          setOrders(orderHistory);
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
          setOrders([]);
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signUp = async (email: string, password: string, name: string, address: string) => {
    if (!supabaseAvailable || !supabase) {
      return { 
        success: false, 
        error: '認証サービスが利用できません。環境設定を確認してください。' 
      };
    }
    
    try {
      // サイトURLを取得（supabase.tsで設定したものを使用）
      let redirectTo: string | undefined = undefined;
      if (typeof window !== 'undefined' && window.__SUPABASE_CONFIG__?.siteUrl) {
        redirectTo = `${window.__SUPABASE_CONFIG__.siteUrl}/auth/callback`;
      }
      
      console.log('サインアップ時のリダイレクトURL:', redirectTo);
      
      // メール確認用のサインアップ
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            address
          },
          // メール確認後のリダイレクトURLを指定
          emailRedirectTo: redirectTo
        }
      });

      if (error) {
        throw error;
      }

      if (data.user) {
        if (data.session) {
          // プロファイル情報が自動的に作成されなかった場合、明示的に作成
          const { error: profileError } = await supabase
            .from('profiles')
            .upsert({
              id: data.user.id,
              name,
              address
            });
            
          if (profileError) {
            console.error('プロファイル作成エラー:', profileError);
          }
          
          // セッションがある場合は直接ログイン状態
          setUser({
            id: data.user.id,
            email: data.user.email || '',
            name: name,
            address: address,
          });
          router.push('/profile');
        } else {
          // メール確認が必要な場合
          router.push('/login?registration=success');
        }
      }

      return { success: true };
    } catch (error) {
      console.error('登録エラー:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : '不明なエラーが発生しました'
      };
    }
  };

  const signIn = async (email: string, password: string) => {
    if (!supabaseAvailable || !supabase) {
      return { 
        success: false, 
        error: '認証サービスが利用できません。環境設定を確認してください。' 
      };
    }
    
    try {
      // パスワードでログイン
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        // エラーメッセージをわかりやすく変換
        if (error.message === 'Invalid login credentials') {
          return { 
            success: false, 
            error: 'メールアドレスまたはパスワードが正しくありません。'
          };
        } else if (error.message.includes('Email not confirmed')) {
          return { 
            success: false, 
            error: 'メールアドレスが確認されていません。受信トレイを確認してください。'
          };
        }
        throw error;
      }

      if (data.user) {
        // プロファイル情報を取得
        const profile = await fetchProfile(data.user.id);
        
        // ユーザー情報をセット
        setUser({
          id: data.user.id,
          email: data.user.email || '',
          name: profile?.name || data.user.user_metadata?.name || '',
          address: profile?.address || data.user.user_metadata?.address || '',
          profile_image: profile?.avatar_url,
        });

        // 注文履歴を取得
        const orderHistory = await fetchOrderHistory(data.user.id);
        setOrders(orderHistory);

        router.push('/profile');
      }

      return { success: true };
    } catch (error) {
      console.error('ログインエラー:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : '不明なエラーが発生しました' 
      };
    }
  };

  const signOut = async () => {
    if (!supabaseAvailable || !supabase) {
      return { 
        success: false, 
        error: '認証サービスが利用できません。環境設定を確認してください。' 
      };
    }
    
    try {
      // ログアウト処理
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        throw error;
      }
      
      // 状態をクリア
      setUser(null);
      setOrders([]);
      
      // ホームページにリダイレクト
      router.push('/');
      
      return { success: true };
    } catch (error) {
      console.error('ログアウトエラー:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : '不明なエラーが発生しました' 
      };
    }
  };

  const updateProfile = async (profile: Partial<UserProfile>) => {
    if (!user) return { success: false, error: 'ユーザーが認証されていません' };
    if (!supabaseAvailable || !supabase) {
      return { 
        success: false, 
        error: '認証サービスが利用できません。環境設定を確認してください。' 
      };
    }

    try {
      // Supabaseのプロファイルテーブルを更新
      const { error: profileError } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          name: profile.name || user.name,
          address: profile.address || user.address,
          updated_at: new Date().toISOString()
        });

      if (profileError) throw profileError;

      // Supabaseのユーザーメタデータを更新
      const { error } = await supabase.auth.updateUser({
        data: {
          name: profile.name || user.name,
          address: profile.address || user.address
        }
      });

      if (error) throw error;

      // ユーザー情報を更新
      setUser(prev => prev ? { ...prev, ...profile } : null);
      
      return { success: true };
    } catch (error) {
      console.error('プロフィール更新エラー:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : '不明なエラーが発生しました' 
      };
    }
  };

  return {
    user,
    loading,
    orders,
    ordersLoading,
    signUp,
    signIn,
    signOut,
    updateProfile,
    getOrderHistory
  };
}; 