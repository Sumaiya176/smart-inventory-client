// src/services/auth.service.ts
import api from './api';

const authService = {
  async login(email: string, password: string) {
    const response = await api.post('/user/login', { email, password });
    return response.data;
  },

  async signup(email: string, password: string, name: string) {
    const response = await api.post('/user/register', { email, password, name });
    return response.data;
  },

  async logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  async getCurrentUser() {
    const response = await api.get('/auth/me');
    return response.data;
  },
};

export default authService;