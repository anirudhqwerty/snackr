import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
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
import {
    getRestaurantDetails,
    getRestaurantMenu,
} from "../../lib/api/restaurant.api";
import { useCart } from "../../lib/context/CartContext";
import type { MenuItem, Restaurant } from "../../lib/types";

const RestaurantDetail: React.FC = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const cart = useCart();
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [menu, setMenu] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      fetchRestaurantDetails(id);
    }
  }, [id]);

  const fetchRestaurantDetails = async (restaurantId: string) => {
    setLoading(true);
    setError(null);
    try {
      const details = await getRestaurantDetails(restaurantId);
      setRestaurant(details.restaurant);

      // Fetch menu items
      const menuItems = await getRestaurantMenu(restaurantId);
      setMenu(menuItems);
    } catch (err: any) {
      const message = err?.message || "Failed to load restaurant details";
      setError(message);
      console.error("Error loading restaurant:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    router.back();
  };

  const handleAddToCart = (item: MenuItem) => {
    // Check if adding from different restaurant
    if (cart.restaurantId && cart.restaurantId !== item.restaurantId) {
      Alert.alert(
        "Switch Restaurant?",
        "Your cart contains items from a different restaurant. Clear cart to add items from this restaurant?",
        [
          {
            text: "Cancel",
            onPress: () => {},
            style: "cancel",
          },
          {
            text: "Clear & Add",
            onPress: () => {
              cart.clearCart();
              cart.addItem(item);
              Alert.alert("Added", `${item.name} added to cart!`, [
                { text: "Continue Shopping" },
              ]);
            },
            style: "destructive",
          },
        ],
      );
    } else {
      // Same restaurant or empty cart
      cart.addItem(item);
      Alert.alert("Added", `${item.name} added to cart!`, [
        { text: "Continue Shopping" },
      ]);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Restaurant Details</Text>
        {cart.totalItems > 0 && (
          <View style={styles.cartBadge}>
            <Text style={styles.cartBadgeText}>{cart.totalItems}</Text>
          </View>
        )}
      </View>

      {loading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={Colors.light.primary} />
          <Text style={styles.loadingText}>Loading restaurant...</Text>
        </View>
      ) : error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={() => id && fetchRestaurantDetails(id)}
          >
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : restaurant ? (
        <View style={styles.content}>
          <Text style={styles.restaurantName}>{restaurant.name}</Text>
          <Text style={styles.description}>{restaurant.description}</Text>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Rating:</Text>
            <Text style={styles.infoValue}>⭐ {restaurant.rating}</Text>
          </View>

          <View style={styles.menuSection}>
            <Text style={styles.sectionTitle}>Menu</Text>

            {menu && menu.length > 0 ? (
              <View style={styles.menuItems}>
                {menu.map((item: MenuItem) => (
                  <View key={item.id} style={styles.menuItem}>
                    <View style={styles.itemHeader}>
                      <Text style={styles.itemName}>{item.name}</Text>
                      <Text style={styles.itemPrice}>
                        ${item.price.toFixed(2)}
                      </Text>
                    </View>
                    <Text style={styles.itemDescription} numberOfLines={2}>
                      {item.description}
                    </Text>
                    <View style={styles.itemFooter}>
                      <Text style={styles.categoryBadge}>{item.category}</Text>
                      <TouchableOpacity
                        style={[
                          styles.addButton,
                          !item.isAvailable && styles.addButtonDisabled,
                        ]}
                        onPress={() => handleAddToCart(item)}
                        disabled={!item.isAvailable}
                      >
                        <Text style={styles.addButtonText}>
                          {item.isAvailable ? "Add" : "Unavailable"}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                ))}
              </View>
            ) : (
              <Text style={styles.emptyMenu}>No menu items available</Text>
            )}
          </View>
        </View>
      ) : (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Restaurant not found</Text>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  centerContainer: {
    justifyContent: "center",
    alignItems: "center",
    height: 300,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: Colors.light.text,
  },
  errorContainer: {
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
    height: 300,
  },
  errorText: {
    fontSize: 16,
    color: "#DC143C",
    marginBottom: 15,
    textAlign: "center",
  },
  retryButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: Colors.light.primary,
    borderRadius: 8,
  },
  retryButtonText: {
    color: "#fff",
    fontWeight: "600",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingVertical: 12,
    backgroundColor: Colors.light.primary,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
    marginLeft: 10,
    flex: 1,
  },
  cartBadge: {
    backgroundColor: "#DC143C",
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    minWidth: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  cartBadgeText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
  },
  content: {
    padding: 20,
  },
  restaurantName: {
    fontSize: 24,
    fontWeight: "bold",
    color: Colors.light.text,
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: Colors.light.icon,
    lineHeight: 20,
    marginBottom: 15,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  infoLabel: {
    fontSize: 14,
    color: Colors.light.icon,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.light.text,
  },
  menuSection: {
    marginTop: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: Colors.light.text,
    marginBottom: 15,
  },
  menuItems: {
    gap: 12,
  },
  menuItem: {
    backgroundColor: Colors.light.lightGrey,
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  itemHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  itemName: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.light.text,
    flex: 1,
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: "bold",
    color: Colors.light.primary,
    marginLeft: 10,
  },
  itemDescription: {
    fontSize: 12,
    color: Colors.light.icon,
    marginBottom: 10,
  },
  categoryBadge: {
    fontSize: 12,
    color: "#fff",
    backgroundColor: Colors.light.primary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    overflow: "hidden",
  },
  itemFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  addButton: {
    backgroundColor: Colors.light.primary,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
  },
  addButtonDisabled: {
    backgroundColor: Colors.light.icon,
    opacity: 0.5,
  },
  addButtonText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },
  emptyMenu: {
    textAlign: "center",
    color: Colors.light.icon,
    fontSize: 14,
    paddingVertical: 20,
  },
});

export default RestaurantDetail;
