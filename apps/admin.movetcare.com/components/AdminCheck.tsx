import { useContext, useEffect, useState } from "react";
import { UserContext } from "contexts/UserContext";
import Error from "./Error";
import { auth } from "services/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/router";
import { Loader } from "ui";

const AdminCheck = (props: any) => {
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
          if (claims?.isSuperAdmin || claims?.isAdmin) setIsAuthorized(true);
        }
        setIsLoading(false);
      }
    });
    return () => unsubscribe();
  }, [user, router]);

  return isLoading ? (
    <Loader />
  ) : user && isAuthorized ? (
    props.children
  ) : (
    props.fallback || (
      <Error
        error={{
          status: "401",
          name: "PERMISSION DENIED",
          message:
            "You do not have permission to view this page. Please contact support via the form below if you believe this is an error.",
        }}
      />
    )
  );
};

export default AdminCheck;
