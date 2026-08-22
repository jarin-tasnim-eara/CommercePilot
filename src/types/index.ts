export type UserRole = "admin" | "staff";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
}

export interface Product {
  id: number;
  title: string;
  description: string;
  category: string;
  price: number;
  stock: number;
  lowStockThreshold: number;
  thumbnail: string;
  images: string[];
  brand?: string;
  status: "active" | "draft" | "archived";
  createdAt: string;
  updatedAt: string;
}

export type OrderStatus =
  "pending" | "processing" | "shipped" | "delivered" | "cancelled";

export type PaymentStatus = "paid" | "pending" | "refunded";

export interface OrderItem {
  productId: number;
  title: string;
  category: string;
  thumbnail: string;
  quantity: number;
  price: number;
}

export interface OrderTimelineEntry {
  status: OrderStatus;
  timestamp: string;
  note?: string;
}

export interface Order {
  id: string;
  customerId: string;
  customerName: string;
  items: OrderItem[];
  totalAmount: number;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  timeline: OrderTimelineEntry[];
  shippingAddress: string;
  createdAt: string;
  updatedAt: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  totalOrders: number;
  totalSpent: number;
  joinedAt: string;
  status: "active" | "inactive";
}

export interface StaffMember {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: "active" | "suspended";
  joinedAt: string;
}