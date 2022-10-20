import Layout from "components/Layout";
import Head from "next/head";
import { useEffect } from "react";
import { environment } from "utilities";

export default function Custom404() {
  useEffect(() => {
    setTimeout(
      () =>
        environment === "production"
          ? (window.location.href = "https://movetcare.com/")
          : (window.location.href = `http://${window.location.host}`),
      3000
    );
  }, []);
  return (
    <Layout>
      <Head>
        <title>404 - Not Found</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <section className="relative w-full sm:max-w-xl mx-auto bg-white rounded-xl p-4 m-4 sm:m-8 text-center">
        <h1>404 - Not Found</h1>
        <h2 className="text-base italic -mt-6">Taking you home now...</h2>
      </section>
    </Layout>
  );
}
