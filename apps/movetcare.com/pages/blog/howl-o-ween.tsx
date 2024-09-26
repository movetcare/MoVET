import Layout from "components/Layout";
import Head from "next/head";
import Image from "next/image";
import { CallToAction, HowloweenForm } from "ui";

export default function HowlOWeen() {
  return (
    <Layout>
      <Head>
        <title>
          HOWL-O-WEEN Pet Costume Contest - Sunday, Oct 27th @ 11AM - 3PM
        </title>
        <meta
          name="description"
          content="Unleash your furry friend's inner superstar this Halloween with MoVET's spook-tacular HOWL-O-WEEN Pet Costume Contest! Dress up your pet in their most boo-tiful costume and capture their hauntingly adorable look in a FREE photoshoot!"
        />
        <meta property="og:type" content="website" />
        <meta
          name="og:title"
          property="og:title"
          content="HOWL-O-WEEN Pet Costume Contest - Sunday, Oct 27th @ 11AM - 3PM"
        />
        <meta
          name="og:description"
          property="og:description"
          content="Unleash your furry friend's inner superstar this Halloween with MoVET's spook-tacular HOWL-O-WEEN Pet Costume Contest! Dress up your pet in their most boo-tiful costume and capture their hauntingly adorable look in a FREE photoshoot!"
        />
        <meta property="og:site_name" content="MoVET" />
        <meta name="twitter:card" content="summary" />
        <meta
          name="twitter:title"
          content="HOWL-O-WEEN Pet Costume Contest - Sunday, Oct 27th @ 11AM - 3PM"
        />
        <meta
          name="twitter:description"
          content="Unleash your furry friend's inner superstar this Halloween with MoVET's spook-tacular HOWL-O-WEEN Pet Costume Contest! Dress up your pet in their most boo-tiful costume and capture their hauntingly adorable look in a FREE photoshoot!"
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
      <section className="flex flex-col items-center justify-center sm:max-w-screen-lg mx-4 sm:mx-auto mt-8 mb-20 lg:px-20 bg-white rounded-xl p-4 sm:p-8">
        <Image
          className="rounded-xl"
          src="/images/blog/howl-o-ween-banner.png"
          alt="MoVET's 3rd Annual Howl-O-Ween"
          height={480}
          width={820}
        />
        <h2 className="text-2xl mt-8 text-center">
          HOWL-O-WEEN Pet Costume Contest Photoshoot Extravaganza
        </h2>
        <h3 className="italic test-xl">Sunday, October 27th 11AM - 3PM</h3>
        <p className="text-lg">
          Unleash your furry friend&apos;s inner superstar this Halloween with
          MoVET&apos;s spook-tacular HOWL-O-WEEN Pet Costume Contest! Dress up
          your pet in their most boo-tiful costume and capture their hauntingly
          adorable look in a FREE photoshoot!
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
