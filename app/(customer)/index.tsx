import { useEffect, useState } from "react";
import { Alert, Pressable, StyleSheet, Text, View } from "react-native";
import { apiRequest } from "../../lib/api";
import { getToken } from "../../lib/auth";

export default function CustomerHome() {
  const [foods, setFoods] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function loadFoods() {
      const token = await getToken();
      if (!token) return;

      const data = await apiRequest("/food", "GET", undefined, token);

      setFoods(data);
    }

    loadFoods();
  }, []);

  async function orderFood(foodId: string) {
    setLoading(true);
    try {
      const token = await getToken();
      if (!token) throw new Error("No token");
      await apiRequest("/orders", "POST", { foodId }, token);
      Alert.alert("Success", "Order placed!");
    } catch (error) {
      Alert.alert("Error", "Failed to place order");
    } finally {
      setLoading(false);
    }
  }

  function isOrdered(foodId: string) {
    // Since orders are now in DB, we can't check locally; assume not ordered for simplicity
    return false;
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
