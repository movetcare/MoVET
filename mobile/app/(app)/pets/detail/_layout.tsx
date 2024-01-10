import { SupportedIcons } from "components/themed";
import { NavigationHeader } from "components/themed/NavigationHeader";
import { Stack, useSegments } from "expo-router";
import { useState, useEffect } from "react";
import { AppointmentsStore } from "stores";
import { navigationStackScreenOptions } from "utils/navigationStackScreenOptions";

export default function Layout() {
  const segments = useSegments();
  const { upcomingAppointments, pastAppointments } =
    AppointmentsStore.useState();
  const [navigationDetails, setNavigationDetails] = useState<{
    title: string;
    iconName: SupportedIcons;
    canGoBack: boolean;
  } | null>(null);

  useEffect(() => {
    if (segments)
      if (segments.includes("edit")) {
        setNavigationDetails({
          title: "Edit Pet",
          iconName: "pencil",
          canGoBack: true,
        });
      } else if (segments.includes("new-appointment")) {
        setNavigationDetails({
          title:
            (!upcomingAppointments && !pastAppointments
              ? "Request"
              : "Schedule") + " an Appointment",
          iconName: "calendar-plus",
          canGoBack: true,
        });
      } else if (segments.includes("appointment-detail")) {
        setNavigationDetails({
          title: "Appointment Summary",
          iconName: "calendar-heart",
          canGoBack: true,
        });
      } else if (segments && segments.includes("web-view")) {
        setNavigationDetails({
          title: "Request Pet's Records",
          iconName: "folder-heart",
          canGoBack: true,
        });
      } else if (segments.includes("detail")) {
        setNavigationDetails({
          title: "My Pet",
          iconName: "paw",
          canGoBack: true,
        });
      } else setNavigationDetails(null);
  }, [pastAppointments, segments, upcomingAppointments]);
  return (
    <Stack
      screenOptions={{
        ...navigationStackScreenOptions,
        header: (props) => {
          return navigationDetails ? (
            <NavigationHeader
              title={props.options.title || navigationDetails.title}
              iconName={navigationDetails.iconName}
              canGoBack={navigationDetails.canGoBack}
            />
          ) : undefined;
        },
      }}
    />
  );
}
