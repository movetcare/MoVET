import Layout from "components/Layout";
import Head from "next/head";
import Image from "next/image";
import { CallToAction } from "ui";

export default function SixReasons() {
  return (
    <Layout>
      <Head>
        <title>
          6 Reasons Why We're Thankful For Our Pets This Thanksgiving Season
        </title>
        <meta
          name="description"
          content="They are our fur-babies, what's not to love? Humans and their pets can develop such special bonds. It's often something not understood until you are lucky enough to experience it yourself. As we approach the busy season of the holidays, don't forget to take a few moments each day to show your pet some extra love!"
        />
        <meta property="og:type" content="website" />
        <meta
          name="og:title"
          property="og:title"
          content="6 Reasons Why We're Thankful For Our Pets This Thanksgiving Season"
        />
        <meta
          name="og:description"
          property="og:description"
          content="They are our fur-babies, what's not to love? Humans and their pets can develop such special bonds. It's often something not understood until you are lucky enough to experience it yourself. As we approach the busy season of the holidays, don't forget to take a few moments each day to show your pet some extra love!"
        />
        <meta property="og:site_name" content="MoVET" />
        <meta name="twitter:card" content="summary" />
        <meta
          name="twitter:title"
          content="6 Reasons Why We're Thankful For Our Pets This Thanksgiving Season"
        />
        <meta
          name="twitter:description"
          content="They are our fur-babies, what's not to love? Humans and their pets can develop such special bonds. It's often something not understood until you are lucky enough to experience it yourself. As we approach the busy season of the holidays, don't forget to take a few moments each day to show your pet some extra love!"
        />
        <meta name="twitter:site" content="https://movetcare.com" />
        <meta name="twitter:creator" content="Dr. A." />
        <link rel="icon" type="image/png" href="/static/images/favicon.ico" />
        <link rel="apple-touch-icon" href="/static/images/favicon.ico" />
        <meta
          property="og:image"
          content="/static/images/blog/six-reasons.jpg"
        />
        <meta
          name="twitter:image"
          content="/static/images/blog/six-reasons.jpg"
        />
      </Head>
      <section className="flex flex-col items-center justify-center sm:max-w-screen-lg mx-4 sm:mx-auto mt-8 mb-20 px-8 lg:px-20 bg-white rounded-xl p-4 sm:p-8">
        <Image
          className="rounded-xl"
          src="/images/blog/six-reasons.jpg"
          alt="MoVET's 2022 Black Friday Deal"
          height={484}
          width={820}
        />
        <h2 className="text-3xl mt-8 mb-4 text-center">
          6 Reasons Why We're Thankful For Our Pets This Thanksgiving Season
        </h2>
        <p className="-mb-2">By: Dr. A</p>
        <p className="mb-4 italic text-xs">November 21st, 2022</p>
        <p>
          They are our fur-babies, what's not to love? Humans and their pets can
          develop such special bonds. It's often something not understood until
          you are lucky enough to experience it yourself. As we approach the
          busy season of the holidays, don't forget to take a few moments each
          day to show your pet some extra love! After all, they are there for
          you all year round. Here are just a few of the reasons why we are
          extra thankful for them!
        </p>
        <ul>
          <li>
            <h2>1. They give us a purpose</h2>
            <p>
              We've all experienced those days that are harder than others to
              get out of bed. If all else fails, you can typically count on some
              wet nose nuzzles and paw pats reminding you that someone is
              hungry! Having something so adorable that depends on you can
              always cheer you up.
            </p>
          </li>
          <li>
            <h2>2. Unconditional Love</h2>
            <p>
              A human and their pet share an unbreakable bond. We are flawed and
              imperfect, but our pets don't care. Every day they show us that we
              are worthy of love!
            </p>
          </li>
          <li>
            <h2>3. They keep us active</h2>
            <p>
              Whether it's taking your dog on their daily walk which they love
              so much, or constantly searching your local pet stores for their
              favorite toys and snacks, having pets keeps us moving! We might
              rely on technology these days, but our furry friends certainly do
              not! They are the perfect excuse to get up and move around.
            </p>
          </li>
          <li>
            <h2>4. They are always there for us</h2>
            <p>
              Animals have a long history of helping us get through the days.
              Whether as a service animal, a trained protector, or a comfy buddy
              to cry on during times of grief, we can always count on our pets
              to be there for us when we need them the most.
            </p>
          </li>
          <li>
            <h2>5. They're FUN!</h2>
            <p>
              Caring for any pet is a big responsibly, but the fun and
              excitement they provide us with in return is more than worth it!
              Laughter is the best medicine, and there is plenty to go around
              when spending time with your fur-baby. From their unique quirks to
              inventive games, you can always count on your pet to make you
              smile.
            </p>
          </li>
          <li>
            <h2>6. They make us better</h2>
            <p>
              It's no secret that our pets bring out the best in us. Their
              unconditional love makes us want to be gentler and kinder to them,
              which in turn can change our reactions to the outside world. They
              give us something to look forward to during the work day which can
              lift our spirits, and allow us to connect with other people who
              share a love for their pets as deeply as we do!
            </p>
          </li>
        </ul>
      </section>
      <CallToAction />
    </Layout>
  );
}
