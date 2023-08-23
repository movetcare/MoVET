import { Stack, router } from "expo-router";
import { Pressable, StyleSheet } from "react-native";

import { Text, View } from "../components/Themed";

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: "Oops!" }} />
      <View style={styles.container}>
        <Text style={styles.title}>
          The screen you are looking for does not exist.
        </Text>
        <Pressable onPress={() => router.replace("/(app)/home")}>
          <Text style={styles.linkText}>Go to home screen!</Text>
        </Pressable>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  link: {
    marginTop: 15,
    paddingVertical: 15,
  },
  linkText: {
    fontSize: 14,
    color: "#2e78b7",
  },
});
