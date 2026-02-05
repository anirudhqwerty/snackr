import { View, Text, TextInput, Pressable, StyleSheet } from "react-native";

export default function Register() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Register</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        autoCapitalize="none"
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
      />

      <Text style={styles.label}>Select Role</Text>

      <View style={styles.roleContainer}>
        <Pressable style={styles.roleButton}>
          <Text style={styles.roleText}>Customer</Text>
        </Pressable>

        <Pressable style={styles.roleButton}>
          <Text style={styles.roleText}>Vendor</Text>
        </Pressable>

        <Pressable style={styles.roleButton}>
          <Text style={styles.roleText}>Delivery</Text>
        </Pressable>
      </View>

      <Pressable style={styles.button}>
        <Text style={styles.buttonText}>Create Account</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
  },
  title: {
    fontSize: 28,
    marginBottom: 25,
    textAlign: "center",
    fontWeight: "600",
  },
  label: {
    marginBottom: 10,
    fontSize: 16,
    fontWeight: "500",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
  },
  roleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 25,
  },
  roleButton: {
    flex: 1,
    padding: 12,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    marginHorizontal: 4,
  },
  roleText: {
    textAlign: "center",
    fontSize: 14,
  },
  button: {
    backgroundColor: "#111",
    padding: 15,
    borderRadius: 8,
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontSize: 16,
  },
});
