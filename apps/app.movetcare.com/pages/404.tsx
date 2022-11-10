import { Loader } from "ui";
import Head from "next/head";
import { useEffect } from "react";
import { environment } from "utilities";

export default function Custom404() {
  useEffect(() => {
    setTimeout(
      () =>
        environment === "production"
          ? (window.location.href = "https://app.movetcare.com/")
          : (window.location.href = `http://${window.location.host}`),
      3000
    );
  }, []);
  return (
    <div className="flex flex-col items-center justify-center min-py-2">
      <Head>
        <title>404 - Not Found</title>
      </Head>
      <main className="flex flex-col items-center justify-center w-full flex-1 px-4 sm:px-20 text-center">
        <section className="relative w-full sm:max-w-xl mx-auto bg-white rounded-xl p-4 sm:m-8 sm:p-8 z-50 mb-4 sm:mb-24">
          <Loader message="404 - Not Found" />
          <h2 className="text-base italic -mt-6 mb-8">
            Taking you home now...
          </h2>
        </section>
      </main>
    </div>
  );
}
