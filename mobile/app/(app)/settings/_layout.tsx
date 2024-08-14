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
      setNavigationDetails({
        title: "Notifications",
        iconName: "bell",
        canGoBack: true,
      });
    } else if (segments && segments.includes("payment-methods")) {
      setNavigationDetails({
        title: "Payment Methods",
        iconName: "credit-card",
        canGoBack: true,
      });
    } else if (segments && segments.includes("invoice-pay")) {
      setNavigationDetails({
        title: "Pay Invoice",
        iconName: "credit-card",
        canGoBack: true,
      });
    } else if (segments && segments.includes("invoice-detail")) {
      setNavigationDetails({
        title: "Invoice Summary",
        iconName: "folder-heart",
        canGoBack: true,
      });
    } else if (segments && segments.includes("invoices")) {
      setNavigationDetails({
        title: "Invoices",
        iconName: "folder-heart",
        canGoBack: true,
      });
    } else if (segments && segments.includes("privacy-policy")) {
      setNavigationDetails({
        title: "Privacy Policy",
        iconName: "lock",
        canGoBack: true,
      });
    } else if (segments && segments.includes("report-a-bug")) {
      setNavigationDetails({
        title: "Report a Bug",
        iconName: "bug",
        canGoBack: true,
      });
    } else if (segments && segments.includes("account")) {
      if (segments && segments.includes("web-view")) {
        setNavigationDetails({
          title: "Contact Us",
          iconName: "user-medical-message",
          canGoBack: true,
        });
      } else
        setNavigationDetails({
          title: "My Account",
          iconName: "user-edit",
          canGoBack: true,
        });
    } else {
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
        tw`flex-1`,
        navigationDetails?.title === "Settings"
          ? tw`bg-transparent dark:bg-movet-black`
          : tw`bg-movet-red`,
        { paddingTop: insets.top },
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
            />
          ),
        }}
      />
    </Container>
  );
}
