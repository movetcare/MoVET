import { NavigationHeader } from "components/themed/NavigationHeader";
import { Stack } from "expo-router";
import { navigationStackScreenOptions } from "utils/navigationStackScreenOptions";

export default function Layout() {
  return (
    <Stack
      screenOptions={{
        ...navigationStackScreenOptions,
        header: () => <NavigationHeader title="Telehealth Chat" icon="💬" />,
      }}
    />
  );
}
