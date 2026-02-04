import { Stack, useRootNavigationState, useRouter, useSegments } from "expo-router";
import React, { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { AuthProvider, useAuth } from "../lib/auth/context";
import { CartProvider } from "../lib/context/CartContext";

function RootNavigator() {
  const router = useRouter();
  const segments = useSegments();
  const navigationState = useRootNavigationState();
  const { isLoading, isSignedIn } = useAuth();

  // Handle navigation based on auth state
  useEffect(() => {
    if (!navigationState?.key) {
      return; // Wait for navigation to be ready
    }
    if (isLoading) {
      return; // Still loading, wait for auth state
    }

    const inAuthGroup = segments[0] === "(auth)";
    if (isSignedIn) {
      // User is logged in, go to tabs
      if (inAuthGroup) {
        router.replace("/(tabs)");
      }
    } else {
      // User is not logged in, go to auth
      if (!inAuthGroup) {
        router.replace("/(auth)/login");
      }
    }
  }, [isLoading, isSignedIn, router, segments, navigationState?.key]);

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
