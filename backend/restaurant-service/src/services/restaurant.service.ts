import * as restaurantQueries from "../db/queries/restaurant.queries";

export async function listRestaurants(limit?: number, offset?: number) {
  return await restaurantQueries.getRestaurants(limit, offset);
}

export async function getRestaurantDetails(id: string) {
  const restaurant = await restaurantQueries.getRestaurantById(id);
  if (!restaurant) {
    throw new Error("Restaurant not found");
  }
  return restaurant;
}

export async function getRestaurantMenu(id: string) {
  const restaurant = await restaurantQueries.getRestaurantById(id);
  if (!restaurant) {
    throw new Error("Restaurant not found");
  }
  return await restaurantQueries.getMenuItems(id);
}

export async function searchRestaurantsByName(searchTerm: string) {
  if (!searchTerm || searchTerm.length < 2) {
    throw new Error("Search term must be at least 2 characters");
  }
  return await restaurantQueries.searchRestaurants(searchTerm);
}

export async function getRestaurantReviews(restaurantId: string) {
  const restaurant = await restaurantQueries.getRestaurantById(restaurantId);
  if (!restaurant) {
    throw new Error("Restaurant not found");
  }
  return await restaurantQueries.getRestaurantReviews(restaurantId);
}

export async function submitRestaurantReview(
  restaurantId: string,
  userId: string,
  rating: number,
  comment?: string,
) {
  const restaurant = await restaurantQueries.getRestaurantById(restaurantId);
  if (!restaurant) {
    throw new Error("Restaurant not found");
  }
  return await restaurantQueries.createReview(
    restaurantId,
    userId,
    rating,
    comment,
  );
}
