import { Tabs } from "expo-router";
import { useThemeColor } from "hooks/useThemeColor";
import { SafeAreaView } from "react-native";
import tw from "tailwind";
import { Icon } from "components/themed";
import { isTablet } from "utils/isTablet";

const TabsLayout = (props: any) => {
  const iconHeight = isTablet ? 40 : 30;
  const iconWidth = isTablet ? 40 : 30;
  const { lightColor, darkColor } = props;
  const tabBarActiveTintColor = useThemeColor(
    { light: lightColor, dark: darkColor },
    "tabBarActiveTintColor",
  );
  const tabBarActiveBackgroundColor = useThemeColor(
    { light: lightColor, dark: darkColor },
    "tabBarActiveBackgroundColor",
  );
  const tabBarInactiveBackgroundColor = useThemeColor(
    { light: lightColor, dark: darkColor },
    "tabBarInactiveBackgroundColor",
  );
  const tabBarInactiveTintColor = useThemeColor(
    { light: lightColor, dark: darkColor },
    "tabBarInactiveTintColor",
  );
  const tabBarStyle = {
    //tabBarShowLabel: false,
    tabBarActiveTintColor,
    tabBarActiveBackgroundColor,
    tabBarInactiveBackgroundColor,
    tabBarInactiveTintColor,
    tabBarLabelPosition: (isTablet ? "beside-icon" : "below-icon") as any,
    tabBarLabelStyle: {
      fontSize: isTablet ? 16 : 8,
      marginBottom: isTablet ? 0 : 4,
      marginTop: isTablet ? 0 : 4,
    },
    tabBarIconStyle: {
      marginTop: isTablet ? 0 : 8,
    },
  };
  return (
    <SafeAreaView style={tw`flex-1 bg-movet-red dark:bg-movet-black`}>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            backgroundColor: "transparent",
          },
        }}
      >
        <Tabs.Screen
          name="home"
          options={{
            title: "Home",
            tabBarIcon: () => (
              <Icon name="mobile" height={iconHeight} width={iconWidth} />
            ),
            ...tabBarStyle,
          }}
        />
        <Tabs.Screen
          name="appointments"
          options={{
            title: "Appointments",
            tabBarIcon: () => (
              <Icon name="clinic" height={iconHeight} width={iconWidth} />
            ),
            ...tabBarStyle,
          }}
        />
        <Tabs.Screen
          name="pets"
          options={{
            title: "Pets",
            tabBarIcon: () => (
              <Icon name="dog-wash" height={iconHeight} width={iconWidth} />
            ),
            ...tabBarStyle,
          }}
        />
        <Tabs.Screen
          name="chat"
          options={{
            title: "Chat",
            headerShown: false,
            tabBarIcon: () => (
              <Icon name="telehealth" height={iconHeight} width={iconWidth} />
            ),
            ...tabBarStyle,
          }}
        />
        <Tabs.Screen
          name="settings"
          options={{
            title: "Settings",
            tabBarIcon: () => <Icon name="clinic-alt" size="xs" />,
            ...tabBarStyle,
          }}
        />
      </Tabs>
    </SafeAreaView>
  );
};

export default TabsLayout;
