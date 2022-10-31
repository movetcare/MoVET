import Layout from "components/Layout";
import Head from "next/head";
import { useEffect } from "react";
import { Loader } from "ui";
import { environment } from "utilities";

export default function Payment() {
  useEffect(() => {
    setTimeout(
      () =>
        environment === "production"
          ? (window.location.href =
              "https://app.movetcare.com/appointment-check-in")
          : (window.location.href = `http://localhost:3001/appointment-check-in`),
      3000
    );
  }, []);
  return (
    <Layout>
      <Head>
        <title>Appointment Check In...</title>
      </Head>
      <section className="mx-auto bg-white rounded-xl p-4 m-4 sm:m-8 text-center">
        <Loader />
      </section>
    </Layout>
  );
}
