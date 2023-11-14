import { Stack } from "expo-router";
import { Text, View } from "react-native";
import { PatientsStore } from "stores/PatientsStore";

const MyPets = () => {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Stack.Screen options={{ headerShown: true, title: "MyPets" }} />
      <Text>{JSON.stringify(PatientsStore.useState())}</Text>
    </View>
  );
};
export default MyPets;
