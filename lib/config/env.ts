/**
 * Environment configuration for API endpoints
 * Backend microservices running on Docker
 */

const BASE_IP = "172.16.164.170"; // ← YOUR LAPTOP IP

const AUTH_SERVICE_URL = `http://${BASE_IP}:3001`;
const USER_SERVICE_URL = `http://${BASE_IP}:3002`;
const RESTAURANT_SERVICE_URL = `http://${BASE_IP}:3003`;
const ORDER_SERVICE_URL = `http://${BASE_IP}:3004`;
const DELIVERY_SERVICE_URL = `http://${BASE_IP}:3005`;

const API_TIMEOUT = 10000; // 10 seconds

export const env = {
  authServiceUrl: AUTH_SERVICE_URL,
  userServiceUrl: USER_SERVICE_URL,
  restaurantServiceUrl: RESTAURANT_SERVICE_URL,
  orderServiceUrl: ORDER_SERVICE_URL,
  deliveryServiceUrl: DELIVERY_SERVICE_URL,
  apiTimeout: API_TIMEOUT,
  isProduction: false,
} as const;

export type Env = typeof env;
