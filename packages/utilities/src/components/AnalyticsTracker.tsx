import Script from "next/script";

export const AnalyticsTracker = ({ trackerId }: { trackerId: string }) => (
  <>
    <Script
      strategy="worker"
      src={`https://www.googletagmanager.com/gtag/js?id=${trackerId}`}
    />
    <Script strategy="worker" id="gtag">
      {`
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', '${trackerId}', {
          page_path: window.location.pathname,
        });
      `}
    </Script>
  </>
);
