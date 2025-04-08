'use client';

import { useState, useEffect } from 'react';
import { useAuthContext } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { formatDate, formatPrice } from '@/lib/utils';

export default function Profile() {
  const { user, loading, orders, ordersLoading, updateProfile, getOrderHistory } = useAuthContext();
  const router = useRouter();
  
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [bio, setBio] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  
  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
    
    if (user) {
      setName(user.name || '');
      setAddress(user.address || '');
      setBio(user.bio || '');
      
      // 注文履歴を取得
      getOrderHistory();
    }
  }, [user, loading, router, getOrderHistory]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsUpdating(true);
    
    try {
      const result = await updateProfile({
        name,
        address,
        bio
      });
      
      if (result.success) {
        setSuccess('プロフィールが更新されました。');
      } else {
        setError(result.error || 'プロフィールの更新に失敗しました。');
      }
    } catch (error) {
      setError('プロフィール更新中にエラーが発生しました。');
      console.error(error);
    } finally {
      setIsUpdating(false);
    }
  };
  
  if (loading) {
    return (
      <div className="min-h-[500px] flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl">読み込み中...</p>
        </div>
      </div>
    );
  }
  
  if (!user) {
    return null; // useEffectでリダイレクトされるため
  }
  
  return (
    <div className="bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
          <div className="bg-primary text-white p-6">
            <h1 className="text-2xl font-bold">マイプロフィール</h1>
          </div>
          
          <div className="p-6">
            {error && (
              <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            )}
            {success && (
              <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">
                {success}
              </div>
            )}
            
            <div className="flex flex-col md:flex-row gap-8">
              <div className="md:w-1/3">
                <div className="flex flex-col items-center">
                  <div className="relative w-32 h-32 mb-4 bg-gray-200 rounded-full overflow-hidden">
                    {user.profile_image ? (
                      <Image 
                        src={user.profile_image} 
                        alt={user.name || 'ユーザープロフィール'} 
                        fill
                        style={{ objectFit: 'cover' }}
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full text-gray-400">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                    )}
                  </div>
                  <div className="text-center mb-6">
                    <h2 className="text-xl font-bold">{user.name || '名前未設定'}</h2>
                    <p className="text-gray-600">{user.email}</p>
                  </div>
                </div>
              </div>
              
              <div className="md:w-2/3">
                <form onSubmit={handleSubmit}>
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                        お名前
                      </label>
                      <input
                        id="name"
                        name="name"
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                        住所
                      </label>
                      <input
                        id="address"
                        name="address"
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-1">
                        自己紹介
                      </label>
                      <textarea
                        id="bio"
                        name="bio"
                        rows={4}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                      />
                    </div>
                    
                    <div className="pt-4">
                      <button
                        type="submit"
                        disabled={isUpdating}
                        className={`w-full px-4 py-2 bg-primary text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
                          isUpdating ? 'opacity-70 cursor-not-allowed' : ''
                        }`}
                      >
                        {isUpdating ? '更新中...' : 'プロフィールを更新する'}
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
        
        <div className="max-w-3xl mx-auto mt-8 bg-white rounded-lg shadow-md overflow-hidden">
          <div className="bg-primary text-white p-6">
            <h2 className="text-2xl font-bold">注文履歴</h2>
          </div>
          
          <div className="p-6">
            {ordersLoading ? (
              <div className="text-center py-8">
                <p>注文履歴を読み込み中...</p>
              </div>
            ) : orders.length > 0 ? (
              <div className="space-y-6">
                {orders.map((order) => (
                  <div key={order.id} className="border rounded-lg overflow-hidden">
                    <div className="bg-gray-50 p-4 border-b">
                      <div className="flex justify-between flex-wrap gap-2">
                        <div>
                          <p className="text-sm text-gray-500">注文番号: {order.id.slice(-8)}</p>
                          <p className="text-sm text-gray-500">注文日: {formatDate(order.created_at)}</p>
                        </div>
                        <div>
                          <span className={`inline-block px-2 py-1 rounded text-xs font-medium
                            ${order.status === 'completed' ? 'bg-green-100 text-green-800' : 
                              order.status === 'processing' ? 'bg-blue-100 text-blue-800' : 
                              order.status === 'cancelled' ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'}`}>
                            {order.status === 'completed' ? '完了' : 
                             order.status === 'processing' ? '処理中' : 
                             order.status === 'cancelled' ? 'キャンセル' : order.status}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="p-4">
                      {order.items.map((item) => (
                        <div key={item.id} className="py-2 flex justify-between border-b last:border-b-0">
                          <div>
                            <p className="font-medium">{item.name}</p>
                            <p className="text-sm text-gray-500">数量: {item.quantity}</p>
                          </div>
                          <div className="text-right">
                            <p>{formatPrice(item.price * item.quantity)}</p>
                          </div>
                        </div>
                      ))}
                      <div className="mt-4 text-right font-bold">
                        合計: {formatPrice(order.total)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-600 text-center py-8">
                注文履歴はまだありません。
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 