import TelehealthChatSummary from 'components/TelehealthChatSummary';
import Head from 'next/head';

export default function Telehealth() {
  return (
    <section>
      <Head>
        <title> Telehealth</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <TelehealthChatSummary />
    </section>
  );
}
