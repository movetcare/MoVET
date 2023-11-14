import { Stack, useLocalSearchParams, useSegments } from "expo-router";
import { navigationStackScreenOptions } from "utils/navigationStackScreenOptions";
import { NavigationHeader } from "components/themed/NavigationHeader";
import { useEffect, useState } from "react";
import { Icon, SupportedIcons } from "components/themed";
import tw from "tailwind";

// const defaultNavigationDetails = {
//   title: "My MoVET",
//   icon: <Icon name="clinic-alt" size="xs" style={tw`mr-1`} />,
//   canGoBack: false,
// };
export default function Layout() {
  const segments = useSegments();
  const router = useLocalSearchParams();
  const { screenTitle, screenTitleIcon }: any = router?.params || {};
  const [navigationDetails, setNavigationDetails] = useState<{
    title: string;
    icon: any;
    canGoBack: boolean;
  } | null>(null);

  useEffect(() => {
    if (screenTitle)
      setNavigationDetails({
        title: screenTitle as string,
        icon: screenTitleIcon ? (
          <Icon
            name={screenTitleIcon as SupportedIcons}
            size="xs"
            style={tw`mr-2`}
            color="white"
          />
        ) : (
          <Icon name="bullhorn" size="xs" style={tw`mr-2`} color="white"  />
        ),
        canGoBack: true,
      });
    else if (segments && segments.includes("web-view")) {
      //setTimeout(() => {
      setNavigationDetails({
        title: "Announcement",
        icon:   <Icon name="bullhorn" size="xs" style={tw`mr-2`} color="white" />,
        canGoBack: true,
      });
      //}, 180);
    } else setNavigationDetails(null);
  }, [screenTitle, screenTitleIcon, segments]);

  return (
    <Stack
      screenOptions={{
        ...navigationStackScreenOptions,
        header: () =>
          navigationDetails ? (
            <NavigationHeader
              title={navigationDetails.title}
              icon={navigationDetails.icon}
              canGoBack={navigationDetails.canGoBack}
            />
          ) : undefined,
      }}
    />
  );
}
