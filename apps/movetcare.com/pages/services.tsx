import { faTruckMedical } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { CallToAction, ClientReviews, Services } from "ui";
import Head from "next/head";
import Link from "next/link";
import Layout from "components/Layout";

export default function ServicesPage() {
  return (
    <Layout>
      <Head>
        <title>Services</title>
      </Head>
      <section className="flex flex-col items-center justify-center w-full px-4 bg-movet-white">
        <Services backgroundColor="white" />
        <div className="group flex -mt-10 text-movet-red cursor-pointer max-w-lg text-center">
          <Link href="/emergency">
            <div className="flex flex-row items-center justify-center bg-white group-hover:text-movet-white group-hover:bg-movet-red rounded-full py-2 px-6 ease-in-out duration-500">
              <div className="flex my-auto text-center mx-auto">
                <FontAwesomeIcon icon={faTruckMedical} size="lg" />
              </div>
              <h3 className="ml-3 font-abside text-sm">
                If you think this is an animal emergency, please contact a 24/7
                ER clinic or urgent care center
              </h3>
            </div>
          </Link>
        </div>
        <div className="flex flex-col justify-center items-center sm:max-w-screen-lg mx-auto mb-20">
          <h5 className="text-3xl tracking-wide mt-8 font-bold whitespace-nowrap italic md:mb-4">
            Client Reviews
          </h5>
          <ClientReviews />
        </div>
      </section>
      <CallToAction />
    </Layout>
  );
}
