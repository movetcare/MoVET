import { useContext, useEffect, useState } from "react";
import { UserContext } from "contexts/UserContext";
import { SignIn } from "./SignIn";
import { auth } from "services/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/router";
import Notifications from "./Notifications";

const AuthCheck = (props: any) => {
  const { user } = useContext(UserContext);
  const [isAuthorized, setIsAuthorized] = useState<boolean>(false);
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
      }
    });
    return () => unsubscribe();
  }, [user, router]);

  return user && isAuthorized ? (
    <Notifications>{props.children}</Notifications>
  ) : (
    props.fallback || <SignIn />
  );
};

export default AuthCheck;
