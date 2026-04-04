// src/types/index.ts
export interface User {
  id: string;
  email: string;
  name: string;
  role: 'ADMIN' | 'MANAGER' | 'VIEWER';
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Product {
  id: string;
  name: string;
  sku: string;
  description?: string;
  categoryId: string;
  category?: Category;
  price: number;
  stockQuantity: number;
  minimumStockThreshold: number;
  status: 'ACTIVE' | 'OUT_OF_STOCK' | 'DISCONTINUED';
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  product?: Product;
  quantity: number;
  unitPrice: number;
  subtotal: number;
  createdAt: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail?: string;
  customerPhone?: string;
  totalAmount: number;
  status: 'PENDING' | 'CONFIRMED' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
  notes?: string;
  userId: string;
  user?: User;
  items: OrderItem[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateOrderData {
  customerName: string;
  customerEmail?: string;
  customerPhone?: string;
  items: {
    productId: string;
    quantity: number;
  }[];
  notes?: string;
}

export interface UpdateOrderData {
  status?: Order['status'];
  notes?: string;
}

export interface RestockQueueItem {
  id: string;
  productId: string;
  product: Product;
  currentStock: number;
  threshold: number;
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  addedAt: string;
  resolvedAt?: string;
}

export interface ActivityLog {
  id: string;
  action: string;
  actionType: string;
  entityType: string;
  entityId: string;
  userId?: string;
  user?: User;
  metadata?: any;
  createdAt: string;
}

export interface DashboardMetrics {
  totalOrdersToday: number;
  totalRevenueToday: number;
  pendingOrders: number;
  completedOrders: number;
  lowStockCount: number;
  totalProducts: number;
  recentActivities: ActivityLog[];
  revenueByDay: {
    date: string;
    revenue: number;
  }[];
}

export interface ApiResponse<T = any> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  products: { id: string; name: string; sku: string; description?: string | undefined; categoryId: string; category?: { id: string; name: string; description?: string | undefined; createdAt: string; updatedAt: string; } | undefined; price: number; stockQuantity: number; minimumStockThreshold: number; status: "ACTIVE" | "OUT_OF_STOCK" | "DISCONTINUED"; createdAt: string; updatedAt: string; }[];
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}