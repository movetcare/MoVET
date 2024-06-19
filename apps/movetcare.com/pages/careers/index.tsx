import Layout from "components/Layout";
import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import { getPopUpAd } from "server";
import { PopUpAd } from "ui";
import type { PopUpAd as PopUpAdType } from "types";

export async function getStaticProps() {
  return {
    props: {
      popUpAd: (await getPopUpAd()) || null,
    } as any,
  };
}

export default function Careers({ popUpAd }: { popUpAd: PopUpAdType }) {
  return (
    <Layout>
      <Head>
        <title>Careers with MoVET</title>
      </Head>
      <section className="flex flex-col items-center justify-center sm:max-w-screen-lg mx-4 sm:mx-auto text-center mt-8 mb-20 lg:px-20 bg-white rounded-xl p-4 sm:p-8">
        <h2 className="text-4xl mt-0 mb-6 ">We&apos;re Hiring!</h2>
        <p>
          At MoVET we are passionate about pets! We are a veterinary clinic that
          offers preventative services only because we believe prevention and
          wellness are NOT an afterthought. Because of this, we go the extra
          mile and offer a truly unique, concierge experience for each and every
          one of our clients and their pets. Clients can have appointments in
          their home or in our clinic (designed to look just like your living
          room), they can discuss their medication with an informed team member
          in our up-front, transparent veterinary pharmacy, and clients can shop
          in our high end veterinary-approved boutique, even equipped with a
          self-washing dog bath station, where pampering is a must! Healthcare
          is so much more than treating an illness for us, it&apos;s personal.
        </p>
        <h4 className="mt-8 mb-2 text-xl font-extrabold text-left">
          Benefits of Working with MoVET
        </h4>
        <ul className="list-disc ml-8 my-4 text-left">
          <li>People, not Employees culture.</li>
          <li>
            Flexible schedule for better quality of life.{" "}
            <span className="italic">Reasonable</span> hours expected. No
            emergencies! No medical appointments on weekends or holidays! But,
            if you want them there are plenty of opportunities.
          </li>
          <li className="ml-8">
            <span className="font-bold">Pick up Relief shifts</span> at partner
            clinics around town if you want to keep your skills up or earn extra
            cash! Oftentimes they need extra seasonal help during holidays, or
            weekends. We&apos;ll happily connect you with them!
          </li>
          <li className="ml-8">
            <span className="font-bold">Work remotely with Telehealth</span>.
            Pick up telehealth calls with only MoVET clients while you explore
            and travel for a week ... or two. Run triage or telemedicine --
            don&apos;t know the difference? Don&apos;t worry we can help you
            with this. Don&apos;t skip a beat, we just have you jump back in
            doing in-person appointments when you get back!
          </li>
          <li>
            Safety during homecalls is taken very seriously. We travel in pairs.
            Technicians meet Veterinarians at every appointment, and Assistants
            meet Technicians at every appointment, unless the client is
            established and has already been screened (eg. owner is a good
            handler, the house is in a safe neighborhood, it&aspos;s a quick
            drop-off or simple no-hands-required appointment, etc).
          </li>
          <li>Company events & team celebrations.</li>
          <li>Mentorship & teaching opportunities.</li>
          <li>Growth path for career advancement.</li>
        </ul>
        <h2 className="mt-8 mb-4 text-xl italic">Available Positions:</h2>
        <h5 className="text-lg">
          <Link href="/careers/front-desk-veterinary-medical-receptionist-and-retail-sales-associate">
            Front Desk Veterinary Medical Receptionist & Retail Sales Associate
          </Link>
        </h5>
        <hr className="border-movet-gray w-full sm:w-2/3 my-4" />
        <h5 className="text-lg mb-4">
          <Link href="/careers/lead-veterinary-nurse-technician">
            Lead Veterinary Nurse / Technician
          </Link>
        </h5>
      </section>
      {popUpAd?.isActive && (
        <PopUpAd
          autoOpen={popUpAd?.autoOpen}
          icon={popUpAd?.icon}
          title={popUpAd?.title}
          description={popUpAd?.description}
          adComponent={
            <Link href={popUpAd?.link as string}>
              <Image
                className="rounded-xl"
                src={popUpAd?.imagePath as string}
                alt={popUpAd?.title}
                height={popUpAd?.height || 200}
                width={popUpAd?.width || 200}
              />
            </Link>
          }
          ignoreUrlPath={popUpAd?.ignoreUrlPath}
        />
      )}
    </Layout>
  );
}
