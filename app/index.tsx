import { View, ActivityIndicator, StyleSheet } from "react-native";
import { useEffect } from "react";
import { router } from "expo-router";
import { getToken, removeToken } from "../lib/auth";
import { apiRequest } from "../lib/api";

export default function Index() {
  useEffect(() => {
    async function bootstrap() {
      const token = await getToken();

      if (!token) {
        router.replace("/login");
        return;
      }

      try {
        const user = await apiRequest("/auth/me", "GET", undefined, token);

        if (user.role === "customer") {
          router.replace("/(customer)");
        } else if (user.role === "vendor") {
          router.replace("/(vendor)");
        } else if (user.role === "delivery") {
          router.replace("/(delivery)");
        } else {
          throw new Error("Unknown role");
        }
      } catch {
        await removeToken();
        router.replace("/login");
      }
    }

    bootstrap();
  }, []);

  return (
    <View style={styles.center}>
      <ActivityIndicator size="large" />
    </View>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
