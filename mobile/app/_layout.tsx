import {
  ErrorBoundaryProps,
  SplashScreen,
  Stack,
  useRootNavigationState,
} from "expo-router";
import { useEffect } from "react";
import { updateUserAuth } from "services/Auth";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "firebase-config";
import * as Notifications from "expo-notifications";
import { router } from "expo-router";
import { useDeviceContext } from "twrnc";
import tw from "tailwind";
import { ErrorLayout } from "components/themed";
import { FontAwesome } from "@expo/vector-icons";
import { useFonts } from "expo-font";
import { AuthStore } from "stores/AuthStore";

SplashScreen.preventAutoHideAsync();

export function ErrorBoundary(props: ErrorBoundaryProps) {
  return (
    <ErrorLayout
      message={props.error.message}
      actionTitle={"Retry"}
      actionIconName="redo"
      action={props.retry}
    />
  );
}

const Layout = () => {
  useDeviceContext(tw);
  const navigationState = useRootNavigationState();
  const { initialized, isLoggedIn } = AuthStore.useState();
  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user: any) =>
      updateUserAuth(user),
    );

    let isMounted = true;

    const redirect = (notification: Notifications.Notification) => {
      const url = notification.request.content.data?.path;
      if (url) router.push(url);
    };

    Notifications.getLastNotificationResponseAsync().then((response) => {
      if (response?.notification) alert(JSON.stringify(response?.notification));
      if (!isMounted || !response?.notification) return;
      redirect(response?.notification);
    });

    const subscription = Notifications.addNotificationResponseReceivedListener(
      (response) => redirect(response.notification),
    );

    return () => {
      unsubscribeAuth();
      isMounted = false;
      subscription.remove();
    };
  }, []);

  useEffect(() => {
    if (!navigationState?.key || !initialized) return;
    else if (!isLoggedIn) router.replace("/(auth)/sign-in");
  }, [navigationState?.key, initialized, isLoggedIn]);

  const [fontsLoaded, fontsError] = useFonts({
    Abside: require("../assets/fonts/Abside-Regular.ttf"),
    Parkinson: require("../assets/fonts/Parkinson-Bold.ttf"),
    "Abside Smooth": require("../assets/fonts/Abside-Smooth.ttf"),
    "Source Sans Pro": require("../assets/fonts/SourceSansPro-Regular.ttf"),
    "Source Sans Pro Italic": require("../assets/fonts/SourceSansPro-Italic.ttf"),
    ...FontAwesome.font,
  });

  useEffect(() => {
    if (fontsError) throw fontsError;
    else if (fontsLoaded) SplashScreen.hideAsync();
  }, [fontsLoaded, fontsError]);

  if (!fontsLoaded) return null;

  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    />
  );
};

export default Layout;
