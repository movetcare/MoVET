import Head from 'next/head';
import { SettingsNavigation } from 'components/SettingsNavigation';
import AdminCheck from 'components/AdminCheck';

export default function Dashboard() {
  return (
    <main>
      <Head>
        <title> Settings</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <AdminCheck>
        <SettingsNavigation />
      </AdminCheck>
    </main>
  );
}
