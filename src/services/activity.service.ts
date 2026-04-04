// frontend/src/services/activity.service.ts
import api from './api';

class ActivityService {
  private baseUrl = '/activities';

  async getActivities(params?: {
    page?: number;
    limit?: number;
    actionType?: string;
    entityType?: string;
    startDate?: string;
    endDate?: string;
    search?: string;
  }) {
    const response = await api.get(this.baseUrl, { params });
    return response.data.data;
  }

  async getActivityById(id: string) {
    const response = await api.get(`${this.baseUrl}/${id}`);
    return response.data.data;
  }

  async exportActivities(params?: any) {
    const response = await api.get(`${this.baseUrl}/export`, {
      params,
      responseType: 'blob'
    });
    return response.data;
  }

  async getActivityStats(params?: {
    startDate?: string;
    endDate?: string;
  }) {
    const response = await api.get(`${this.baseUrl}/stats`, { params });
    return response.data.data;
  }
}

export default new ActivityService();