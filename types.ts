
export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  image: string;
  category: string;
  stock?: number;
  isVisible?: boolean;
  originalPrice?: number;
}

export interface DiscountCode {
  id: string;
  code: string;
  type: 'percentage' | 'fixed';
  value: number;
  minOrderValue?: number;
  active: boolean;
}

export interface CartItem extends Product {
  quantity: number;
}

export type OrderStatus = 'offen' | 'in Bearbeitung' | 'versandt' | 'abgeschlossen';

export interface CustomerInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  address: string;
  zip: string;
  city: string;
}

export interface Customer extends CustomerInfo {
  id: string;
  createdAt: string;
}

export interface Order {
  id: string;
  date: string;
  customer: CustomerInfo;
  items: CartItem[];
  total: number;
  status: OrderStatus;
}

export interface CustomPage {
  id: string;
  title: string;
  slug: string;
  content: string;
  inMenu: boolean;
  inFooter: boolean;
  productIds?: string[];
}

export interface ShopSettings {
  logoText: string;
  logoSubText: string;
  logoImage?: string;
  shopTitle?: string;
  shopSubtitle?: string;
  primaryColor?: string;
  secondaryColor?: string;
  backgroundColor?: string;
  fontFamily?: string;
  borderRadius?: 'none' | 'small' | 'medium' | 'large' | 'full';
  buttonStyle?: 'solid' | 'outline' | 'ghost';
}

export interface User {
  id: string;
  username: string;
  password: string;
  role: 'admin' | 'mitarbeiter';
  name: string;
  email?: string;
  phone?: string;
}

export interface NewsletterSubscriber {
  id: string;
  email: string;
  subscribedAt: string;
  active: boolean;
}

export interface EmailSettings {
  smtpHost: string;
  smtpPort: number;
  smtpUser: string;
  smtpPass: string;
  senderEmail: string;
  senderName: string;
}

export interface Review {
  id: string;
  productId: string;
  customerName: string;
  customerEmail: string;
  rating: number;
  comment: string;
  date: string;
  verified: boolean;
}

export type View = 'shop' | 'cart' | 'checkout' | 'success' | 'admin' | 'admin-login' | string;
