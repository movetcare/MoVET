import { SplashScreen, Stack } from "expo-router";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import * as Notifications from "expo-notifications";
import { useEffect, useRef, useState } from "react";
import { useFonts } from "expo-font";
import { updateUserAuth } from "services/Auth";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "firebase-config";
export { ErrorBoundary } from "expo-router";

SplashScreen.preventAutoHideAsync();

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: true,
  }),
});

export default function Layout() {
  const notificationListener: any = useRef();
  const responseListener: any = useRef();

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user: any) =>
      updateUserAuth(user),
    );

    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        console.log(response);
      });
    return () => {
      unsubscribeAuth();
      Notifications.removeNotificationSubscription(
        (notificationListener as any).current,
      );
      Notifications.removeNotificationSubscription(
        (responseListener as any).current,
      );
    };
  }, []);

  const [loaded, error] = useFonts({
    SpaceMono: require("../assets/fonts/Abside-Regular.ttf"),
    ...FontAwesome.font,
  });

  useEffect(() => {
    if (error) {
      console.error(error);
      alert("ERROR: " + JSON.stringify(error));
      throw error;
    }
  }, [error]);

  if (!loaded) SplashScreen.hideAsync();
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    />
  );
}
