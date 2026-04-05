// frontend/src/services/restockQueue.service.ts
import api from './api';

class RestockQueueService {
  private baseUrl = '/restock-queue';

  async getQueue(params?: {
    page?: number;
    limit?: number;
    priority?: string;
  }) {
    const response = await api.get(this.baseUrl, { params });
    return response.data.data;
  }

  async getQueueItem(id: string) {
    const response = await api.get(`${this.baseUrl}/${id}`);
    return response.data.data;
  }

  async updateStock(productId: string, quantity: number) {
    const response = await api.patch(`${this.baseUrl}/update-stock/${productId}`, { quantity });
    return response.data.data;
  }

  async removeFromQueue(itemId: string) {
    const response = await api.delete(`${this.baseUrl}/${itemId}`);
    return response.data;
  }

  async bulkRestock(itemIds: string[], quantity: number) {
    const response = await api.post(`${this.baseUrl}/bulk-restock`, { itemIds, quantity });
    return response.data.data;
  }

  async getStats() {
    const response = await api.get(`${this.baseUrl}/stats`);
    return response.data.data;
  }

  async getHistory(params?: {
    page?: number;
    limit?: number;
    startDate?: string;
    endDate?: string;
  }) {
    const response = await api.get(`${this.baseUrl}/history`, { params });
    return response.data.data;
  }
}

export default new RestockQueueService();