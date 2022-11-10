import Layout from "components/Layout";
import Head from "next/head";
import Image from "next/image";

export default function HowlOWeen() {
  return (
    <Layout>
      <Head>
        <title>HOWL-O-WEEN Pet Costume Contest - Sunday, Oct 30th @ 1pm</title>
        <meta
          name="description"
          content="Come one come all! Join us, Oct 30th at 1pm in the Belleview Station Dog Park to show off your Halloween Best! We'll have a fall themed photo booth to capture this once-a-year attire! Come as a couple, or just in an awesome-sauce costume! We hope to see you there! Free treats and belly rubs included for all who come. Best of all, all entry photos will be posted on Instagram and Facebook -- make sure to campaign your friends to vote by LIKING your picture. Winning photo (the one with the most likes) will be announced on Halloween and be featured as MoVET's November PET OF THE MONTH!"
        />
        <meta property="og:type" content="website" />
        <meta
          name="og:title"
          property="og:title"
          content="HOWL-O-WEEN Pet Costume Contest - Sunday, Oct 30th @ 1pm"
        />
        <meta
          name="og:description"
          property="og:description"
          content="Come one come all! Join us, Oct 30th at 1pm in the Belleview Station Dog Park to show off your Halloween Best! We'll have a fall themed photo booth to capture this once-a-year attire! Come as a couple, or just in an awesome-sauce costume! We hope to see you there! Free treats and belly rubs included for all who come. Best of all, all entry photos will be posted on Instagram and Facebook -- make sure to campaign your friends to vote by LIKING your picture. Winning photo (the one with the most likes) will be announced on Halloween and be featured as MoVET's November PET OF THE MONTH!"
        />
        <meta property="og:site_name" content="MoVET" />
        <meta name="twitter:card" content="summary" />
        <meta
          name="twitter:title"
          content="HOWL-O-WEEN Pet Costume Contest - Sunday, Oct 30th @ 1pm"
        />
        <meta
          name="twitter:description"
          content="Come one come all! Join us, Oct 30th at 1pm in the Belleview Station Dog Park to show off your Halloween Best! We'll have a fall themed photo booth to capture this once-a-year attire! Come as a couple, or just in an awesome-sauce costume! We hope to see you there! Free treats and belly rubs included for all who come. Best of all, all entry photos will be posted on Instagram and Facebook -- make sure to campaign your friends to vote by LIKING your picture. Winning photo (the one with the most likes) will be announced on Halloween and be featured as MoVET's November PET OF THE MONTH!"
        />
        <meta name="twitter:site" content="https://movetcare.com" />
        <meta name="twitter:creator" content="Rachel Bloch" />
        <link rel="icon" type="image/png" href="/static/images/favicon.ico" />
        <link rel="apple-touch-icon" href="/static/images/favicon.ico" />
        <meta
          property="og:image"
          content="/static/images/blog/howl-o-ween.png"
        />
        <meta
          name="twitter:image"
          content="/static/images/blog/howl-o-ween.png"
        />
      </Head>
      <section className="flex flex-col items-center justify-center sm:max-w-screen-lg mx-4 sm:mx-auto mt-8 mb-20 px-8 lg:px-20 bg-white rounded-xl p-4 sm:p-8">
        <Image
          className="rounded-xl"
          src="/images/blog/howl-o-ween.png"
          alt="MoVET's 1st Annual Howl-O-Ween"
          height={484}
          width={820}
        />
        <p className="text-lg mt-8">
          Come one come all! Join us, Oct 30th at 1pm in the Belleview Station
          Dog Park to show off your Halloween Best!
        </p>
        <p className="text-lg">
          We&apos;ll have a fall themed photo booth to capture this once-a-year
          attire! Come as a couple, or just in an awesome-sauce costume! We hope
          to see you there! Free treats and belly rubs included for all who
          come.
        </p>
        <p className="text-lg">
          Best of all, all entry photos will be posted on Instagram and Facebook
          -- make sure to campaign your friends to vote by &quot;LIKING&quot;
          your picture. Winning photo (the one with the most likes) will be
          announced on Halloween and be featured as MoVET&apos;s November PET OF
          THE MONTH!
        </p>
        <p className="text-lg">🎉🐾🤞 Good Luck! 🤞🐾🎉</p>
      </section>
    </Layout>
  );
}
