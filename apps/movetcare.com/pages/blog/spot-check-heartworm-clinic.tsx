import Layout from "components/Layout";
import Head from "next/head";
import Image from "next/image";
import { Button, CallToAction } from "ui";

export default function IChooseYou() {
  return (
    <Layout>
      <Head>
        <title>Spot Check Heartworm Clinic</title>
        <meta
          name="description"
          content="We want to make sure ALL dogs are protected this Spring from Heartworm disease. MoVET is offering a Heartworm 'Spot Check' Clinic on Sunday, May 19th. Clinic includes a Heartworm Test ($45) and Monthly Heartworm Parasite Prevention. Flea/Tick prevention will also be available."
        />
        <meta property="og:type" content="website" />
        <meta
          name="og:title"
          property="og:title"
          content="Spot Check Heartworm Clinic"
        />
        <meta
          name="og:description"
          property="og:description"
          content="We want to make sure ALL dogs are protected this Spring from Heartworm disease. MoVET is offering a Heartworm 'Spot Check' Clinic on Sunday, May 19th. Clinic includes a Heartworm Test ($45) and Monthly Heartworm Parasite Prevention. Flea/Tick prevention will also be available."
        />
        <meta property="og:site_name" content="MoVET" />
        <meta name="twitter:card" content="summary" />
        <meta
          name="twitter:title"
          content="Spot Check Heartworm Clinic"
        />
        <meta
          name="twitter:description"
          content="We want to make sure ALL dogs are protected this Spring from Heartworm disease. MoVET is offering a Heartworm 'Spot Check' Clinic on Sunday, May 19th. Clinic includes a Heartworm Test ($45) and Monthly Heartworm Parasite Prevention. Flea/Tick prevention will also be available."
        />
        <meta name="twitter:site" content="https://movetcare.com" />
        <meta name="twitter:creator" content="Dr. A" />
        <link rel="icon" type="image/png" href="/static/images/favicon.ico" />
        <link rel="apple-touch-icon" href="/static/images/favicon.ico" />
        <meta property="og:image" content="/images/blog/spot-check-heartworm-clinic.png" />
        <meta
          name="twitter:image"
          content="/images/blog/spot-check-heartworm-clinic.png"
        />
      </Head>
      <section className="flex flex-col items-center justify-center sm:max-w-screen-lg mx-4 sm:mx-auto mt-8 mb-20 lg:px-20 bg-white rounded-xl p-4 sm:p-8">
        <Image
          className="rounded-xl cursor-pointer"
          src="/images/blog/spot-check-cta.png"
          alt="2023 Spring Heartworm Clinic"
          height={300}
          width={900}
          onClick={() =>
            window.open(
              "https://app.movetcare.com/schedule-an-appointment",
              "_blank",
            )
          }
        />
        <h2 className="text-3xl mt-8 mb-2 text-center">
          Spot Check Heartworm Clinic
        </h2>
        <p className="text-xl text-extrabold mb-6 sm:mb-8">
        We want to make sure ALL dogs are protected this Spring from Heartworm disease. MoVET is offering a Heartworm &quot;Spot Check&quot; Clinic on Sunday, May 19th. Clinic includes a Heartworm Test ($45) and Monthly Heartworm Parasite Prevention. Flea/Tick prevention will also be available.
        </p>
        <Image
          className="rounded-xl cursor-pointer hidden sm:block"
          src="/images/blog/spot-check-cta-1.png"
          alt="2023 Spring Heartworm Clinic"
          height={300}
          width={900}
          onClick={() =>
            window.open(
              "https://app.movetcare.com/schedule-an-appointment",
              "_blank",
            )
          }
        />
        <Image
          className="rounded-xl cursor-pointer sm:hidden"
          src="/images/blog/spot-check-cta-1-mobile.png"
          alt="2023 Spring Heartworm Clinic"
          height={300}
          width={900}
          onClick={() =>
            window.open(
              "https://app.movetcare.com/schedule-an-appointment",
              "_blank",
            )
          }
        />
        <Button
          text="Schedule an Appointment Today"
          color="red"
          className="mt-8 mb-4"
          onClick={() =>
            window.open(
              "https://app.movetcare.com/schedule-an-appointment",
              "_blank",
            )
          }
        />
      </section>
      <CallToAction />
    </Layout>
  );
}
