import { QueryResult } from "pg";
import { pool } from "../index";

export type OrderStatus =
  | "CREATED"
  | "ACCEPTED"
  | "PREPARING"
  | "PICKED_UP"
  | "DELIVERED"
  | "CANCELLED";

export interface Order {
  id: string;
  customer_id: string;
  restaurant_id: string;
  delivery_id: string | null;
  status: OrderStatus;
  total_amount: number;
  delivery_address: string;
  delivery_fee: number | null;
  notes: string | null;
  created_at: Date;
  updated_at: Date;
}

export interface OrderItem {
  id: string;
  order_id: string;
  menu_item_id: string;
  quantity: number;
  unit_price: number;
  subtotal: number;
  special_instructions: string | null;
  created_at: Date;
}

export async function createOrder(
  customerId: string,
  restaurantId: string,
  totalAmount: number,
  deliveryAddress: string,
  notes?: string,
  deliveryFee?: number,
): Promise<Order> {
  const query = `
    INSERT INTO orders (customer_id, restaurant_id, total_amount, delivery_address, notes, delivery_fee, status)
    VALUES ($1, $2, $3, $4, $5, $6, 'CREATED')
    RETURNING id, customer_id, restaurant_id, delivery_id, status, total_amount, delivery_address, delivery_fee, notes, created_at, updated_at
  `;

  try {
    const result: QueryResult<Order> = await pool.query(query, [
      customerId,
      restaurantId,
      totalAmount,
      deliveryAddress,
      notes || null,
      deliveryFee || 0,
    ]);

    return result.rows[0];
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(`Failed to create order: ${error.message}`);
    }
    throw error;
  }
}

export async function addOrderItem(
  orderId: string,
  menuItemId: string,
  quantity: number,
  unitPrice: number,
  specialInstructions?: string,
): Promise<OrderItem> {
  const subtotal = quantity * unitPrice;
  const query = `
    INSERT INTO order_items (order_id, menu_item_id, quantity, unit_price, subtotal, special_instructions)
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING id, order_id, menu_item_id, quantity, unit_price, subtotal, special_instructions, created_at
  `;

  try {
    const result: QueryResult<OrderItem> = await pool.query(query, [
      orderId,
      menuItemId,
      quantity,
      unitPrice,
      specialInstructions || null,
    ]);

    return result.rows[0];
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(`Failed to add order item: ${error.message}`);
    }
    throw error;
  }
}

export async function getOrderById(orderId: string): Promise<Order | null> {
  const query = `
    SELECT id, customer_id, restaurant_id, delivery_id, status, total_amount, delivery_address, delivery_fee, notes, created_at, updated_at
    FROM orders
    WHERE id = $1
  `;

  try {
    const result: QueryResult<Order> = await pool.query(query, [orderId]);
    return result.rows.length > 0 ? result.rows[0] : null;
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(`Failed to get order: ${error.message}`);
    }
    throw error;
  }
}

export async function getOrderItems(orderId: string): Promise<OrderItem[]> {
  const query = `
    SELECT id, order_id, menu_item_id, quantity, unit_price, subtotal, special_instructions, created_at
    FROM order_items
    WHERE order_id = $1
    ORDER BY created_at ASC
  `;

  try {
    const result: QueryResult<OrderItem> = await pool.query(query, [orderId]);
    return result.rows;
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(`Failed to get order items: ${error.message}`);
    }
    throw error;
  }
}

export async function getCustomerOrders(customerId: string): Promise<Order[]> {
  const query = `
    SELECT id, customer_id, restaurant_id, delivery_id, status, total_amount, delivery_address, delivery_fee, notes, created_at, updated_at
    FROM orders
    WHERE customer_id = $1
    ORDER BY created_at DESC
  `;

  try {
    const result: QueryResult<Order> = await pool.query(query, [customerId]);
    return result.rows;
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(`Failed to get customer orders: ${error.message}`);
    }
    throw error;
  }
}

export async function updateOrderStatus(
  orderId: string,
  status: OrderStatus,
): Promise<Order> {
  const query = `
    UPDATE orders
    SET status = $1
    WHERE id = $2
    RETURNING id, customer_id, restaurant_id, delivery_id, status, total_amount, delivery_address, delivery_fee, notes, created_at, updated_at
  `;

  try {
    const result: QueryResult<Order> = await pool.query(query, [
      status,
      orderId,
    ]);

    if (result.rows.length === 0) {
      throw new Error("Order not found");
    }

    return result.rows[0];
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(`Failed to update order status: ${error.message}`);
    }
    throw error;
  }
}

export async function assignDelivery(
  orderId: string,
  deliveryId: string,
): Promise<Order> {
  const query = `
    UPDATE orders
    SET delivery_id = $1
    WHERE id = $2
    RETURNING id, customer_id, restaurant_id, delivery_id, status, total_amount, delivery_address, delivery_fee, notes, created_at, updated_at
  `;

  try {
    const result: QueryResult<Order> = await pool.query(query, [
      deliveryId,
      orderId,
    ]);

    if (result.rows.length === 0) {
      throw new Error("Order not found");
    }

    return result.rows[0];
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(`Failed to assign delivery: ${error.message}`);
    }
    throw error;
  }
}
