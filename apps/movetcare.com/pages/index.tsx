import Layout from "components/Layout";
import {
  getAnnouncement,
  getHours,
  getWinterMode,
  // getHoursStatus,
  getPopUpAd,
  getClinicConfig,
} from "server";
import {
  Hero,
  BookAnAppointmentForm,
  AppLinks,
  ServiceTypes,
  Amenities,
  Services,
  Hours,
  Reviews,
  Contact,
  CallToAction,
  PopUpAd,
} from "ui";

import type {
  Announcement as AnnouncementType,
  WinterMode as WinterModeType,
  Hours as HoursType,
  // HoursStatus as HoursStatusType,
  PopUpAd as PopUpAdType,
  ClinicConfig,
} from "types";
import Link from "next/link";
import Image from "next/image";

export async function getStaticProps() {
  return {
    props: {
      announcement: (await getAnnouncement()) || null,
      winterMode: (await getWinterMode()) || null,
      hours: (await getHours()) || null,
      // hoursStatus: (await getHoursStatus()) || null,
      popUpAd: (await getPopUpAd()) || null,
      clinicsConfig: await getClinicConfig({ id: "summary" }),
    } as any,
  };
}

export default function Home({
  announcement,
  winterMode,
  hours,
  // hoursStatus,
  popUpAd,
  clinicsConfig,
}: {
  announcement: AnnouncementType;
  winterMode: WinterModeType;
  hours: Array<HoursType>;
  // hoursStatus: HoursStatusType;
  popUpAd: PopUpAdType;
  clinicsConfig: Array<ClinicConfig>;
}) {
  return (
    <Layout announcement={announcement}>
      <div className="flex flex-col justify-center items-center min-py-2 bg-movet-white">
        <Hero
          title="Your neighborhood vet,"
          secondTitle="Delivered"
          description={
            <span>
              A stress-free way to take care
              <br /> of your vet appointments.
            </span>
          }
          callToAction={
            <>
              <p className="mb-3 font-abside">SCHEDULE AN APPOINTMENT</p>
              <div className="flex justify-center">
                <AppLinks />
              </div>
            </>
          }
          imageUrl="/images/pets/home-appointment-2.jpg"
          clinicsConfig={clinicsConfig}
        />
        <ServiceTypes />
        <Amenities />
        <Services />
        <Hours
          winterMode={winterMode}
          embed
          hours={hours}
          // hoursStatus={hoursStatus}
        />
        <Reviews />
        <Contact />
        <CallToAction />
      </div>
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
