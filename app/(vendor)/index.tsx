import { router } from "expo-router";
import { useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { apiRequest } from "../../lib/api";
import { getToken, removeToken } from "../../lib/auth";

export default function VendorHome() {
  const [foodName, setFoodName] = useState("");
  const [foods, setFoods] = useState<any[]>([]);

  async function loadFoods() {
    try {
      const token = await getToken();
      // Ensure we handle cases where the token is missing/invalid
      if (!token) return;

      const data = await apiRequest(
        "/food",
        "GET",
        undefined,
        token || undefined,
      );
      setFoods(data);
    } catch (e) {
      console.error("Failed to load foods", e);
    }
  }

  async function addFood() {
    if (!foodName.trim()) return;

    try {
      const token = await getToken();
      await apiRequest("/food", "POST", { name: foodName }, token);
      setFoodName("");
      loadFoods();
    } catch (e) {
      alert("Failed to add food. Check server connection.");
    }
  }

  async function handleLogout() {
    await removeToken();
    router.replace("/login");
  }

  useEffect(() => {
    loadFoods();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Vendor Home</Text>
        <Pressable onPress={handleLogout} style={styles.logoutButton}>
          <Text style={styles.logoutText}>Logout</Text>
        </Pressable>
      </View>

      <TextInput
        style={styles.input}
        placeholder="Food name"
        value={foodName}
        onChangeText={setFoodName}
      />

      <Pressable style={styles.button} onPress={addFood}>
        <Text style={styles.buttonText}>Add Food</Text>
      </Pressable>

      <Text style={styles.sectionTitle}>Added Foods</Text>
      {foods.length === 0 ? (
        <Text style={styles.muted}>No food items yet.</Text>
      ) : (
        foods.map((item) => (
          <Text key={item.id} style={styles.listItem}>
            {item.name}
          </Text>
        ))
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    marginTop: 40, // Added margin for status bar safety
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "600",
  },
  logoutButton: {
    padding: 8,
  },
  logoutText: {
    color: "red",
    fontWeight: "600",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  button: {
    backgroundColor: "#111",
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "600",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 8,
  },
  listItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  muted: {
    color: "#666",
    fontStyle: "italic",
  },
});
