// src/services/product.service.ts
import api from './api';
import { Product, PaginatedResponse, ApiResponse } from '@/types';

class ProductService {
  private baseUrl = '/product';

  async getAllProducts(params?: {
    page?: number;
    limit?: number;
    search?: string;
    categoryId?: string;
    status?: string;
    lowStock?: boolean;
  }): Promise<PaginatedResponse<Product>> {
    const response = await api.get<ApiResponse<PaginatedResponse<Product>>>(`${this.baseUrl}/products`, { params });
    console.log('API response for getAllProducts:', response);
    return response.data.data;
  }

  async getProductById(id: string): Promise<Product> {
    const response = await api.get<ApiResponse<Product>>(`${this.baseUrl}/${id}`);
    return response.data.data;
  }

  async createProduct(productData: Partial<Product>): Promise<Product> {
    const response = await api.post<ApiResponse<Product>>(`${this.baseUrl}/create-product`, productData);
    return response.data.data;
  }

  async updateProduct(id: string, productData: Partial<Product>): Promise<Product> {
    const response = await api.put<ApiResponse<Product>>(`${this.baseUrl}/${id}`, productData);
    return response.data.data;
  }

  async deleteProduct(id: string): Promise<void> {
    await api.delete(`${this.baseUrl}/${id}`);
  }

  async updateStock(id: string, quantity: number): Promise<Product> {
    const response = await api.patch<ApiResponse<Product>>(`${this.baseUrl}/${id}/stock`, { quantity });
    return response.data.data;
  }

  async getLowStockProducts(): Promise<Product[]> {
    const response = await api.get(`${this.baseUrl}/low-stock`);
    return response.data.data;
  }

  async bulkUpdate(updates: { id: string; data: Partial<Product> }[]): Promise<Product[]> {
    const response = await api.post(`${this.baseUrl}/bulk-update`, { updates });
    return response.data.data;
  }
}

export default new ProductService();