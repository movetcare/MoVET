import { EmergencyWarning } from "ui";
import Layout from "components/Layout";
import Head from "next/head";

export default function EmergencyPage() {
  return (
    <Layout>
      <Head>
        <title>Emergency Care Notice</title>
      </Head>
      <section className="relative max-w-screen-lg bg-white rounded-xl p-4 sm:p-8 mx-4 sm:mx-auto my-4 sm:m-8">
        <EmergencyWarning />
      </section>
    </Layout>
  );
}
