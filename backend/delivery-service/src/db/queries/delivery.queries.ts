import { QueryResult } from "pg";
import { pool } from "../index";

export type DeliveryStatus = "ASSIGNED" | "IN_TRANSIT" | "DELIVERED" | "FAILED";

export interface Delivery {
  id: string;
  order_id: string;
  delivery_person_id: string | null;
  status: DeliveryStatus;
  current_latitude: number | null;
  current_longitude: number | null;
  estimated_arrival: Date | null;
  actual_arrival: Date | null;
  created_at: Date;
  updated_at: Date;
}

export interface DeliveryRating {
  id: string;
  delivery_id: string;
  order_id: string;
  customer_id: string;
  rating: number;
  comment: string | null;
  created_at: Date;
}

export interface DeliveryIssue {
  id: string;
  delivery_id: string;
  order_id: string;
  customer_id: string;
  issue_type: string | null;
  description: string | null;
  resolved: boolean;
  created_at: Date;
  updated_at: Date;
}

// Delivery Queries

export async function createDelivery(orderId: string): Promise<Delivery> {
  const query = `
    INSERT INTO deliveries (order_id, status)
    VALUES ($1, 'ASSIGNED')
    RETURNING id, order_id, delivery_person_id, status, current_latitude, current_longitude, estimated_arrival, actual_arrival, created_at, updated_at
  `;

  try {
    const result: QueryResult<Delivery> = await pool.query(query, [orderId]);
    return result.rows[0];
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(`Failed to create delivery: ${error.message}`);
    }
    throw error;
  }
}

export async function getDeliveryByOrderId(
  orderId: string,
): Promise<Delivery | null> {
  const query = `
    SELECT id, order_id, delivery_person_id, status, current_latitude, current_longitude, estimated_arrival, actual_arrival, created_at, updated_at
    FROM deliveries
    WHERE order_id = $1
  `;

  try {
    const result: QueryResult<Delivery> = await pool.query(query, [orderId]);
    return result.rows.length > 0 ? result.rows[0] : null;
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(`Failed to get delivery: ${error.message}`);
    }
    throw error;
  }
}

export async function getDeliveryById(
  deliveryId: string,
): Promise<Delivery | null> {
  const query = `
    SELECT id, order_id, delivery_person_id, status, current_latitude, current_longitude, estimated_arrival, actual_arrival, created_at, updated_at
    FROM deliveries
    WHERE id = $1
  `;

  try {
    const result: QueryResult<Delivery> = await pool.query(query, [deliveryId]);
    return result.rows.length > 0 ? result.rows[0] : null;
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(`Failed to get delivery: ${error.message}`);
    }
    throw error;
  }
}

export async function updateDeliveryLocation(
  deliveryId: string,
  latitude: number,
  longitude: number,
): Promise<Delivery> {
  const query = `
    UPDATE deliveries
    SET current_latitude = $1, current_longitude = $2
    WHERE id = $3
    RETURNING id, order_id, delivery_person_id, status, current_latitude, current_longitude, estimated_arrival, actual_arrival, created_at, updated_at
  `;

  try {
    const result: QueryResult<Delivery> = await pool.query(query, [
      latitude,
      longitude,
      deliveryId,
    ]);

    if (result.rows.length === 0) {
      throw new Error("Delivery not found");
    }

    return result.rows[0];
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(`Failed to update delivery location: ${error.message}`);
    }
    throw error;
  }
}

export async function updateDeliveryStatus(
  deliveryId: string,
  status: DeliveryStatus,
): Promise<Delivery> {
  let query = `
    UPDATE deliveries
    SET status = $1`;

  const values: any[] = [status, deliveryId];

  if (status === "DELIVERED") {
    query += `, actual_arrival = CURRENT_TIMESTAMP`;
  }

  query += ` WHERE id = $2
    RETURNING id, order_id, delivery_person_id, status, current_latitude, current_longitude, estimated_arrival, actual_arrival, created_at, updated_at`;

  try {
    const result: QueryResult<Delivery> = await pool.query(query, values);

    if (result.rows.length === 0) {
      throw new Error("Delivery not found");
    }

    return result.rows[0];
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(`Failed to update delivery status: ${error.message}`);
    }
    throw error;
  }
}

// Rating Queries

export async function createDeliveryRating(
  deliveryId: string,
  orderId: string,
  customerId: string,
  rating: number,
  comment?: string,
): Promise<DeliveryRating> {
  if (rating < 1 || rating > 5) {
    throw new Error("Rating must be between 1 and 5");
  }

  const query = `
    INSERT INTO delivery_ratings (delivery_id, order_id, customer_id, rating, comment)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING id, delivery_id, order_id, customer_id, rating, comment, created_at
  `;

  try {
    const result: QueryResult<DeliveryRating> = await pool.query(query, [
      deliveryId,
      orderId,
      customerId,
      rating,
      comment || null,
    ]);

    return result.rows[0];
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(`Failed to create rating: ${error.message}`);
    }
    throw error;
  }
}

export async function getDeliveryRating(
  deliveryId: string,
): Promise<DeliveryRating | null> {
  const query = `
    SELECT id, delivery_id, order_id, customer_id, rating, comment, created_at
    FROM delivery_ratings
    WHERE delivery_id = $1
  `;

  try {
    const result: QueryResult<DeliveryRating> = await pool.query(query, [
      deliveryId,
    ]);
    return result.rows.length > 0 ? result.rows[0] : null;
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(`Failed to get rating: ${error.message}`);
    }
    throw error;
  }
}

// Issue Queries

export async function createDeliveryIssue(
  deliveryId: string,
  orderId: string,
  customerId: string,
  issueType: string,
  description?: string,
): Promise<DeliveryIssue> {
  const query = `
    INSERT INTO delivery_issues (delivery_id, order_id, customer_id, issue_type, description)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING id, delivery_id, order_id, customer_id, issue_type, description, resolved, created_at, updated_at
  `;

  try {
    const result: QueryResult<DeliveryIssue> = await pool.query(query, [
      deliveryId,
      orderId,
      customerId,
      issueType,
      description || null,
    ]);

    return result.rows[0];
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(`Failed to create issue report: ${error.message}`);
    }
    throw error;
  }
}

export async function getDeliveryIssues(
  deliveryId: string,
): Promise<DeliveryIssue[]> {
  const query = `
    SELECT id, delivery_id, order_id, customer_id, issue_type, description, resolved, created_at, updated_at
    FROM delivery_issues
    WHERE delivery_id = $1
    ORDER BY created_at DESC
  `;

  try {
    const result: QueryResult<DeliveryIssue> = await pool.query(query, [
      deliveryId,
    ]);
    return result.rows;
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(`Failed to get issues: ${error.message}`);
    }
    throw error;
  }
}
