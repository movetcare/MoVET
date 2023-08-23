import { Redirect } from "expo-router";
import { AuthStore } from "stores/AuthStore";

const Link = () => {
  const { isLoggedIn } = AuthStore.useState();
  return isLoggedIn ? (
    <Redirect href={`/(app)/home`} />
  ) : (
    <Redirect href={`/(auth)/create-account`} />
  );
};

export default Link;
