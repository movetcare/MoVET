import { Container } from "components/themed";
import { NavigationHeader } from "components/themed/NavigationHeader";
import { Stack } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import tw from "tailwind";
import { navigationStackScreenOptions } from "utils/navigationStackScreenOptions";

export default function Layout() {
  const insets = useSafeAreaInsets();
  return (
    <Container style={[tw`flex-1 bg-movet-red`, { paddingTop: insets.top }]}>
      <Stack
        screenOptions={{
          ...navigationStackScreenOptions,
          header: () => (
            <NavigationHeader
              title="Chat with MoVET"
              iconName="user-medical-message"
            />
          ),
        }}
      />
    </Container>
  );
}
