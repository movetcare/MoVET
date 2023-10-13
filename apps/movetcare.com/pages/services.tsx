import { faTruckMedical } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { CallToAction, ClientReviews, Services } from "ui";
import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import { getPopUpAd } from "server";
import { PopUpAd } from "ui";
import type { PopUpAd as PopUpAdType } from "types";
import Layout from "components/Layout";

export async function getStaticProps() {
  return {
    props: {
      popUpAd: (await getPopUpAd()) || null,
    } as any,
  };
}

export default function ServicesPage({ popUpAd }: { popUpAd: PopUpAdType }) {
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
      {popUpAd?.isActive && (
        <PopUpAd
          autoOpen={popUpAd?.autoOpen}
          icon={popUpAd?.icon}
          title={popUpAd?.title}
          description={popUpAd?.description}
          adComponent={
            <Link href={popUpAd?.urlRedirect as string}>
              <Image
                className="rounded-xl"
                src={popUpAd?.imagePath as string}
                alt={popUpAd?.title}
                height={popUpAd?.height || 200}
                width={popUpAd?.width || 200}
              />
            </Link>
          }
          ignoreUrlPath={popUpAd?.ignoreUrlPath}
        />
      )}
    </Layout>
  );
}
