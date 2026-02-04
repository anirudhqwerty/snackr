/**
 * Environment configuration for API endpoints
 * Backend microservices running on Docker
 */

// Backend service URLs (running on localhost)
const AUTH_SERVICE_URL = "http://localhost:3001";
const USER_SERVICE_URL = "http://localhost:3002";
const RESTAURANT_SERVICE_URL = "http://localhost:3003";
const ORDER_SERVICE_URL = "http://localhost:3004";
const DELIVERY_SERVICE_URL = "http://localhost:3005";

const API_TIMEOUT = 10000; // 10 seconds

export const env = {
  // Service URLs
  authServiceUrl: AUTH_SERVICE_URL,
  userServiceUrl: USER_SERVICE_URL,
  restaurantServiceUrl: RESTAURANT_SERVICE_URL,
  orderServiceUrl: ORDER_SERVICE_URL,
  deliveryServiceUrl: DELIVERY_SERVICE_URL,

  // Configuration
  apiTimeout: API_TIMEOUT,
  isProduction: process.env.NODE_ENV === "production",
} as const;

export type Env = typeof env;
