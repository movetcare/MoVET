import { Stack, useSegments } from "expo-router";
import { navigationStackScreenOptions } from "utils/navigationStackScreenOptions";
import { NavigationHeader } from "components/themed/NavigationHeader";
import { useEffect, useState } from "react";
import { Container, SupportedIcons } from "components/themed";
import { AppointmentsStore } from "stores/AppointmentsStore";
import tw from "tailwind";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function Layout() {
  const segments = useSegments();
  const insets = useSafeAreaInsets();
  const { upcomingAppointments, pastAppointments } =
    AppointmentsStore.useState();
  const [navigationDetails, setNavigationDetails] = useState<{
    title: string;
    iconName: SupportedIcons;
    canGoBack: boolean;
  } | null>(null);

  useEffect(() => {
    if (segments && segments.includes("announcement")) {
      setNavigationDetails({
        title: "Announcement",
        iconName: "bullhorn",
        canGoBack: true,
      });
    } else if (segments && segments.includes("invoice-detail")) {
      setNavigationDetails({
        title: "Invoice Summary",
        iconName: "folder-heart",
        canGoBack: true,
      });
    } else if (segments && segments.includes("services")) {
      setNavigationDetails({
        title: "Our Services",
        iconName: "list",
        canGoBack: true,
      });
    } else if (segments && segments.includes("new-pet")) {
      setNavigationDetails({
        title: "Add a Pet",
        iconName: "paw",
        canGoBack: true,
      });
    } else if (segments && segments.includes("new-appointment")) {
      setNavigationDetails({
        title:
          (!upcomingAppointments && !pastAppointments
            ? "Request"
            : "Schedule") + " an Appointment",
        iconName: "calendar-plus",
        canGoBack: true,
      });
    } else if (segments && segments.includes("quick-book-appointment")) {
      setNavigationDetails({
        title:
          (!upcomingAppointments && !pastAppointments
            ? "Request"
            : "Schedule") + " an Appointment",
        iconName: "calendar-plus",
        canGoBack: true,
      });
    } else if (
      segments.includes("appointment-detail") &&
      !segments.includes("pet")
    ) {
      setNavigationDetails({
        title: "Appointment Details",
        iconName: "calendar-heart",
        canGoBack: true,
      });
    } else setNavigationDetails(null);
  }, [pastAppointments, segments, upcomingAppointments]);

  return (
    <Container
      style={[
        tw`flex-1 `,
        !navigationDetails && !segments.includes("pet")
          ? tw`bg-transparent dark:bg-movet-black`
          : tw`bg-movet-red`,
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
