import { SupportedIcons } from "components/themed";
import { NavigationHeader } from "components/themed/NavigationHeader";
import { Stack, useSegments } from "expo-router";
import { useState, useEffect } from "react";
import { navigationStackScreenOptions } from "utils/navigationStackScreenOptions";

export default function Layout() {
  const segments = useSegments();
  const [navigationDetails, setNavigationDetails] = useState<{
    title: string;
    iconName: SupportedIcons;
    canGoBack: boolean;
  }>({
    title: "Settings",
    iconName: "gear",
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
      if (segments && segments.includes("web-view")) {
        //setTimeout(() => {
        setNavigationDetails({
          title: "Contact Us",
          iconName: "user-medical-message",
          canGoBack: true,
        });
        //}, 180);
      }
      //setTimeout(() => {
      else
        setNavigationDetails({
          title: "My Account",
          iconName: "user-edit",
          canGoBack: true,
        });
      //}, 180);
    } else
      setNavigationDetails({
        title: "Settings",
        iconName: "gear",
        canGoBack: false,
      });
  }, [segments]);
  return (
    <Stack
      screenOptions={{
        ...navigationStackScreenOptions,
        header: () => (
          <NavigationHeader
            title={navigationDetails?.title}
            iconName={navigationDetails?.iconName}
            canGoBack={navigationDetails?.canGoBack}
            goBackRoot={
              segments && segments.includes("web-view")
                ? "/(app)/settings/account"
                : "/(app)/settings"
            }
          />
        ),
      }}
    />
  );
}
