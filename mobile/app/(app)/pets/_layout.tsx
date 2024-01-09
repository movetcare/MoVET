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
  const [usesSafeAreaInsets, setUsesSafeAreaInsets] = useState(false);
  const segments = useSegments();
  const { upcomingAppointments, pastAppointments } =
    AppointmentsStore.useState();
  const [navigationDetails, setNavigationDetails] = useState<{
    title: string;
    iconName: SupportedIcons;
    canGoBack: boolean;
    goBackRoot?: string;
  } | null>(null);

  useEffect(() => {
    if (segments)
      if (segments.includes("new-pet")) {
        //setTimeout(() => {
        setUsesSafeAreaInsets(true);
        setNavigationDetails({
          title: "Add a Pet",
          iconName: "plus",
          canGoBack: true,
          goBackRoot: "/(app)/pets",
        });

        //}, 180);
      } else if (
        segments.includes("new-appointment") &&
        !segments.includes("detail")
      ) {
        //setTimeout(() => {
        setUsesSafeAreaInsets(true);
        setNavigationDetails({
          title:
            (!upcomingAppointments && !pastAppointments
              ? "Request"
              : "Schedule") + " an Appointment",
          iconName: "calendar-plus",
          canGoBack: true,
          goBackRoot: "/(app)/pets",
        });
        //}, 180);
      } else if (
        segments.includes("pets") &&
        !segments.includes("appointment-detail") &&
        !segments.includes("detail")
      ) {
        setUsesSafeAreaInsets(false);
        setNavigationDetails(null);
      } else {
        setUsesSafeAreaInsets(true);
        setNavigationDetails(null);
      }
  }, [pastAppointments, segments, upcomingAppointments]);
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
          header: (props) =>
            navigationDetails ? (
              <NavigationHeader
                title={props.options.title || navigationDetails.title}
                iconName={navigationDetails.iconName}
                canGoBack={navigationDetails.canGoBack}
                goBackRoot={navigationDetails.goBackRoot}
              />
            ) : undefined,
        }}
      />
    </Container>
  );
}
