/**
 * Order API endpoints
 * Handles order creation, retrieval, and management
 */

import axios from "axios";
import { env } from "../config/env";
import type {
    CreateOrderRequest,
    CreateOrderResponse,
    Order,
    OrderListResponse,
    PaginationParams,
} from "../types";
import { getAccessToken } from "./client";

const createAuthHeaders = () => ({
  Authorization: `Bearer ${getAccessToken()}`,
});

/**
 * Create new order
 * @param orderData Order creation data
 * @returns Created order with payment URL if applicable
 */
export async function createOrder(
  orderData: CreateOrderRequest,
): Promise<CreateOrderResponse> {
  const response = await axios.post<CreateOrderResponse>(
    `${env.orderServiceUrl}/orders`,
    orderData,
    {
      timeout: env.apiTimeout,
      headers: createAuthHeaders(),
    },
  );
  return response.data;
}

/**
 * Get user's order history
 * @param params Pagination and filter parameters
 * @returns List of orders with pagination info
 */
export async function getUserOrders(
  params?: PaginationParams,
): Promise<OrderListResponse> {
  const response = await axios.get<OrderListResponse>(
    `${env.orderServiceUrl}/orders`,
    {
      timeout: env.apiTimeout,
      params,
      headers: createAuthHeaders(),
    },
  );
  return response.data;
}

/**
 * Get order details by ID
 * @param orderId Order ID
 * @returns Order information
 */
export async function getOrderDetails(orderId: string): Promise<Order> {
  const response = await axios.get<Order>(
    `${env.orderServiceUrl}/orders/${orderId}`,
    {
      timeout: env.apiTimeout,
      headers: createAuthHeaders(),
    },
  );
  return response.data;
}

/**
 * Cancel order
 * @param orderId Order ID to cancel
 * @param reason Cancellation reason
 * @returns Updated order
 */
export async function cancelOrder(
  orderId: string,
  reason?: string,
): Promise<Order> {
  const response = await axios.post<Order>(
    `${env.orderServiceUrl}/orders/${orderId}/cancel`,
    { reason },
    {
      timeout: env.apiTimeout,
      headers: createAuthHeaders(),
    },
  );
  return response.data;
}

/**
 * Get order status
 * @param orderId Order ID
 * @returns Order status information
 */
export async function getOrderStatus(orderId: string): Promise<any> {
  const response = await axios.get(
    `${env.orderServiceUrl}/orders/${orderId}/status`,
    {
      timeout: env.apiTimeout,
      headers: createAuthHeaders(),
    },
  );
  return response.data;
}

/**
 * Estimate order delivery time
 * @param restaurantId Restaurant ID
 * @param itemCount Number of items
 * @returns Estimated delivery time in minutes
 */
export async function estimateDeliveryTime(
  restaurantId: string,
  itemCount: number,
): Promise<{ estimatedTime: number }> {
  const response = await axios.get<{ estimatedTime: number }>(
    `${env.orderServiceUrl}/orders/estimate-delivery`,
    {
      timeout: env.apiTimeout,
      params: {
        restaurantId,
        itemCount,
      },
      headers: createAuthHeaders(),
    },
  );
  return response.data;
}

/**
 * Apply coupon to order
 * @param couponCode Coupon code
 * @returns Discount details
 */
export async function applyCoupon(couponCode: string): Promise<any> {
  const response = await axios.post(
    `${env.orderServiceUrl}/orders/apply-coupon`,
    { code: couponCode },
    {
      timeout: env.apiTimeout,
      headers: createAuthHeaders(),
    },
  );
  return response.data;
}

/**
 * Repeat previous order
 * @param orderId Original order ID
 * @returns New order created from previous order
 */
export async function repeatOrder(
  orderId: string,
): Promise<CreateOrderResponse> {
  const response = await axios.post<CreateOrderResponse>(
    `${env.orderServiceUrl}/orders/${orderId}/repeat`,
    {},
    {
      timeout: env.apiTimeout,
      headers: createAuthHeaders(),
    },
  );
  return response.data;
}
