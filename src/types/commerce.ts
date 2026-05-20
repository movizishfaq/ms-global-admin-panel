export type PaymentMethodKey = 'cod' | 'card' | 'jazzcash';

export interface CatalogProduct {
  id: string;
  name: string;
  priceRp: number;
  category: string;
  image: string;
  description: string;
  active: boolean;
}

export interface OrderLineSnapshot {
  productId: string;
  name: string;
  quantity: number;
  unitPriceRp: number;
  lineTotalRp: number;
}

export interface OrderRecord {
  id: string;
  createdAt: string;
  customerName: string;
  customerEmail: string;
  paymentMethod: PaymentMethodKey;
  items: OrderLineSnapshot[];
  subtotalRp: number;
  taxRp: number;
  shippingRp: number;
  totalRp: number;
}

export interface PaymentToggles {
  cod: boolean;
  card: boolean;
  jazzcash: boolean;
}
