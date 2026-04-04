// src/services/dashboard.service.ts
import api from './api';
import { DashboardMetrics, ActivityLog, ApiResponse } from '@/types';

class DashboardService {
  private baseUrl = '/dashboard';

  async getMetrics(params?: {
    date?: string;
    startDate?: string;
    endDate?: string;
  }): Promise<DashboardMetrics> {
    const response = await api.get<ApiResponse<DashboardMetrics>>(`${this.baseUrl}/metrics`, { params });
    console.log('Fetched dashboard metrics:', response.data.data);
    return response.data.data;
  }

  async getRecentActivities(limit: number = 10): Promise<ActivityLog[]> {
    const response = await api.get<ApiResponse<ActivityLog[]>>(`${this.baseUrl}/activities`, {
      params: { limit },
    });
    console.log('Fetched recent activities:', response.data.data);
    return response.data.data;
  }

  async getRevenueChart(days: number = 7): Promise<{ date: string; revenue: number }[]> {
    const response = await api.get(`${this.baseUrl}/revenue-chart`, {
      params: { days },
    });

    console.log("Fetched revenue chart data:", response.data.data);
    return response.data.data;
  }

  async getOrderStatusStats(): Promise<{
    pending: number;
    confirmed: number;
    shipped: number;
    delivered: number;
    cancelled: number;
  }> {
    const response = await api.get(`${this.baseUrl}/order-stats`);
    return response.data.data;
  }

  async getTopProducts(limit: number = 5): Promise<any[]> {
    const response = await api.get(`${this.baseUrl}/top-products`, {
      params: { limit },
    });
    return response.data.data;
  }

  async getLowStockSummary(): Promise<any[]> {
    const response = await api.get(`${this.baseUrl}/low-stock-summary`);
    return response.data.data;
  }

  async getRevenueByCategory(): Promise<any[]> {
    const response = await api.get(`${this.baseUrl}/revenue-by-category`);
    return response.data.data;
  }
}

export default new DashboardService();