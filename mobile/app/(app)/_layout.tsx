import { Tabs } from "expo-router";
import { SafeAreaView, Text } from "react-native";
import tw from "tailwind";

const TabsLayout = () => {
  return (
    <SafeAreaView style={tw`flex-1 bg-movet-red`}>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarStyle: { backgroundColor: "transparent" },
        }}
      >
        <Tabs.Screen
          name="home"
          options={{
            title: "Home",
            tabBarActiveTintColor: tw.color("movet-black"),
            tabBarActiveBackgroundColor: tw.color("movet-white"),
            tabBarInactiveBackgroundColor: tw.color("white"),
            tabBarInactiveTintColor: tw.color("movet-black"),
            tabBarIcon: () => <Text>🏠</Text>,
          }}
        />
        <Tabs.Screen
          name="pets"
          options={{
            title: "Pets",
            tabBarActiveTintColor: tw.color("movet-black"),
            tabBarActiveBackgroundColor: tw.color("movet-white"),
            tabBarInactiveBackgroundColor: tw.color("white"),
            tabBarInactiveTintColor: tw.color("movet-black"),
            tabBarIcon: () => <Text>🏷️</Text>,
          }}
        />
        <Tabs.Screen
          name="chat"
          options={{
            title: "Chat",
            headerShown: false,
            tabBarActiveTintColor: tw.color("movet-black"),
            tabBarActiveBackgroundColor: tw.color("movet-white"),
            tabBarInactiveBackgroundColor: tw.color("white"),
            tabBarInactiveTintColor: tw.color("movet-black"),
            tabBarIcon: () => <Text>💬</Text>,
          }}
        />
        <Tabs.Screen
          name="settings"
          options={{
            title: "Settings",
            tabBarActiveTintColor: tw.color("movet-black"),
            tabBarActiveBackgroundColor: tw.color("movet-white"),
            tabBarInactiveBackgroundColor: tw.color("white"),
            tabBarInactiveTintColor: tw.color("movet-black"),
            tabBarIcon: () => <Text>⚙️</Text>,
          }}
        />
      </Tabs>
    </SafeAreaView>
  );
};

export default TabsLayout;
