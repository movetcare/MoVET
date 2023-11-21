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
    iconName: any;
    canGoBack: boolean;
  }>({
    title: "Settings",
    iconName: "cog",
    canGoBack: false,
  });

  useEffect(() => {
    if (segments && segments.includes("notifications")) {
      //setTimeout(() => {
      setNavigationDetails({
        title: "Notification Settings",
        iconName: "bell",
        canGoBack: true,
      });
      //}, 180);
    } else if (segments && segments.includes("payment-methods")) {
      //setTimeout(() => {
      setNavigationDetails({
        title: "Payment Settings",
        iconName: "credit-card",
        canGoBack: true,
      });
      //}, 180);
    } else if (segments && segments.includes("account")) {
      //setTimeout(() => {
      setNavigationDetails({
        title: "My Account",
        iconName: "user-edit",
        canGoBack: true,
      });
      //}, 180);
    } else
      setNavigationDetails({
        title: "Settings",
        iconName: "cog",
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
            goBackRoot="/(app)/settings"
          />
        ),
      }}
    />
  );
}
