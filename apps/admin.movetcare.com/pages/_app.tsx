import "../tailwind.css";
import "@fortawesome/fontawesome-svg-core/styles.css";
import type { AppProps } from "next/app";
import { UserContext } from "contexts/UserContext";
import { useUserData } from "hooks/AuthUser";
import Layout from "components/Layout";
import ErrorBoundary from "components/ErrorBoundary";
import { useEffect } from "react";
import { notifications } from "services/notifications";

const MoVET = ({ Component, pageProps }: AppProps) => {
  const userData: any = useUserData();
  useEffect(() => {
    const configurePushToken = async () =>
      await notifications.configure(userData?.user?.uid);
    if (userData?.user?.uid) configurePushToken();
  }, [userData?.user?.uid]);
  return (
    <ErrorBoundary>
      <UserContext.Provider value={userData}>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </UserContext.Provider>
    </ErrorBoundary>
  );
};

export default MoVET;
