import { useEffect } from "react";
import { Loader } from "components/Loader";
import { signOut } from "services/Auth";
import { Stack } from "expo-router";

const SignOut = () => {
  useEffect(() => {
    const signOutUser = async () => await signOut();
    signOutUser();
  }, []);
  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <Loader description={"Signing Out..."} />
    </>
  );
};
export default SignOut;