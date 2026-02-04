import { Ionicons } from "@expo/vector-icons";
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
import * as orderAPI from "../../lib/api/order.api";
import type { Order } from "../../lib/types";

const Orders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await orderAPI.getUserOrders({ page: 1, limit: 20 });
      setOrders(response.orders || []);
    } catch (err: any) {
      const message = err?.message || "Failed to load orders";
      setError(message);
      console.error("Failed to fetch orders:", err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string): string => {
    const statusColorMap: { [key: string]: string } = {
      CREATED: "#FFA500",
      ACCEPTED: "#4169E1",
      PREPARING: "#9370DB",
      PICKED_UP: "#20B2AA",
      DELIVERED: "#228B22",
      CANCELLED: "#DC143C",
    };
    return statusColorMap[status] || Colors.light.icon;
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>My Orders</Text>
      </View>

      {loading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={Colors.light.primary} />
          <Text style={styles.loadingText}>Loading orders...</Text>
        </View>
      ) : error ? (
        <View style={styles.errorState}>
          <Ionicons
            name="alert-circle-outline"
            size={80}
            color={Colors.light.icon}
          />
          <Text style={styles.emptyTitle}>Oops! Something went wrong</Text>
          <Text style={styles.emptyText}>{error}</Text>
          <TouchableOpacity style={styles.refreshButton} onPress={fetchOrders}>
            <Ionicons name="refresh" size={20} color="#fff" />
            <Text style={styles.refreshText}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : orders.length === 0 ? (
        <View style={styles.emptyState}>
          <Ionicons
            name="receipt-outline"
            size={80}
            color={Colors.light.icon}
          />
          <Text style={styles.emptyTitle}>No orders yet</Text>
          <Text style={styles.emptyText}>
            You haven&apos;t placed any orders yet. Start exploring restaurants
            to place your first order!
          </Text>
          <TouchableOpacity style={styles.refreshButton} onPress={fetchOrders}>
            <Ionicons name="refresh" size={20} color="#fff" />
            <Text style={styles.refreshText}>Refresh</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.ordersContainer}>
          {orders.map((order) => (
            <View key={order.id} style={styles.orderCard}>
              <View style={styles.orderHeader}>
                <Text style={styles.orderId}>
                  Order #{order.id.slice(0, 8)}
                </Text>
                <View
                  style={[
                    styles.statusBadge,
                    { backgroundColor: getStatusColor(order.status) },
                  ]}
                >
                  <Text style={styles.statusText}>{order.status}</Text>
                </View>
              </View>

              <View style={styles.orderDetails}>
                <Text style={styles.detailLabel}>Restaurant ID:</Text>
                <Text style={styles.detailValue}>
                  {order.restaurantId.slice(0, 8)}
                </Text>
              </View>

              <View style={styles.orderDetails}>
                <Text style={styles.detailLabel}>Total Amount:</Text>
                <Text style={styles.detailValue}>${order.totalAmount}</Text>
              </View>

              <View style={styles.orderDetails}>
                <Text style={styles.detailLabel}>Items:</Text>
                <Text style={styles.detailValue}>
                  {order.items?.length || 0}
                </Text>
              </View>

              <View style={styles.orderDetails}>
                <Text style={styles.detailLabel}>Placed:</Text>
                <Text style={styles.detailValue}>
                  {new Date(order.createdAt).toLocaleDateString()}
                </Text>
              </View>
            </View>
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
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
  },
  emptyState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 40,
  },
  errorState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 40,
    height: 400,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: Colors.light.text,
    marginTop: 20,
    marginBottom: 10,
  },
  emptyText: {
    fontSize: 16,
    color: Colors.light.icon,
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 30,
  },
  refreshButton: {
    backgroundColor: Colors.light.primary,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  refreshText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 8,
  },
  ordersContainer: {
    padding: 20,
  },
  orderCard: {
    backgroundColor: Colors.light.lightGrey,
    borderRadius: 12,
    padding: 15,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  orderHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  orderId: {
    fontSize: 16,
    fontWeight: "bold",
    color: Colors.light.text,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statusText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },
  orderDetails: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  detailLabel: {
    fontSize: 14,
    color: Colors.light.icon,
    flex: 1,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.light.text,
    flex: 1,
    textAlign: "right",
  },
});

export default Orders;
