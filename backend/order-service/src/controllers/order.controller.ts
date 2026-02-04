import { Request, Response } from "express";
import * as orderService from "../services/order.service";

export async function createOrderHandler(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ error: "User not authenticated" });
      return;
    }

    const order = await orderService.createNewOrder(req.user.userId, req.body);

    res.status(201).json({
      success: true,
      data: order,
    });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Failed to create order";
    res.status(400).json({
      success: false,
      error: message,
    });
  }
}

export async function getUserOrdersHandler(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ error: "User not authenticated" });
      return;
    }

    const orders = await orderService.getUserOrders(req.user.userId);

    res.status(200).json({
      success: true,
      data: orders,
    });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Failed to get orders";
    res.status(500).json({
      success: false,
      error: message,
    });
  }
}

export async function getOrderHandler(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    const { id } = req.params;
    const order = await orderService.getFullOrder(id);

    res.status(200).json({
      success: true,
      data: order,
    });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Failed to get order";
    res
      .status(
        error instanceof Error && error.message.includes("not found")
          ? 404
          : 500,
      )
      .json({
        success: false,
        error: message,
      });
  }
}

export async function cancelOrderHandler(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    const { id } = req.params;
    const order = await orderService.cancelOrder(id);

    res.status(200).json({
      success: true,
      data: order,
    });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Failed to cancel order";
    res.status(400).json({
      success: false,
      error: message,
    });
  }
}

export async function getOrderStatusHandler(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    const { id } = req.params;
    const status = await orderService.getOrderStatus(id);

    res.status(200).json({
      success: true,
      data: { status },
    });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Failed to get order status";
    res
      .status(
        error instanceof Error && error.message.includes("not found")
          ? 404
          : 500,
      )
      .json({
        success: false,
        error: message,
      });
  }
}
