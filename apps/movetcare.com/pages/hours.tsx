import { CallToAction, Hours } from "ui";
import Head from "next/head";
import Layout from "components/Layout";
import type { WinterMode as WinterModeType } from "types";
import { getWinterMode } from "server";

export async function getStaticProps() {
  return {
    props: {
      winterMode: (await getWinterMode()) || null,
    },
  };
}

export default function HoursPage({
  winterMode,
}: {
  winterMode: WinterModeType;
}) {
  console.log("<HoursPage/> => winterMode", winterMode);
  return (
    <Layout>
      <Head>
        <title>Hours of Operation</title>
      </Head>
      <Hours winterMode={winterMode} />
      <CallToAction />
    </Layout>
  );
}
