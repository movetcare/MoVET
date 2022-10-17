import { HeroBanner } from "ui";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { environment } from "utilities";
import { AppStoreLinks } from "ui";
import { BookAnAppointmentForm } from "ui";

export default function Home() {
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
    <div className="flex flex-col items-center justify-center min-py-2">
      <Head>
        <title>Your neighborhood vet, Delivered</title>
        <link rel="icon" href="/favicon.ico" />
        <meta
          name="description"
          content="A stress-free way to take care of your pet care. Whether your pet is at the very beginning or the tailend of their lifespan, we can provide the age-appropriate primary care they need. For puppies and kittens, we offer packages and a la carte services for nutrition advice, vaccinations and boosters, spay/neuter advice, oral care, training, microchipping, parasite control, grooming, and exercise. For senior cats and dogs, our annual checks will be tailored toward your pet's advancing years."
        ></meta>
      </Head>
      <main className="w-full flex-1 overflow-x-hidden">
        {isLoading ? (
          <section className="relative max-w-xl mx-auto bg-white rounded-xl p-4 m-8 sm:p-8 z-50">
            <h1>Loading, please wait...</h1>
          </section>
        ) : (
          <>
            <HeroBanner
              titleOne={"Your neighborhood vet,"}
              titleTwo={"Delivered"}
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
                  <BookAnAppointmentForm />
                  <div className="flex justify-center">
                    <p className="text-sm font-abside my-3">OR</p>
                  </div>
                  <div className="flex justify-center">
                    <AppStoreLinks />
                  </div>
                </>
              }
              imagePath="/images/pets/home-appointment-2.jpg"
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
      </main>
    </div>
  );
}
