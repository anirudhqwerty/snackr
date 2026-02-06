import { useEffect, useState } from "react";
import { Alert, Pressable, StyleSheet, Text, View } from "react-native";
import { apiRequest } from "../../lib/api";
import { getToken } from "../../lib/auth";

export default function DeliveryHome() {
  const [foods, setFoods] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const token = await getToken();
      if (!token) return;

      const [foodData, orderData] = await Promise.all([
        apiRequest("/food", "GET", undefined, token),
        apiRequest("/orders", "GET", undefined, token),
      ]);

      setFoods(foodData);
      setOrders(orderData);
    } catch (error) {
      Alert.alert("Error", "Failed to load data");
    }
  }

  async function updateOrder(orderId: string, action: "pick" | "deliver") {
    setLoading(true);
    try {
      const token = await getToken();
      if (!token) throw new Error("No token");

      await apiRequest(
        `/orders/${orderId}/${action}`,
        "PATCH",
        undefined,
        token,
      );
      await loadData(); // Refresh data
    } catch (error) {
      Alert.alert("Error", `Failed to ${action} order`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Delivery Home</Text>

      <Text style={styles.sectionTitle}>Orders</Text>
      {orders.length === 0 ? (
        <Text style={styles.muted}>No orders yet.</Text>
      ) : (
        orders.map((order) => {
          const food = foods.find((f) => f.id === order.foodId);
          return (
            <View key={order.id} style={styles.card}>
              <Text style={styles.listItem}>
                {food ? food.name : "Unknown item"}
              </Text>
              <Text style={styles.muted}>Status: {order.status}</Text>
              <View style={styles.actions}>
                <Pressable
                  style={[styles.button, styles.secondaryButton]}
                  onPress={() => updateOrder(order.id, "pick")}
                  disabled={order.status !== "pending" || loading}
                >
                  <Text style={styles.buttonText}>Pick Order</Text>
                </Pressable>
                <Pressable
                  style={[styles.button, styles.secondaryButton]}
                  onPress={() => updateOrder(order.id, "deliver")}
                  disabled={order.status !== "picked" || loading}
                >
                  <Text style={styles.buttonText}>Mark Delivered</Text>
                </Pressable>
              </View>
            </View>
          );
        })
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "600",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 8,
  },
  card: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  listItem: {
    fontSize: 14,
    marginBottom: 4,
  },
  muted: {
    color: "#666",
    marginBottom: 8,
  },
  actions: {
    flexDirection: "row",
    gap: 8,
  },
  button: {
    backgroundColor: "#111",
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 6,
  },
  secondaryButton: {
    backgroundColor: "#111",
  },
  buttonText: {
    color: "#fff",
    fontSize: 12,
  },
});
