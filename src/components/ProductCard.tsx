import Image from 'next/image';
import Link from 'next/link';
import { Product } from '@/types/product';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { id, name, description, price, images, isSubscription, subscriptionPrice } = product;
  
  // 価格をフォーマットする関数
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ja-JP', {
      style: 'currency',
      currency: 'JPY',
      minimumFractionDigits: 0
    }).format(price);
  };

  // プロダクトIDを安全に処理
  const safeId = id || 'unknown';
  
  // 画像URLの安全な取得
  const imageUrl = images && images.length > 0 
    ? images[0] 
    : 'https://via.placeholder.com/400x400?text=No+Image';

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:scale-105">
      <Link href={`/products/${safeId}`}>
        <div className="relative h-64 w-full">
          <Image
            src={imageUrl}
            alt={name || '商品'}
            fill
            className="object-cover"
          />
        </div>
      </Link>
      <div className="p-6">
        <Link href={`/products/${safeId}`}>
          <h3 className="text-xl font-bold mb-2 hover:text-primary transition">{name || '商品名なし'}</h3>
        </Link>
        <p className="text-gray-600 mb-4 line-clamp-2">
          {description || '説明なし'}
        </p>
        <div className="flex justify-between items-center">
          <div>
            <span className="text-xl font-bold text-primary">{formatPrice(price || 0)}</span>
            {isSubscription && (
              <div className="text-sm text-gray-600">
                サブスク: {formatPrice(subscriptionPrice || 0)}/月
              </div>
            )}
          </div>
          <Link 
            href={`/products/${safeId}`} 
            className="bg-primary text-white py-2 px-4 rounded hover:bg-opacity-90 transition"
          >
            詳細を見る
          </Link>
        </div>
      </div>
    </div>
  );
} 