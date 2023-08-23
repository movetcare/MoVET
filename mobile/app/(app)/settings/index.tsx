import { Stack, useRouter } from "expo-router";
import { Button, Text, View } from "react-native";
import { signOff } from "services/Auth";
import { AuthStore } from "stores";

const Tab2Index = () => {
  const router = useRouter();
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Stack.Screen options={{ headerShown: true, title: "Settings" }} />
      {/* <Text style={{ fontFamily: "EncodeSansSemiCondensed_100Thin" }}>
        EncodeSansSemiCondensed_100Thin
      </Text>
      <Text style={{ fontFamily: "EncodeSansSemiCondensed_300Light" }}>
        EncodeSansSemiCondensed_300Light
      </Text> */}
      <Text>{AuthStore.getRawState().user?.email}</Text>
      <Text>{AuthStore.getRawState().user?.displayName}</Text>
      <Button
        onPress={async () => {
          if (await signOff()) router.replace("/(auth)/login");

        }}
        title="LOGOUT"
      />
    </View>
  );
};
export default Tab2Index;
