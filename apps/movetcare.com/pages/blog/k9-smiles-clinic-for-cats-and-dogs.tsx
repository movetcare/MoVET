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
          cat on April 15th from 9:30 AM to 3:30 PM"
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
          cat on April 15th from 9:30 AM to 3:30 PM"
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
          cat on April 15th from 9:30 AM to 3:30 PM"
        />
        <meta name="twitter:site" content="https://movetcare.com" />
        <meta name="twitter:creator" content="Dr. A" />
        <link rel="icon" type="image/png" href="/static/images/favicon.ico" />
        <link rel="apple-touch-icon" href="/static/images/favicon.ico" />
        <meta
          property="og:image"
          content="/images/blog/canine-smiles-clinic.jpg"
        />
        <meta
          name="twitter:image"
          content="/images/blog/canine-smiles-clinic.jpg"
        />
      </Head>
      <section className="flex flex-col items-center justify-center sm:max-w-screen-lg mx-4 sm:mx-auto mt-8 mb-20 px-8 lg:px-20 bg-white rounded-xl p-4 sm:p-8">
        <Image
          className="rounded-xl cursor-pointer"
          src="/images/blog/k9-smiles-clinic.jpg"
          alt="k9 Smiles Teeth Cleaning Clinic @ MoVET"
          height={800}
          width={800}
        />
        <p className="text-xl mt-8 text-center max-w-screen-md font-extrabold">
          MoVET is partnering with{" "}
          <a href="https://www.k-9smiles.com/" target="_blank" rel="noreferrer">
            K-9 Smiles
          </a>{" "}
          to offer a safe and affordable teeth cleaning clinic for your dog or
          cat on April 15th from 9:30 AM to 3:30 PM!
        </p>
        <p className="mt-4 text-center max-w-screen-md text-lg">
          K-9 Smiles provides in-depth teeth cleaning for both cats and dogs.
          Their services include an oral exam, no anesthesia, plaque & tarter
          removal, scaling & polishing with their well trained technicians under
          the supervision of one of MoVET&apos;s licensed veterinarians.
        </p>
        <h2 className="text-xl text-center mt-8">
          SCHEDULE A TEETH CLEANING FOR YOUR PET TODAY!
        </h2>
        <p className="mt-0 text-center text-xl font-bold">
          DENTAL EXAM + IN-DEPTH TEETH CLEANING - $290
        </p>
        <K9SmilesForm />
        <p className="text-center max-w-screen-md font-extrabold italic text-xs -mt-2">
          * It is always up to the veterinarian whether your pet is a candidate
          for the service.
        </p>
        <p className="-mt-2 text-center max-w-screen-md font-extrabold italic text-xs">
          * This is not intended to replace a dental under anesthesia but rather
          to be part of your pet&apos;s dental plan.
        </p>
      </section>
      <CallToAction />
    </Layout>
  );
}
