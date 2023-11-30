import { SupportedIcons } from "components/themed";
import { NavigationHeader } from "components/themed/NavigationHeader";
import { Stack, useLocalSearchParams, useSegments, router } from "expo-router";
import { useState, useEffect } from "react";
import { navigationStackScreenOptions } from "utils/navigationStackScreenOptions";

export default function Layout() {
  const segments = useSegments();
  const route = useLocalSearchParams();
  const { screenTitle, screenTitleIcon }: any = route?.params || {};
  const [navigationDetails, setNavigationDetails] = useState<{
    title: string;
    iconName: SupportedIcons;
    canGoBack: boolean;
    goBackRoot?: string;
  }>({
    title: "My Pets",
    iconName: "paw",
    canGoBack: false,
  });

  useEffect(() => {
    if (segments && segments.includes("new-pet")) {
      //setTimeout(() => {
      setNavigationDetails({
        title: "Add a Pet",
        iconName: "plus",
        canGoBack: true,
        goBackRoot: "/(app)/pets",
      });
      //}, 180);
    } else if (segments && segments.includes("new-appointment")) {
      //setTimeout(() => {
      setNavigationDetails({
        title: "Schedule Appointment",
        iconName: "calendar-plus",
        canGoBack: true,
        goBackRoot: "/(app)/pets",
      });
      //}, 180);
    } else
      setNavigationDetails({
        title: "My Pets",
        iconName: "paw",
        canGoBack: false,
      });
  }, [screenTitle, screenTitleIcon, segments, router]);
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
              goBackRoot={navigationDetails.goBackRoot}
            />
          ) : undefined,
      }}
    />
  );
}
