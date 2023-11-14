import { Icon } from "components/themed";
import { NavigationHeader } from "components/themed/NavigationHeader";
import { Stack } from "expo-router";
import tw from "tailwind";
import { navigationStackScreenOptions } from "utils/navigationStackScreenOptions";

export default function Layout() {
  return (
    <Stack
      screenOptions={{
        ...navigationStackScreenOptions,
        header: () => (
          <NavigationHeader
            title="Telehealth Chat"
            icon={
              <Icon
                name="user-medical-message"
                size="xs"
                style={tw`mr-2`}
                color="white"
              />
            }
          />
        ),
      }}
    />
  );
}
