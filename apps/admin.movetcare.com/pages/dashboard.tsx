import { ClientSearch } from "components/ClientSearch";
import { HoursStatus } from "components/HoursStatus";
import { PushNotificationWarning } from "components/PushNotificationWarning";
import TelehealthChatSummary from "components/TelehealthChatSummary";
import Head from "next/head";

export default function Dashboard() {
  return (
    <section>
      <Head>
        <title>Admin Dashboard</title>
      </Head>
      <ClientSearch />
      <PushNotificationWarning />
      <div className="grid lg:grid-cols-2 gap-4">
        <HoursStatus mode="admin" />
        <TelehealthChatSummary />
      </div>
    </section>
  );
}
