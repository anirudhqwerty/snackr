import { Stack, router } from "expo-router";
import { useEffect } from "react";
import { getToken, removeToken } from "../../lib/auth";
import { apiRequest } from "../../lib/api";

export default function DeliveryLayout() {
  useEffect(() => {
    async function protect() {
      const token = await getToken();

      if (!token) {
        router.replace("/login");
        return;
      }

      try {
        const user = await apiRequest("/auth/me", "GET", undefined, token);

        if (user.role !== "delivery") {
          throw new Error("Not allowed");
        }
      } catch {
        await removeToken();
        router.replace("/login");
      }
    }

    protect();
  }, []);

  return <Stack />;
}
