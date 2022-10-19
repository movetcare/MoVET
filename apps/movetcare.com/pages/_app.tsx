import '../tailwind.css';
import '@fortawesome/fontawesome-svg-core/styles.css';
import Head from "next/head";
import type { AppProps } from "next/app";
import { environment } from "utilities";
import dynamic from "next/dynamic";

const AnalyticsTracker = dynamic(() =>
  import("utilities").then((mod) => mod.AnalyticsTracker)
);

const MoVET = ({ Component, pageProps }: AppProps) => {
  return (
    <>
      <Head>
        <title>Your neighborhood vet, Delivered</title>
        <link rel="icon" href="/favicon.ico" />
        <meta
          name="description"
          content="A stress-free way to take care of your pet care. Whether your pet is at the very beginning or the tailend of their lifespan, we can provide the age-appropriate primary care they need. For puppies and kittens, we offer packages and a la carte services for nutrition advice, vaccinations and boosters, spay/neuter advice, oral care, training, microchipping, parasite control, grooming, and exercise. For senior cats and dogs, our annual checks will be tailored toward your pet's advancing years."
        ></meta>
      </Head>
      {environment !== "development" && (
        <AnalyticsTracker trackerId="G-Y9896HXDFN" />
      )}
      <Component {...pageProps} />
    </>
  );
};

export default MoVET;
