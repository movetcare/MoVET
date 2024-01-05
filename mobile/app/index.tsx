import { router, useSegments, useRootNavigationState } from "expo-router";
import { AuthStore } from "stores";
import { useEffect } from "react";
import { Loader } from "components/Loader";

const Index = () => {
  const segments = useSegments();
  const navigationState = useRootNavigationState();
  const { initialized, isLoggedIn } = AuthStore.useState();

  useEffect(() => {
    console.log("initialized", initialized);
    console.log("navigationState?.key", navigationState?.key);
    console.log("isLoggedIn", isLoggedIn);
    console.log("segments", segments);
    if (!navigationState?.key || !initialized) return;
    else {
      if (!isLoggedIn && segments[0] !== "(auth)" && segments[0] !== "sign-in")
        router.replace("/(auth)/sign-in");
      else if (isLoggedIn) router.replace("/test");
    }
  }, [segments, navigationState?.key, initialized, isLoggedIn]);

  return <Loader />;
};
export default Index;
