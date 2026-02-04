import { Request, Response } from "express";
import * as deliveryService from "../services/delivery.service";

export async function getTrackingHandler(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    const { orderId } = req.params;
    const tracking = await deliveryService.getTrackingInfo(orderId);

    res.status(200).json({
      success: true,
      data: tracking,
    });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Failed to get tracking";
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

export async function rateDeliveryHandler(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ error: "User not authenticated" });
      return;
    }

    const { orderId } = req.params;
    const { rating, comment } = req.body;

    if (!rating) {
      res.status(400).json({
        success: false,
        error: "Rating is required",
      });
      return;
    }

    const result = await deliveryService.submitDeliveryRating(
      orderId,
      req.user.userId,
      rating,
      comment,
    );

    res.status(201).json({
      success: true,
      data: result,
    });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Failed to rate delivery";
    res.status(400).json({
      success: false,
      error: message,
    });
  }
}

export async function reportIssueHandler(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ error: "User not authenticated" });
      return;
    }

    const { orderId } = req.params;
    const { issueType, description } = req.body;

    if (!issueType) {
      res.status(400).json({
        success: false,
        error: "Issue type is required",
      });
      return;
    }

    const result = await deliveryService.reportDeliveryProblem(
      orderId,
      req.user.userId,
      issueType,
      description,
    );

    res.status(201).json({
      success: true,
      data: result,
    });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Failed to report issue";
    res.status(400).json({
      success: false,
      error: message,
    });
  }
}

export async function getEstimatedArrivalHandler(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    const { orderId } = req.params;
    const estimatedArrival = await deliveryService.getEstimatedArrival(orderId);

    res.status(200).json({
      success: true,
      data: { estimatedArrival },
    });
  } catch (error: unknown) {
    const message =
      error instanceof Error
        ? error.message
        : "Failed to get estimated arrival";
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
