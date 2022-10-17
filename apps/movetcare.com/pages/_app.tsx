import '../tailwind.css';
import '@fortawesome/fontawesome-svg-core/styles.css';
import type { AppProps } from 'next/app';
import Layout from 'components/Layout';
import Script from 'next/script';
import {environment} from 'utilities';

const MoVET = ({ Component, pageProps }: AppProps) => {
  return (
    <>
      {environment === 'production' && (
        <>
          <Script
            strategy="lazyOnload"
            src={'https://www.googletagmanager.com/gtag/js?id=G-Y9896HXDFN'}
          />
          <Script strategy="lazyOnload" id="gtag">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-Y9896HXDFN', {
                page_path: window.location.pathname,
              });
            `}
          </Script>
        </>
      )}
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </>
  );
};

export default MoVET;
