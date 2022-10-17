import '../tailwind.css';
import '@fortawesome/fontawesome-svg-core/styles.css';
import type { AppProps } from 'next/app';
import Layout from 'components/Layout';
import { AnalyticsTracker, environment } from "utilities";

const MoVET = ({ Component, pageProps }: AppProps) => {
  return (
    <>
      {environment === "development" && (
        <AnalyticsTracker trackerId="G-Y9896HXDFN" />
      )}
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </>
  );
};

export default MoVET;
