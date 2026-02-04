/**
 * Global Cart Context for managing shopping cart state
 * Supports single-restaurant cart with item management
 */

import React, { createContext, useCallback, useReducer } from "react";
import type { MenuItem } from "../types";

/**
 * Cart item with full menu item details
 */
export interface CartItemWithDetails extends MenuItem {
  cartQuantity: number;
}

/**
 * Minimal cart item structure matching API expectations
 */
export interface CartItemPayload {
  menuItemId: string;
  quantity: number;
  specialInstructions?: string;
}

/**
 * Internal cart state
 */
interface CartState {
  restaurantId: string | null;
  items: CartItemWithDetails[];
}

/**
 * Cart actions
 */
type CartAction =
  | {
      type: "ADD_ITEM";
      payload: MenuItem;
    }
  | {
      type: "REMOVE_ITEM";
      payload: string; // menuItemId
    }
  | {
      type: "INCREASE_QUANTITY";
      payload: string; // menuItemId
    }
  | {
      type: "DECREASE_QUANTITY";
      payload: string; // menuItemId
    }
  | {
      type: "CLEAR_CART";
    }
  | {
      type: "SWITCH_RESTAURANT";
      payload: string; // new restaurantId (clears cart)
    };

/**
 * Cart context value
 */
export interface CartContextType {
  restaurantId: string | null;
  items: CartItemWithDetails[];
  totalItems: number;
  subtotal: number;
  addItem: (menuItem: MenuItem) => void;
  removeItem: (menuItemId: string) => void;
  increaseQuantity: (menuItemId: string) => void;
  decreaseQuantity: (menuItemId: string) => void;
  clearCart: () => void;
  switchRestaurant: (newRestaurantId: string) => void;
  getCheckoutPayload: () => CartItemPayload[];
}

/**
 * Create cart context
 */
export const CartContext = createContext<CartContextType | undefined>(
  undefined,
);

/**
 * Cart reducer
 */
const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case "ADD_ITEM": {
      const menuItem = action.payload;

      // If adding from different restaurant, clear cart first
      if (state.restaurantId && state.restaurantId !== menuItem.restaurantId) {
        return {
          restaurantId: menuItem.restaurantId,
          items: [{ ...menuItem, cartQuantity: 1 }],
        };
      }

      // Check if item already in cart
      const existingItem = state.items.find((item) => item.id === menuItem.id);

      if (existingItem) {
        // Increase quantity if already exists
        return {
          ...state,
          items: state.items.map((item) =>
            item.id === menuItem.id
              ? { ...item, cartQuantity: item.cartQuantity + 1 }
              : item,
          ),
        };
      }

      // Add new item
      return {
        restaurantId: menuItem.restaurantId,
        items: [...state.items, { ...menuItem, cartQuantity: 1 }],
      };
    }

    case "REMOVE_ITEM": {
      return {
        ...state,
        items: state.items.filter((item) => item.id !== action.payload),
      };
    }

    case "INCREASE_QUANTITY": {
      return {
        ...state,
        items: state.items.map((item) =>
          item.id === action.payload
            ? { ...item, cartQuantity: item.cartQuantity + 1 }
            : item,
        ),
      };
    }

    case "DECREASE_QUANTITY": {
      const items = state.items.map((item) =>
        item.id === action.payload
          ? { ...item, cartQuantity: Math.max(0, item.cartQuantity - 1) }
          : item,
      );

      // Remove items with 0 quantity
      return {
        ...state,
        items: items.filter((item) => item.cartQuantity > 0),
      };
    }

    case "CLEAR_CART": {
      return {
        restaurantId: null,
        items: [],
      };
    }

    case "SWITCH_RESTAURANT": {
      return {
        restaurantId: action.payload,
        items: [],
      };
    }

    default:
      return state;
  }
};

/**
 * Cart provider component
 */
export interface CartProviderProps {
  children: React.ReactNode;
}

export function CartProvider({ children }: CartProviderProps) {
  const [state, dispatch] = useReducer(cartReducer, {
    restaurantId: null,
    items: [],
  });

  /**
   * Calculate total items count
   */
  const totalItems = state.items.reduce(
    (sum, item) => sum + item.cartQuantity,
    0,
  );

  /**
   * Calculate subtotal (before delivery fee and tax)
   */
  const subtotal = state.items.reduce(
    (sum, item) => sum + item.price * item.cartQuantity,
    0,
  );

  /**
   * Add item to cart
   */
  const addItem = useCallback((menuItem: MenuItem) => {
    dispatch({ type: "ADD_ITEM", payload: menuItem });
  }, []);

  /**
   * Remove item from cart
   */
  const removeItem = useCallback((menuItemId: string) => {
    dispatch({ type: "REMOVE_ITEM", payload: menuItemId });
  }, []);

  /**
   * Increase item quantity
   */
  const increaseQuantity = useCallback((menuItemId: string) => {
    dispatch({ type: "INCREASE_QUANTITY", payload: menuItemId });
  }, []);

  /**
   * Decrease item quantity (removes if reaches 0)
   */
  const decreaseQuantity = useCallback((menuItemId: string) => {
    dispatch({ type: "DECREASE_QUANTITY", payload: menuItemId });
  }, []);

  /**
   * Clear entire cart
   */
  const clearCart = useCallback(() => {
    dispatch({ type: "CLEAR_CART" });
  }, []);

  /**
   * Switch to different restaurant (clears current cart)
   */
  const switchRestaurant = useCallback((newRestaurantId: string) => {
    dispatch({ type: "SWITCH_RESTAURANT", payload: newRestaurantId });
  }, []);

  /**
   * Get cart items formatted for checkout API
   */
  const getCheckoutPayload = useCallback((): CartItemPayload[] => {
    return state.items.map((item) => ({
      menuItemId: item.id,
      quantity: item.cartQuantity,
    }));
  }, [state.items]);

  const value: CartContextType = {
    restaurantId: state.restaurantId,
    items: state.items,
    totalItems,
    subtotal,
    addItem,
    removeItem,
    increaseQuantity,
    decreaseQuantity,
    clearCart,
    switchRestaurant,
    getCheckoutPayload,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

/**
 * Hook to use cart context
 */
export function useCart(): CartContextType {
  const context = React.useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
