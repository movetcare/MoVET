import { Stack, useRouter } from "expo-router";
import { Button, Text, View } from "react-native";
import { signOff } from "services/Auth";
import { AuthStore } from "stores";

const Settings = () => {
  const router = useRouter();
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Stack.Screen options={{ headerShown: true, title: "Settings" }} />
      <Text>{JSON.stringify(AuthStore.getRawState()?.user)}</Text>
      <Button
        onPress={async () => {
          if (await signOff()) router.replace("/(auth)/sign-in");
        }}
        title="LOGOUT"
      />
    </View>
  );
};
export default Settings;
