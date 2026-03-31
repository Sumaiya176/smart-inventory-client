// src/services/category.service.ts
import api from './api';
import { Category, ApiResponse } from '@/types';

class CategoryService {
  private baseUrl = '/category';

  async getAllCategories(): Promise<Category[]> {
    const response = await api.get<ApiResponse<Category[]>>(`${this.baseUrl}/categories`);
    return response.data.data;
  }

  async getCategoryById(id: string): Promise<Category> {
    const response = await api.get<ApiResponse<Category>>(`${this.baseUrl}/${id}`);
    return response.data.data;
  }

  async createCategory(data: { name: string; description?: string }): Promise<Category> {
    const response = await api.post<ApiResponse<Category>>(`${this.baseUrl}/create-category`, data);
    return response.data.data;
  }

  async updateCategory(id: string, data: Partial<Category>): Promise<Category> {
    const response = await api.put<ApiResponse<Category>>(`${this.baseUrl}/${id}`, data);
    return response.data.data;
  }

  async deleteCategory(id: string): Promise<void> {
    await api.delete(`${this.baseUrl}/${id}`);
  }
}

export default new CategoryService();