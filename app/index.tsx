import { View, Text, ActivityIndicator, StyleSheet } from "react-native";
import { useEffect, useState } from "react";
import { router } from "expo-router";
import { getToken, removeToken } from "../lib/auth";
import { apiRequest } from "../lib/api";

export default function Index() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function bootstrap() {
      const token = await getToken();

      if (!token) {
        router.replace("/login");
        return;
      }

      try {
        const user = await apiRequest(
          "/auth/me",
          "GET",
          undefined,
          token
        );

        console.log("Authenticated user:", user);

        // For now, just stop here
        // Next step: role-based routing
        setLoading(false);
      } catch {
        await removeToken();
        router.replace("/login");
      }
    }

    bootstrap();
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={styles.center}>
      <Text>You are logged in 🎉</Text>
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
