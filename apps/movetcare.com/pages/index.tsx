import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { environment } from "utilities";

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
      <main className="w-full flex-1 overflow-x-hidden">
        {isLoading ? (
          <section className="relative max-w-xl mx-auto bg-white rounded-xl p-4 m-8 sm:p-8 z-50">
            <h1>Loading, please wait...</h1>
          </section>
        ) : (
          <>
            {/* <Hero />
            <Locations />
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
