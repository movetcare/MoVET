import { Stack, useSegments } from "expo-router";
import { navigationStackScreenOptions } from "utils/navigationStackScreenOptions";
import { NavigationHeader } from "components/NavigationHeader";
import { useEffect, useState } from "react";

const defaultNavigationDetails = {
  title: "My MoVET",
  icon: "home",
  canGoBack: false,
};
export default function Layout() {
  const segments = useSegments();
  const [navigationDetails, setNavigationDetails] = useState<{
    title: string;
    icon: string;
    canGoBack: boolean;
  }>(defaultNavigationDetails);

  useEffect(() => {
    if (segments && segments.includes("web-view")) {
      //setTimeout(() => {
      setNavigationDetails({
        title: "Latest Announcement",
        icon: "bullhorn",
        canGoBack: true,
      });
      //}, 180);
    } else setNavigationDetails(defaultNavigationDetails);
  }, [segments]);

  return (
    <Stack
      screenOptions={{
        ...navigationStackScreenOptions,
        header: () => (
          <NavigationHeader
            title={navigationDetails.title}
            icon={navigationDetails.icon}
            canGoBack={navigationDetails.canGoBack}
          />
        ),
      }}
    />
  );
}
