import { ErrorBoundaryProps, Stack, router } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { updateUserAuth } from "services/Auth";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "firebase-config";
import * as Notifications from "expo-notifications";
import { useDeviceContext } from "twrnc";
import tw from "tailwind";
import { ErrorLayout } from "components/themed";
import { useFonts } from "expo-font";
import { ActionSheetProvider } from "@expo/react-native-action-sheet";
import { ErrorModal } from "components/Modal";
import { ErrorStore } from "stores";
import LogRocket from "@logrocket/react-native";

SplashScreen.preventAutoHideAsync();

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

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

const useNotificationObserver = () => {
  useEffect(() => {
    let isMounted = true;
    const redirect = (notification: Notifications.Notification) => {
      alert("PUSH REDIRECT => " + JSON.stringify(notification));
      const url = notification.request.content.data?.path;
      alert("REDIRECT URL => " + url);
      if (url) router.push(url);
    };
    Notifications.getLastNotificationResponseAsync().then((response) => {
      if (response)
        alert(
          "getLastNotificationResponseAsync => " + JSON.stringify(response),
        );
      if (response?.notification) alert(JSON.stringify(response?.notification));
      if (!isMounted || !response?.notification) return;
      redirect(response?.notification);
    });
    const subscription = Notifications.addNotificationResponseReceivedListener(
      (response) => {
        if (response)
          alert("addNotificationResponseReceivedListener => " + response);
        redirect(response?.notification);
      },
    );
    return () => {
      isMounted = false;
      subscription.remove();
    };
  }, []);
};

const Layout = () => {
  useDeviceContext(tw);
  const { currentError } = ErrorStore.useState();
  useNotificationObserver();

  useEffect(() => {
    if (!__DEV__) LogRocket.init("cjlcsx/movet-mobile-app");
    const unsubscribeAuth = onAuthStateChanged(auth, (user: any) => {
      updateUserAuth(user);
    });
    return () => unsubscribeAuth();
  }, []);

  const [fontsLoaded, fontsError] = useFonts({
    Abside: require("../assets/fonts/Abside-Regular.ttf"),
    Parkinson: require("../assets/fonts/Parkinson-Bold.ttf"),
    "Abside Smooth": require("../assets/fonts/Abside-Smooth.ttf"),
    "Source Sans Pro": require("../assets/fonts/SourceSansPro-Regular.ttf"),
    "Source Sans Pro Italic": require("../assets/fonts/SourceSansPro-Italic.ttf"),
  });

  useEffect(() => {
    if (fontsError) throw fontsError;
    //else if (fontsLoaded) SplashScreen.hideAsync();
  }, [fontsLoaded, fontsError]);

  if (!fontsLoaded) return null;

  return (
    <ActionSheetProvider>
      <>
        <Stack
          screenOptions={{
            headerShown: false,
          }}
        />
        <ErrorModal
          isVisible={currentError !== null}
          onClose={() =>
            ErrorStore.update((s: any) => {
              s.currentError = null;
              s.pastErrors = s.pastErrors
                ? [...s.pastErrors, currentError]
                : [currentError];
            })
          }
          message={
            currentError?.source +
            " => " +
            (currentError?.code ||
              currentError?.message ||
              JSON.stringify(currentError))
          }
        />
      </>
    </ActionSheetProvider>
  );
};

export default Layout;
