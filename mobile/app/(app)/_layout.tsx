import { Tabs } from "expo-router";
import { useThemeColor } from "hooks/useThemeColor";
import { SafeAreaView, useColorScheme } from "react-native";
import tw from "tailwind";
import { Icon } from "components/themed";
import { isTablet } from "utils/isTablet";

const TabsLayout = (props: any) => {
  const iconHeight = isTablet ? 26 : 20;
  const iconWidth = isTablet ? 26 : 20;
  const isDarkMode = useColorScheme() !== "light";
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
    tabBarActiveTintColor,
    tabBarActiveBackgroundColor,
    tabBarInactiveBackgroundColor,
    tabBarInactiveTintColor,
    tabBarLabelPosition: (isTablet ? "beside-icon" : "below-icon") as any,
    tabBarLabelStyle: {
      fontFamily: "Abside",
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
            tabBarIcon: (navigationOptions: any) =>
              navigationOptions.focused ? (
                <Icon
                  color="black"
                  noDarkMode
                  name="hospital"
                  height={iconHeight}
                  width={iconWidth}
                />
              ) : isDarkMode ? (
                <Icon
                  color="white"
                  noDarkMode
                  name="hospital"
                  height={iconHeight}
                  width={iconWidth}
                />
              ) : (
                <Icon
                  color="black"
                  noDarkMode
                  name="hospital"
                  height={iconHeight}
                  width={iconWidth}
                />
              ),
            ...tabBarStyle,
          }}
        />
        <Tabs.Screen
          name="appointments"
          options={{
            title: "Appointments",
            tabBarIcon: (navigationOptions: any) =>
              navigationOptions.focused ? (
                <Icon
                  color="black"
                  noDarkMode
                  name="clipboard-medical"
                  height={iconHeight}
                  width={iconWidth}
                />
              ) : isDarkMode ? (
                <Icon
                  color="white"
                  noDarkMode
                  name="clipboard-medical"
                  height={iconHeight}
                  width={iconWidth}
                />
              ) : (
                <Icon
                  color="black"
                  noDarkMode
                  name="clipboard-medical"
                  height={iconHeight}
                  width={iconWidth}
                />
              ),
            ...tabBarStyle,
          }}
        />
        <Tabs.Screen
          name="pets"
          options={{
            title: "Pets",
            tabBarIcon: (navigationOptions: any) =>
              navigationOptions.focused ? (
                <Icon
                  color="black"
                  noDarkMode
                  name="paw"
                  height={iconHeight}
                  width={iconWidth}
                />
              ) : isDarkMode ? (
                <Icon
                  color="white"
                  noDarkMode
                  name="paw"
                  height={iconHeight}
                  width={iconWidth}
                />
              ) : (
                <Icon
                  color="black"
                  noDarkMode
                  name="paw"
                  height={iconHeight}
                  width={iconWidth}
                />
              ),
            ...tabBarStyle,
          }}
        />
        <Tabs.Screen
          name="chat"
          options={{
            title: "Chat",
            headerShown: false,
            tabBarIcon: (navigationOptions: any) =>
              navigationOptions.focused ? (
                <Icon
                  color="black"
                  noDarkMode
                  name="user-medical-message"
                  height={iconHeight}
                  width={iconWidth}
                />
              ) : isDarkMode ? (
                <Icon
                  color="white"
                  noDarkMode
                  name="user-medical-message"
                  height={iconHeight}
                  width={iconWidth}
                />
              ) : (
                <Icon
                  color="black"
                  noDarkMode
                  name="user-medical-message"
                  height={iconHeight}
                  width={iconWidth}
                />
              ),
            ...tabBarStyle,
          }}
        />
        <Tabs.Screen
          name="settings"
          options={{
            title: "Settings",
            tabBarIcon: (navigationOptions: any) =>
              navigationOptions.focused ? (
                <Icon
                  color="black"
                  noDarkMode
                  name="gear"
                  height={iconHeight}
                  width={iconWidth}
                />
              ) : isDarkMode ? (
                <Icon
                  color="white"
                  noDarkMode
                  name="gear"
                  height={iconHeight}
                  width={iconWidth}
                />
              ) : (
                <Icon
                  color="black"
                  noDarkMode
                  name="gear"
                  height={iconHeight}
                  width={iconWidth}
                />
              ),
            ...tabBarStyle,
          }}
        />
      </Tabs>
    </SafeAreaView>
  );
};

export default TabsLayout;
