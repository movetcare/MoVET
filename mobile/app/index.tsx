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
      if (!isLoggedIn && segments[0] !== "(auth)" && segments[0] !== "sign-in")
        router.replace("/sign-in");
      else if (isLoggedIn && segments.length === 0)
        router.replace("/(app)/home");
      else if (isLoggedIn && segments.length > 0) {
        //alert("segments => " + JSON.stringify(segments));
        router.replace("/(app)/chat");
      }
    }
  }, [segments, navigationState?.key, initialized, isLoggedIn]);

  return <Loader />;
};
export default Index;
