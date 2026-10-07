import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000, // 15 second timeout
  withCredentials: true,
});

let clearingSession = false;

// Request cache for GET requests
const requestCache = new Map();
const CACHE_DURATION = 30000; // 30 seconds

api.interceptors.request.use((config) => {
  // Add cache key for GET requests
  if (config.method === 'get') {
    const cacheKey = `${config.url}?${JSON.stringify(config.params)}`;
    const cached = requestCache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      config.adapter = () => Promise.resolve({
        data: cached.data,
        status: 200,
        statusText: 'OK',
        headers: {},
        config,
      });
    }
  }
  
  return config;
});

api.interceptors.response.use(
  (response) => {
    // Cache GET responses
    if (response.config.method === 'get') {
      const cacheKey = `${response.config.url}?${JSON.stringify(response.config.params)}`;
      requestCache.set(cacheKey, {
        data: response.data,
        timestamp: Date.now(),
      });
    }
    return response;
  },
  async (error) => {
    const config = error.config;
    const isAuth = config?.url?.includes('/auth/');
    const transient =
      !config?.__retry &&
      isAuth &&
      (!error.response ||
        error.code === 'ECONNRESET' ||
        String(error.message).includes('ECONNRESET'));

    if (transient) {
      config.__retry = true;
      await new Promise((r) => setTimeout(r, 2000));
      return api(config);
    }

    if (error.response?.status === 401 && !isAuth && !clearingSession) {
      clearingSession = true;
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      api.post('/auth/logout').catch(() => {}).finally(() => {
        clearingSession = false;
      });
    }
    return Promise.reject(error);
  }
);

export const apiEndpoints = {
  // Content
  getSite: () => api.get('/content/site'),
  getNavigation: () => api.get('/content/navigation'),
  getFooter: () => api.get('/content/footer'),
  getCategories: () => api.get('/content/categories'),

  // Products
  getProducts: (params) => api.get('/products', { params }),
  getProduct: (id) => api.get(`/products/${id}`),
  getProductFilters: () => api.get('/products/filters/meta'),
  suggestProducts: (q) => api.get('/products/suggest', { params: { q } }),
  searchByImage: (formData) => {
    const imageApi = axios.create({
      baseURL: API_BASE_URL,
      headers: { 'Content-Type': 'multipart/form-data' },
      timeout: 30000,
      withCredentials: true,
    });
    return imageApi.post('/products/search-by-image', formData);
  },

  validatePromo: (code, subtotal) => api.post('/promo/validate', { code, subtotal }),

  // Testimonials
  getTestimonials: (params) => api.get('/testimonials', { params }),

  // Contact
  submitContact: (data) => api.post('/contact', data),

  saveGhostCart: (data) => api.post('/ghost-carts', data),
  getGhostCart: (token) => api.get(`/ghost-carts/${token}`),

  // Auth
  login: (data) => api.post('/auth/login', data),
  register: (data) => api.post('/auth/register', data),
  getMe: () => api.get('/auth/me'),
  logout: () => api.post('/auth/logout'),
  googleLogin: (data) => api.post('/auth/google', data),
  getAuthConfig: () => api.get('/auth/config'),
  sendPasswordResetOTP: (data) => api.post('/auth/send-otp', data),
  verifyPasswordResetOTP: (data) => api.post('/auth/verify-otp', data),
  resetPassword: (data) => api.post('/auth/reset-password', data),

  // User
  getProfile: () => api.get('/users/me'),
  updateProfile: (data) => api.patch('/users/me', data),
  getOrders: () => api.get('/users/me/orders'),
  getActivity: () => api.get('/users/me/activity'),
  getWishlist: () => api.get('/users/me/wishlist'),
  toggleWishlist: (productId) => api.post(`/users/me/wishlist/${productId}`),

  // Orders
  createOrder: (data) => api.post('/orders', data),
  trackOrder: (id, email) => api.get(`/orders/track/${id}`, { params: { email } }),

  // Reviews
  getProductReviews: (productId) => api.get(`/reviews/product/${productId}`),
  getMyReviews: () => api.get('/reviews/my-reviews'),
  submitReview: (data) => api.post('/reviews', data),
  updateReview: (id, data) => api.put(`/reviews/${id}`, data),
  deleteReview: (id) => api.delete(`/reviews/${id}`),

  // Page Content
  getPageContent: (key) => api.get(`/content/pages/${key}`),
  getAllPages: () => api.get('/content/pages'),
  createPage: (data) => api.post('/content/pages', data),
  updatePage: (key, data) => api.put(`/content/pages/${key}`, data),

  // Notifications
  getNotifications: () => api.get('/notifications'),
  markNotificationRead: (id) => api.patch(`/notifications/${id}/read`),
  markAllNotificationsRead: () => api.patch('/notifications/read-all'),

  // AI Chat (Gemini)
  getChatStatus: (apiKey) =>
    api.get('/chat/status', apiKey ? { headers: { 'X-Gemini-Api-Key': apiKey } } : undefined),
  validateChatKey: (apiKey) =>
    api.post('/chat/validate-key', { apiKey }, { headers: { 'X-Gemini-Api-Key': apiKey } }),
  sendChatMessage: (data, apiKey) =>
    api.post('/chat', { ...data, apiKey: apiKey || undefined }, {
      headers: apiKey ? { 'X-Gemini-Api-Key': apiKey } : undefined,
    }),

  // Admin
  getAdminStats: () => api.get('/admin/stats'),
  getAdminProducts: () => api.get('/admin/products'),
  createAdminProduct: (data) => api.post('/admin/products', data),
  updateAdminProduct: (id, data) => api.put(`/admin/products/${id}`, data),
  deleteAdminProduct: (id) => api.delete(`/admin/products/${id}`),
  getAdminOrders: () => api.get('/admin/orders'),
  updateAdminOrder: (id, data) => api.patch(`/admin/orders/${id}`, data),
  getAdminPromoCodes: () => api.get('/admin/promo-codes'),
  createAdminPromoCode: (data) => api.post('/admin/promo-codes', data),
  updateAdminPromoCode: (id, data) => api.put(`/admin/promo-codes/${id}`, data),
  deleteAdminPromoCode: (id) => api.delete(`/admin/promo-codes/${id}`),
  getAdminGiftCards: () => api.get('/admin/gift-cards'),
  updateAdminGiftCard: (id, data) => api.put(`/admin/gift-cards/${id}`, data),
  deleteAdminGiftCard: (id) => api.delete(`/admin/gift-cards/${id}`),
  getAdminLoyaltyCards: () => api.get('/admin/loyalty-cards'),
  createAdminLoyaltyCard: (data) => api.post('/admin/loyalty-cards', data),
  updateAdminLoyaltyCard: (id, data) => api.put(`/admin/loyalty-cards/${id}`, data),
  deleteAdminLoyaltyCard: (id) => api.delete(`/admin/loyalty-cards/${id}`),
  getAdminPageContent: () => api.get('/admin/page-content'),
  getAdminPageContentByKey: (key) => api.get(`/admin/page-content/${key}`),
  createAdminPageContent: (data) => api.post('/admin/page-content', data),
  updateAdminPageContent: (key, data) => api.put(`/admin/page-content/${key}`, data),
  deleteAdminPageContent: (key) => api.delete(`/admin/page-content/${key}`),
  getAdminCategories: () => api.get('/admin/categories'),
  getAdminCategory: (id) => api.get(`/admin/categories/${id}`),
  createAdminCategory: (data) => api.post('/admin/categories', data),
  updateAdminCategory: (id, data) => api.put(`/admin/categories/${id}`, data),
  deleteAdminCategory: (id) => api.delete(`/admin/categories/${id}`),

  // Categories (public)
  getCategories: () => api.get('/categories'),
  getCategoryBySlug: (slug) => api.get(`/categories/slug/${slug}`),

  // Promo Codes
  getPromoCodes: () => api.get('/promo-codes'),
  validatePromoCode: (data) => api.post('/promo-codes/validate', data),

  // Gift Cards
  getMyGiftCards: () => api.get('/gift-cards/my'),
  purchaseGiftCard: (data) => api.post('/gift-cards', data),
  checkGiftCardBalance: (id, data) => api.post(`/gift-cards/${id}/check-balance`, data),
  redeemGiftCard: (id, data) => api.post(`/gift-cards/${id}/redeem`, data),

  // Loyalty Cards
  getMyLoyaltyCard: () => api.get('/loyalty-cards/my'),
  updateMyLoyaltyCard: (id, data) => api.patch('/loyalty-cards/my', data),
  addLoyaltyPoints: (id, data) => api.post(`/loyalty-cards/${id}/add-points`, data),
  redeemLoyaltyPoints: (id, data) => api.post(`/loyalty-cards/${id}/redeem-points`, data),
  getLoyaltyTransactions: (id) => api.get(`/loyalty-cards/${id}/transactions`),

  // Forms
  submitSupplierForm: (data) => api.post('/supplier-form', data),
  submitCareerForm: (data) => api.post('/career-form', data),
  getAdminCareerApplications: () => api.get('/admin/career-applications'),
  updateAdminCareerApplication: (id, data) => api.put(`/admin/career-applications/${id}`, data),
  deleteAdminCareerApplication: (id) => api.delete(`/admin/career-applications/${id}`),
  getAdminUsers: () => api.get('/admin/users'),
  createAdminUser: (data) => api.post('/admin/users', data),
  updateAdminUser: (id, data) => api.put(`/admin/users/${id}`, data),
  deleteAdminUser: (id) => api.delete(`/admin/users/${id}`),
  getAdminMessages: (params) => api.get('/admin/messages', { params }),
  getAdminMessage: (id) => api.get(`/admin/messages/${id}`),
  updateAdminMessage: (id, data) => api.patch(`/admin/messages/${id}`, data),
  deleteAdminMessage: (id) => api.delete(`/admin/messages/${id}`),
};

export default api;
