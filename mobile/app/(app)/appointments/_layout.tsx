import { Stack, useSegments } from "expo-router";
import { navigationStackScreenOptions } from "utils/navigationStackScreenOptions";
import { NavigationHeader } from "components/themed/NavigationHeader";
import { useEffect, useState } from "react";
import { Icon } from "components/themed";
import tw from "tailwind";

// const defaultNavigationDetails = {
//   title: "My MoVET",
//   icon: <Icon name="clinic-alt" size="xs" style={tw`mr-1`} />,
//   canGoBack: false,
// };
export default function Layout() {
  const segments = useSegments();
  const [navigationDetails, setNavigationDetails] = useState<{
    title: string;
    icon: any;
    canGoBack: boolean;
  } | null>(null);

  useEffect(() => {
    if (segments && segments.includes("new")) {
      //setTimeout(() => {
      setNavigationDetails({
        title: "Schedule Appointment",
        icon: (
          <Icon name="calendar-plus" size="xs" style={tw`mr-2`} color="white" />
        ),
        canGoBack: true,
      });
      //}, 180);
    } else setNavigationDetails(null);
  }, [segments]);

  return (
    <Stack
      screenOptions={{
        ...navigationStackScreenOptions,
        header: () =>
          navigationDetails ? (
            <NavigationHeader
              title={navigationDetails.title}
              icon={navigationDetails.icon}
              canGoBack={navigationDetails.canGoBack}
              goBackRoot="/(app)/appointments/"
            />
          ) : undefined,
      }}
    />
  );
}
