import Layout from "components/Layout";
import Head from "next/head";
import Image from "next/image";
import { CallToAction, HowloweenForm } from "ui";

export default function HowlOWeen() {
  return (
    <Layout>
      <Head>
        <title>HOWL-O-WEEN Pet Costume Contest - Sunday, Oct 29th @ 1pm</title>
        <meta
          name="description"
          content="Come one come all! Join us, Oct 29th at 1pm in the Belleview Station Dog Park to show off your Halloween Best! We'll have a fall themed photo booth to capture this once-a-year attire! Come as a couple, or just in an awesome-sauce costume! We hope to see you there! Free treats and belly rubs included for all who come. Best of all, all entry photos will be posted on Instagram and Facebook -- make sure to campaign your friends to vote by LIKING your picture. Winning photo (the one with the most likes) will be announced on Halloween and be featured as MoVET's November PET OF THE MONTH!"
        />
        <meta property="og:type" content="website" />
        <meta
          name="og:title"
          property="og:title"
          content="HOWL-O-WEEN Pet Costume Contest - Sunday, Oct 29th @ 1pm"
        />
        <meta
          name="og:description"
          property="og:description"
          content="Come one come all! Join us, Sunday Oct 29th at 1pm in the Belleview Station Dog Park to show off your Halloween Best! We'll have a fall themed photo booth to capture this once-a-year attire! Come as a couple, or just in an awesome-sauce costume! We hope to see you there! Free treats and belly rubs included for all who come. Best of all, all entry photos will be posted on Instagram and Facebook -- make sure to campaign your friends to vote by LIKING your picture. Winning photo (the one with the most likes) will be announced on Halloween and be featured as MoVET's November PET OF THE MONTH!"
        />
        <meta property="og:site_name" content="MoVET" />
        <meta name="twitter:card" content="summary" />
        <meta
          name="twitter:title"
          content="HOWL-O-WEEN Pet Costume Contest - Sunday, Oct 29th @ 1pm"
        />
        <meta
          name="twitter:description"
          content="Come one come all! Join us, Sunday Oct 29th at 1pm in the Belleview Station Dog Park to show off your Halloween Best! We'll have a fall themed photo booth to capture this once-a-year attire! Come as a couple, or just in an awesome-sauce costume! We hope to see you there! Free treats and belly rubs included for all who come. Best of all, all entry photos will be posted on Instagram and Facebook -- make sure to campaign your friends to vote by LIKING your picture. Winning photo (the one with the most likes) will be announced on Halloween and be featured as MoVET's November PET OF THE MONTH!"
        />
        <meta name="twitter:site" content="https://movetcare.com" />
        <meta name="twitter:creator" content="Dr. A." />
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
          src="/images/blog/howl-o-ween-banner.png"
          alt="MoVET's 2nd Annual Howl-O-Ween"
          height={480}
          width={820}
        />
        <h2 className="text-2xl mt-8 text-center">
          The Pet Costume Contest is still ON!
        </h2>
        <h3 className="italic test-xl">Sunday, October 29th 1 PM - 3 PM</h3>
        <h3 className="italic test-xl mb-4">Photography starts at 1:15 PM</h3>
        <p className="text-lg">
          The Annual MoVET HOWL-O-WEEN Pet Costume is still on for today to show
          off your Halloween Best! The snow won&apos;t hold us back!
        </p>
        <p className="text-lg">
          Join us, TODAY! We&apos;ve made a few adjustments for the weather.
          Please meet us in the{" "}
          <a href="https://maps.app.goo.gl/1rQbAQogr3ZexD3F9" target="_blank">
            Belleview Station Beer Garden Ski Chalet
          </a>
          .
          <span className="font-extrabold">
            {" "}
            Don&apos;t worry, it&apos;s covered and heated, but still dress
            warmly!
          </span>
        </p>

        <p className="italic text-lg my-4">
          We&apos;ll keep in touch with you via Text/SMS so you know when to
          show up for your photo, so keep your phone handy!
        </p>
        <Image
          className="rounded-xl my-4"
          src="/images/blog/howl-o-ween-ad.png"
          alt="MoVET's 2nd Annual Howl-O-Ween"
          height={300}
          width={600}
        />
        <a
          href="https://denverpetpics.com/"
          target="_blank"
          className="text-lg my-4 text-center"
        >
          Professional photographer, DenverPetPics, will capture this
          once-a-year attire!
        </a>
        <a
          href="https://veterinaryemergencygroup.com/locations/denver-tech-center-co/"
          target="_blank"
          className="text-lg text-center"
        >
          VEG (our emergency vet partner) will also be there if you have any
          questions.
        </a>
        <p className="text-lg mt-8">
          FREE Admission! Free treats and belly rubs included for all who come.
          Event is free to attend, for all ages, and is dog friendly, of course!
        </p>
        <h4 className="text-lg mb-0 mt-8 text-center">
          KEEP IN TOUCH & BE SOCIAL:
        </h4>
        <a
          href="https://www.instagram.com/nessie_themovetpup/"
          target="_blank"
          className="text-lg my-2 text-center"
        >
          IG @nessie_themovetpup / @movetcare
        </a>
        <a
          href="https://www.facebook.com/MOVETCARE"
          target="_blank"
          className="text-lg text-center"
        >
          FB @movetcare
        </a>
        <p className="text-lg mt-8">
          All entry photos will be posted on Instagram and Facebook -- make sure
          to campaign your friends to vote by &quot;LIKING&quot; your picture.
          Winning photo (the one with the most likes) will be announced on
          Halloween and be featured as MoVET&apos;s November PET OF THE MONTH!
        </p>
        <HowloweenForm />
      </section>
      <CallToAction />
    </Layout>
  );
}
