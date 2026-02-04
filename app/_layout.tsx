import { Stack, useRouter } from "expo-router";
import React, { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { AuthProvider, useAuth } from "../lib/auth/context";
import { CartProvider } from "../lib/context/CartContext";

function RootNavigator() {
  const router = useRouter();
  const { isLoading, isSignedIn } = useAuth();

  // Handle navigation based on auth state
  useEffect(() => {
    if (isLoading) {
      return; // Still loading, wait for auth state
    }

    if (isSignedIn) {
      // User is logged in, go to tabs
      router.replace("/(tabs)");
    } else {
      // User is not logged in, go to auth
      router.replace("/(auth)/login");
    }
  }, [isLoading, isSignedIn, router]);

  if (isLoading) {
    // Show loading screen while checking auth state
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}

export default function Layout() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <CartProvider>
          <RootNavigator />
        </CartProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}
