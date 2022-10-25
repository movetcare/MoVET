import { AppHeader } from "components/AppHeader";
import Layout from "components/Layout";
import { Loader } from "ui";

export default function Home() {
  return (
    <Layout>
      <AppHeader />
      <section className="relative max-w-xl mx-auto bg-white rounded-xl p-4 m-8 sm:p-8 z-50">
        <Loader />
      </section>
    </Layout>
  );
}
