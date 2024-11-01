import "styles";
import "@fortawesome/fontawesome-svg-core/styles.css";
import Head from "next/head";
import type { AppProps } from "next/app";
import { environment } from "utilities";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import ErrorBoundary from "components/ErrorBoundary";
import { hotjar } from "react-hotjar";

const AnalyticsTracker = dynamic(() =>
  import("ui").then((mod) => mod.AnalyticsTracker),
);

const MoVET = ({ Component, pageProps }: AppProps) => {
  const [loadAnalytics, setLoadAnalytics] = useState(false);
  useEffect(() => {
    if (environment === "production") {
      setLoadAnalytics(true);
      hotjar.initialize({ id: 2516615, sv: 6 });
    }
  }, []);
  return (
    <ErrorBoundary>
      <Head>
        <title>Veterinarian Near Me | MoVET @ Belleview Station</title>
        <meta name="geo.placename" content="Denver" />
        <meta name="geo.position" content="39.6252377;-104.9067478" />
        <meta name="icbm" content="39.6252377, -104.9067478" />
        <meta
          property="og:title"
          content="Veterinarian Near Me | MoVET @ Belleview Station"
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://movetcare.com" />
        <link rel="icon" type="image/png" href="favicon.ico" />
        <link rel="apple-touch-icon" href="favicon.ico" />
        <meta
          name="description"
          content="MoVET @ Belleview Station offers a unique approach to veterinarian services to keep your pet healthy! As an experienced veterinarian in Denver, CO, we specialize in primary pet care and minor illness treatment through house calls, in-clinic appointments, and telehealth services."
        />
        <meta
          property="og:description"
          content="MoVET @ Belleview Station offers a unique approach to veterinarian services to keep your pet healthy! As an experienced veterinarian in Denver, CO, we specialize in primary pet care and minor illness treatment through house calls, in-clinic appointments, and telehealth services."
        />
        <meta
          name="apple-itunes-app"
          content="app-id=1478031556, app-argument=website"
        />
      </Head>
      {loadAnalytics && <AnalyticsTracker trackerId="G-Y9896HXDFN" />}
      <Component {...pageProps} />
    </ErrorBoundary>
  );
};

export default MoVET;
