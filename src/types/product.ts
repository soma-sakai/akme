export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  features?: string[];
  category: string;
  stock: number;
  isSubscription?: boolean;
  subscriptionPrice?: number;
  subscriptionInterval?: 'month' | 'year';
  createdAt: string;
}; 