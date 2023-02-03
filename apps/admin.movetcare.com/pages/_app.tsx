import "../tailwind.css";
import "@fortawesome/fontawesome-svg-core/styles.css";
import "react-tooltip/dist/react-tooltip.css";
import type { AppProps } from "next/app";
import { UserContext } from "contexts/UserContext";
import { useUserData } from "hooks/AuthUser";
import { Toaster } from "react-hot-toast";
import Layout from "components/Layout";
import ErrorBoundary from "components/ErrorBoundary";

const MoVET = ({ Component, pageProps }: AppProps) => {
  const userData: any = useUserData();
  return (
    <ErrorBoundary>
      <UserContext.Provider value={userData}>
        <Layout>
          <Component {...pageProps} />
        </Layout>
        <Toaster position="top-right" reverseOrder={false} />
      </UserContext.Provider>
    </ErrorBoundary>
  );
};

export default MoVET;
