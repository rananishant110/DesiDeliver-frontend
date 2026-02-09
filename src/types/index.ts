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
  first_name: string;
  last_name: string;
  business_name: string;
  phone_number: string;
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

// Delivery Tracking Types
export interface DeliveryPersonnel {
  id: number;
  user: UserBasic;
  employee_id: string;
  phone_number: string;
  vehicle_type: VehicleType;
  vehicle_number: string;
  license_number: string;
  status: DriverStatus;
  current_latitude?: number;
  current_longitude?: number;
  last_location_update?: string;
  total_deliveries: number;
  successful_deliveries: number;
  average_rating: number;
  created_at: string;
  updated_at: string;
}

export interface DeliveryPersonnelList {
  id: number;
  user: UserBasic;
  employee_id: string;
  phone_number: string;
  vehicle_type: VehicleType;
  vehicle_number: string;
  status: DriverStatus;
  total_deliveries: number;
  average_rating: number;
}

export interface DeliveryRoute {
  id: number;
  latitude: number;
  longitude: number;
  speed?: number;
  recorded_at: string;
}

export interface DeliveryStatusHistory {
  id: number;
  status: DeliveryStatus;
  notes: string;
  changed_by: number;
  changed_by_name: string;
  timestamp: string;
}

export interface DeliveryTracking {
  id: number;
  order: Order;
  driver?: DeliveryPersonnelList;
  status: DeliveryStatus;
  pickup_latitude: number;
  pickup_longitude: number;
  delivery_latitude: number;
  delivery_longitude: number;
  current_latitude?: number;
  current_longitude?: number;
  assigned_at: string;
  picked_up_at?: string;
  delivered_at?: string;
  estimated_delivery_time?: string;
  total_distance?: number;
  delivery_notes: string;
  proof_of_delivery_photo?: string;
  customer_signature?: string;
  customer_rating?: number;
  customer_feedback: string;
  status_history: DeliveryStatusHistory[];
  route_points: DeliveryRoute[];
  created_at: string;
  updated_at: string;
}

export interface DeliveryTrackingList {
  id: number;
  order: number;
  order_number: string;
  customer_name: string;
  driver?: DeliveryPersonnelList;
  status: DeliveryStatus;
  current_latitude?: number;
  current_longitude?: number;
  assigned_at: string;
  estimated_delivery_time?: string;
  delivered_at?: string;
}

export interface LocationUpdate {
  latitude: number;
  longitude: number;
  speed?: number;
}

export interface DeliveryProof {
  notes?: string;
  proof_photo?: File;
  signature?: File;
}

export interface CustomerFeedback {
  rating: number;
  feedback?: string;
}

export interface CreateDeliveryTrackingData {
  order_id: number;
  driver_id?: number;
  pickup_latitude: number;
  pickup_longitude: number;
  delivery_latitude: number;
  delivery_longitude: number;
  estimated_delivery_time?: string;
}

export type DeliveryStatus = 
  | 'assigned' 
  | 'picked_up' 
  | 'in_transit' 
  | 'nearby' 
  | 'delivered' 
  | 'failed' 
  | 'cancelled';

export type DriverStatus = 'available' | 'on_delivery' | 'off_duty';

export type VehicleType = 'bike' | 'scooter' | 'car' | 'van' | 'truck';

export interface DeliveryStats {
  total_deliveries: number;
  active_deliveries: number;
  completed_today: number;
  by_status: {
    assigned: number;
    picked_up: number;
    in_transit: number;
    nearby: number;
    delivered: number;
    failed: number;
    cancelled: number;
  };
  average_delivery_time: number;
  on_time_percentage: number;
}

