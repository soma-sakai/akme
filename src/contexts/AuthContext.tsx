'use client';

// useStateとuseEffectは使用していないため削除済み
import React, { createContext, useContext, ReactNode } from 'react';
import { useAuth, UserProfile, Order } from '@/hooks/useAuth';

interface AuthContextProps {
  user: UserProfile | null;
  loading: boolean;
  orders: Order[];
  ordersLoading: boolean;
  signUp: (email: string, password: string, name: string, address: string) => Promise<{ success: boolean; error?: string }>;
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<{ success: boolean; error?: string }>;
  updateProfile: (profile: Partial<UserProfile>) => Promise<{ success: boolean; error?: string }>;
  getOrderHistory: () => Promise<void>;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const auth = useAuth();

  return (
    <AuthContext.Provider value={auth}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
} 