import Layout from "components/Layout";
import Head from "next/head";
import Image from "next/image";
import { CallToAction, K9SmilesForm } from "ui";

export default function BanishBadDogBreath() {
  return (
    <Layout>
      <Head>
        <title>Banish Doggy Breath and Get Kissable Canine Smiles Again!</title>
        <meta
          name="description"
          content="MoVET is partnering with K9 Smiles to offer a complete dental exam and cleaning for your dog!"
        />
        <meta property="og:type" content="website" />
        <meta
          name="og:title"
          property="og:title"
          content="Banish Doggy Breath and Get Kissable Canine Smiles Again!"
        />
        <meta
          name="og:description"
          property="og:description"
          content="MoVET is partnering with K9 Smiles to offer a complete dental exam and cleaning for your dog!"
        />
        <meta property="og:site_name" content="MoVET" />
        <meta name="twitter:card" content="summary" />
        <meta
          name="twitter:title"
          content="Banish Doggy Breath and Get Kissable Canine Smiles Again!"
        />
        <meta
          name="twitter:description"
          content="MoVET is partnering with K9 Smiles to offer a complete dental exam and cleaning for your dog!"
        />
        <meta name="twitter:site" content="https://movetcare.com" />
        <meta name="twitter:creator" content="Barbara Caldwell, DVM" />
        <link rel="icon" type="image/png" href="/static/images/favicon.ico" />
        <link rel="apple-touch-icon" href="/static/images/favicon.ico" />
        <meta
          property="og:image"
          content="/images/blog/banish-bad-dog-breath.png"
        />
        <meta
          name="twitter:image"
          content="/images/blog/banish-bad-dog-breath.png"
        />
      </Head>
      <section className="flex flex-col items-center justify-center sm:max-w-screen-lg mx-4 sm:mx-auto mt-8 mb-20 px-8 lg:px-20 bg-white rounded-xl p-4 sm:p-8">
        <Image
          className="rounded-xl cursor-pointer"
          src="/images/blog/banish-bad-dog-breath.png"
          alt="Banish Doggy Breath and Get Kissable Canine Smiles Again!"
          height={200}
          width={800}
          onClick={() => window.open("https://movetcare.com/smile", "_blank")}
        />
        <h2 className="text-3xl mt-8 mb-2 text-center">
          Banish Doggy Breath and Get Kissable Canine Smiles Again!
        </h2>
        <p className="-mb-2">By: Barbara Caldwell, DVM</p>
        <p className="mb-4 italic text-xs">May 16th, 2023</p>
        <p>
          Have you ever had your dog lick you and thought, &quot;Wow, my
          dog&apos;s breath really smells bad&quot;? Just like humans, dogs and
          cats get plaque and tartar buildup on their teeth and below the gum
          line. This comes from the bacteria that occurs naturally in their
          mouth and from foods and other things they eat and chew on. Humans
          generally brush their teeth once to twice a day and have regular
          cleanings at the dentist. Unfortunately, a majority of dogs and cats
          do not get regular preventative dental care. This leads to gingivitis,
          periodontal disease, and tooth abscesses which then leads to the need
          for tooth extractions. Along with this comes pain, difficulty chewing
          food, and infection. In the long run these combined can then lead to
          major organ disease and overall health problems if left untreated.
        </p>
        <p className="mt-2">
          A complete veterinary dental exam includes evaluating each tooth for
          fractures, gum loss, amount of tartar (calculus) buildup, periodontal
          pocketing, pain, swelling, and bleeding or drainage. A full oral exam
          is also evaluated to note any oral masses and abnormalities not
          related to dental issues. A complete oral exam has historically only
          occurred with an animal under anesthesia, which not only allows for a
          thorough exam, but radiographs (x-rays) to evaluate below the gum line
          where over 60% of dental disease is found. A treatment plan can then
          be formulated and address any concerns, as well as cleaning and
          polishing of the teeth.
        </p>
        <p className="mt-2">
          The main problem comes when owners do not pursue dental care and
          cleanings because of the anesthesia and the costs associated with
          safely doing these procedures. In addition, there is an extreme
          scheduling backlog and staffing shortage that COVID-19 caused within
          the veterinary profession, which has led to many pets not getting the
          dental care they need.
        </p>
        <p className="mt-2">
          Non-anesthetic dental cleanings or Professional Outpatient
          Preventative Dentistry (POPD), when done correctly, can be a valuable
          supplemental treatment for our canine and feline friends. These are
          NOT a substitute for anesthetic dental procedures and there are
          numerous limitations on when these types of cleaning procedures are
          appropriate. Radiographs and extractions, for example, can not be
          performed with a pet awake, no matter how well behaved they are. Pets
          that have moderate to severe periodontal disease and calculus buildup,
          have tooth fractures, exposed tooth roots or deeper gingival pocketing
          are not good candidates for this type of procedure. Also, pets that
          are fearful, very nervous, or aggressive will not be a good candidate
          for POPD. Pets that are young, have had an anesthetic cleaning in the
          previous year, and are relatively calm and cooperative are the best
          candidates for this type of preventative care.
        </p>
        <p className="mt-2">
          The veterinarians at MoVET have elected to begin offering appointments
          for these procedures while working closely with trained veterinary
          dental technicians to help reduce plaque buildup. With the help of
          POPDs, we are excited to move forward with oral health education and
          better overall oral care for our canine and feline friends at home.
        </p>
        <h3 className="text-xl text-center mt-8 font-abside">
          Upcoming Clinics:
        </h3>
        <ul className="text-center mt-2">
          <li>Saturday June 17th, 9:30AM - 3:30PM</li>
          <li>Saturday August 26th, 9:30AM - 3:30PM</li>
          <li>Saturday October 28th, 9:30AM - 3:30PM</li>
          <li>Saturday December 9th, 9:30AM - 3:30PM</li>
        </ul>
        <h3 className="text-xl text-center mt-12 font-abside">
          SCHEDULE A TEETH CLEANING FOR YOUR DOG TODAY!
        </h3>
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
