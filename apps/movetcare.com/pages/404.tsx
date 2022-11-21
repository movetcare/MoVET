import Layout from "components/Layout";
import Head from "next/head";
import Router, { useRouter } from "next/router";
import { useEffect } from "react";
import { environment } from "utilities";

export default function Custom404() {
  const router = useRouter();
  useEffect(() => {
    setTimeout(() => router.replace("/"), 3000);
  }, []);
  return (
    <Layout>
      <Head>
        <title>404 - Not Found</title>
      </Head>
      <section className="relative w-full sm:max-w-xl mx-auto bg-white rounded-xl p-4 m-4 sm:m-8 text-center">
        <h1>404 - Not Found</h1>
        <h2 className="text-base italic -mt-6">Taking you home now...</h2>
      </section>
    </Layout>
  );
}
