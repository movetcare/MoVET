import { ErrorBoundaryProps, SplashScreen, Stack } from "expo-router";
import { useEffect } from "react";
import { updateUserAuth } from "services/Auth";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "firebase-config";
import * as Notifications from "expo-notifications";
import { router } from "expo-router";
import { useDeviceContext } from "twrnc";
import tw from "tailwind";
import { View, Text } from "components/Themed";

SplashScreen.preventAutoHideAsync();

export function ErrorBoundary(props: ErrorBoundaryProps) {
  return (
    <View style={{ flex: 1 }}>
      <Text>{props.error.message}</Text>
      <Text onPress={props.retry}>Try Again?</Text>
    </View>
  );
}

const Layout = () => {
  useDeviceContext(tw);
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

  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    />
  );
};

export default Layout;
