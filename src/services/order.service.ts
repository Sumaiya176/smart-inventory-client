// src/services/order.service.ts
import api from './api';
import { Order, CreateOrderData, UpdateOrderData, PaginatedResponse, ApiResponse } from '@/types';

class OrderService {
  private baseUrl = '/orders';

  async getAllOrders(params?: {
    page?: number;
    limit?: number;
    status?: string;
    startDate?: string;
    endDate?: string;
    search?: string;
  }): Promise<PaginatedResponse<Order>> {
    const response = await api.get<ApiResponse<PaginatedResponse<Order>>>(this.baseUrl, { params });
    return response.data.data;
  }

  async getOrderById(id: string): Promise<Order> {
    const response = await api.get<ApiResponse<Order>>(`${this.baseUrl}/${id}`);
    return response.data.data;
  }

  async createOrder(orderData: CreateOrderData): Promise<Order> {
    const response = await api.post<ApiResponse<Order>>(this.baseUrl, orderData);
    return response.data.data;
  }

  async updateOrderStatus(id: string, status: Order['status']): Promise<Order> {
    const response = await api.patch<ApiResponse<Order>>(`${this.baseUrl}/${id}/status`, { status });
    return response.data.data;
  }

  async updateOrder(id: string, data: UpdateOrderData): Promise<Order> {
    const response = await api.patch<ApiResponse<Order>>(`${this.baseUrl}/${id}`, data);
    return response.data.data;
  }

  async cancelOrder(id: string): Promise<Order> {
    const response = await api.post<ApiResponse<Order>>(`${this.baseUrl}/${id}/cancel`);
    return response.data.data;
  }

  async deleteOrder(id: string): Promise<void> {
    await api.delete(`${this.baseUrl}/${id}`);
  }

  async getOrderStats(params?: { startDate?: string; endDate?: string }): Promise<any> {
    const response = await api.get(`${this.baseUrl}/stats`, { params });
    return response.data.data;
  }

  async getOrdersByDateRange(startDate: string, endDate: string): Promise<Order[]> {
    const response = await api.get(`${this.baseUrl}/range`, {
      params: { startDate, endDate },
    });
    return response.data.data;
  }
}

export default new OrderService();