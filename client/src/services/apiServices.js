import api from '../utils/api';

export const authService = {
    login: (email, password) => api.post('/admin/auth/login', { email, password }),
    logout: () => api.post('/admin/auth/logout'),
    getMe: () => api.get('/admin/auth/me'),
};

export const productService = {
    getAll: (params) => api.get('/admin/products', { params }),
    getById: (id) => api.get(`/admin/products/${id}`),
    create: (data) => api.post('/admin/products', data),
    update: (id, data) => api.put(`/admin/products/${id}`, data),
    softDelete: (id) => api.delete(`/admin/products/${id}`),
    restore: (id) => api.patch(`/admin/products/${id}/restore`),
    permanentDelete: (id) => api.delete(`/admin/products/${id}/permanent`),
    uploadImage: (formData) => api.post('/admin/products/upload-image', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    }),
};

export const categoryService = {
    getAll: () => api.get('/admin/categories'),
    create: (data) => api.post('/admin/categories', data),
    update: (id, data) => api.put(`/admin/categories/${id}`, data),
    delete: (id) => api.delete(`/admin/categories/${id}`),
};

export const collectionService = {
    getAll: () => api.get('/admin/collections'),
    create: (data) => api.post('/admin/collections', data),
    update: (id, data) => api.put(`/admin/collections/${id}`, data),
    delete: (id) => api.delete(`/admin/collections/${id}`),
};

export const homepageService = {
    get: () => api.get('/admin/homepage'),
    update: (data) => api.put('/admin/homepage', data),
};

export const settingsService = {
    get: () => api.get('/admin/settings'),
    update: (data) => api.put('/admin/settings', data),
};

export const analyticsService = {
    getOverview: () => api.get('/admin/analytics/overview'),
    getProducts: () => api.get('/admin/analytics/products'),
    getCollections: () => api.get('/admin/analytics/collections'),
    getMostEnquired: () => api.get('/admin/analytics/most-enquired'),
    getEvents: (params) => api.get('/admin/analytics/events', { params }),
    getTrafficSources: () => api.get('/admin/analytics/traffic-sources'),
    getSizeColorBreakdown: () => api.get('/admin/analytics/size-color-breakdown'),
};

export const imageService = {
    upload: (formData) => api.post('/admin/products/upload-image', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    }),
};

export const publicService = {
    getCategories: () => api.get('/categories'),
    getCollections: () => api.get('/collections'),
    getProducts: (params) => api.get('/products', { params }),
};
