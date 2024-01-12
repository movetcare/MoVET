import { Container, SupportedIcons } from "components/themed";
import { NavigationHeader } from "components/themed/NavigationHeader";
import { Stack, useSegments } from "expo-router";
import { useState, useEffect } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { AppointmentsStore } from "stores";
import tw from "tailwind";
import { navigationStackScreenOptions } from "utils/navigationStackScreenOptions";

export default function Layout() {
  const insets = useSafeAreaInsets();
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
      if (segments.includes("new-pet")) {
        //setTimeout(() => {

        setNavigationDetails({
          title: "Add a Pet",
          iconName: "plus",
          canGoBack: true,
        });

        //}, 180);
      } else if (
        segments.includes("new-appointment") &&
        !segments.includes("detail")
      ) {
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
      } else if (
        segments.includes("pets") &&
        !segments.includes("appointment-detail") &&
        !segments.includes("detail")
      )
        setNavigationDetails(null);
      else setNavigationDetails(null);
  }, [pastAppointments, segments, upcomingAppointments]);
  return (
    <Container
      style={[
        tw`flex-1`,
        segments.includes("pets") &&
        !segments.includes("appointment-detail") &&
        !segments.includes("detail")
          ? tw`bg-transparent dark:bg-movet-black`
          : tw`bg-movet-red`,
        { paddingTop: insets.top },
      ]}
    >
      <Stack
        screenOptions={{
          ...navigationStackScreenOptions,
          header: (props) =>
            navigationDetails ? (
              <NavigationHeader
                title={props.options.title || navigationDetails.title}
                iconName={navigationDetails.iconName}
                canGoBack={navigationDetails.canGoBack}
              />
            ) : undefined,
        }}
      />
    </Container>
  );
}
