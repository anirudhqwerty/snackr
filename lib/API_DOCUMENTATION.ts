/**
 * API ABSTRACTION LAYER - DOCUMENTATION
 *
 * This document explains the frontend API architecture for the Snackr App MVP.
 */

/**
 * STRUCTURE
 *
 * lib/
 * ├── api/
 * │   ├── client.ts          - Axios HTTP client with interceptors
 * │   ├── auth.api.ts        - Authentication endpoints (login, register, logout)
 * │   ├── user.api.ts        - User profile and address management
 * │   ├── restaurant.api.ts  - Restaurant browsing and details
 * │   ├── order.api.ts       - Order creation and history
 * │   ├── delivery.api.ts    - Real-time delivery tracking
 * │   └── index.ts           - Re-exports for convenient importing
 * ├── config/
 * │   └── env.ts             - Environment configuration and API URLs
 * └── types/
 *     ├── index.ts           - All TypeScript interfaces for API
 *     └── exports.ts         - Re-exports for convenience
 */

/**
 * KEY FEATURES
 */

/*
  1. JWT-Based Authentication
     - Tokens stored in memory via setTokens() and clearTokens()
     - Automatic token injection in Authorization header
     - Token refresh interceptor (placeholder for implementation)

  2. No Real API Calls
     - All functions have empty function bodies
     - Return types are defined but no data returned
     - Ready for backend implementation

  3. Full TypeScript Support
     - Every request and response has interfaces
     - Type-safe parameters and returns
     - IDE autocompletion support

  4. Centralized Error Handling
     - Axios interceptors handle 401 responses
     - Automatic token refresh logic (to implement)
     - Error propagation to UI components

  5. Clean Separation of Concerns
     - API layer isolated from UI
     - UI doesn't know about HTTP internals
     - Easy to swap HTTP client if needed
*/

/**
 * USAGE EXAMPLES
 */

// BEFORE (screens had inline placeholder functions):
/*
  async function loginUser(email: string, password: string) {
    // Backend integration later
  }

  const handleLogin = async () => {
    setLoading(true);
    try {
      await loginUser(email, password);
      router.push("/(tabs)");
    } catch (error) {
      Alert.alert("Login Failed", "Please try again later");
    }
  };
*/

// AFTER (screens import from API layer):
/*
  import { login } from "../../lib/api/auth.api";

  const handleLogin = async () => {
    setLoading(true);
    try {
      await login(email, password);  // Clean API call
      router.push("/(tabs)");
    } catch (error) {
      Alert.alert("Login Failed", "Please try again later");
    }
  };
*/

/**
 * IMPLEMENTED ENDPOINTS
 */

/*
  AUTH
  ├── login(email: string, password: string)
  ├── register(name: string, email: string, password: string)
  ├── refreshAccessToken(refreshToken: string)
  ├── logout()
  └── verifySession()

  USER
  ├── getCurrentUser()
  ├── updateUserProfile(data: UpdateUserRequest)
  ├── getUserAddresses()
  ├── addUserAddress(address: Address)
  ├── updateUserAddress(addressId: string, address: Partial<Address>)
  ├── deleteUserAddress(addressId: string)
  └── setDefaultAddress(addressId: string)

  RESTAURANT
  ├── getRestaurants(params?: PaginationParams)
  ├── searchRestaurants(query: string, params?: PaginationParams)
  ├── getRestaurantDetails(restaurantId: string)
  ├── getRestaurantMenu(restaurantId: string, category?: string)
  ├── getNearbyRestaurants(latitude, longitude, radius, params?)
  ├── getRestaurantReviews(restaurantId: string, params?)
  └── submitRestaurantReview(restaurantId: string, review: {rating, comment})

  ORDER
  ├── createOrder(orderData: CreateOrderRequest)
  ├── getUserOrders(params?: PaginationParams)
  ├── getOrderDetails(orderId: string)
  ├── cancelOrder(orderId: string, reason?: string)
  ├── getOrderStatus(orderId: string)
  ├── estimateDeliveryTime(restaurantId: string, itemCount: number)
  ├── applyCoupon(couponCode: string)
  └── repeatOrder(orderId: string)

  DELIVERY
  ├── getDeliveryTracking(orderId: string)
  ├── getDeliveryPersonContact(orderId: string)
  ├── rateDelivery(orderId: string, rating: number, feedback?: string)
  ├── reportDeliveryIssue(orderId: string, issue: string)
  ├── getEstimatedArrival(orderId: string)
  └── updateDeliveryPreferences(orderId: string, preferences: {...})
*/

/**
 * TYPES DEFINED
 */

/*
  Authentication Types:
  - LoginRequest, LoginResponse
  - RegisterRequest, RegisterResponse
  - RefreshTokenRequest, RefreshTokenResponse

  User Types:
  - User, Address
  - UpdateUserRequest, UpdateUserResponse

  Restaurant Types:
  - Restaurant, MenuItem
  - RestaurantListResponse, RestaurantDetailsResponse

  Order Types:
  - Order, OrderItem, CartItem, Cart
  - CreateOrderRequest, CreateOrderResponse
  - OrderListResponse
  - OrderStatus (pending, confirmed, preparing, ready, out_for_delivery, delivered, cancelled)

  Delivery Types:
  - DeliveryTracking

  Utility Types:
  - ApiError, PaginationParams
*/

/**
 * IMPLEMENTING BACKEND INTEGRATION
 */

/*
  When backend is ready:

  1. Update lib/config/env.ts with actual API URL:
     const API_BASE_URL = 'https://api.yourserver.com';

  2. Implement function bodies in API files:
     
     // Before:
     export async function login(email: string, password: string): Promise<LoginResponse> {
       const request: LoginRequest = { email, password };
       const response = await apiClient.post<LoginResponse>('/auth/login', request);
       setTokens(response.data.accessToken, response.data.refreshToken);
       return response.data;
     }

     // After: (just update the endpoint URL if needed, body is already complete!)

  3. Implement token refresh logic in apiClient interceptor

  4. Add persistent token storage (AsyncStorage)
     - Currently stores tokens in memory
     - Should persist with device storage for app restart

  5. Add error handling UI
     - Network error handling
     - 401 unauthorized handling
     - Timeout handling

  No UI changes needed! The architecture is future-proof.
*/

/**
 * TOKEN MANAGEMENT
 */

/*
  Current Implementation (Memory-Based):
  - setTokens(accessToken, refreshToken) - Store tokens
  - clearTokens() - Clear tokens on logout
  - getAccessToken() - Get current access token
  - getRefreshToken() - Get current refresh token

  Future Implementation (Should Use AsyncStorage):
  - Store tokens persistently
  - Restore tokens on app launch
  - Handle token expiration gracefully
*/

/**
 * INTERCEPTOR LOGIC
 */

/*
  Request Interceptor:
  - Adds "Authorization: Bearer {accessToken}" header to all requests
  - Skips if no token is stored

  Response Interceptor:
  - Catches 401 (Unauthorized) responses
  - Attempts token refresh using refreshToken
  - If refresh fails, clears tokens and redirects to login
  - Retries original request with new token
*/

export { };

