import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to attach token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('baytbd_token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Agro APIs
export const agroApi = {
  getCategories: () => api.get('/agro/categories').then(res => res.data),
  getProducts: (params?: Record<string, any>) => api.get('/agro/products', { params }).then(res => res.data),
  getProductBySlug: (slug: string) => api.get(`/agro/products/${slug}`).then(res => res.data),
  createOrder: (data: any) => api.post('/agro/orders', data).then(res => res.data),
  getAdminOrders: (params?: Record<string, any>) => api.get('/agro/admin/orders', { params }).then(res => res.data),
  updateOrderStatus: (id: string, data: any) => api.patch(`/agro/admin/orders/${id}`, data).then(res => res.data),
  createProduct: (data: any) => api.post('/agro/admin/products', data).then(res => res.data),
  updateProduct: (id: string, data: any) => api.put(`/agro/admin/products/${id}`, data).then(res => res.data),
  deleteProduct: (id: string) => api.delete(`/agro/admin/products/${id}`).then(res => res.data),
};

// Development APIs
export const devApi = {
  getProjects: (params?: Record<string, any>) => api.get('/dev/projects', { params }).then(res => res.data),
  getProjectBySlug: (slug: string) => api.get(`/dev/projects/${slug}`).then(res => res.data),
  createInquiry: (data: any) => api.post('/dev/inquiries', data).then(res => res.data),
  getAdminInquiries: () => api.get('/dev/admin/inquiries').then(res => res.data),
  createProject: (data: any) => api.post('/dev/admin/projects', data).then(res => res.data),
  updateProject: (id: string, data: any) => api.put(`/dev/admin/projects/${id}`, data).then(res => res.data),
  deleteProject: (id: string) => api.delete(`/dev/admin/projects/${id}`).then(res => res.data),
};

// IT APIs
export const itApi = {
  getServices: () => api.get('/it/services').then(res => res.data),
  getServiceBySlug: (slug: string) => api.get(`/it/services/${slug}`).then(res => res.data),
  getProjects: () => api.get('/it/projects').then(res => res.data),
  getProjectBySlug: (slug: string) => api.get(`/it/projects/${slug}`).then(res => res.data),
  createService: (data: any) => api.post('/it/admin/services', data).then(res => res.data),
  updateService: (id: string, data: any) => api.put(`/it/admin/services/${id}`, data).then(res => res.data),
  deleteService: (id: string) => api.delete(`/it/admin/services/${id}`).then(res => res.data),
  createProject: (data: any) => api.post('/it/admin/projects', data).then(res => res.data),
  updateProject: (id: string, data: any) => api.put(`/it/admin/projects/${id}`, data).then(res => res.data),
  deleteProject: (id: string) => api.delete(`/it/admin/projects/${id}`).then(res => res.data),
};

// CMS & Shared APIs
export const cmsApi = {
  getTeam: (params?: Record<string, any>) => api.get('/cms/team', { params }).then(res => res.data),
  createTeamMember: (data: any) => api.post('/cms/admin/team', data).then(res => res.data),
  updateTeamMember: (id: string, data: any) => api.put(`/cms/admin/team/${id}`, data).then(res => res.data),
  deleteTeamMember: (id: string) => api.delete(`/cms/admin/team/${id}`).then(res => res.data),

  getNews: (params?: Record<string, any>) => api.get('/cms/news', { params }).then(res => res.data),
  getNewsBySlug: (slug: string) => api.get(`/cms/news/${slug}`).then(res => res.data),
  createNews: (data: any) => api.post('/cms/admin/news', data).then(res => res.data),
  updateNews: (id: string, data: any) => api.put(`/cms/admin/news/${id}`, data).then(res => res.data),
  deleteNews: (id: string) => api.delete(`/cms/admin/news/${id}`).then(res => res.data),

  getJobs: () => api.get('/cms/jobs').then(res => res.data),
  createJob: (data: any) => api.post('/cms/admin/jobs', data).then(res => res.data),
  updateJob: (id: string, data: any) => api.put(`/cms/admin/jobs/${id}`, data).then(res => res.data),
  deleteJob: (id: string) => api.delete(`/cms/admin/jobs/${id}`).then(res => res.data),
  getJobApplications: () => api.get('/cms/admin/applications').then(res => res.data),
  updateJobApplicationStatus: (id: string, data: any) => api.patch(`/cms/admin/applications/${id}`, data).then(res => res.data),
  applyJob: (data: any) => api.post('/cms/jobs/apply', data).then(res => res.data),

  submitGeneralInquiry: (data: any) => api.post('/cms/inquiries', data).then(res => res.data),
  getAdminGeneralInquiries: (params?: Record<string, any>) => api.get('/cms/admin/inquiries', { params }).then(res => res.data),
  updateGeneralInquiryStatus: (id: string, data: any) => api.patch(`/cms/admin/inquiries/${id}`, data).then(res => res.data),

  getSettings: () => api.get('/cms/settings').then(res => res.data),
  getCompanyInfo: () => api.get('/cms/company-info').then(res => res.data),
  updateCompanyInfo: (data: any) => api.put('/cms/admin/company-info', data).then(res => res.data),
  getAdminStats: () => api.get('/cms/admin/stats').then(res => res.data),
};

// Auth APIs
export const authApi = {
  login: (data: any) => api.post('/auth/login', data).then(res => res.data),
  getMe: () => api.get('/auth/me').then(res => res.data),
};

// Upload APIs
export interface UploadResponse {
  success: boolean;
  url: string;
  publicId?: string;
  format?: string;
  originalName?: string;
  size?: number;
  width?: number;
  height?: number;
}

export const uploadApi = {
  uploadImage: (file: File): Promise<UploadResponse> => {
    const formData = new FormData();
    formData.append('image', file);
    return api.post('/upload/image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }).then(res => res.data);
  },
};

// User & Role (RBAC) APIs
export const userApi = {
  getUsers: () => api.get('/users').then(res => res.data),
  createUser: (data: any) => api.post('/users', data).then(res => res.data),
  updateUser: (id: string, data: any) => api.put(`/users/${id}`, data).then(res => res.data),
  toggleStatus: (id: string) => api.patch(`/users/${id}/status`).then(res => res.data),
  deleteUser: (id: string) => api.delete(`/users/${id}`).then(res => res.data),
};

export default api;
