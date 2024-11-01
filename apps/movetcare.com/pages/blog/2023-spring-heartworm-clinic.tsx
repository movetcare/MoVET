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
        <meta
          name="og:title"
          property="og:title"
          content="MoVET's 1st Annual Spring Heartworm Clinic"
        />
        <meta
          name="og:description"
          property="og:description"
          content="Our 1st Annual Spring Heartworm Clinic is now open for bookings!"
        />
        <meta property="og:site_name" content="MoVET" />
        <meta name="twitter:card" content="summary" />
        <meta
          name="twitter:title"
          content="MoVET's 1st Annual Spring Heartworm Clinic"
        />
        <meta
          name="twitter:description"
          content="Our 1st Annual Spring Heartworm Clinic is now open for bookings!"
        />
        <meta name="twitter:site" content="https://movetcare.com" />
        <meta name="twitter:creator" content="Dr. A" />
        <meta property="og:image" content="/images/blog/heartworm-clinic.png" />
        <meta
          name="twitter:image"
          content="/images/blog/heartworm-clinic.png"
        />
      </Head>
      <section className="flex flex-col items-center justify-center sm:max-w-screen-lg mx-4 sm:mx-auto mt-8 mb-20 lg:px-20 bg-white rounded-xl p-4 sm:p-8">
        <Image
          className="rounded-xl cursor-pointer"
          src="/images/blog/heartworm-clinic-banner.png"
          alt="2023 Spring Heartworm Clinic"
          height={200}
          width={800}
          onClick={() =>
            window.open(
              "https://app.movetcare.com/schedule-an-appointment",
              "_blank",
            )
          }
        />
        <h2 className="text-3xl mt-8 mb-2 text-center">
          Spring Heartworm Clinic
        </h2>
        <p className="text-xl text-extrabold">
          Our 1st Annual Spring Heartworm Clinic is now open for bookings!
        </p>
        <p className="text-lg mt-2">
          Did you know{" "}
          <a
            href="https://www.zoetispetcare.com/products/proheart"
            target="_blank"
            rel="noreferrer"
          >
            ProHeart12
          </a>{" "}
          lasts for 12 months! No more monthly tablets.
        </p>
        <p className="italic text-lg mb-4">
          Receive <span className="font-extrabold">$10 off</span> when you book
          a Heartworm Test with a{" "}
          <a
            href="https://www.zoetispetcare.com/products/proheart"
            target="_blank"
            rel="noreferrer"
          >
            ProHeart12
          </a>{" "}
          injection between March 20th and June 21st.
        </p>
        <h2 className="text-lg mt-4">
          DON&apos;T FALL BEHIND ON YOUR HEARTWORM PREVENTION
        </h2>
        <Button
          text="Schedule an Appointment Today"
          color="red"
          className="mt-2 mb-4"
          onClick={() =>
            window.open(
              "https://app.movetcare.com/schedule-an-appointment",
              "_blank",
            )
          }
        />
        <p className="mt-4 mb-4 italic uppercase">
          Learn more about heartworm prevention
        </p>
        <div className="flex flex-row">
          <Button
            text="Heartworm In Colorado"
            color="black"
            className="mr-2"
            onClick={() =>
              window.open(
                "https://movetcare.com/blog/winter-heartworm/",
                "_blank",
              )
            }
          />
          <Button
            text="American Heartworm Society"
            color="black"
            className="ml-2"
            onClick={() =>
              window.open("https://www.heartwormsociety.org/", "_blank")
            }
          />
        </div>
      </section>
      <CallToAction />
    </Layout>
  );
}
