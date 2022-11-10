import ReportABug from 'components/ReportABug';
import Head from 'next/head';

export default function BugReport() {
  return (
    <section>
      <Head>
        <title>Report a Bug</title>
      </Head>
      <ReportABug type="bug" />
    </section>
  );
}
