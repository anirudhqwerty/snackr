import * as deliveryQueries from "../db/queries/delivery.queries";

export async function getTrackingInfo(orderId: string): Promise<any> {
  const delivery = await deliveryQueries.getDeliveryByOrderId(orderId);
  if (!delivery) {
    throw new Error("Delivery not found");
  }

  const issues = await deliveryQueries.getDeliveryIssues(delivery.id);
  const rating = await deliveryQueries.getDeliveryRating(delivery.id);

  return {
    ...delivery,
    issues,
    rating,
  };
}

export async function updateDeliveryLocationCoordinates(
  orderId: string,
  latitude: number,
  longitude: number,
): Promise<any> {
  const delivery = await deliveryQueries.getDeliveryByOrderId(orderId);
  if (!delivery) {
    throw new Error("Delivery not found");
  }

  return await deliveryQueries.updateDeliveryLocation(
    delivery.id,
    latitude,
    longitude,
  );
}

export async function markDeliveryAsDelivered(orderId: string): Promise<any> {
  const delivery = await deliveryQueries.getDeliveryByOrderId(orderId);
  if (!delivery) {
    throw new Error("Delivery not found");
  }

  return await deliveryQueries.updateDeliveryStatus(delivery.id, "DELIVERED");
}

export async function submitDeliveryRating(
  orderId: string,
  customerId: string,
  rating: number,
  comment?: string,
): Promise<any> {
  const delivery = await deliveryQueries.getDeliveryByOrderId(orderId);
  if (!delivery) {
    throw new Error("Delivery not found");
  }

  return await deliveryQueries.createDeliveryRating(
    delivery.id,
    orderId,
    customerId,
    rating,
    comment,
  );
}

export async function reportDeliveryProblem(
  orderId: string,
  customerId: string,
  issueType: string,
  description?: string,
): Promise<any> {
  const delivery = await deliveryQueries.getDeliveryByOrderId(orderId);
  if (!delivery) {
    throw new Error("Delivery not found");
  }

  return await deliveryQueries.createDeliveryIssue(
    delivery.id,
    orderId,
    customerId,
    issueType,
    description,
  );
}

export async function getEstimatedArrival(
  orderId: string,
): Promise<Date | null> {
  const delivery = await deliveryQueries.getDeliveryByOrderId(orderId);
  if (!delivery) {
    throw new Error("Delivery not found");
  }

  // Simulate estimated arrival (30 minutes from now if not set)
  if (delivery.estimated_arrival) {
    return delivery.estimated_arrival;
  }

  return new Date(Date.now() + 30 * 60 * 1000); // 30 minutes from now
}
