import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white">
      <div className="container mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">Akamee</h3>
            <p className="text-gray-300">
              高品質な商品をお届けする日本のECサイトです。お客様の満足を第一に考え、丁寧な対応を心がけております。
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-bold mb-4">ナビゲーション</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-300 hover:text-white transition">
                  ホーム
                </Link>
              </li>
              <li>
                <Link href="/products" className="text-gray-300 hover:text-white transition">
                  商品一覧
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-300 hover:text-white transition">
                  会社概要
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-bold mb-4">会員情報</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/login" className="text-gray-300 hover:text-white transition">
                  ログイン
                </Link>
              </li>
              <li>
                <Link href="/register" className="text-gray-300 hover:text-white transition">
                  会員登録
                </Link>
              </li>
              <li>
                <Link href="/profile" className="text-gray-300 hover:text-white transition">
                  マイページ
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-bold mb-4">法的情報</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/terms" className="text-gray-300 hover:text-white transition">
                  利用規約
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-gray-300 hover:text-white transition">
                  プライバシーポリシー
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-300 hover:text-white transition">
                  お問い合わせ
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} Akamee. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
} 