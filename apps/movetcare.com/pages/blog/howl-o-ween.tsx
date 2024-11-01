import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import Layout from "components/Layout";
import Head from "next/head";
import Image from "next/image";
import { Button, CallToAction } from "ui";

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
          src="/images/blog/fetch-photo-truck.jpg"
          alt="MoVET's 3rd Annual Howl-O-Ween"
          height={480}
          width={820}
        />
        <h2 className="text-2xl mt-8 text-center">
          🎃🐾 HOWL-O-WEEN Pet Costume Contest Photoshoot Extravaganza 🐾🎃
        </h2>
        <h3 className="italic test-xl">Sunday, October 27th 11AM - 3PM</h3>
        <p className="text-lg">
          Unleash your furry friend&apos;s inner superstar this Halloween with
          MoVET&apos;s spook-tacular HOWL-O-WEEN Pet Costume Contest! Dress up
          your pet in their most boo-tiful costume and capture their hauntingly
          adorable look in a FREE photoshoot!
        </p>
        <p className="text-lg">
          All entry photos will be posted on{" "}
          <a
            href="https://www.instagram.com/nessie_themovetpup/"
            target="_blank"
          >
            Instagram
          </a>{" "}
          and{" "}
          <a href="https://www.facebook.com/MOVETCARE" target="_blank">
            Facebook
          </a>{" "}
          -- make sure to campaign your friends to vote by &quot;LIKING&quot;
          your picture. Winning photo (the one with the most likes) will be
          announced on Halloween and be featured as MoVET&apos;s November PET OF
          THE MONTH!
        </p>
        <h3 className="mt-4 mb-0 text-2xl text-center">New to MoVET?</h3>
        <h2 className="text-center">
          Don&apos;t fret! Here&apos;s how you can join the fun...
        </h2>
        <ol className="mb-8 italic">
          <li>
            1.{" "}
            <a href="/get-the-app">Download and sign up for the MoVET app.</a>
          </li>
          <li>
            2. Spend <b>$30</b> in our Boutique between now and October 27th.
          </li>
          <li>
            3. &quot;Like and Follow&quot;{" "}
            <a
              href="https://www.instagram.com/nessie_themovetpup/"
              target="_blank"
              className="text-lg my-2 text-center"
            >
              @nessie_themovetpup
            </a>{" "}
            and{" "}
            <a
              href="https://www.instagram.com/movetcare/"
              target="_blank"
              className="text-lg my-2 text-center"
            >
              @movetcare
            </a>{" "}
            on Instagram.
          </li>
        </ol>
        <h3 className="mt-4 mb-0 text-2xl text-center">
          Existing MoVET Clients
        </h3>
        <h2 className="text-center mb-8">
          You get a FREE photoshoot—no tricks, just treats!
        </h2>
        <Button
          color="red"
          text="Join the Contest"
          icon={faArrowRight}
          className="mb-8"
          onClick={() =>
            window.open(
              `https://app.movetcare.com/booking/2024-howl-o-ween-pet-costume-contest/`,
              "_blank",
            )
          }
        />
        {/* <HowloweenForm /> */}
      </section>
      <CallToAction />
    </Layout>
  );
}
