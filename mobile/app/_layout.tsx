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

// https://github.com/firebase/firebase-js-sdk/issues/7962#issuecomment-1902290249
(window.navigator as any).userAgent = "ReactNative";

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
      const url = notification.request.content.data?.path;
      if (url) {
        router.push(url);
      }
    };
    Notifications.getLastNotificationResponseAsync().then((response) => {
      if (!isMounted || !response?.notification) {
        return;
      }
      //alert("response?.notification => " + JSON.stringify(response?.notification));
      redirect(response?.notification);
    });
    const subscription = Notifications.addNotificationResponseReceivedListener(
      (response) => {
        redirect(response.notification);
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

  // const notificationListener: any = useRef();
  // const responseListener: any = useRef();

  // useEffect(() => {

  //   notificationListener.current = Notifications.addNotificationReceivedListener((notification: Notifications.Notification) => {
  //     alert("addNotificationReceivedListener notification =>" + notification.request);
  //   });

  //   responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
  //     alert("addNotificationResponseReceivedListener response =>" + response);
  //     const url = response.notification.request.content.data?.path;
  //     if (url) router.navigate(url);
  //   });

  //   return () => {
  //     Notifications.removeNotificationSubscription(notificationListener.current);
  //     Notifications.removeNotificationSubscription(responseListener.current);
  //   };
  // }, []);

  useEffect(() => {
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
