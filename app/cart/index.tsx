import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
    ActivityIndicator,
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { Colors } from "../../constants/theme";
import * as orderAPI from "../../lib/api/order.api";
import { useAuth } from "../../lib/auth/context";
import { useCart } from "../../lib/context/CartContext";

const Cart: React.FC = () => {
  const router = useRouter();
  const cart = useCart();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  // Estimate tax and delivery (could be from backend)
  const TAX_RATE = 0.08;
  const DELIVERY_FEE = 5.99;
  const tax = cart.subtotal * TAX_RATE;
  const total = cart.subtotal + tax + DELIVERY_FEE;

  const handleCheckout = async () => {
    // Validate cart
    if (!cart.restaurantId || cart.items.length === 0) {
      Alert.alert("Empty Cart", "Add items before checkout");
      return;
    }

    // Validate user has address
    if (!user?.addresses || user.addresses.length === 0) {
      Alert.alert(
        "No Address",
        "Please add a delivery address in your profile first",
        [
          {
            text: "Go to Profile",
            onPress: () => router.push("/(tabs)/profile"),
          },
        ],
      );
      return;
    }

    setLoading(true);
    try {
      // Use first address or default
      const deliveryAddress =
        user.addresses.find((addr) => addr.isDefault) || user.addresses[0];

      const orderPayload = {
        restaurantId: cart.restaurantId,
        items: cart.getCheckoutPayload(),
        deliveryAddress: deliveryAddress,
        deliveryFee: DELIVERY_FEE,
        notes: "",
      };

      const response = await orderAPI.createOrder(orderPayload);

      // Success - clear cart
      cart.clearCart();

      // Navigate to success page
      router.push({
        pathname: "/order/success",
        params: { orderId: response.order.id },
      });
    } catch (error: any) {
      const message =
        error?.response?.data?.message || "Failed to create order";
      Alert.alert("Order Failed", message);
      console.error("Order creation error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveItem = (menuItemId: string) => {
    cart.removeItem(menuItemId);
  };

  const handleIncreaseQuantity = (menuItemId: string) => {
    cart.increaseQuantity(menuItemId);
  };

  const handleDecreaseQuantity = (menuItemId: string) => {
    cart.decreaseQuantity(menuItemId);
  };

  const handleContinueShopping = () => {
    router.back();
  };

  // Empty state
  if (!cart.restaurantId || cart.items.length === 0) {
    return (
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>My Cart</Text>
        </View>

        <View style={styles.emptyState}>
          <Ionicons name="basket-outline" size={80} color={Colors.light.icon} />
          <Text style={styles.emptyTitle}>Your cart is empty</Text>
          <Text style={styles.emptyText}>
            Add some delicious food from your favorite restaurants to get
            started!
          </Text>
        </View>

        <View style={styles.checkoutSection}>
          <TouchableOpacity
            style={styles.continueBrowsingButton}
            onPress={handleContinueShopping}
          >
            <Text style={styles.continueBrowsingText}>Browse Restaurants</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  }

  // Cart with items
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>My Cart</Text>
        <Text style={styles.itemCount}>
          {cart.totalItems} item{cart.totalItems !== 1 ? "s" : ""}
        </Text>
      </View>

      <View style={styles.cartItems}>
        {cart.items.map((item) => (
          <View key={item.id} style={styles.cartItem}>
            <View style={styles.itemInfo}>
              <Text style={styles.itemName} numberOfLines={1}>
                {item.name}
              </Text>
              <Text style={styles.itemCategory}>{item.category}</Text>
              <Text style={styles.itemPrice}>${item.price.toFixed(2)}</Text>
            </View>

            <View style={styles.quantitySection}>
              <TouchableOpacity
                style={styles.quantityButton}
                onPress={() => handleDecreaseQuantity(item.id)}
              >
                <Text style={styles.quantityButtonText}>−</Text>
              </TouchableOpacity>
              <Text style={styles.quantity}>{item.cartQuantity}</Text>
              <TouchableOpacity
                style={styles.quantityButton}
                onPress={() => handleIncreaseQuantity(item.id)}
              >
                <Text style={styles.quantityButtonText}>+</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.itemTotal}>
              <Text style={styles.itemTotalPrice}>
                ${(item.price * item.cartQuantity).toFixed(2)}
              </Text>
              <TouchableOpacity
                style={styles.removeButton}
                onPress={() => handleRemoveItem(item.id)}
              >
                <Ionicons name="close" size={20} color={Colors.light.icon} />
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </View>

      <View style={styles.billingSummary}>
        <View style={styles.billRow}>
          <Text style={styles.billLabel}>Subtotal</Text>
          <Text style={styles.billValue}>${cart.subtotal.toFixed(2)}</Text>
        </View>
        <View style={styles.billRow}>
          <Text style={styles.billLabel}>Tax (8%)</Text>
          <Text style={styles.billValue}>${tax.toFixed(2)}</Text>
        </View>
        <View style={styles.billRow}>
          <Text style={styles.billLabel}>Delivery Fee</Text>
          <Text style={styles.billValue}>${DELIVERY_FEE.toFixed(2)}</Text>
        </View>
        <View style={[styles.billRow, styles.totalRow]}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalValue}>${total.toFixed(2)}</Text>
        </View>
      </View>

      <View style={styles.checkoutSection}>
        <TouchableOpacity
          style={[
            styles.checkoutButton,
            loading && styles.checkoutButtonDisabled,
          ]}
          onPress={handleCheckout}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <>
              <Text style={styles.checkoutText}>Place Order</Text>
              <Ionicons name="arrow-forward" size={20} color="#fff" />
            </>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.continueBrowsingButton}
          onPress={handleContinueShopping}
          disabled={loading}
        >
          <Text style={styles.continueBrowsingText}>Continue Shopping</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  header: {
    padding: 20,
    backgroundColor: Colors.light.primary,
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 4,
  },
  itemCount: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.8)",
  },
  emptyState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 40,
    minHeight: 400,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: Colors.light.text,
    marginTop: 20,
    marginBottom: 10,
  },
  emptyText: {
    fontSize: 16,
    color: Colors.light.icon,
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 30,
  },
  cartItems: {
    padding: 15,
    gap: 10,
  },
  cartItem: {
    flexDirection: "row",
    backgroundColor: Colors.light.lightGrey,
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: Colors.light.border,
    alignItems: "center",
  },
  itemInfo: {
    flex: 1,
    marginRight: 10,
  },
  itemName: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.light.text,
    marginBottom: 4,
  },
  itemCategory: {
    fontSize: 12,
    color: Colors.light.icon,
    marginBottom: 4,
  },
  itemPrice: {
    fontSize: 14,
    fontWeight: "bold",
    color: Colors.light.primary,
  },
  quantitySection: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 8,
    paddingHorizontal: 4,
    marginHorizontal: 8,
  },
  quantityButton: {
    width: 32,
    height: 32,
    justifyContent: "center",
    alignItems: "center",
  },
  quantityButtonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: Colors.light.primary,
  },
  quantity: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.light.text,
    minWidth: 30,
    textAlign: "center",
  },
  itemTotal: {
    alignItems: "flex-end",
  },
  itemTotalPrice: {
    fontSize: 16,
    fontWeight: "bold",
    color: Colors.light.text,
    marginBottom: 4,
  },
  removeButton: {
    padding: 4,
  },
  billingSummary: {
    margin: 15,
    padding: 15,
    backgroundColor: "#fff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  billRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  totalRow: {
    borderBottomWidth: 0,
  },
  billLabel: {
    fontSize: 14,
    color: Colors.light.icon,
  },
  billValue: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.light.text,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: "bold",
    color: Colors.light.text,
  },
  totalValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: Colors.light.primary,
  },
  checkoutSection: {
    padding: 15,
    gap: 10,
  },
  checkoutButton: {
    backgroundColor: Colors.light.primary,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    borderRadius: 8,
  },
  checkoutButtonDisabled: {
    opacity: 0.7,
  },
  checkoutText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    marginRight: 8,
  },
  continueBrowsingButton: {
    backgroundColor: Colors.light.lightGrey,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: "center",
    borderWidth: 1,
    borderColor: Colors.light.border,
    marginBottom: 20,
  },
  continueBrowsingText: {
    color: Colors.light.text,
    fontSize: 16,
    fontWeight: "600",
  },
});

export default Cart;
