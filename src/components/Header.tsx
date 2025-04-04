'use client';

import Link from 'next/link';
import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { useAuthContext } from '@/contexts/AuthContext';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  const { user, signOut } = useAuthContext();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <Link href="/" className="font-bold text-2xl text-primary">
            Akamee
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            <Link 
              href="/" 
              className={`hover:text-primary transition ${pathname === '/' ? 'text-primary' : 'text-gray-700'}`}
            >
              ホーム
            </Link>
            <Link 
              href="/products" 
              className={`hover:text-primary transition ${pathname.startsWith('/products') ? 'text-primary' : 'text-gray-700'}`}
            >
              商品一覧
            </Link>
            <Link 
              href="/about" 
              className={`hover:text-primary transition ${pathname === '/about' ? 'text-primary' : 'text-gray-700'}`}
            >
              会社概要
            </Link>
            <Link 
              href="/terms" 
              className={`hover:text-primary transition ${pathname === '/terms' ? 'text-primary' : 'text-gray-700'}`}
            >
              利用規約
            </Link>
            <Link 
              href="/privacy" 
              className={`hover:text-primary transition ${pathname === '/privacy' ? 'text-primary' : 'text-gray-700'}`}
            >
              プライバシーポリシー
            </Link>
          </nav>

          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <>
                <Link 
                  href="/profile" 
                  className="text-gray-700 hover:text-primary transition flex items-center"
                >
                  <span className="mr-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </span>
                  {user.name || 'マイページ'}
                </Link>
                <button 
                  onClick={handleSignOut}
                  className="text-gray-700 hover:text-primary transition"
                >
                  ログアウト
                </button>
              </>
            ) : (
              <>
                <Link 
                  href="/login" 
                  className="text-gray-700 hover:text-primary transition"
                >
                  ログイン
                </Link>
                <Link 
                  href="/register" 
                  className="bg-primary text-white px-4 py-2 rounded hover:bg-opacity-90 transition"
                >
                  会員登録
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button 
            className="md:hidden text-gray-700"
            onClick={toggleMenu}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pt-4 border-t border-gray-200">
            <nav className="flex flex-col space-y-4">
              <Link 
                href="/" 
                className={`hover:text-primary transition ${pathname === '/' ? 'text-primary' : 'text-gray-700'}`}
                onClick={() => setIsMenuOpen(false)}
              >
                ホーム
              </Link>
              <Link 
                href="/products" 
                className={`hover:text-primary transition ${pathname.startsWith('/products') ? 'text-primary' : 'text-gray-700'}`}
                onClick={() => setIsMenuOpen(false)}
              >
                商品一覧
              </Link>
              <Link 
                href="/about" 
                className={`hover:text-primary transition ${pathname === '/about' ? 'text-primary' : 'text-gray-700'}`}
                onClick={() => setIsMenuOpen(false)}
              >
                会社概要
              </Link>
              <Link 
                href="/terms" 
                className={`hover:text-primary transition ${pathname === '/terms' ? 'text-primary' : 'text-gray-700'}`}
                onClick={() => setIsMenuOpen(false)}
              >
                利用規約
              </Link>
              <Link 
                href="/privacy" 
                className={`hover:text-primary transition ${pathname === '/privacy' ? 'text-primary' : 'text-gray-700'}`}
                onClick={() => setIsMenuOpen(false)}
              >
                プライバシーポリシー
              </Link>
              <div className="flex flex-col space-y-2">
                {user ? (
                  <>
                    <Link 
                      href="/profile" 
                      className="text-gray-700 hover:text-primary transition flex items-center"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <span className="mr-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </span>
                      {user.name || 'マイページ'}
                    </Link>
                    <button 
                      onClick={() => {
                        handleSignOut();
                        setIsMenuOpen(false);
                      }}
                      className="text-gray-700 hover:text-primary transition text-left"
                    >
                      ログアウト
                    </button>
                  </>
                ) : (
                  <>
                    <Link 
                      href="/login" 
                      className="text-gray-700 hover:text-primary transition"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      ログイン
                    </Link>
                    <Link 
                      href="/register" 
                      className="bg-primary text-white px-4 py-2 rounded hover:bg-opacity-90 transition text-center"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      会員登録
                    </Link>
                  </>
                )}
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
} 