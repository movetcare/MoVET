import { SupportedIcons } from "components/themed";
import { NavigationHeader } from "components/themed/NavigationHeader";
import { Stack, useLocalSearchParams, useSegments } from "expo-router";
import { useState, useEffect } from "react";
import { navigationStackScreenOptions } from "utils/navigationStackScreenOptions";

export default function Layout() {
  const segments = useSegments();
  const router = useLocalSearchParams();
  const { screenTitle, screenTitleIcon }: any = router?.params || {};
  const [navigationDetails, setNavigationDetails] = useState<{
    title: string;
    iconName: SupportedIcons;
    canGoBack: boolean;
  }>({
    title: "My Pets",
    iconName: "paw",
    canGoBack: false,
  });

  useEffect(() => {
    if (segments && segments.includes("new")) {
      //setTimeout(() => {
      setNavigationDetails({
        title: "Add a Pet",
        iconName: "plus",
        canGoBack: true,
      });
      //}, 180);
    } else
      setNavigationDetails({
        title: "My Pets",
        iconName: "paw",
        canGoBack: false,
      });
  }, [screenTitle, screenTitleIcon, segments]);
  return (
    <Stack
      screenOptions={{
        ...navigationStackScreenOptions,
        header: () => (
          <NavigationHeader
            title={navigationDetails?.title}
            iconName={navigationDetails?.iconName}
            canGoBack={navigationDetails?.canGoBack}
            goBackRoot={"/(app)/pets"}
          />
        ),
      }}
    />
  );
}
