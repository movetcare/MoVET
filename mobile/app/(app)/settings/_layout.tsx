import { Container, SupportedIcons } from "components/themed";
import { NavigationHeader } from "components/themed/NavigationHeader";
import { Stack, useSegments } from "expo-router";
import { useState, useEffect } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import tw from "tailwind";
import { navigationStackScreenOptions } from "utils/navigationStackScreenOptions";

export default function Layout() {
  const segments = useSegments();
  const insets = useSafeAreaInsets();
  const [usesSafeAreaInsets, setUsesSafeAreaInsets] = useState(false);
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
        title: "Notifications",
        iconName: "bell",
        canGoBack: true,
      });
      setUsesSafeAreaInsets(true);
      //}, 180);
    } else if (segments && segments.includes("payment-methods")) {
      //setTimeout(() => {
      setNavigationDetails({
        title: "Payment Methods",
        iconName: "credit-card",
        canGoBack: true,
      });
      setUsesSafeAreaInsets(true);
      //}, 180);
    } else if (segments && segments.includes("account")) {
      setUsesSafeAreaInsets(true);
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
    } else {
      setUsesSafeAreaInsets(false);
      setNavigationDetails({
        title: "Settings",
        iconName: "gear",
        canGoBack: false,
      });
    }
  }, [segments]);

  return (
    <Container
      style={[
        tw`flex-1 bg-movet-red`,
        { paddingTop: usesSafeAreaInsets ? insets.top : 0 },
      ]}
    >
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
    </Container>
  );
}
