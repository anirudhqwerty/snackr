import { View, Text, Pressable, StyleSheet } from "react-native";
import { useEffect, useState } from "react";
import { getState, subscribe, updateOrderStatus } from "../../lib/mockStore";

export default function DeliveryHome() {
  const [foods, setFoods] = useState(getState().foods);
  const [orders, setOrders] = useState(getState().orders);

  useEffect(
    () =>
      subscribe((snapshot) => {
        setFoods(snapshot.foods);
        setOrders(snapshot.orders);
      }),
    []
  );

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
                  onPress={() => updateOrderStatus(order.id, "picked")}
                  disabled={order.status !== "pending"}
                >
                  <Text style={styles.buttonText}>Pick Order</Text>
                </Pressable>
                <Pressable
                  style={[styles.button, styles.secondaryButton]}
                  onPress={() => updateOrderStatus(order.id, "delivered")}
                  disabled={order.status !== "picked"}
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
