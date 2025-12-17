import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { 
  LoginCredentials, 
  RegisterData, 
  User, 
  Product, 
  Category, 
  Cart, 
  CartItem, 
  Order,
  CreateOrderData,
  OrderSummary,
  OrderStats,
  AuthResponse,
  ApiResponse,
  PaginatedResponse,
  Ticket,
  TicketListItem,
  CreateTicketData,
  AddCommentData,
  UpdateTicketStatusData,
  UpdateTicketPriorityData,
  TicketStats
} from '../types';

// API Configuration
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000/api';

// Create axios instance
const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const refreshToken = localStorage.getItem('refresh_token');
        if (refreshToken) {
          const response = await axios.post(`${API_BASE_URL}/auth/refresh/`, {
            refresh: refreshToken
          });
          
          const { access } = response.data;
          localStorage.setItem('access_token', access);
          
          originalRequest.headers.Authorization = `Bearer ${access}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        // Refresh failed, redirect to login
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
    }
    
    return Promise.reject(error);
  }
);

// Authentication API
export const authAPI = {
  // User registration
  register: async (data: RegisterData): Promise<AuthResponse> => {
    const response: AxiosResponse<AuthResponse> = await api.post('/auth/register/', data);
    return response.data;
  },

  // User login
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response: AxiosResponse<AuthResponse> = await api.post('/auth/login/', credentials);
    return response.data;
  },

  // User logout
  logout: async (): Promise<ApiResponse<null>> => {
    const response: AxiosResponse<ApiResponse<null>> = await api.post('/auth/logout/');
    return response.data;
  },

  // Get user profile
  getProfile: async (): Promise<User> => {
    const response: AxiosResponse<User> = await api.get('/auth/profile/');
    return response.data;
  },

  // Update user profile
  updateProfile: async (data: Partial<User>): Promise<User> => {
    const response: AxiosResponse<User> = await api.patch('/auth/profile/', data);
    return response.data;
  },

  // Change password
  changePassword: async (oldPassword: string, newPassword: string): Promise<ApiResponse<null>> => {
    const response: AxiosResponse<ApiResponse<null>> = await api.post('/auth/change-password/', {
      old_password: oldPassword,
      new_password: newPassword
    });
    return response.data;
  },
};

// Products API
export const productsAPI = {
  // Get all products with pagination and filters
  getProducts: async (params: {
    page?: number;
    page_size?: number;
    category?: number | null;
    in_stock?: boolean | null;
    search?: string;
    ordering?: string;
  } = {}): Promise<PaginatedResponse<Product>> => {
    const urlParams = new URLSearchParams();
    if (params.page) urlParams.append('page', params.page.toString());
    if (params.page_size) urlParams.append('page_size', params.page_size.toString());
    if (params.category) urlParams.append('category', params.category.toString());
    if (params.in_stock !== null && params.in_stock !== undefined) urlParams.append('in_stock', params.in_stock.toString());
    if (params.search) urlParams.append('search', params.search);
    if (params.ordering) urlParams.append('ordering', params.ordering);
    
    const response: AxiosResponse<PaginatedResponse<Product>> = await api.get(`/products/?${urlParams}`);
    return response.data;
  },

  // Get single product
  getProduct: async (id: number): Promise<Product> => {
    const response: AxiosResponse<Product> = await api.get(`/products/${id}/`);
    return response.data;
  },

  // Get all categories
  getCategories: async (): Promise<PaginatedResponse<Category>> => {
    const response: AxiosResponse<PaginatedResponse<Category>> = await api.get('/products/categories/');
    return response.data;
  },

  // Search products
  searchProducts: async (params: {
    search: string;
    category?: number | null;
    in_stock?: boolean | null;
    page?: number;
    page_size?: number;
    ordering?: string;
  }): Promise<PaginatedResponse<Product>> => {
    const urlParams = new URLSearchParams();
    urlParams.append('search', params.search);
    if (params.category) urlParams.append('category', params.category.toString());
    if (params.in_stock !== null && params.in_stock !== undefined) urlParams.append('in_stock', params.in_stock.toString());
    if (params.page) urlParams.append('page', params.page.toString());
    if (params.page_size) urlParams.append('page_size', params.page_size.toString());
    if (params.ordering) urlParams.append('ordering', params.ordering);
    
    const response: AxiosResponse<PaginatedResponse<Product>> = await api.get(`/products/search/?${urlParams}`);
    return response.data;
  },
};

// Cart API
export const cartAPI = {
  // Get user's cart
  getCart: async (): Promise<Cart> => {
    const response: AxiosResponse<Cart> = await api.get('/cart/');
    return response.data;
  },

  // Add item to cart
  addToCart: async (productId: number, quantity: number): Promise<Cart> => {
    const response: AxiosResponse<Cart> = await api.post('/cart/add/', {
      product_id: productId,
      quantity
    });
    return response.data;
  },

  // Update cart item quantity
  updateCartItem: async (itemId: number, quantity: number): Promise<Cart> => {
    const response: AxiosResponse<Cart> = await api.put(`/cart/items/${itemId}/update/`, {
      quantity
    });
    return response.data;
  },

  // Remove item from cart
  removeFromCart: async (itemId: number): Promise<Cart> => {
    const response: AxiosResponse<Cart> = await api.delete(`/cart/items/${itemId}/remove/`);
    return response.data;
  },

  // Clear cart
  clearCart: async (): Promise<Cart> => {
    const response: AxiosResponse<Cart> = await api.delete('/cart/clear/');
    return response.data;
  },
};

// Orders API
export const ordersAPI = {
  // Create new order from cart
  createOrder: async (orderData: CreateOrderData): Promise<Order> => {
    const response = await api.post('/orders/create/', orderData);
    return response.data.order;
  },

  // Get user's orders with pagination
  getOrders: async (page: number = 1, pageSize: number = 10, status?: string): Promise<{
    orders: OrderSummary[];
    pagination: {
      page: number;
      page_size: number;
      total_orders: number;
      total_pages: number;
    };
  }> => {
    const params = new URLSearchParams({
      page: page.toString(),
      page_size: pageSize.toString(),
    });
    if (status) {
      params.append('status', status);
    }
    const response = await api.get(`/orders/list/?${params}`);
    return response.data;
  },

  // Get specific order details
  getOrder: async (orderId: number): Promise<Order> => {
    const response = await api.get(`/orders/${orderId}/`);
    return response.data;
  },

  // Cancel an order
  cancelOrder: async (orderId: number): Promise<Order> => {
    const response = await api.post(`/orders/${orderId}/cancel/`);
    return response.data.order;
  },

  // Get order statistics
  getOrderStats: async (): Promise<OrderStats> => {
    const response = await api.get('/orders/stats/');
    return response.data;
  },

  // CSV download methods
  downloadOrderCSV: (orderId: number): string => {
    return `${api.defaults.baseURL}/orders/${orderId}/csv/`;
  },

  downloadOrdersSummaryCSV: (): string => {
    return `${api.defaults.baseURL}/orders/summary/csv/`;
  },

  downloadDailyOrdersCSV: (date?: string): string => {
    const baseUrl = `${api.defaults.baseURL}/orders/daily/csv/`;
    return date ? `${baseUrl}?date=${date}` : baseUrl;
  },

  // Staff dashboard methods
  getOrdersForStaff: async (params: {
    page: number;
    page_size: number;
    status?: string;
    date?: string;
    search?: string;
  }): Promise<any> => {
    const queryParams = new URLSearchParams({
      page: params.page.toString(),
      page_size: params.page_size.toString(),
    });
    
    if (params.status) queryParams.append('status', params.status);
    if (params.date) queryParams.append('date', params.date);
    if (params.search) queryParams.append('search', params.search);
    
    const response = await api.get(`/orders/staff/?${queryParams}`);
    return response.data;
  },

  bulkProcessOrders: async (data: {
    order_ids: number[];
    action: string;
    notes?: string;
  }): Promise<any> => {
    const response = await api.post('/orders/bulk-process/', data);
    return response.data;
  },

  // Update order status (for staff)
  updateOrderStatus: async (orderId: number, data: {
    status: string;
    notes?: string;
  }): Promise<any> => {
    const response = await api.patch(`/orders/${orderId}/status/`, data);
    return response.data;
  },
};

// ========================================
// Tickets API
// ========================================
export const ticketsAPI = {
  // Create a new support ticket
  createTicket: async (data: CreateTicketData): Promise<Ticket> => {
    const response = await api.post('/tickets/', data);
    return response.data;
  },

  // Get list of tickets with filtering
  getTickets: async (params: {
    page?: number;
    page_size?: number;
    status?: string;
    priority?: string;
    category?: string;
    search?: string;
  } = {}): Promise<PaginatedResponse<TicketListItem>> => {
    const queryParams = new URLSearchParams();
    
    if (params.page) queryParams.append('page', params.page.toString());
    if (params.page_size) queryParams.append('page_size', params.page_size.toString());
    if (params.status) queryParams.append('status', params.status);
    if (params.priority) queryParams.append('priority', params.priority);
    if (params.category) queryParams.append('category', params.category);
    if (params.search) queryParams.append('search', params.search);
    
    const response = await api.get(`/tickets/?${queryParams}`);
    return response.data;
  },

  // Get detailed ticket information
  getTicketDetail: async (ticketId: number): Promise<Ticket> => {
    const response = await api.get(`/tickets/${ticketId}/`);
    return response.data;
  },

  // Add a comment to a ticket
  addTicketComment: async (ticketId: number, data: AddCommentData): Promise<any> => {
    const response = await api.post(`/tickets/${ticketId}/comments/`, data);
    return response.data;
  },

  // Update ticket status (staff only)
  updateTicketStatus: async (ticketId: number, data: UpdateTicketStatusData): Promise<Ticket> => {
    const response = await api.patch(`/tickets/${ticketId}/status/`, data);
    return response.data;
  },

  // Update ticket priority (staff only)
  updateTicketPriority: async (ticketId: number, data: UpdateTicketPriorityData): Promise<Ticket> => {
    const response = await api.patch(`/tickets/${ticketId}/priority/`, data);
    return response.data;
  },

  // Get ticket statistics (staff only)
  getTicketStats: async (): Promise<TicketStats> => {
    const response = await api.get('/tickets/stats/');
    return response.data;
  },
};

export default api;
