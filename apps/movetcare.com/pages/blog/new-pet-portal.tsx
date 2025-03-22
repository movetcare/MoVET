import { faCalendarPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Layout from "components/Layout";
import Head from "next/head";
import { CallToAction } from "ui";

export default function NewPetPortal() {
  return (
    <Layout>
      <Head>
        <title>Exciting Changes Coming to Enhance Your Pet&apos;s Care!</title>
        <meta
          name="description"
          content="We are excited to share some important updates regarding our veterinary record-keeping and appointment scheduling system!"
        />
        <meta property="og:type" content="website" />
        <meta
          name="og:title"
          property="og:title"
          content="xciting Changes Coming to Enhance Your Pets Care!"
        />
        <meta
          name="og:description"
          property="og:description"
          content="We are excited to share some important updates regarding our veterinary record-keeping and appointment scheduling system!"
        />
        <meta property="og:site_name" content="MoVET" />
        <meta name="twitter:card" content="summary" />
        <meta
          name="twitter:title"
          content="xciting Changes Coming to Enhance Your Pets Care!"
        />
        <meta
          name="twitter:description"
          content="We are excited to share some important updates regarding our veterinary record-keeping and appointment scheduling system!"
        />
        <meta name="twitter:site" content="https://movetcare.com" />
        <meta name="twitter:creator" content="Dr. A." />
        <meta property="og:image" content="/images/logos/logo.png" />
        <meta name="twitter:image" content="/images/logos/logo.png" />
      </Head>
      <section className="flex flex-col justify-center items-center p-4 mx-4 mt-8 mb-20 bg-white rounded-xl sm:max-w-screen-lg sm:mx-auto lg:px-20 sm:p-8">
        <h1 className="mt-8 w-full text-xl sm:w-2/3">
          Exciting Changes Coming to Enhance Your Pet&apos;s Care!
        </h1>
        <p>
          We are excited to share some important updates regarding our
          veterinary record-keeping and appointment scheduling system! Beginning
          in the next few weeks, we will be transitioning to a new and improved
          platform designed to streamline communication and enhance your
          experience with us.
        </p>
        <p>
          As part of this transition, our current MoVET App will be retiring as
          of April 1st. But don&apos;t worry—our new system includes a
          user-friendly pet portal that will provide you with convenient access
          to:
        </p>
        <ul className="flex flex-col ml-8 w-full list-disc">
          <li>Schedule appointments online</li>
          <li>View upcoming and past visits</li>
          <li>Access vaccination records</li>
          <li>Request refills</li>
          <li>View upcoming reminders</li>
          <li>Communicate with our team more efficiently</li>
        </ul>
        <p>
          Our website will continue to be a great resource as well as providing
          quick access to our new Pet Portal as well as our continued
          communication via phone or text messaging services.
        </p>
        <p>
          {" "}
          We appreciate your patience as we navigate this transition and learn
          the new system. Our team is here to help, and we are confident this
          change will improve the way we serve you and your pets.
        </p>
        <p>
          If you have any questions or need assistance during this transition,
          please don&apos;t hesitate to reach out!{" "}
        </p>
        <a
          className="flex justify-center items-center px-4 py-2 mt-6 text-base font-medium uppercase rounded-full border border-transparent shadow-sm duration-500 ease-in-out text-movet-white font-abside bg-movet-red group-hover:bg-movet-black hover:bg-movet-black focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-movet-red"
          target="_blank"
          href={`https://petportal.vet/movet/`}
          rel="noopener noreferrer"
          id="mobile-request-appointment-cta"
        >
          <FontAwesomeIcon icon={faCalendarPlus} size="lg" className="mr-2" />
          SCHEDULE AN APPOINTMENT
        </a>
      </section>
      <CallToAction />
    </Layout>
  );
}
