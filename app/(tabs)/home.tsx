import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
    ActivityIndicator,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { Colors } from "../../constants/theme";
import { getRestaurants } from "../../lib/api/restaurant.api";
import type { Restaurant, RestaurantListResponse } from "../../lib/types";

const Home: React.FC = () => {
  const router = useRouter();
  const [restaurants, setRestaurants] = useState<RestaurantListResponse | null>(
    null,
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchRestaurants();
  }, []);

  const fetchRestaurants = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getRestaurants({ page: 1, limit: 10 });
      setRestaurants(data);
    } catch (err: any) {
      const message = err?.message || "Failed to load restaurants";
      setError(message);
      console.error("Failed to fetch restaurants:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleRestaurantPress = (restaurantId: string) => {
    router.push(`/(tabs)/restaurant/${restaurantId}`);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Snackr</Text>
        <Text style={styles.subtitle}>Discover delicious food</Text>
      </View>

      {loading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={Colors.light.primary} />
          <Text style={styles.loadingText}>Loading restaurants...</Text>
        </View>
      ) : error ? (
        <View style={styles.errorState}>
          <Text style={styles.emptyTitle}>Oops! Something went wrong</Text>
          <Text style={styles.emptyText}>{error}</Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={fetchRestaurants}
          >
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : !restaurants || restaurants.restaurants.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyTitle}>No restaurants available yet</Text>
          <Text style={styles.emptyText}>
            We&apos;re working on bringing you the best local restaurants. Check
            back soon!
          </Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={fetchRestaurants}
          >
            <Text style={styles.retryButtonText}>Refresh</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.placeholderSection}>
          <Text style={styles.sectionTitle}>Featured Restaurants</Text>
          {restaurants.restaurants.map((restaurant: Restaurant) => (
            <TouchableOpacity
              key={restaurant.id}
              style={styles.restaurantCard}
              onPress={() => handleRestaurantPress(restaurant.id)}
            >
              <View style={styles.restaurantContent}>
                <Text style={styles.restaurantName}>{restaurant.name}</Text>
                <Text style={styles.restaurantDesc} numberOfLines={2}>
                  {restaurant.description}
                </Text>
                <View style={styles.restaurantFooter}>
                  <Text style={styles.ratingText}>⭐ {restaurant.rating}</Text>
                  <Text style={styles.statusText}>
                    {restaurant.isActive ? "Open" : "Closed"}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  centerContainer: {
    justifyContent: "center",
    alignItems: "center",
    height: 300,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: Colors.light.text,
  },
  header: {
    padding: 20,
    backgroundColor: Colors.light.primary,
    alignItems: "center",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#fff",
  },
  subtitle: {
    fontSize: 16,
    color: "#fff",
    marginTop: 5,
  },
  emptyState: {
    padding: 20,
    alignItems: "center",
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: Colors.light.text,
    marginBottom: 10,
  },
  emptyText: {
    fontSize: 16,
    color: Colors.light.icon,
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 20,
  },
  errorState: {
    padding: 20,
    alignItems: "center",
    height: 300,
    justifyContent: "center",
  },
  retryButton: {
    marginTop: 15,
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: Colors.light.primary,
    borderRadius: 8,
  },
  retryButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  placeholderSection: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: Colors.light.text,
    marginBottom: 15,
  },
  restaurantCard: {
    backgroundColor: Colors.light.lightGrey,
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  restaurantContent: {
    flex: 1,
  },
  restaurantName: {
    fontSize: 18,
    fontWeight: "bold",
    color: Colors.light.text,
  },
  restaurantDesc: {
    fontSize: 14,
    color: Colors.light.icon,
    marginTop: 5,
  },
  restaurantFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },
  ratingText: {
    fontSize: 12,
    color: Colors.light.text,
    fontWeight: "600",
  },
  statusText: {
    fontSize: 12,
    color: Colors.light.primary,
    fontWeight: "600",
  },
});

export default Home;
