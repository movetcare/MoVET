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
      //setTimeout(() => {
      setNavigationDetails({
        title: "Announcement",
        iconName: "bullhorn",
        canGoBack: true,
      });
      //}, 180);
    } else if (segments && segments.includes("services")) {
      //setTimeout(() => {
      setNavigationDetails({
        title: "Our Services",
        iconName: "list",
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
    } else if (segments && segments.includes("quick-book-appointment")) {
      //setTimeout(() => {
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
      console.log("segments", segments);
      setNavigationDetails({
        title: "Upcoming Appointment",
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
