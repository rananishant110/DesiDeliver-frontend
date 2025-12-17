// User Types
export interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  business_name: string;
  business_type: 'restaurant' | 'store' | 'other';
  phone_number: string;
  address_line1: string;
  address_line2?: string;
  city: string;
  state: string;
  zip_code: string;
  tax_id?: string;
  business_license?: string;
  is_verified: boolean;
  is_staff: boolean;
  created_at: string;
  updated_at: string;
}

// Product Types
export interface Category {
  id: number;
  name: string;
  description: string;
  slug: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Product {
  id: number;
  item_code: string;
  name: string;
  description: string;
  category: Category;
  unit: string;
  min_order_quantity: number;
  in_stock: boolean;
  stock_quantity: number;
  brand?: string;
  origin?: string;
  weight?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// Cart Types
export interface CartItem {
  id: number;
  product: Product;
  quantity: number; // Integer quantity
  added_at: string;
  updated_at: string;
}

export interface Cart {
  id: number;
  user: number;
  items: CartItem[];
  total_items: number;
  total_quantity: number;
  created_at: string;
  updated_at: string;
  is_active: boolean;
}

// Order Types
export interface OrderItem {
  id: number;
  product: Product;
  quantity: number; // Integer quantity
}

export interface Order {
  id: number;
  order_number: string;
  customer: User;
  status: string;
  status_display: string;
  total_items: number;
  delivery_address: string;
  delivery_instructions: string;
  preferred_delivery_date: string | null;
  actual_delivery_date: string | null;
  business_name: string;
  contact_person: string;
  phone_number: string;
  notes?: string;
  created_at: string;
  updated_at: string;
  items: OrderItem[];
  can_cancel: boolean;
  can_be_updated?: boolean;
}

export interface CreateOrderData {
  delivery_address: string;
  delivery_instructions?: string;
  preferred_delivery_date?: string;
  business_name: string;
  contact_person: string;
  phone_number: string;
}

export interface OrderSummary {
  id: number;
  order_number: string;
  status: string;
  status_display: string;
  total_items: number;
  business_name: string;
  created_at: string;
  item_count: number;
}

export interface OrderStats {
  total_orders: number;
  pending_orders: number;
  confirmed_orders: number;
  processing_orders: number;
  ready_orders: number;
  delivered_orders: number;
  cancelled_orders: number;
  total_items_ordered: number;
}

// Authentication Types
export interface LoginCredentials {
  username: string;
  password: string;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
  password_confirm: string;
  first_name: string;
  last_name: string;
  business_name: string;
  business_type: 'restaurant' | 'store' | 'other';
  phone_number: string;
  address_line1: string;
  address_line2?: string;
  city: string;
  state: string;
  zip_code: string;
}

export interface AuthResponse {
  message: string;
  user: User;
  access_token: string;
  refresh_token: string;
}

// API Response Types
export interface ApiResponse<T> {
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  count: number;
  next?: string;
  previous?: string;
  results: T[];
}

// Ticket Types
export interface UserBasic {
  id: number;
  username: string;
  email: string;
  business_name: string;
  is_staff: boolean;
}

export interface OrderBasic {
  id: number;
  order_number: string;
  status: string;
  created_at: string;
}

export interface TicketComment {
  id: number;
  ticket: number;
  author: UserBasic;
  comment: string;
  is_staff_comment: boolean;
  created_at: string;
}

export interface TicketHistory {
  id: number;
  ticket: number;
  changed_by: UserBasic;
  field_changed: string;
  old_value: string;
  new_value: string;
  change_reason: string;
  created_at: string;
}

export interface Ticket {
  id: number;
  ticket_number: string;
  customer: UserBasic;
  order?: OrderBasic;
  subject: string;
  description: string;
  category: TicketCategory;
  priority: TicketPriority;
  priority_display: string;
  status: TicketStatus;
  status_display: string;
  created_at: string;
  updated_at: string;
  resolved_at?: string;
  closed_at?: string;
  comments: TicketComment[];
  history: TicketHistory[];
  can_update: boolean;
}

export interface TicketListItem {
  id: number;
  ticket_number: string;
  customer: UserBasic;
  order?: OrderBasic;
  subject: string;
  category: string;
  priority: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export type TicketStatus = 'open' | 'in_progress' | 'resolved' | 'closed';
export type TicketPriority = 'low' | 'medium' | 'high' | 'urgent';
export type TicketCategory = 'order_issue' | 'product_quality' | 'delivery' | 'billing' | 'technical' | 'other';

export interface CreateTicketData {
  subject: string;
  description: string;
  category: TicketCategory;
  priority: TicketPriority;
  order_id?: number;
}

export interface UpdateTicketStatusData {
  status: TicketStatus;
  reason?: string;
}

export interface UpdateTicketPriorityData {
  priority: TicketPriority;
  reason?: string;
}

export interface AddCommentData {
  comment: string;
}

export interface TicketStats {
  total_tickets: number;
  open_tickets: number;
  recent_tickets: number;
  by_status: {
    open: number;
    in_progress: number;
    resolved: number;
    closed: number;
  };
  by_priority: {
    low: number;
    medium: number;
    high: number;
    urgent: number;
  };
  by_category: {
    order_issue: number;
    product_quality: number;
    delivery: number;
    billing: number;
    technical: number;
    other: number;
  };
}
