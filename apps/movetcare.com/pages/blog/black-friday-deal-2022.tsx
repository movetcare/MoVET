import Layout from "components/Layout";
import Head from "next/head";
import Image from "next/image";

export default function BlackFridayDeal() {
  return (
    <Layout>
      <Head>
        <title>Black Friday Deal - Free Exam w/ Purchase</title>
        <meta
          name="description"
          content="Spend more than $30 in the Boutique and receive a FREE veterinary exam, a $68 value!"
        />
        <meta property="og:type" content="website" />
        <meta
          name="og:title"
          property="og:title"
          content="Black Friday Deal: Free Exam w/ a Purchase of $30 or More!"
        />
        <meta
          name="og:description"
          property="og:description"
          content="Spend more than $30 in the Boutique and receive a FREE veterinary exam, a $68 value!"
        />
        <meta property="og:site_name" content="MoVET" />
        <meta name="twitter:card" content="summary" />
        <meta
          name="twitter:title"
          content="Black Friday Deal: Free Exam w/ a Purchase of $30 or More!"
        />
        <meta
          name="twitter:description"
          content="Spend more than $30 in the Boutique and receive a FREE veterinary exam, a $68 value!"
        />
        <meta name="twitter:site" content="https://movetcare.com" />
        <meta name="twitter:creator" content="Rachel Bloch" />
        <link rel="icon" type="image/png" href="/static/images/favicon.ico" />
        <link rel="apple-touch-icon" href="/static/images/favicon.ico" />
        <meta
          property="og:image"
          content="/static/images/blog/black-friday-deal-2022.png"
        />
        <meta
          name="twitter:image"
          content="/static/images/blog/black-friday-deal-2022.png"
        />
      </Head>
      <section className="flex flex-col items-center justify-center sm:max-w-screen-lg mx-4 sm:mx-auto mt-8 mb-20 px-8 lg:px-20 bg-white rounded-xl p-4 sm:p-8">
        <Image
          className="rounded-xl"
          src="/images/blog/black-friday-deal-2022.png"
          alt="MoVET's 2022 Black Friday Deal"
          height={484}
          width={820}
        />
        <p className="text-lg mt-8">
          * Spend $30 or more in the MoVET boutique on November 25th, 2022 and
          get a FREE veterinary exam!
        </p>
        <p className="text-lg">🎉🐾Happy Holidays!🐾🎉</p>
      </section>
    </Layout>
  );
}
