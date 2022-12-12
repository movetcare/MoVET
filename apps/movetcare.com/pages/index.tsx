import Layout from "components/Layout";
import { getAnnouncement } from "server";
// import { useRouter } from "next/router";
// import { useEffect, useState } from "react";
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
} from "ui";

import type { Announcement as AnnouncementType } from "types";

export async function getStaticProps() {
  return {
    props: {
      announcement: (await getAnnouncement()) || null,
    },
  };
}

export default function Home({ announcement }: { announcement: AnnouncementType }) {
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
              <p className="mb-3 font-abside text-sm">REQUEST AN APPOINTMENT</p>
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
        <Hours />
        <Reviews />
        <Contact />
        <CallToAction />
      </div>
    </Layout>
  );
}
