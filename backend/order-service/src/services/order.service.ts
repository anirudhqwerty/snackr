import * as orderQueries from "../db/queries/order.queries";

export interface CreateOrderRequest {
  restaurantId: string;
  items: Array<{
    menuItemId: string;
    quantity: number;
    unitPrice: number;
    specialInstructions?: string;
  }>;
  deliveryAddress: string;
  notes?: string;
  deliveryFee?: number;
}

export async function createNewOrder(
  customerId: string,
  request: CreateOrderRequest,
): Promise<any> {
  // Validate inputs
  if (!request.restaurantId || !request.items || request.items.length === 0) {
    throw new Error("Restaurant ID and items are required");
  }

  // Calculate total
  const totalAmount =
    request.items.reduce((sum, item) => {
      return sum + item.quantity * item.unitPrice;
    }, 0) + (request.deliveryFee || 0);

  // Create order
  const order = await orderQueries.createOrder(
    customerId,
    request.restaurantId,
    totalAmount,
    request.deliveryAddress,
    request.notes,
    request.deliveryFee,
  );

  // Add items to order
  for (const item of request.items) {
    await orderQueries.addOrderItem(
      order.id,
      item.menuItemId,
      item.quantity,
      item.unitPrice,
      item.specialInstructions,
    );
  }

  // Get full order with items
  return await getFullOrder(order.id);
}

export async function getFullOrder(orderId: string): Promise<any> {
  const order = await orderQueries.getOrderById(orderId);
  if (!order) {
    throw new Error("Order not found");
  }

  const items = await orderQueries.getOrderItems(orderId);

  return {
    ...order,
    items,
  };
}

export async function getUserOrders(customerId: string): Promise<any[]> {
  return await orderQueries.getCustomerOrders(customerId);
}

export async function cancelOrder(orderId: string): Promise<any> {
  const order = await orderQueries.getOrderById(orderId);
  if (!order) {
    throw new Error("Order not found");
  }

  if (order.status === "DELIVERED" || order.status === "CANCELLED") {
    throw new Error(`Cannot cancel order with status ${order.status}`);
  }

  const updated = await orderQueries.updateOrderStatus(orderId, "CANCELLED");
  const items = await orderQueries.getOrderItems(orderId);

  return {
    ...updated,
    items,
  };
}

export async function getOrderStatus(orderId: string): Promise<string> {
  const order = await orderQueries.getOrderById(orderId);
  if (!order) {
    throw new Error("Order not found");
  }

  return order.status;
}
