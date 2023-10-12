import { EmergencyWarning } from "ui";
import Layout from "components/Layout";
import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import { getPopUpAd } from "server";
import { PopUpAd } from "ui";
import type { PopUpAd as PopUpAdType } from "types";

export async function getStaticProps() {
  return {
    props: {
      popUpAd: (await getPopUpAd()) || null,
    } as any,
  };
}

export default function EmergencyPage({ popUpAd }: { popUpAd: PopUpAdType }) {
  return (
    <Layout>
      <Head>
        <title>Emergency Care Notice</title>
      </Head>
      <section className="relative max-w-screen-lg bg-white rounded-xl p-4 sm:p-8 mx-4 sm:mx-auto my-4 sm:m-8">
        <EmergencyWarning />
      </section>
      {popUpAd?.isActive && (
        <PopUpAd
          autoOpen={popUpAd?.autoOpen}
          icon={popUpAd?.icon}
          title={popUpAd?.title}
          description={popUpAd?.description}
          adComponent={
            <Link
              href={popUpAd?.urlRedirect || "/images/logos/logo-paw-black.png"}
            >
              <Image
                className="rounded-xl"
                src={popUpAd?.imagePath || "/images/logos/logo-paw-black.png"}
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
