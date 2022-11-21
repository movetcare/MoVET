import Layout from "components/Layout";
import Head from "next/head";
import Image from "next/image";
import { CallToAction } from "ui";

export default function WinterHeartworm() {
  return (
    <Layout>
      <Head>
        <title>Over Wintering - Heartworm Disease in Colorado</title>
        <meta
          name="description"
          content="Mosquitos are found in the Denver & Front Range areas throughout the 
winter months and still have the potential to spread dangerous and deadly 
heartworm disease. It is important that your pet be protected."
        />
        <meta property="og:type" content="website" />
        <meta
          name="og:title"
          property="og:title"
          content="Over Wintering - Heartworm Disease in Colorado"
        />
        <meta
          name="og:description"
          property="og:description"
          content="Mosquitos are found in the Denver & Front Range areas throughout the 
winter months and still have the potential to spread dangerous and deadly 
heartworm disease. It is important that your pet be protected."
        />
        <meta property="og:site_name" content="MoVET" />
        <meta name="twitter:card" content="summary" />
        <meta
          name="twitter:title"
          content="Over Wintering - Heartworm Disease in Colorado"
        />
        <meta
          name="twitter:description"
          content="Mosquitos are found in the Denver & Front Range areas throughout the 
winter months and still have the potential to spread dangerous and deadly 
heartworm disease. It is important that your pet be protected."
        />
        <meta name="twitter:site" content="https://movetcare.com" />
        <meta name="twitter:creator" content="Dr. Barbara Caldwell" />
        <link rel="icon" type="image/png" href="/static/images/favicon.ico" />
        <link rel="apple-touch-icon" href="/static/images/favicon.ico" />
        <meta
          property="og:image"
          content="/static/images/blog/winter-heartworm.jpg"
        />
        <meta
          name="twitter:image"
          content="/static/images/blog/winter-heartworm.jpg"
        />
      </Head>
      <section className="flex flex-col items-center justify-center sm:max-w-screen-lg mx-4 sm:mx-auto mt-8 mb-20 px-8 lg:px-20 bg-white rounded-xl p-4 sm:p-8">
        <Image
          className="rounded-xl"
          src="/images/blog/winter-heartworm.jpg"
          alt="MoVET's 2022 Black Friday Deal"
          height={484}
          width={820}
        />
        <h2 className="text-3xl mt-8 mb-4 text-center">
          Over Wintering – Heartworm Disease in Colorado
        </h2>
        <p className="-mb-2">By: Dr. Barbara Caldwell</p>
        <p className="mb-4 italic text-xs">November 17th, 2022</p>
        <p>
          The leaves are falling and the weather is turning colder. Heartworm
          disease isn&apos;t a concern any more, right? Unfortunately, that is
          not true. Mosquitos are found in the Denver & Front Range areas
          throughout the winter months and still have the potential to spread
          dangerous and deadly heartworm disease. It is important that your pet
          be protected by using a year-round preventative product such as the
          monthly chewable tablets, Interceptor Plus or have your veterinarian
          administer the 12-month protection, Proheart-12.
        </p>
        <p>
          In Fall, mosquito species that die off for the winter will not
          disappear until after a good freeze, although they become less active
          as temperatures drop below 50 degrees. For those mosquito species that
          hibernate as adults, they become dormant when winter temperatures
          arrive, but will come out anytime the weather is warm enough,
          generally when the temperature rises over 50 degrees. Think about
          those great, sunny, 60–70-degree Colorado winter days. Also, these
          hibernating mosquitos are cold-blooded insects that have a great knack
          for finding warmer areas to survive in. The urban heat island effect
          has been found to be a significant way mosquitos extend well past
          their normal “season.” Heat that is retained in buildings, parking
          structures and other protected spaces such as the inside of houses,
          sheds, garages and barns, all allow these annoying little pests to
          thrive even when the thermometer begins to dip.
        </p>
        <p>
          Avoiding the on-again, off-again preventative schedule ensures that
          our pets are always protected. The savings of stopping preventative
          for a few months doesn&apos;t compare to the over $1,000.00 treatment
          cost once a pet is positive for heartworm disease. Additionally, since
          the heartworm preventatives are broad spectrum and protect against
          multiple parasites, such as intestinal parasites, fleas, and ticks, we
          can prevent the increase of other parasitic diseases. Discontinuing
          the parasite preventive because the summer has passed, puts our pets
          at risk.
        </p>
      </section>
      <CallToAction />
    </Layout>
  );
}
