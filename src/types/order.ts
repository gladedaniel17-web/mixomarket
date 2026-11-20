import { Product, ProductVariant } from './product';

export interface CartItem {
  id: string; // unique item id (e.g., prodId-variantId)
  productId: string;
  variantId: string;
  product: Product;
  variant: ProductVariant;
  quantity: number;
}

export interface DeliveryZone {
  id: string;
  city: 'Brazzaville' | 'Pointe-Noire';
  zoneName: string;
  deliveryFee: number; // in FCFA
  estimatedHoursMin: number;
  estimatedHoursMax: number;
}

export type PaymentMethodType = 'card' | 'mtn_momo' | 'airtel_money';

export interface OrderCustomerInfo {
  fullName: string;
  phone: string; // e.g., +242 06 xxx xx xx or 05 xxx xx xx
  email?: string;
  city: 'Brazzaville' | 'Pointe-Noire';
  zoneId: string;
  neighborhood: string;
  street?: string;
  landmark?: string;
  deliveryInstructions?: string;
}

export interface OrderSummary {
  orderNumber: string;
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  discountAmount: number;
  total: number;
  customer: OrderCustomerInfo;
  paymentMethod: PaymentMethodType;
  status: 'pending' | 'paid' | 'preparing' | 'shipped' | 'delivered';
  createdAt: string;
}
