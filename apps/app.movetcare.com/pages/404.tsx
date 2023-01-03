import { Loader } from "ui";
import Head from "next/head";
import { useEffect } from "react";
import { useRouter } from "next/router";
import { AppHeader } from "components/AppHeader";

export default function Custom404() {
  const router = useRouter();
  useEffect(() => {
    setTimeout(
      () =>
        (window.location.href =
          window.location.protocol +
          "//" +
          window.location.host +
          "/schedule-an-appointment"),
      3000
    );
  }, [router]);
  return (
    <div className="flex flex-col items-center justify-center min-py-2">
      <Head>
        <title>404 - Not Found</title>
      </Head>
      <AppHeader />
      <section className="relative w-full sm:max-w-xl mx-auto bg-white rounded-xl p-4 sm:m-8 sm:p-8 z-50 mb-4 sm:mb-24">
        <Loader message="404 - Not Found" />
        <h2 className="text-base italic -mt-6 mb-8 text-center">
          Taking you home now...
        </h2>
      </section>
    </div>
  );
}
