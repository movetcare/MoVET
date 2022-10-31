import Layout from "components/Layout";
import { getAnnouncement } from "server";
// import { useRouter } from "next/router";
// import { useEffect, useState } from "react";
import {
  Announcement,
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

export async function getStaticProps() {
  return {
    props: {
      announcement: (await getAnnouncement()) || null,
    },
  };
}

export default function Home({ announcement }: { announcement: Announcement }) {
  // const router = useRouter();
  // const [isLoading, setIsLoading] = useState<boolean>(false);
  // const { link } = router.query;
  // useEffect(() => {
  //   if (router && link) {
  //     setIsLoading(true);
  //     const params = Object.fromEntries(
  //       new URLSearchParams(window.location.search).entries()
  //     );
  //     const linkParams = Object.fromEntries(
  //       new URLSearchParams(
  //         params.link
  //           .replaceAll("http://localhost:3000/account/", "")
  //           .replaceAll("https://movetcare.com/account/", "")
  //       ).entries()
  //     );
  //     if (environment === "development")
  //     console.log(
  //       "redirectUrl",
  //       `http://localhost:3001/sign-in?mode=${linkParams?.mode}&oobCode=${linkParams?.oobCode}&continueUrl=${linkParams?.continueUrl}&lang=${linkParams?.lang}&apiKey=${linkParams?.apiKey}`
  //     );
  //     console.log(
  //       "redirectUrl",
  //       `https://app.movetcare.com/sign-in?mode=${linkParams?.mode}&oobCode=${linkParams?.oobCode}&continueUrl=${linkParams?.continueUrl}&lang=${linkParams?.lang}&apiKey=${linkParams?.apiKey}`
  //     );
  //     else
  //       linkParams?.mode === "signIn"
  //         ? (environment === "production"
  //             ? (window.location.href = "https://app.movetcare.com")
  //             : (window.location.href = `http://localhost:3001`)) +
  //           `/sign-in?mode=${linkParams?.mode}&oobCode=${linkParams?.oobCode}&continueUrl=${linkParams?.continueUrl}&lang=${linkParams?.lang}&apiKey=${linkParams?.apiKey}`
  //         : setIsLoading(false);
  //   }
  // }, [router, link]);
  return (
    <Layout announcement={announcement}>
      <div className="flex flex-col items-center justify-center min-py-2 bg-movet-white">
        {/* {isLoading ? (
          <section className="relative max-w-xl mx-auto bg-white rounded-xl p-4 m-8 sm:p-8 z-50">
            <h1>Loading, please wait...</h1>
          </section>
        ) : (
          <> */}
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
              <p className="mb-3 font-abside text-sm">BOOK AN APPOINTMENT</p>
              <BookAnAppointmentForm autoFocus />
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
        {/* </>
        )} */}
      </div>
    </Layout>
  );
}
