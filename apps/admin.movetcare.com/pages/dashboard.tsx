import TelehealthChatSummary from 'components/TelehealthChatSummary';
import { Waitlist } from 'components/Waitlist';
import Head from 'next/head';

import { AnnouncementBannerControls } from 'components/AnnouncementBannerControls';

export default function Dashboard() {
  return (
    <section>
      <Head>
        <title>Admin Dashboard</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <AnnouncementBannerControls />
      <div className="grid lg:grid-cols-2 gap-4">
        <Waitlist />
        <TelehealthChatSummary />
      </div>
    </section>
  );
}
