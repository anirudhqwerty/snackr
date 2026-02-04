/**
 * TypeScript interfaces for API requests and responses
 */

// Auth Interfaces
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}

export interface RegisterRequest {
  email: string;
  password: string;
  role?: string;
}

export interface RegisterResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface RefreshTokenResponse {
  accessToken: string;
}

// User Interfaces
export interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  avatar?: string;
  bio?: string;
  addresses?: Address[];
  createdAt: string;
  updatedAt: string;
}

export interface Address {
  id: string;
  label?: string;
  streetAddress: string;
  city: string;
  state?: string;
  postalCode: string;
  country: string;
  latitude?: number;
  longitude?: number;
  isDefault?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface UpdateUserRequest {
  firstName?: string;
  lastName?: string;
  phone?: string;
  bio?: string;
}

export interface UpdateUserResponse {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  bio?: string;
}

// Restaurant Interfaces
export interface Restaurant {
  id: string;
  name: string;
  description: string;
  imageUrl?: string;
  rating: number;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface RestaurantListResponse {
  restaurants: Restaurant[];
  total: number;
  page?: number;
  pageSize?: number;
}

export interface RestaurantDetailsResponse {
  restaurant: Restaurant;
}

export interface MenuItem {
  id: string;
  restaurantId: string;
  name: string;
  description: string;
  price: number;
  imageUrl?: string;
  category: string;
  isAvailable: boolean;
  createdAt?: string;
  updatedAt?: string;
}

// Cart & Order Interfaces
export interface CartItem {
  menuItemId: string;
  quantity: number;
  specialInstructions?: string;
}

export interface Cart {
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  tax: number;
  total: number;
}

export interface CreateOrderRequest {
  restaurantId: string;
  items: CartItem[];
  deliveryAddress: Address;
  notes?: string;
  deliveryFee?: number;
}

export interface Order {
  id: string;
  customerId?: string;
  restaurantId: string;
  items: OrderItem[];
  status: OrderStatus;
  deliveryAddress: string;
  totalAmount: number;
  deliveryFee?: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  id: string;
  menuItemId: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
  specialInstructions?: string;
}

export type OrderStatus =
  | "CREATED"
  | "ACCEPTED"
  | "PREPARING"
  | "PICKED_UP"
  | "DELIVERED"
  | "CANCELLED";

export interface CreateOrderResponse {
  order: Order;
}

export interface OrderListResponse {
  orders: Order[];
  total?: number;
  page?: number;
  pageSize?: number;
}

// Delivery Interfaces
export interface DeliveryTracking {
  orderId: string;
  deliveryId?: string;
  status: "ASSIGNED" | "IN_TRANSIT" | "DELIVERED" | "FAILED";
  currentLatitude?: number;
  currentLongitude?: number;
  estimatedArrival?: string;
  actualArrival?: string;
  rating?: number;
  issues?: {
    id: string;
    issueType: string;
    description: string;
    resolved: boolean;
    createdAt: string;
  }[];
}

// Pagination
export interface PaginationParams {
  page?: number;
  limit?: number;
  offset?: number;
}

// API Error Response
export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, string>;
}

// Pagination
export interface PaginationParams {
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}
