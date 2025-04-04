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
      currency: 'JPY'
    }).format(price);
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:scale-105">
      <Link href={`/products/${id}`}>
        <div className="relative h-64 w-full">
          <Image
            src={images[0]}
            alt={name}
            fill
            style={{ objectFit: 'cover' }}
          />
        </div>
      </Link>
      <div className="p-6">
        <Link href={`/products/${id}`}>
          <h3 className="text-xl font-bold mb-2 hover:text-primary transition">{name}</h3>
        </Link>
        <p className="text-gray-600 mb-4 line-clamp-2">
          {description}
        </p>
        <div className="flex justify-between items-center">
          <div>
            <span className="text-xl font-bold text-primary">{formatPrice(price)}</span>
            {isSubscription && (
              <div className="text-sm text-gray-600">
                サブスク: {formatPrice(subscriptionPrice || 0)}/月
              </div>
            )}
          </div>
          <Link 
            href={`/products/${id}`} 
            className="bg-primary text-white py-2 px-4 rounded hover:bg-opacity-90 transition"
          >
            詳細を見る
          </Link>
        </div>
      </div>
    </div>
  );
} 