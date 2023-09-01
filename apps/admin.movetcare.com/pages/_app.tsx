import "../tailwind.css";
import "@fortawesome/fontawesome-svg-core/styles.css";
import type { AppProps } from "next/app";
import { UserContext } from "contexts/UserContext";
import { useUserData } from "hooks/AuthUser";
import Layout from "components/Layout";
import ErrorBoundary from "components/ErrorBoundary";
import { useEffect } from "react";
import { notifications } from "services/notifications";
import Notifications from "components/Notifications";

const MoVET = ({ Component, pageProps }: AppProps) => {
  const userData: any = useUserData();
  // useEffect(() => {
  //   if ("serviceWorker" in navigator) {
  //     navigator.serviceWorker.addEventListener("message", (event) => {
  //       console.log("event for the service worker", event?.data || event);
  //     });
  //   } else
  //     alert(
  //       "WARNING - Service Workers are not supported in this browser! Push Notifications will NOT work...",
  //     );
  // }, []);
  useEffect(() => {
    const configurePushToken = async () =>
      await notifications.configure(userData?.user?.uid);
    if (userData?.user?.uid) configurePushToken();
  }, [userData?.user?.uid]);
  return (
    <ErrorBoundary>
      <UserContext.Provider value={userData}>
        <Notifications>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </Notifications>
      </UserContext.Provider>
    </ErrorBoundary>
  );
};

export default MoVET;
