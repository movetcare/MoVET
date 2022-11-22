import Layout from "components/Layout";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { Loader } from "ui";

export default function Custom404() {
  const router = useRouter();
  useEffect(() => {
    // setTimeout(() => router.replace("/"), 3000);
  }, []);
  return (
    <Layout>
      <Head>
        <title>404 - Not Found</title>
      </Head>
      <div className="flex flex-col justify-center w-full mx-auto">
        <section className="bg-white rounded-xl p-4 m-4 sm:m-8 text-center">
          <Loader message="404 - Not Found" />
          <h2 className="text-base italic -mt-6">Taking you home now...</h2>
        </section>
      </div>
    </Layout>
  );
}
