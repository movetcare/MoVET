import { SupportedIcons } from "components/themed";
import { NavigationHeader } from "components/themed/NavigationHeader";
import { Stack, useLocalSearchParams, useSegments } from "expo-router";
import { useState, useEffect } from "react";
import { navigationStackScreenOptions } from "utils/navigationStackScreenOptions";

export default function Layout() {
  const segments = useSegments();
  const [navigationDetails, setNavigationDetails] = useState<{
    title: string;
    iconName: SupportedIcons;
    canGoBack: boolean;
    goBackRoot?: string;
  } | null>(null);

  useEffect(() => {
    if (segments)
      if (segments.includes("new-pet")) {
        //setTimeout(() => {
        setNavigationDetails({
          title: "Add a Pet",
          iconName: "plus",
          canGoBack: true,
          goBackRoot: "/(app)/pets",
        });
        //}, 180);
      } else if (
        segments.includes("new-appointment") &&
        !segments.includes("detail")
      ) {
        //setTimeout(() => {
        setNavigationDetails({
          title: "Schedule Appointment",
          iconName: "calendar-plus",
          canGoBack: true,
          goBackRoot: "/(app)/pets",
        });
        //}, 180);
      } else if (
        segments.includes("pets") &&
        !segments.includes("appointment-detail") &&
        !segments.includes("detail")
      ) {
        setNavigationDetails({
          title: "My Pets",
          iconName: "paw",
          canGoBack: false,
        });
      } else setNavigationDetails(null);
  }, [segments]);
  return (
    <Stack
      screenOptions={{
        ...navigationStackScreenOptions,
        header: (props) => {
          //console.log("props", props);
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
