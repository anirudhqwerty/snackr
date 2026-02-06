import { View, Text, Pressable, StyleSheet } from "react-native";
import { useEffect, useState } from "react";
import { addOrder, getState, subscribe } from "../../lib/mockStore";

export default function CustomerHome() {
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

  function orderFood(foodId: string) {
    // Mock data flow: customer creates orders in the shared store.
    addOrder(foodId);
  }

  function isOrdered(foodId: string) {
    return orders.some((o) => o.foodId === foodId);
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Customer Home</Text>

      <Text style={styles.sectionTitle}>Available Foods</Text>
      {foods.length === 0 ? (
        <Text style={styles.muted}>No foods available.</Text>
      ) : (
        foods.map((food) => {
          const ordered = isOrdered(food.id);
          return (
            <View key={food.id} style={styles.row}>
              <Text style={styles.listItem}>{food.name}</Text>
              <Pressable
                style={[styles.button, ordered && styles.buttonDisabled]}
                onPress={() => orderFood(food.id)}
                disabled={ordered}
              >
                <Text style={styles.buttonText}>
                  {ordered ? "Ordered" : "Order"}
                </Text>
              </Pressable>
            </View>
          );
        })
      )}

      <Text style={styles.sectionTitle}>Your Orders</Text>
      {orders.length === 0 ? (
        <Text style={styles.muted}>No orders yet.</Text>
      ) : (
        orders.map((order) => {
          const food = foods.find((f) => f.id === order.foodId);
          return (
            <Text key={order.id} style={styles.listItem}>
              {food ? food.name : "Unknown item"}
            </Text>
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
    marginTop: 12,
    marginBottom: 8,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  listItem: {
    fontSize: 14,
  },
  button: {
    backgroundColor: "#111",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: "#fff",
    fontSize: 12,
  },
  muted: {
    color: "#666",
  },
});
