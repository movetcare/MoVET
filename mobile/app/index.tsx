import { useRouter, useSegments, useRootNavigationState } from "expo-router";
import { AuthStore } from "stores";
import { useEffect } from "react";
import { isProductionEnvironment } from "utils/isProductionEnvironment";
const Index = () => {
  const segments = useSegments();
  const router = useRouter();
  const navigationState = useRootNavigationState();
  const { initialized, isLoggedIn } = AuthStore.useState();

  useEffect(() => {
    if (!navigationState?.key || !initialized) return;
    else {
      if (isProductionEnvironment)
        alert("index segments: " + JSON.stringify(segments));
      if (!isLoggedIn && segments[0] !== "(auth)")
        router.replace("/(auth)/sign-in");
      else if (isLoggedIn) router.replace("/(app)/home");
    }
  }, [segments, navigationState?.key, initialized, isLoggedIn, router]);

  return null;
};
export default Index;
