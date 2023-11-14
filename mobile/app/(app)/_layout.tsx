import { Tabs, usePathname } from "expo-router";
import { useThemeColor } from "hooks/useThemeColor";
import { SafeAreaView, useColorScheme } from "react-native";
import tw from "tailwind";
import { Icon } from "components/themed";
import { isTablet } from "utils/isTablet";
import { AuthStore } from "stores";
import { firestore } from "firebase-config";
import { onSnapshot, query, collection, where, QuerySnapshot, } from "firebase/firestore";
import { useEffect, useState } from "react";


const TabsLayout = (props: any) => {
    const { user } = AuthStore.useState();
    const [patientsCount, setPatientsCount] = useState<number | null>(null);
    const pathName = usePathname() 
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

    useEffect(() => {
    const unsubscribePatients = onSnapshot(
      query(
        collection(firestore, "patients"),
        where("client", "==", Number(user.uid)),
        where("archived", "==", false),
      ),
      (querySnapshot: QuerySnapshot) => {
        if (querySnapshot.empty) return;
         else setPatientsCount(querySnapshot.size)
      },
      (error: any) => console.error("ERROR => ", error),
    );
    return () => 
      unsubscribePatients();
  }, [user?.uid]);
  return (
    <SafeAreaView style={tw`flex-1 bg-movet-red dark:bg-movet-black`}>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            backgroundColor: "transparent",
            display: (( pathName === "appointments"  || pathName === "pets" ) && patientsCount) ? "none" : "flex",
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
          options={patientsCount ? {
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
          }: {href: null}}
        />
        <Tabs.Screen
          name="pets"
          options={patientsCount ? {
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
          } : {href: null}}
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
