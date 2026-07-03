export type PackageStatus =
  | 'declared'
  | 'received'
  | 'preparing'
  | 'shipped'
  | 'in_country'
  | 'out_for_delivery'
  | 'delivered';

export type DeliveryOption = 'pickup_point' | 'home';

export type PaymentMethod =
  | 'card'
  | 'apple_pay'
  | 'google_pay'
  | 'interac'
  | 'paypal'
  | 'mobile_money';

export type PaymentStatus = 'pending' | 'paid' | 'failed';

export interface User {
  id: string;
  clientId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  country: string;
  balance: number;
  loyaltyPoints: number;
  phoneVerified?: boolean;
  createdAt: string;
}

export interface TransitAddress {
  warehouseName: string;
  clientName: string;
  clientId: string;
  street: string;
  city: string;
  province: string;
  postalCode: string;
  country: string;
}

export interface PackagePhotos {
  box?: string;
  label?: string;
  content?: string;
}

export interface Package {
  id: string;
  trackingNumber: string;
  storeName: string;
  description: string;
  declaredValue: number;
  estimatedWeight: number;
  actualWeight?: number;
  dimensions?: string;
  condition?: string;
  status: PackageStatus;
  photos: PackagePhotos;
  invoicePhotos: string[];
  receivedAt?: string;
  declaredAt: string;
  deliveryOption?: DeliveryOption;
  deliveryAddress?: DeliveryAddress;
  fees?: ShippingFees;
  paymentStatus: PaymentStatus;
}

export interface DeliveryAddress {
  country: string;
  city: string;
  address: string;
  phone: string;
}

export interface ShippingFees {
  transport: number;
  storage: number;
  insurance: number;
  taxes: number;
  total: number;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'payment';
  read: boolean;
  createdAt: string;
  packageId?: string;
}

export interface PaymentRecord {
  id: string;
  packageId: string;
  amount: number;
  method: PaymentMethod;
  status: PaymentStatus;
  createdAt: string;
}

export const STATUS_LABELS: Record<PackageStatus, string> = {
  declared: 'Déclaré',
  received: 'Reçu au Canada',
  preparing: 'En préparation',
  shipped: 'Expédié',
  in_country: 'Arrivé dans le pays',
  out_for_delivery: 'En livraison',
  delivered: 'Livré',
};

export const TRACKING_STEPS: PackageStatus[] = [
  'received',
  'preparing',
  'shipped',
  'in_country',
  'out_for_delivery',
  'delivered',
];
