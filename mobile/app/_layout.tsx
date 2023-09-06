import { SplashScreen, Stack } from "expo-router";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useEffect } from "react";
import { useFonts } from "expo-font";
import { updateUserAuth } from "services/Auth";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "firebase-config";
import * as Notifications from "expo-notifications";
import { router } from "expo-router";
//export { ErrorBoundary } from "expo-router";

SplashScreen.preventAutoHideAsync();

export default function Layout() {
  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user: any) =>
      updateUserAuth(user),
    );

    let isMounted = true;

    function redirect(notification: Notifications.Notification) {
      const url = notification.request.content.data?.url;
      if (url) {
        router.push(url);
      }
    }

    Notifications.getLastNotificationResponseAsync().then((response) => {
      if (!isMounted || !response?.notification) {
        return;
      }
      redirect(response?.notification);
    });

    const subscription = Notifications.addNotificationResponseReceivedListener(
      (response) => {
        redirect(response.notification);
      },
    );

    return () => {
      unsubscribeAuth();
      isMounted = false;
      subscription.remove();
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
