import ReportABug from 'components/ReportABug';
import Head from 'next/head';

export default function BugReport() {
  return (
    <section>
      <Head>
        <title> Report a Bug</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <ReportABug type="bug" />
    </section>
  );
}
