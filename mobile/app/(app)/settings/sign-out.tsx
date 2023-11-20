import { useEffect } from "react";
import { Loader } from "components/Loader";
import { signOut } from "services/Auth";

const SignOut = () => {
  useEffect(() => {
    const signOutUser = async () => await signOut();
    signOutUser();
  }, []);
  return <Loader description={"Signing Out..."} />;
};
export default SignOut;
