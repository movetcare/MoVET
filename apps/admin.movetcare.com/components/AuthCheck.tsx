import { useContext, useEffect, useState } from "react";
import { UserContext } from "contexts/UserContext";
import { SignIn } from "./SignIn";
import { auth } from "services/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/router";
import { Loader } from "ui";

const AuthCheck = (props: any) => {
  const { user } = useContext(UserContext);
  const [isAuthorized, setIsAuthorized] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        const claimsString = (user as any)?.reloadUserInfo?.customAttributes;
        if (claimsString) {
          const claims = JSON.parse(claimsString);
          if (claims?.isSuperAdmin || claims?.isAdmin || claims?.isStaff)
            setIsAuthorized(true);
          else router.push("/signout");
        }
        setIsLoading(false);
      }
    });
    return () => unsubscribe();
  }, [user, router]);

  return isLoading ? (
    <main
      className={
        "h-screen flex flex-grow items-center justify-center p-8 md:px-12 lg:px-24 bg-movet-white"
      }
    >
      <Loader />
    </main>
  ) : user && isAuthorized ? (
    props.children
  ) : (
    props.fallback || <SignIn />
  );
};

export default AuthCheck;
