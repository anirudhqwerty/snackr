import { View, Text, Pressable } from "react-native";
import { removeToken } from "../../lib/auth";
import { router } from "expo-router";

export default function CustomerHome() {
  async function logout() {
    await removeToken();
    router.replace("/login");
  }

  return (
    <View>
      <Text>Customer Home</Text>
      <Pressable onPress={logout}>
        <Text>Logout</Text>
      </Pressable>
    </View>
  );
}
