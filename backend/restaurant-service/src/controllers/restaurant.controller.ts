import { Request, Response } from "express";
import * as restaurantService from "../services/restaurant.service";

export async function listRestaurantsHandler(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    const limit = req.query.limit
      ? parseInt(req.query.limit as string, 10)
      : 20;
    const offset = req.query.offset
      ? parseInt(req.query.offset as string, 10)
      : 0;

    const restaurants = await restaurantService.listRestaurants(limit, offset);

    res.status(200).json({
      success: true,
      data: restaurants,
    });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Failed to list restaurants";
    res.status(500).json({
      success: false,
      error: message,
    });
  }
}

export async function getRestaurantHandler(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    const { id } = req.params;
    const restaurant = await restaurantService.getRestaurantDetails(id);

    res.status(200).json({
      success: true,
      data: restaurant,
    });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Failed to get restaurant";
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

export async function getMenuHandler(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    const { id } = req.params;
    const menu = await restaurantService.getRestaurantMenu(id);

    res.status(200).json({
      success: true,
      data: menu,
    });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Failed to get menu";
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

export async function searchHandler(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    const { q } = req.query;

    if (!q) {
      res.status(400).json({
        success: false,
        error: "Search query parameter is required",
      });
      return;
    }

    const restaurants = await restaurantService.searchRestaurantsByName(
      q as string,
    );

    res.status(200).json({
      success: true,
      data: restaurants,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Search failed";
    res.status(400).json({
      success: false,
      error: message,
    });
  }
}

export async function getReviewsHandler(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    const { id } = req.params;
    const reviews = await restaurantService.getRestaurantReviews(id);

    res.status(200).json({
      success: true,
      data: reviews,
    });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Failed to get reviews";
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

export async function createReviewHandler(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ error: "User not authenticated" });
      return;
    }

    const { id } = req.params;
    const { rating, comment } = req.body;

    if (!rating) {
      res.status(400).json({
        success: false,
        error: "Rating is required",
      });
      return;
    }

    const review = await restaurantService.submitRestaurantReview(
      id,
      req.user.userId,
      rating,
      comment,
    );

    res.status(201).json({
      success: true,
      data: review,
    });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Failed to create review";
    res.status(400).json({
      success: false,
      error: message,
    });
  }
}
