import api from '../utils/api';

export const storefrontService = {
    getProducts: (params) => api.get('/products', { params }),
    getProduct: (slug) => api.get(`/products/${slug}`),
    getNewArrivals: () => api.get('/products/new-arrivals'),
    getFeatured: () => api.get('/products/featured'),
    getCategories: () => api.get('/categories'),
    getCollections: () => api.get('/collections'),
    getCollection: (slug) => api.get(`/collections/${slug}`),
    getHomepage: () => api.get('/homepage'),
    getPublicSettings: () => api.get('/settings/public'),
    recordEvent: (data) => api.post('/analytics/events', data),
};
