import { CallToAction, K9SmilesForm } from "ui";
import Head from "next/head";
import Image from "next/image";
import Layout from "components/Layout";

export default function K9Smiles() {
  return (
    <Layout>
      <Head>
        <title>K-9 Smiles Teeth Cleaning Clinic @ MoVET</title>
        <meta
          name="description"
          content="MoVET is partnering with K-9 Smiles to offer a safe and affordable teeth cleaning clinic for your dog or
          cat!"
        />
        <meta property="og:type" content="website" />
        <meta
          name="og:title"
          property="og:title"
          content="K-9 Smiles Teeth Cleaning Clinic @ MoVET"
        />
        <meta
          name="og:description"
          property="og:description"
          content="MoVET is partnering with K-9 Smiles to offer a safe and affordable teeth cleaning clinic for your dog or
          cat!"
        />
        <meta property="og:site_name" content="MoVET" />
        <meta name="twitter:card" content="summary" />
        <meta
          name="twitter:title"
          content="K-9 Smiles Teeth Cleaning Clinic @ MoVET"
        />
        <meta
          name="twitter:description"
          content="MoVET is partnering with K-9 Smiles to offer a safe and affordable teeth cleaning clinic for your dog or
          cat!"
        />
        <meta name="twitter:site" content="https://movetcare.com" />
        <meta name="twitter:creator" content="Dr. A" />
        <meta
          property="og:image"
          content="/images/blog/canine-smiles-clinic.png"
        />
        <meta
          name="twitter:image"
          content="/images/blog/canine-smiles-clinic.png"
        />
      </Head>
      <section className="flex flex-col justify-center items-center p-4 mx-4 mt-8 mb-20 bg-white rounded-xl sm:max-w-screen-lg sm:mx-auto lg:px-20 sm:p-8">
        <Image
          className="rounded-xl cursor-pointer"
          src="/images/blog/canine-smiles-clinic.png"
          alt="k9 Smiles Teeth Cleaning Clinic @ MoVET"
          height={500}
          width={600}
        />
        <h2 className="mt-8 max-w-screen-md text-2xl font-extrabold text-center">
          MoVET is partnering with{" "}
          <a href="https://www.k-9smiles.com/" target="_blank" rel="noreferrer">
            K-9 Smiles
          </a>{" "}
          to offer a safe and affordable teeth cleaning clinic for your dog or
          cat!
        </h2>
        <p className="mt-4 max-w-screen-md text-center">
          K-9 Smiles provides in-depth teeth cleaning for both cats and dogs.
          Their services include an oral exam, no anesthesia, plaque & tarter
          removal, scaling & polishing with their well trained technicians under
          the supervision of one of MoVET&apos;s licensed veterinarians.
        </p>
        <h3 className="mt-4 text-xl text-center font-abside">
          Upcoming Clinics:
        </h3>
        <ul className="mt-2 text-center">
          <li>February 22nd - 9:30AM - 3:30PM</li>
          <li>March 22nd - 9:30AM - 3:30PM</li>
          <li>April 26th - 9:30AM - 3:30PM</li>
          <li>May 17th - 9:30AM - 3:30PM</li>
          <li>June 7th - 9:30AM - 3:30PM</li>
          <li>July 12th - 9:30AM - 3:30PM</li>
          <li>August 23rd - 9:30AM - 3:30PM</li>
          <li>September 20th - 9:30AM - 3:30PM</li>
          <li>October 11th - 9:30AM - 3:30PM</li>
          <li>November 8th - 9:30AM - 3:30PM</li>
        </ul>
        <h3 className="mt-12 text-xl text-center font-abside">
          SCHEDULE A TEETH CLEANING FOR YOUR PET TODAY!
        </h3>
        <p className="mt-0 text-xl font-bold text-center">
          DENTAL EXAM + IN-DEPTH TEETH CLEANING - $295
        </p>
        <K9SmilesForm />
        <p className="-mt-2 max-w-screen-md text-xs italic font-extrabold text-center">
          * It is always up to the veterinarian whether your pet is a candidate
          for the service.
        </p>
        <p className="-mt-2 max-w-screen-md text-xs italic font-extrabold text-center">
          * This is not intended to replace a dental under anesthesia but rather
          to be part of your pet&apos;s dental plan.
        </p>
      </section>
      <CallToAction />
    </Layout>
  );
}
