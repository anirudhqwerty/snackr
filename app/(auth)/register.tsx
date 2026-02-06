import { View, Text, TextInput, Pressable, StyleSheet } from "react-native";
import { useState } from "react";
import { router } from "expo-router";
import { apiRequest } from "../../lib/api";
import { saveToken } from "../../lib/auth";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"customer" | "vendor" | "delivery" | "">("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleRegister() {
    if (!email || !password || !role) {
      setError("Email, password, and role are required");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const response = await apiRequest("/auth/register", "POST", {
        email,
        password,
        role,
      });

      await saveToken(response.token);
      router.replace("/");
    } catch (err: any) {
      setError(err.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Register</Text>

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <TextInput
        style={styles.input}
        placeholder="Email"
        autoCapitalize="none"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <Text style={styles.label}>Select Role</Text>

      <View style={styles.roleContainer}>
        <Pressable
          style={[
            styles.roleButton,
            role === "customer" && styles.roleButtonSelected,
          ]}
          onPress={() => setRole("customer")}
        >
          <Text
            style={[
              styles.roleText,
              role === "customer" && styles.roleTextSelected,
            ]}
          >
            Customer
          </Text>
        </Pressable>

        <Pressable
          style={[
            styles.roleButton,
            role === "vendor" && styles.roleButtonSelected,
          ]}
          onPress={() => setRole("vendor")}
        >
          <Text
            style={[
              styles.roleText,
              role === "vendor" && styles.roleTextSelected,
            ]}
          >
            Vendor
          </Text>
        </Pressable>

        <Pressable
          style={[
            styles.roleButton,
            role === "delivery" && styles.roleButtonSelected,
          ]}
          onPress={() => setRole("delivery")}
        >
          <Text
            style={[
              styles.roleText,
              role === "delivery" && styles.roleTextSelected,
            ]}
          >
            Delivery
          </Text>
        </Pressable>
      </View>

      <Pressable
        style={[styles.button, loading && styles.buttonDisabled]}
        onPress={handleRegister}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? "Creating account..." : "Create Account"}
        </Text>
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
  error: {
    color: "red",
    marginBottom: 15,
    textAlign: "center",
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
  roleButtonSelected: {
    borderColor: "#111",
    backgroundColor: "#111",
  },
  roleText: {
    textAlign: "center",
    fontSize: 14,
  },
  roleTextSelected: {
    color: "#fff",
    fontWeight: "600",
  },
  button: {
    backgroundColor: "#111",
    padding: 15,
    borderRadius: 8,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontSize: 16,
  },
});
