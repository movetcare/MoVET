import { Contact } from "ui";
import Head from "next/head";
import { AppHeader } from "components/AppHeader";

export default function ContactUs() {
  return (
    <div className="w-full">
      <Head>
        <title>Contact Us</title>
      </Head>
      <AppHeader />
      <div className="bg-white max-w-3xl rounded-xl mx-auto mb-8">
        <Contact />
      </div>
    </div>
  );
}
