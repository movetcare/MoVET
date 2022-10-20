import Layout from "components/Layout";
import Head from "next/head";

export default function Custom500() {
  return (
    <Layout>
      <Head>
        <title>Error - Something went wrong...</title>
      </Head>
      <section className=" bg-white rounded-xl p-4 sm:p-8 italic flex flex-col flex-grow items-center justify-center text-center max-w-screen-md mx-4 sm:mx-auto px-4 sm:px-8 overflow-hidden sm:mt-8 sm:mb-24 text-2xl">
        <h2 className="text-2xl">We&apos;re sorry! Something went wrong...</h2>
      </section>
    </Layout>
  );
}
