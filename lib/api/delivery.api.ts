/**
 * Delivery tracking API endpoints
 * Handles real-time delivery status and tracking
 */

import axios from "axios";
import { env } from "../config/env";
import type { DeliveryTracking } from "../types";
import { getAccessToken } from "./client";

const createAuthHeaders = () => ({
  Authorization: `Bearer ${getAccessToken()}`,
});

/**
 * Get delivery tracking for an order
 * @param orderId Order ID
 * @returns Delivery tracking information
 */
export async function getDeliveryTracking(
  orderId: string,
): Promise<DeliveryTracking> {
  const response = await axios.get<DeliveryTracking>(
    `${env.deliveryServiceUrl}/delivery/${orderId}/tracking`,
    { timeout: env.apiTimeout },
  );
  return response.data;
}

/**
 * Get delivery person contact information
 * @param orderId Order ID
 * @returns Delivery person contact details
 */
export async function getDeliveryPersonContact(orderId: string): Promise<any> {
  const response = await axios.get(
    `${env.deliveryServiceUrl}/delivery/${orderId}/contact`,
    { timeout: env.apiTimeout },
  );
  return response.data;
}

/**
 * Rate delivery person
 * @param orderId Order ID
 * @param rating Rating (1-5)
 * @param comment Optional feedback
 * @returns Review response
 */
export async function rateDelivery(
  orderId: string,
  rating: number,
  comment?: string,
): Promise<any> {
  const response = await axios.post(
    `${env.deliveryServiceUrl}/delivery/${orderId}/rate`,
    { rating, comment },
    {
      timeout: env.apiTimeout,
      headers: createAuthHeaders(),
    },
  );
  return response.data;
}

/**
 * Report delivery issue
 * @param orderId Order ID
 * @param issueType Type of issue
 * @param description Issue description
 * @returns Issue report response
 */
export async function reportDeliveryIssue(
  orderId: string,
  issueType: string,
  description: string,
): Promise<any> {
  const response = await axios.post(
    `${env.deliveryServiceUrl}/delivery/${orderId}/report`,
    { issue_type: issueType, description },
    {
      timeout: env.apiTimeout,
      headers: createAuthHeaders(),
    },
  );
  return response.data;
}

/**
 * Get estimated arrival time
 * @param orderId Order ID
 * @returns Estimated arrival information
 */
export async function getEstimatedArrival(orderId: string): Promise<any> {
  const response = await axios.get(
    `${env.deliveryServiceUrl}/delivery/${orderId}/estimated-arrival`,
    { timeout: env.apiTimeout },
  );
  return response.data;
}

/**
 * Update delivery preferences (e.g., leave at door, ring doorbell)
 * @param orderId Order ID
 * @param preferences Delivery preferences
 * @returns Updated preferences
 */
export async function updateDeliveryPreferences(
  orderId: string,
  preferences: {
    leaveAtDoor?: boolean;
    ringDoorbell?: boolean;
    specialInstructions?: string;
  },
): Promise<any> {
  const response = await axios.patch(
    `${env.deliveryServiceUrl}/delivery/${orderId}/preferences`,
    preferences,
    {
      timeout: env.apiTimeout,
      headers: createAuthHeaders(),
    },
  );
  return response.data;
}
