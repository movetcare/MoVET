import { Contact } from "ui";
import Head from "next/head";
import Layout from "components/Layout";

export default function ContactUs() {
  return (
    <Layout>
      <Head>
        <title>Contact Us</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="bg-white max-w-3xl rounded-xl mx-auto mb-4 sm:mb-20">
        <Contact />
      </div>
    </Layout>
  );
}
