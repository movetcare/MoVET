import Layout from "components/Layout";
import { getAnnouncement } from "server";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Announcement, Hero, BookAnAppointment, AppLinks } from "ui";
import { environment } from "utilities";

export async function getStaticProps() {
  return {
    props: {
      announcement: await getAnnouncement(),
    },
  };
}

export default function Home({ announcement }: { announcement: Announcement }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { link } = router.query;
  useEffect(() => {
    if (router && link) {
      setIsLoading(true);
      const params = Object.fromEntries(
        new URLSearchParams(window.location.search).entries()
      );
      const linkParams = Object.fromEntries(
        new URLSearchParams(
          params.link
            .replaceAll("http://localhost:3000/account/", "")
            .replaceAll("https://movetcare.com/account/", "")
        ).entries()
      );
      if (environment === "development")
        console.log(
          "redirectUrl",
          `/account/sign-in?mode=${linkParams?.mode}&oobCode=${linkParams?.oobCode}&continueUrl=${linkParams?.continueUrl}&lang=${linkParams?.lang}&apiKey=${linkParams?.apiKey}`
        );
      linkParams?.mode === "signIn"
        ? router.replace(
            `/account/sign-in?mode=${linkParams?.mode}&oobCode=${linkParams?.oobCode}&continueUrl=${linkParams?.continueUrl}&lang=${linkParams?.lang}&apiKey=${linkParams?.apiKey}`
          )
        : setIsLoading(false);
    }
  }, [router, link]);
  return (
    <Layout announcement={announcement}>
      <div className="flex flex-col items-center justify-center min-py-2 bg-movet-white">
        {isLoading ? (
          <section className="relative max-w-xl mx-auto bg-white rounded-xl p-4 m-8 sm:p-8 z-50">
            <h1>Loading, please wait...</h1>
          </section>
        ) : (
          <>
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
                    BOOK AN APPOINTMENT
                  </p>
                  <BookAnAppointment autoFocus />
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
            {/* <Locations />
            <Amenities />
            <Services />
            <Hours />
            <Reviews />
            <div className="relative w-full mb-12 mt-20">
              <ContactForm />
            </div>
            <CallToAction /> */}
          </>
        )}
      </div>
    </Layout>
  );
}
