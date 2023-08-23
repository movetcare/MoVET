import { Stack } from "expo-router";
import { navigationStackScreenOptions } from "utils/navigationStackScreenOptions";
import { NavigationHeader } from "components/NavigationHeader";

export default function Layout() {
  return (
    <Stack
      screenOptions={{
        ...navigationStackScreenOptions,
        header: () => <NavigationHeader title="My MoVET" icon="🏠" />,
      }}
    >
      <Stack.Screen
        name="new-entry-modal"
        options={{
          presentation: "modal",
        }}
      />
    </Stack>
  );
}
