import {
  useRouter,
  useSegments,
  useRootNavigationState,
  Redirect,
} from "expo-router";
import { AuthStore } from "stores";
import { useEffect } from "react";

const Index = () => {
  const segments = useSegments();
  const router = useRouter();
  const navigationState = useRootNavigationState();
  const { initialized, isLoggedIn } = AuthStore.useState();

  useEffect(() => {
    if (!navigationState?.key || !initialized) return;
    if (!isLoggedIn && segments[0] !== "(auth)")
      router.replace("/(auth)/login");
    else if (isLoggedIn) router.replace("/(app)/home");
  }, [segments, navigationState?.key, initialized, isLoggedIn, router]);

  if (!navigationState?.key) return null;
  //return <View>{!navigationState?.key ? <Text>LOADING...</Text> : <></>}</View>;
  return <Redirect href={"/(auth)/login"} />;
};
export default Index;
