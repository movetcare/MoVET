import Layout from "components/Layout";
import Head from "next/head";
import Image from "next/image";
import { Button, CallToAction } from "ui";

export default function IChooseYou() {
  return (
    <Layout>
      <Head>
        <title>2023 Spring Heartworm Clinic</title>
        <meta
          name="description"
          content="Our 1st Annual Spring Heartworm Clinic is now open for bookings!"
        />
        <meta property="og:type" content="website" />
        <meta name="og:title" property="og:title" content="I Chews You" />
        <meta
          name="og:description"
          property="og:description"
          content="Our 1st Annual Spring Heartworm Clinic is now open for bookings!"
        />
        <meta property="og:site_name" content="MoVET" />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content="I Chews You" />
        <meta
          name="twitter:description"
          content="Our 1st Annual Spring Heartworm Clinic is now open for bookings!"
        />
        <meta name="twitter:site" content="https://movetcare.com" />
        <meta name="twitter:creator" content="Dr. A" />
        <link rel="icon" type="image/png" href="/static/images/favicon.ico" />
        <link rel="apple-touch-icon" href="/static/images/favicon.ico" />
        <meta property="og:image" content="/images/blog/heartworm-clinic.png" />
        <meta
          name="twitter:image"
          content="/images/blog/heartworm-clinic.png"
        />
      </Head>
      <section className="flex flex-col items-center justify-center sm:max-w-screen-lg mx-4 sm:mx-auto mt-8 mb-20 px-8 lg:px-20 bg-white rounded-xl p-4 sm:p-8">
        <Image
          className="rounded-xl cursor-pointer"
          src="/images/blog/heartworm-clinic-banner.png"
          alt="2023 Spring Heartworm Clinic"
          height={200}
          width={800}
          onClick={() =>
            window.open(
              "https://app.movetcare.com/schedule-an-appointment",
              "_blank"
            )
          }
        />

        <h2 className="text-3xl mt-8 mb-4 text-center">
          Spring Heartworm Clinic
        </h2>
        <p className="text-xl text-extrabold">
          Our 1st Annual Spring Heartworm Clinic is now open for bookings!
        </p>
        <p className="italic text-lg -mt-1 mb-4">
          Did you know ProHeart12 lasts for 12 months! No more monthly tablets.
        </p>
        <h2 className="text-base">
          DON&apos;T FALL BEHIND ON YOUR HEARTWORM PREVENTION
        </h2>
        <Button
          text="Schedule an Appointment Today"
          color="red"
          className="mt-2"
          onClick={() =>
            window.open(
              "https://app.movetcare.com/schedule-an-appointment",
              "_blank"
            )
          }
        />
      </section>
      <CallToAction />
    </Layout>
  );
}
