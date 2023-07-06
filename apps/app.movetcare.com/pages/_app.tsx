import "styles";
import "@fortawesome/fontawesome-svg-core/styles.css";
import Head from "next/head";
import type { AppProps } from "next/app";
import { environment } from "utilities";
import dynamic from "next/dynamic";
import Layout from "components/Layout";
import { Toaster } from "react-hot-toast";
import ErrorBoundary from "components/ErrorBoundary";
import { useState, useEffect } from "react";

const AnalyticsTracker = dynamic(() =>
  import("ui").then((mod) => mod.AnalyticsTracker),
);

const MoVET = ({ Component, pageProps }: AppProps) => {
  const [loadAnalytics, setLoadAnalytics] = useState(false);
  useEffect(() => {
    if (environment === "production") setLoadAnalytics(true);
  }, []);
  return (
    <ErrorBoundary>
      <Head>
        <title>Schedule an Appointment - MoVET</title>
        <meta
          name="description"
          content="Sign in to your MoVET account to manage and access your pet's data and schedule appointments!"
        />
        <meta
          name="apple-itunes-app"
          content="app-id=1478031556, app-argument=webapp"
        />
      </Head>
      {loadAnalytics && <AnalyticsTracker trackerId="G-Y9896HXDFN" />}
      <Layout>
        <Component {...pageProps} />
      </Layout>
      <Toaster position="top-center" reverseOrder={false} />
    </ErrorBoundary>
  );
};

export default MoVET;
