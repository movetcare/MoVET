import { Stack, useLocalSearchParams, useSegments } from "expo-router";
import { navigationStackScreenOptions } from "utils/navigationStackScreenOptions";
import { NavigationHeader } from "components/themed/NavigationHeader";
import { useEffect, useState } from "react";
import { Container, SupportedIcons } from "components/themed";
import { AppointmentsStore } from "stores/AppointmentsStore";
import tw from "tailwind";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function Layout() {
  const segments = useSegments();
  const router = useLocalSearchParams();
  const insets = useSafeAreaInsets();
  const [usesSafeAreaInsets, setUsesSafeAreaInsets] = useState(false);
  const { upcomingAppointments, pastAppointments } =
    AppointmentsStore.useState();
  const { screenTitle, screenTitleIcon }: any = router?.params || {};
  const [navigationDetails, setNavigationDetails] = useState<{
    title: string;
    iconName: SupportedIcons;
    canGoBack: boolean;
  } | null>(null);

  useEffect(() => {
    if (screenTitle) {
      setUsesSafeAreaInsets(true);
      setNavigationDetails({
        title: screenTitle as string,
        iconName: screenTitleIcon ? screenTitleIcon : "bullhorn",
        canGoBack: true,
      });
    } else if (segments && segments.includes("web-view")) {
      //setTimeout(() => {
      setUsesSafeAreaInsets(true);
      setNavigationDetails({
        title: "Announcement",
        iconName: "bullhorn",
        canGoBack: true,
      });
      //}, 180);
    } else if (segments && segments.includes("new-pet")) {
      //setTimeout(() => {
      setUsesSafeAreaInsets(true);
      setNavigationDetails({
        title: "Add a Pet",
        iconName: "paw",
        canGoBack: true,
      });
      //}, 180);
    } else if (segments && segments.includes("new-appointment")) {
      //setTimeout(() => {
      setUsesSafeAreaInsets(true);
      setNavigationDetails({
        title:
          (!upcomingAppointments && !pastAppointments
            ? "Request"
            : "Schedule") + " an Appointment",
        iconName: "calendar-plus",
        canGoBack: true,
      });
      //}, 180);
    } else if (segments && segments.includes("appointment-detail")) {
      //setTimeout(() => {
      setUsesSafeAreaInsets(true);
      setNavigationDetails({
        title: "Appointment Summary",
        iconName: "calendar-heart",
        canGoBack: true,
      });
      //}, 180);
    } else {
      setUsesSafeAreaInsets(false);
      setNavigationDetails(null);
    }
  }, [screenTitle, screenTitleIcon, segments]);

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
    </Container>
  );
}
