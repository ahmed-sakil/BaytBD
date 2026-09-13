export type ThemeMode = 'corporate' | 'agro' | 'development' | 'it';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'SUPER_ADMIN' | 'ADMIN' | 'CONTENT_MANAGER' | 'ORDER_MANAGER' | 'BUSINESS_MANAGER';
  avatar?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  _count?: { products: number };
}

export interface ProductImage {
  id: string;
  imageUrl: string;
  isPrimary: boolean;
  sortOrder: number;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  sku: string;
  price: number;
  discountPrice?: number | null;
  stockQuantity: number;
  unit: string;
  description: string;
  specifications?: Record<string, any>;
  benefits?: string[];
  isFeatured: boolean;
  categoryId: string;
  category?: Category;
  images: ProductImage[];
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  deliveryAddress: string;
  city: string;
  subtotal: number;
  shippingFee: number;
  totalAmount: number;
  paymentMethod: 'COD' | 'BKASH_MANUAL' | 'NAGAD_MANUAL' | 'CARD';
  paymentStatus: 'PENDING' | 'PAID' | 'REFUNDED';
  orderStatus: 'PENDING' | 'CONFIRMED' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
  transactionId?: string;
  notes?: string;
  items: OrderItem[];
  createdAt: string;
}

export interface DevelopmentProject {
  id: string;
  title: string;
  slug: string;
  projectType: 'RESIDENTIAL' | 'COMMERCIAL' | 'SHOPPING_MALL' | 'MIXED_USE';
  status: 'UPCOMING' | 'ONGOING' | 'COMPLETED';
  location: string;
  city: string;
  landArea?: string;
  numberOfFloors?: string;
  units?: string;
  parking?: string;
  completionDate?: string;
  featuredImage: string;
  description: string;
  features?: string[];
  facilities?: string[];
  isFeatured: boolean;
  images: { id: string; imageUrl: string; caption?: string; category: string }[];
}

export interface ITService {
  id: string;
  title: string;
  slug: string;
  shortDesc: string;
  fullDesc: string;
  iconName: string;
  features?: string[];
  technologies?: string[];
  isFeatured: boolean;
}

export interface ITProject {
  id: string;
  title: string;
  slug: string;
  industry: string;
  clientName?: string;
  technologies?: string[];
  featuredImage: string;
  summary: string;
  challenges?: string;
  solutions?: string;
  results?: string;
  liveUrl?: string;
  isFeatured: boolean;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  department: 'EXECUTIVE' | 'AGRO' | 'DEVELOPMENT' | 'IT' | 'CORPORATE';
  bio?: string;
  image?: string;
  skills?: string[];
  socials?: { linkedin?: string; email?: string };
}

export interface NewsArticle {
  id: string;
  title: string;
  slug: string;
  category: string;
  content: string;
  excerpt: string;
  featuredImage: string;
  publishedAt: string;
}

export interface JobPost {
  id: string;
  title: string;
  slug: string;
  department: string;
  location: string;
  employmentType: string;
  description: string;
  requirements?: string[];
  benefits?: string[];
  deadline?: string;
}
