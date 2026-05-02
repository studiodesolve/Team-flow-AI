import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? '/api' : 'http://localhost:5001/api');

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authService = {
  login: (data) => api.post('/auth/login', data),
  signup: (data) => api.post('/auth/signup', data),
};

export const projectService = {
  getAll: () => api.get('/projects'),
  getById: (id) => api.get(`/projects/${id}`),
  create: (data) => api.post('/projects', data),
  addMember: (id, data) => api.post(`/projects/${id}/members`, data),
};

export const taskService = {
  getByProject: (projectId) => api.get(`/tasks?projectId=${projectId}`),
  create: (data) => api.post('/tasks', data),
  update: (id, data) => api.patch(`/tasks/${id}`, data),
  delete: (id) => api.delete(`/tasks/${id}`),
};

export const dashboardService = {
  getStats: () => api.get('/dashboard'),
};

export const extraService = {
  getNotifications: () => api.get('/extras/notifications'),
  markRead: (id) => api.patch(`/extras/notifications/${id}/read`),
  getActivities: (projectId) => api.get(`/extras/activities/${projectId}`),
};

export default api;
