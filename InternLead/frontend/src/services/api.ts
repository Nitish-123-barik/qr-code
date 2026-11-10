import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/admin/login';
    }
    return Promise.reject(error);
  }
);

export default api;

// Auth API
export const authAPI = {
  login: (data: { email: string; password: string }) =>
    api.post('/auth/login', data),
  getProfile: () => api.get('/auth/me'),
  logout: () => api.post('/auth/logout'),
};

// Student API
export const studentAPI = {
  register: (data: any) => api.post('/register', data),
  getAll: (params?: any) => api.get('/students', { params }),
  getById: (id: string) => api.get(`/students/${id}`),
  update: (id: string, data: any) => api.put(`/students/${id}`, data),
  delete: (id: string) => api.delete(`/students/${id}`),
  updateStatus: (id: string, status: string) =>
    api.put(`/students/${id}/status`, { status }),
  addNote: (id: string, note: string) =>
    api.post(`/students/${id}/notes`, { note }),
  exportCSV: (params?: any) =>
    api.get('/export/csv', { params, responseType: 'blob' }),
};

// Campaign API
export const campaignAPI = {
  getAll: () => api.get('/campaigns'),
  getById: (id: string) => api.get(`/campaigns/${id}`),
  create: (data: any) => api.post('/campaigns', data),
  update: (id: string, data: any) => api.put(`/campaigns/${id}`, data),
  delete: (id: string) => api.delete(`/campaigns/${id}`),
  toggleStatus: (id: string) => api.patch(`/campaigns/${id}/toggle-status`),
  getQRCode: (id: string) => api.get(`/campaigns/${id}/qrcode`),
};

// Analytics API
export const analyticsAPI = {
  getDashboard: () => api.get('/analytics/dashboard'),
  getRegistrationsOverTime: (days?: number) =>
    api.get('/analytics/registrations', { params: { days } }),
  getInterestDistribution: () => api.get('/analytics/interests'),
  getCampaignPerformance: () => api.get('/analytics/campaigns'),
};
