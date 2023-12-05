import { SupportedIcons } from "components/themed";
import { NavigationHeader } from "components/themed/NavigationHeader";
import { Stack, useLocalSearchParams, useSegments } from "expo-router";
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
  } | null>(null);

  useEffect(() => {
    if (segments)
      if (segments.includes("edit")) {
        //setTimeout(() => {
        setNavigationDetails({
          title: "Edit Pet",
          iconName: "pencil",
          canGoBack: true,
          goBackRoot: "/(app)/pets/detail",
        });
        //}, 180);
      } else if (segments.includes("new-appointment")) {
        //setTimeout(() => {
        setNavigationDetails({
          title: "Schedule Appointment",
          iconName: "calendar-plus",
          canGoBack: true,
          goBackRoot: "/(app)/pets/detail",
        });
        //}, 180);
      } else if (segments.includes("appointment-detail")) {
        setNavigationDetails({
          title: "Appointment Summary",
          iconName: "calendar-heart",
          canGoBack: true,
          goBackRoot: "/(app)/pets/detail",
        });
      } else if (segments.includes("detail")) {
        setNavigationDetails({
          title: "My Pet",
          iconName: "paw",
          canGoBack: true,
          goBackRoot: "/(app)/pets/",
        });
      } else setNavigationDetails(null);
  }, [screenTitle, screenTitleIcon, segments]);
  return (
    <Stack
      screenOptions={{
        ...navigationStackScreenOptions,
        header: (props) => {
          return navigationDetails ? (
            <NavigationHeader
              title={props.options.title || navigationDetails.title}
              iconName={navigationDetails.iconName}
              canGoBack={navigationDetails.canGoBack}
              goBackRoot={navigationDetails.goBackRoot}
            />
          ) : undefined;
        },
      }}
    />
  );
}
