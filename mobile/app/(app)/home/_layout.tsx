import { Stack, useSegments } from "expo-router";
import { navigationStackScreenOptions } from "utils/navigationStackScreenOptions";
import { NavigationHeader } from "components/themed/NavigationHeader";
import { useEffect, useState } from "react";
import { Icon } from "components/themed";
import tw from "tailwind";

const defaultNavigationDetails = {
  title: "My MoVET",
  icon: <Icon name="clinic-alt" size="xs" style={tw`mr-1`} />,
  canGoBack: false,
};
export default function Layout() {
  const segments = useSegments();
  const [navigationDetails, setNavigationDetails] = useState<{
    title: string;
    icon: any;
    canGoBack: boolean;
  }>(defaultNavigationDetails);

  useEffect(() => {
    if (segments && segments.includes("web-view")) {
      //setTimeout(() => {
      setNavigationDetails({
        title: "Announcement",
        icon: <Icon name="boutique" size="xs" style={tw`mr-1`} />,
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
