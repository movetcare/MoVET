import { Stack } from "expo-router";
import { navigationStackScreenOptions } from "utils/navigationStackScreenOptions";

export default function Layout() {
  return (
    <Stack
      screenOptions={{
        ...navigationStackScreenOptions,
        header: () => null,
      }}
    />
  );
}
