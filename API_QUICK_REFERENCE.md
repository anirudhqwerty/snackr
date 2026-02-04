# API Layer Quick Reference

## 🚀 Quick Start

### Import API Functions

```typescript
// Option 1: From specific API file
import { login, register } from "../../lib/api/auth.api";

// Option 2: From lib index (convenience)
import { login, register, getRestaurants } from "../../lib";

// Option 3: From specific module
import * as authAPI from "../../lib/api/auth.api";
```

### Import Types

```typescript
// Option 1: Direct import
import type { User, Restaurant, Order } from "../../lib/types";

// Option 2: From lib index
import type { User, Restaurant, Order } from "../../lib";
```

## 📡 API Endpoints Quick Map

### Authentication

```typescript
import { login, register, logout, refreshAccessToken } from "../../lib";

await login("user@example.com", "password");
await register("John", "john@example.com", "password");
await logout();
```

### Restaurants

```typescript
import {
  getRestaurants,
  getRestaurantDetails,
  searchRestaurants,
} from "../../lib";

const restaurants = await getRestaurants({ page: 1, pageSize: 10 });
const details = await getRestaurantDetails("restaurant-id");
const results = await searchRestaurants("pizza");
```

### Orders

```typescript
import { createOrder, getUserOrders, getOrderDetails } from "../../lib";

const order = await createOrder(orderData);
const history = await getUserOrders({ page: 1 });
const details = await getOrderDetails("order-id");
```

### User Profile

```typescript
import { getCurrentUser, updateUserProfile, getUserAddresses } from "../../lib";

const user = await getCurrentUser();
await updateUserProfile({ name: "New Name", phone: "123456" });
const addresses = await getUserAddresses();
```

### Delivery Tracking

```typescript
import { getDeliveryTracking, rateDelivery } from "../../lib";

const tracking = await getDeliveryTracking("order-id");
await rateDelivery("order-id", 5, "Great delivery!");
```

## 🔐 Authentication Flow

```typescript
// Login
import { login, setTokens } from "../../lib";

const response = await login(email, password);
// Tokens automatically stored via setTokens() inside login()

// Make authenticated requests
import { getRestaurants } from "../../lib";
const restaurants = await getRestaurants();
// Bearer token automatically added to request

// Logout
import { logout, clearTokens } from "../../lib";
await logout();
// Tokens automatically cleared via clearTokens() inside logout()
```

## 📊 Type System

### Request Types

```typescript
import type {
  LoginRequest,
  RegisterRequest,
  CreateOrderRequest,
  UpdateUserRequest,
  PaginationParams,
} from "../../lib";

const loginData: LoginRequest = {
  email: "user@example.com",
  password: "password",
};

const orderData: CreateOrderRequest = {
  restaurantId: "rest-1",
  items: [{ menuItemId: "item-1", quantity: 2 }],
  deliveryAddress: addressData,
  paymentMethod: "card",
};
```

### Response Types

```typescript
import type {
  LoginResponse,
  User,
  Order,
  Restaurant,
  RestaurantListResponse,
} from "../../lib";

const response: LoginResponse = await login(email, password);
const user: User = response.user;

const ordersList: RestaurantListResponse = await getRestaurants();
const restaurants: Restaurant[] = ordersList.restaurants;
```

## ⚙️ Configuration

### Update API Base URL

```typescript
// lib/config/env.ts
const API_BASE_URL = "https://your-api.com"; // Change this

export const env = {
  apiBaseUrl: API_BASE_URL,
  apiTimeout: 10000,
  isProduction: process.env.NODE_ENV === "production",
};
```

## 🛠️ Common Patterns

### Loading State

```typescript
const [loading, setLoading] = useState(false);
const [data, setData] = useState<Restaurant[] | null>(null);
const [error, setError] = useState<string | null>(null);

const fetchData = async () => {
  setLoading(true);
  setError(null);
  try {
    const result = await getRestaurants();
    setData(result.restaurants);
  } catch (err) {
    setError("Failed to load restaurants");
  } finally {
    setLoading(false);
  }
};

useEffect(() => {
  fetchData();
}, []);
```

### Error Handling

```typescript
import { Alert } from "react-native";

const handleLogin = async () => {
  try {
    await login(email, password);
    router.push("/(tabs)");
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "An error occurred";
    Alert.alert("Error", message);
  }
};
```

### Pagination

```typescript
const { restaurants, total, page, pageSize } = await getRestaurants({
  page: 1,
  pageSize: 20,
  sortBy: "rating",
  sortOrder: "desc",
});
```

## 📚 File Structure Reference

```
lib/
├── api/
│   ├── client.ts           # HTTP client setup
│   ├── auth.api.ts         # Authentication (5 functions)
│   ├── user.api.ts         # User management (7 functions)
│   ├── restaurant.api.ts   # Restaurant data (7 functions)
│   ├── order.api.ts        # Order management (8 functions)
│   ├── delivery.api.ts     # Delivery tracking (6 functions)
│   └── index.ts            # Re-exports
├── config/
│   └── env.ts              # Configuration
├── types/
│   ├── index.ts            # All interfaces
│   └── exports.ts          # Type re-exports
├── index.ts                # Main entry point
└── API_DOCUMENTATION.ts    # Full documentation
```

## 🔗 Cross-File Example

### In app/(tabs)/home.tsx:

```typescript
import { useEffect, useState } from "react";
import { getRestaurants } from "../../lib/api/restaurant.api";
import type { RestaurantListResponse } from "../../lib/types";

export default function Home() {
  const [restaurants, setRestaurants] = useState<RestaurantListResponse | null>(
    null,
  );
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const data = await getRestaurants({ page: 1, pageSize: 10 });
        setRestaurants(data);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  // UI...
}
```

## ✅ Checklist for Backend Integration

- [ ] Update API_BASE_URL in lib/config/env.ts
- [ ] Implement function bodies in lib/api/\*.ts files
- [ ] Add persistent token storage (AsyncStorage)
- [ ] Test each endpoint with real backend
- [ ] Add error logging/monitoring
- [ ] Handle network errors gracefully
- [ ] Add retry logic for failed requests
- [ ] Test token refresh flow
- [ ] Add request/response logging in dev mode
- [ ] Document any API-specific requirements

## 📞 Support

For questions about:

- **Architecture**: See API_DOCUMENTATION.ts
- **Implementation**: Check each api/\*.ts file
- **Types**: View lib/types/index.ts
- **Configuration**: Edit lib/config/env.ts

All functions follow the same pattern and are ready for implementation!
