import { Contact } from "ui";
import Head from "next/head";
import Layout from "components/Layout";
import { AppHeader } from "components/AppHeader";

export default function ContactUs() {
  return (
    <Layout>
      <Head>
        <title>Contact Us</title>
      </Head>
      <div className="flex-1">
        <AppHeader />
        <div className="bg-white max-w-3xl rounded-xl mx-auto mt-8 mb-8 sm:mb-20">
          <Contact />
        </div>
      </div>
    </Layout>
  );
}
