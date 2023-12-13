import { router, useSegments, useRootNavigationState } from "expo-router";
import { AuthStore } from "stores";
import { useEffect } from "react";
import { Loader } from "components/Loader";

const Index = () => {
  const segments = useSegments();
  const navigationState = useRootNavigationState();
  const { initialized, isLoggedIn } = AuthStore.useState();

  useEffect(() => {
    if (!navigationState?.key || !initialized) return;
    else {
      alert("INDEX => isLoggedin: " + isLoggedIn + " segments: " + segments[0]);
      if (!isLoggedIn && segments[0] !== "(auth)" && segments[0] !== "sign-in")
        router.replace("/(auth)/sign-in");
      else if (isLoggedIn) router.replace("/(app)/home");
    }
  }, [segments, navigationState?.key, initialized, isLoggedIn]);

  return <Loader />;
};
export default Index;
