import { Stack, useLocalSearchParams, useSegments } from "expo-router";
import { navigationStackScreenOptions } from "utils/navigationStackScreenOptions";
import { NavigationHeader } from "components/themed/NavigationHeader";
import { useEffect, useState } from "react";

export default function Layout() {
  const segments = useSegments();
  const router = useLocalSearchParams();
  const { screenTitle, screenTitleIcon }: any = router?.params || {};
  const [navigationDetails, setNavigationDetails] = useState<{
    title: string;
    iconName: any;
    canGoBack: boolean;
  } | null>(null);

  useEffect(() => {
    if (screenTitle)
      setNavigationDetails({
        title: screenTitle as string,
        iconName: screenTitleIcon ? screenTitleIcon : "bullhorn",
        canGoBack: true,
      });
    else if (segments && segments.includes("web-view")) {
      //setTimeout(() => {
      setNavigationDetails({
        title: "Announcement",
        iconName: "bullhorn",
        canGoBack: true,
      });
      //}, 180);
    } else if (segments && segments.includes("new-pet")) {
      //setTimeout(() => {
      setNavigationDetails({
        title: "Add a Pet",
        iconName: "paw",
        canGoBack: true,
      });
      //}, 180);
    } else setNavigationDetails(null);
  }, [screenTitle, screenTitleIcon, segments]);

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
            />
          ) : undefined,
      }}
    />
  );
}
