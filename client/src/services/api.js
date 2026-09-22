// API Service with seamless backend integration and resilient fallbacks

const API_BASE_URL = '/api';

export const api = {
  // Menu APIs
  async getMenu(params = {}) {
    const query = new URLSearchParams();
    if (params.category && params.category !== 'All') query.append('category', params.category);
    if (params.search) query.append('search', params.search);
    if (params.vegOnly) query.append('vegOnly', 'true');

    const res = await fetch(`${API_BASE_URL}/menu?${query.toString()}`);
    if (!res.ok) throw new Error('Failed to load menu items');
    return res.json();
  },

  async getCategories() {
    const res = await fetch(`${API_BASE_URL}/menu/categories`);
    if (!res.ok) throw new Error('Failed to load categories');
    return res.json();
  },

  // Auth APIs
  async login(email, password) {
    const res = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Login failed');
    return data;
  },

  async register(userData) {
    const res = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Registration failed');
    return data;
  },

  async getProfile(token) {
    const res = await fetch(`${API_BASE_URL}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (!res.ok) throw new Error('Failed to get user profile');
    return res.json();
  },

  // Order APIs
  async createOrder(orderPayload, token) {
    const headers = { 'Content-Type': 'application/json' };
    if (token) headers.Authorization = `Bearer ${token}`;

    const res = await fetch(`${API_BASE_URL}/orders`, {
      method: 'POST',
      headers,
      body: JSON.stringify(orderPayload)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to place order');
    return data;
  },

  async getOrderById(orderId) {
    const res = await fetch(`${API_BASE_URL}/orders/${orderId}`);
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Order not found');
    return data;
  },

  async getUserOrders(token) {
    const res = await fetch(`${API_BASE_URL}/orders/user/history`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to fetch your orders');
    return data;
  },

  // Admin APIs
  async getAllOrders(token) {
    const res = await fetch(`${API_BASE_URL}/orders/admin/all`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to fetch restaurant orders');
    return data;
  },

  async updateOrderStatus(orderId, status, token) {
    const res = await fetch(`${API_BASE_URL}/orders/admin/${orderId}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ status })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to update order status');
    return data;
  },

  async createMenuItem(itemData, token) {
    const res = await fetch(`${API_BASE_URL}/menu`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(itemData)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to create menu item');
    return data;
  },

  async updateMenuItem(id, itemData, token) {
    const res = await fetch(`${API_BASE_URL}/menu/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(itemData)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to update menu item');
    return data;
  },

  async deleteMenuItem(id, token) {
    const res = await fetch(`${API_BASE_URL}/menu/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to delete menu item');
    return data;
  },

  async getReports(params = {}, token) {
    const query = new URLSearchParams(params);
    const res = await fetch(`${API_BASE_URL}/orders/admin/reports?${query.toString()}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to fetch reports');
    return data;
  }
};
