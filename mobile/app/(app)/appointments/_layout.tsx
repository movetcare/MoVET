import { Stack, useSegments } from "expo-router";
import { navigationStackScreenOptions } from "utils/navigationStackScreenOptions";
import { NavigationHeader } from "components/themed/NavigationHeader";
import { useEffect, useState } from "react";

export default function Layout() {
  const segments = useSegments();
  const [navigationDetails, setNavigationDetails] = useState<{
    title: string;
    iconName: any;
    canGoBack: boolean;
  } | null>(null);

  useEffect(() => {
    if (segments && segments.includes("new")) {
      //setTimeout(() => {
      setNavigationDetails({
        title: "Schedule Appointment",
        iconName: "calendar-plus",
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
              iconName={navigationDetails.iconName}
              canGoBack={navigationDetails.canGoBack}
              goBackRoot="/(app)/appointments/"
            />
          ) : undefined,
      }}
    />
  );
}
