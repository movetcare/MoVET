import ReportABug from 'components/ReportABug';
import Head from 'next/head';

export default function RequestAFeature() {
  return (
    <section>
      <Head>
        <title> Request a Feature</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <ReportABug type="feature" />
    </section>
  );
}
