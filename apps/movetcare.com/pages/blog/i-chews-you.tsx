import Layout from "components/Layout";
import Head from "next/head";
import Image from "next/image";
import { CallToAction } from "ui";

export default function IChooseYou() {
  return (
    <Layout>
      <Head>
        <title>I Chews You!</title>
        <meta
          name="description"
          content="5 ideas to make them feel extra loved this Valentine's Day!"
        />
        <meta property="og:type" content="website" />
        <meta name="og:title" property="og:title" content="I Chews You" />
        <meta
          name="og:description"
          property="og:description"
          content="5 ideas to make them feel extra loved this Valentine's Day!"
        />
        <meta property="og:site_name" content="MoVET" />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content="I Chews You" />
        <meta
          name="twitter:description"
          content="5 ideas to make them feel extra loved this Valentine's Day!"
        />
        <meta name="twitter:site" content="https://movetcare.com" />
        <meta name="twitter:creator" content="Rachel Bloch" />
        <link rel="icon" type="image/png" href="/static/images/favicon.ico" />
        <link rel="apple-touch-icon" href="/static/images/favicon.ico" />
        <meta
          property="og:image"
          content="/static/images/blog/i-chews-you.jpg"
        />
        <meta
          name="twitter:image"
          content="/static/images/blog/i-chews-you.jpg"
        />
      </Head>
      <section className="flex flex-col items-center justify-center sm:max-w-screen-lg mx-4 sm:mx-auto mt-8 mb-20 lg:px-20 bg-white rounded-xl p-4 sm:p-8">
        <Image
          className="rounded-xl"
          src="/images/blog/i-chews-you.jpg"
          alt="I Chews You!"
          height={484}
          width={820}
        />
        <h2 className="text-3xl mt-8 mb-4 text-center">I Chews You!</h2>
        <p className="-mb-2">By: Rachel Bloch</p>
        <p className="mb-4 italic text-xs">February 9th, 2023</p>
        <p className="text-lg">
          We all know Valentine&quot;s Day as the holiday to celebrate our
          significant others, but what about the OTHER significant other? (You
          know, the furry one with a wagging tail and slobbery kisses).
          It&apos;s not unusual these days for pet-owners to consider their
          fur-baby to be the great love of their life. These adorable
          Valentine&apos;s deserve to be celebrated this February just like
          anyone else would! Unlike your human partner, you pet would not
          appreciate the flowers and boxes of chocolates… so what can you do for
          your Furry Valentine? Here&apos;s 5 ideas to make them feel extra
          loved this Valentine&apos;s Day!
        </p>
        <ul>
          <li>
            <h2>1. Bake a Fancy Dog Treat</h2>
            <p>
              No, dogs can&apos;t have chocolate or candy, of course. But that
              doesn&apos;t mean they can&apos;t enjoy a fancy treat made with
              love! There are many dog-friendly recipes out there that even the
              most beginner bakers can tackle. See below for a recipe for
              Cranberry Heart Valentine&apos;s for dogs! As always, check with
              your Veterinarian about what ingredients are safe for your dog and
              their dietary needs.
            </p>
          </li>
          <li>
            <h2>2. Good Old-Fashioned Quality Time</h2>
            <p>
              Like their human companions, different pets have different love
              languages. If your furry love thrives on snuggles, set aside some
              extra time this Valentine&apos;s Day to give them ALL of the pats!
              A nice belly rub or head scratch is all a dog needs sometimes.
            </p>
          </li>
          <li>
            <h2>3. Scent Walk</h2>
            <p>
              If your dog loves their daily walks with you, change it up this
              Valentine&apos;s Day! Find a route outside of your normal routine
              to really intrigue your dog and their senses! Dogs love smelling
              new scents and exploring exciting terrains. Like they always say,
              a tired dog is a happy dog!
            </p>
          </li>
          <li>
            <h2>4. Gift Them a New Toy</h2>
            <p>
              Who doesn&apos;t love getting gifts? If your dog or cat has seemed
              bored lately with their basket of toys, surprise them with a brand
              new stuffy or squeaky toy! And to really spoil them, take them
              with you to the pet store and let them pick out their own new toy!
              The MoVET Boutique carries many brands of dog and cat toys. Come
              sniff around!
            </p>
          </li>
          <li>
            <h2>5. Dog Park Adventure</h2>
            <p>
              If your dog loves making friends, take them to one of your local
              dog parks for an afternoon of fun and socializing! MoVET is
              conveniently located next to the #BelleviewStationDogPark, and our
              own @Nessie_theMoVETPup is a frequent visitor!
            </p>
          </li>
        </ul>
      </section>
      <CallToAction />
    </Layout>
  );
}
