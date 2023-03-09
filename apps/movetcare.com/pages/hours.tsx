import { CallToAction, Hours } from "ui";
import Head from "next/head";
import Layout from "components/Layout";
import type {
  WinterMode as WinterModeType,
  Closures as ClosuresType,
} from "types";
import { getWinterMode, getClosures } from "server";

export async function getStaticProps() {
  return {
    props: {
      winterMode: (await getWinterMode()) || null,
      closures: (await getClosures()) || null,
    } as any,
  };
}

export default function HoursPage({
  winterMode,
  closures,
}: {
  winterMode: WinterModeType;
  closures: ClosuresType;
}) {
  return (
    <Layout>
      <Head>
        <title>Hours of Operation</title>
      </Head>
      <Hours winterMode={winterMode} />
      {closures && <pre>{JSON.stringify(closures)}</pre>}
      <CallToAction />
    </Layout>
  );
}
