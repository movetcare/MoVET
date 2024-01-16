import Layout from "components/Layout";
import {
  getAnnouncement,
  getHours,
  getWinterMode,
  getHoursStatus,
  getPopUpAd,
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
  HoursStatus as HoursStatusType,
  PopUpAd as PopUpAdType,
} from "types";
import Link from "next/link";
import Image from "next/image";

export async function getStaticProps() {
  return {
    props: {
      announcement: (await getAnnouncement()) || null,
      winterMode: (await getWinterMode()) || null,
      hours: (await getHours()) || null,
      hoursStatus: (await getHoursStatus()) || null,
      popUpAd: (await getPopUpAd()) || null,
    } as any,
  };
}

export default function Home({
  announcement,
  winterMode,
  hours,
  hoursStatus,
  popUpAd,
}: {
  announcement: AnnouncementType;
  winterMode: WinterModeType;
  hours: Array<HoursType>;
  hoursStatus: HoursStatusType;
  popUpAd: PopUpAdType;
}) {
  return (
    <Layout announcement={announcement}>
      <div className="flex flex-col items-center justify-center min-py-2 bg-movet-white">
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
              <p className="mb-3 font-abside text-sm">
                SCHEDULE AN APPOINTMENT
              </p>
              <BookAnAppointmentForm />
              <div className="flex justify-center">
                <p className="text-sm font-abside my-3">OR</p>
              </div>
              <div className="flex justify-center">
                <AppLinks />
              </div>
            </>
          }
          imageUrl="/images/pets/home-appointment-2.jpg"
        />
        <ServiceTypes />
        <Amenities />
        <Services />
        <Hours
          winterMode={winterMode}
          embed
          hours={hours}
          hoursStatus={hoursStatus}
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
