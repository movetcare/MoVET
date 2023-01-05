import "styles";
import "@fortawesome/fontawesome-svg-core/styles.css";
import Head from "next/head";
import type { AppProps } from "next/app";
import { environment } from "utilities";
import dynamic from "next/dynamic";
// import { PopUpAd } from "ui";

const AnalyticsTracker = dynamic(() =>
  import("ui").then((mod) => mod.AnalyticsTracker)
);

const MoVET = ({ Component, pageProps }: AppProps) => {
  return (
    <>
      <Head>
        <title>MoVET - Your neighborhood vet, delivered</title>
        <meta
          name="description"
          content="A stress-free way to take care of your pet care. Whether your pet is at the very beginning or the tailend of their lifespan, we can provide the age-appropriate primary care they need. For puppies and kittens, we offer packages and a la carte services for nutrition advice, vaccinations and boosters, spay/neuter advice, oral care, training, microchipping, parasite control, grooming, and exercise. For senior cats and dogs, our annual checks will be tailored toward your pet's advancing years."
        />
      </Head>
      {environment === "production" && (
        <AnalyticsTracker trackerId="G-Y9896HXDFN" />
      )}
      <Component {...pageProps} />
      {/* <PopUpAd
        description="Spend $30 or more in the MoVET boutique on November 25th and get a FREE veterinary exam!"
        adComponent={
          <Link href="/blog/black-friday-deal-2022">
            <Image
              className="rounded-xl"
              src="/images/blog/black-friday-deal-2022.png"
              alt="MoVET's 2022 Black Friday Deal"
              height={200}
              width={400}
            />
          </Link>
        }
        ignoreUrlPath="/blog/black-friday-deal-2022/"
      /> */}
    </>
  );
};

export default MoVET;
