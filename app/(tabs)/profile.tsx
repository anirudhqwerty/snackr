import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { Colors } from "../../constants/theme";
import * as userAPI from "../../lib/api/user.api";
import { useAuth } from "../../lib/auth/context";
import type { User } from "../../lib/types";

const Profile: React.FC = () => {
  const router = useRouter();
  const { logout, accessToken, user } = useAuth();
  const [profileData, setProfileData] = useState<User | null>(user || null);
  const [loading, setLoading] = useState(false);

  // Load user profile on component mount
  useEffect(() => {
    const loadProfile = async () => {
      if (!accessToken) return;
      try {
        setLoading(true);
        const profile = await userAPI.getCurrentUser();
        setProfileData(profile);
      } catch (error) {
        console.error("Failed to load profile:", error);
      } finally {
        setLoading(false);
      }
    };

    if (accessToken) {
      loadProfile();
    }
  }, [accessToken]);

  const handleLogout = async () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      {
        text: "Cancel",
        onPress: () => {},
        style: "cancel",
      },
      {
        text: "Logout",
        onPress: async () => {
          try {
            await logout();
            router.replace("/(auth)/login");
          } catch (error) {
            console.error("Logout error:", error);
            router.replace("/(auth)/login");
          }
        },
        style: "destructive",
      },
    ]);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="person-circle" size={80} color="#fff" />
        <Text style={styles.title}>My Profile</Text>
      </View>

      {loading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={Colors.light.primary} />
        </View>
      ) : (
        <>
          <View style={styles.profileSection}>
            <Text style={styles.sectionTitle}>Account Information</Text>

            <View style={styles.infoItem}>
              <Text style={styles.label}>Email:</Text>
              <Text style={styles.value}>
                {profileData?.email || "[Not set]"}
              </Text>
            </View>

            <View style={styles.infoItem}>
              <Text style={styles.label}>First Name:</Text>
              <Text style={styles.value}>
                {profileData?.firstName || "[Not set]"}
              </Text>
            </View>

            <View style={styles.infoItem}>
              <Text style={styles.label}>Last Name:</Text>
              <Text style={styles.value}>
                {profileData?.lastName || "[Not set]"}
              </Text>
            </View>

            <View style={styles.infoItem}>
              <Text style={styles.label}>Phone:</Text>
              <Text style={styles.value}>
                {profileData?.phone || "[Not set]"}
              </Text>
            </View>

            <View style={styles.infoItem}>
              <Text style={styles.label}>Bio:</Text>
              <Text style={styles.value}>
                {profileData?.bio || "[Not set]"}
              </Text>
            </View>
          </View>

          <View style={styles.actions}>
            <TouchableOpacity
              style={styles.logoutButton}
              onPress={handleLogout}
            >
              <Ionicons name="log-out-outline" size={20} color="#fff" />
              <Text style={styles.logoutText}>Logout</Text>
            </TouchableOpacity>
          </View>
        </>
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
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    height: 200,
  },
  header: {
    backgroundColor: Colors.light.primary,
    alignItems: "center",
    padding: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    marginTop: 10,
  },
  profileSection: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: Colors.light.text,
    marginBottom: 20,
  },
  infoItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    color: Colors.light.text,
  },
  value: {
    fontSize: 16,
    color: Colors.light.icon,
  },
  actions: {
    padding: 20,
  },
  logoutButton: {
    backgroundColor: Colors.light.accent,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 15,
    borderRadius: 8,
  },
  logoutText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 8,
  },
});

export default Profile;
