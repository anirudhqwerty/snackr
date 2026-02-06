import { View, Text, TextInput, Pressable, StyleSheet } from "react-native";
import { useEffect, useState } from "react";
import { addFood, getState, subscribe } from "../../lib/mockStore";

export default function VendorHome() {
  const [foodName, setFoodName] = useState("");
  const [foods, setFoods] = useState(getState().foods);

  useEffect(() => subscribe((snapshot) => setFoods(snapshot.foods)), []);

  function handleAddFood() {
    // Mock data flow: vendor creates foods in the shared store.
    addFood(foodName);
    setFoodName("");
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Vendor Home</Text>

      <TextInput
        style={styles.input}
        placeholder="Food name"
        value={foodName}
        onChangeText={setFoodName}
      />

      <Pressable style={styles.button} onPress={handleAddFood}>
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
  },
  title: {
    fontSize: 22,
    fontWeight: "600",
    marginBottom: 16,
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
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 8,
  },
  listItem: {
    paddingVertical: 6,
  },
  muted: {
    color: "#666",
  },
});
