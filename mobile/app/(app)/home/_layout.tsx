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
      setNavigationDetails({
        title: screenTitle as string,
        iconName: screenTitleIcon ? screenTitleIcon : "bullhorn",
        canGoBack: true,
      });
    } else if (segments && segments.includes("web-view")) {
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
    } else if (segments && segments.includes("new-appointment")) {
      //setTimeout(() => {
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
      setNavigationDetails({
        title: "Appointment Summary",
        iconName: "calendar-heart",
        canGoBack: true,
      });
      //}, 180);
    } else setNavigationDetails(null);
  }, [
    pastAppointments,
    screenTitle,
    screenTitleIcon,
    segments,
    upcomingAppointments,
  ]);

  return (
    <Container
      style={[
        tw`flex-1 `,
        !navigationDetails ? tw`bg-transparent dark:bg-movet-black` : tw`bg-movet-red`,
        { paddingTop: insets.top },
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
