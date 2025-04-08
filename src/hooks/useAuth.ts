'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase, isSupabaseAvailable } from '@/lib/supabase';

// ユーザー情報の型定義
export type UserProfile = {
  id: string;
  email: string;
  name: string;
  address?: string;
  profile_image?: string;
  bio?: string;
};

// 認証ロジック
export const useAuth = () => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [supabaseAvailable, setSupabaseAvailable] = useState(false);
  const router = useRouter();

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
          // ユーザー基本情報をセット
          setUser({
            id: session.user.id,
            email: session.user.email || '',
            name: session.user.user_metadata?.name || localStorage.getItem(`name_${session.user.id}`) || '',
            address: session.user.user_metadata?.address || localStorage.getItem(`address_${session.user.id}`) || '',
          });
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
          // サインイン時にユーザー情報をセット
          setUser({
            id: session.user.id,
            email: session.user.email || '',
            name: session.user.user_metadata?.name || localStorage.getItem(`name_${session.user.id}`) || '',
            address: session.user.user_metadata?.address || localStorage.getItem(`address_${session.user.id}`) || '',
          });
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
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
      // メール確認なしの直接サインアップ
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            address
          }
        }
      });

      if (error) {
        throw error;
      }

      if (data.user) {
        // メタデータをローカルストレージに保存
        localStorage.setItem(`name_${data.user.id}`, name);
        localStorage.setItem(`address_${data.user.id}`, address);
        
        if (data.session) {
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
        // メタデータからユーザー情報を取得
        const userName = data.user.user_metadata?.name || localStorage.getItem(`name_${data.user.id}`) || '';
        const userAddress = data.user.user_metadata?.address || localStorage.getItem(`address_${data.user.id}`) || '';
        
        // ユーザー情報をセット
        setUser({
          id: data.user.id,
          email: data.user.email || '',
          name: userName,
          address: userAddress,
        });

        // ローカルストレージにも保存
        if (userName) localStorage.setItem(`name_${data.user.id}`, userName);
        if (userAddress) localStorage.setItem(`address_${data.user.id}`, userAddress);

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
      // ログアウト前にユーザー情報をクリアする
      setUser(null);
      
      // Supabaseセッション削除
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        throw error;
      }
      
      // ローカルストレージのクリーンアップ
      if (typeof window !== 'undefined') {
        // ユーザー関連の情報をすべて削除
        Object.keys(localStorage).forEach(key => {
          if (key.startsWith('name_') || key.startsWith('address_')) {
            localStorage.removeItem(key);
          }
        });
      }
      
      // 明示的にホームにリダイレクト
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
      // ローカルストレージに保存
      if (profile.name) {
        localStorage.setItem(`name_${user.id}`, profile.name);
      }
      if (profile.address) {
        localStorage.setItem(`address_${user.id}`, profile.address);
      }

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
    signUp,
    signIn,
    signOut,
    updateProfile
  };
}; 